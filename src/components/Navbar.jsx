import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

// Links de Navegação
const NAV_LINKS = [
    {to: '/', label: 'Home'},
    {to: '/problema', label: 'O Problema'},
    {to: '/como-funciona', label: 'Como Funciona'},
    {to: '/mapa-ceu', label: 'Mapa do Céu'},
    {to: '/alertas', label: 'Alertas'},
    {to: '/impacto', label: 'Impacto'},
    {to: '/sobre', label: 'Sobre'},
]

// Configuração para cada perfil
const PROFILE_CONFIG = {
    amador: {label: "Amador", color: "var(--c-green)"},
    fotografo: {label: "Fotógrafo", color: "var(--c-cyan)"},
    profissional: {label: "Profissional", color: "var(--c-orange)"}
}

export default function Navbar({profile, onProfileChange}) {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [apiOnline, setApiOnline] = useState(false)

    useEffect(() => {
        const onScroll = () =>  setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll, {passive: true})
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Verifica se o backend está respondendo
    useEffect(() => {
        async function checarApi() {
            try {
                const controller = new AbortController()
                const timer = setTimeout(() => controller.abort(), 5000)
                const res = await fetch("https://darksky-fiap.duckdns.org/score", {
                    signal: controller.signal,
                })
                clearTimeout(timer)
                setApiOnline(res.ok)
            } catch {
                setApiOnline(false)
            }
        }
        checarApi()
        const intervalo = setInterval(checarApi, 60 * 1000)
        return () => clearInterval(intervalo)
    }, [])

    const currentProfile = PROFILE_CONFIG[profile]

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
            style={{
                background: scrolled
                    ? "rgba(3, 5, 12, 0.97)"
                    : "rgba(3, 5, 12, 0.6)",
                borderBottom: "0.5px solid rgba(79, 158, 255, 0.1)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",  
            }}
        >
            <div
                className="flex items-center justify-between"
                style={{padding: "1.4rem 4rem"}}
            >
                {/* Logo */}
                <NavLink
                    to='/'
                    className="flex items-center gap-3 flex-shrink-0"
                    onClick={() => setMenuOpen(false)}
                >
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                        <circle cx="13" cy="13" r="3" fill="var(--c-cyan)" />
                        <ellipse cx="13" cy="13" rx="11" ry="5"
                            stroke="var(--c-cyan)" strokeWidth="0.8"
                            fill="none" strokeDasharray="2.5 1.5" />
                        <ellipse cx="13" cy="13" rx="5" ry="11"
                            stroke="var(--c-cyan)" strokeWidth="0.7" opacity="0.4"
                            fill="none" strokeDasharray="2 2" />
                        <circle cx="22" cy="7.5" r="1.5" fill="var(--c-orange)" />
                    </svg>
                    <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.875rem",
                        fontWeight: "700",
                        letterSpacing: "0.18em",
                        color: "var(--c-cyan)",
                    }}>
                        SKY<span style={{color: "var(--c-white)"}}>AWARE</span>
                    </span>
                </NavLink>

                {/* Links Desktop */}
                <nav 
                    className="hidden lg:flex items-center"
                    style={{gap: "2.8rem"}}
                    aria-label="Navegação principal"
                >
                    {NAV_LINKS.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/'}
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'active' : ''}`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Perfil e status */}
                <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                    {profile && (
                        <button
                            onClick={onProfileChange}
                            className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-70"
                            style={{
                                background: "transparent",
                                border: "0.5px solid rgba(232, 244, 253, 0.12)",
                                borderRadius: "4px",
                                padding: "0.3rem 0.8rem",
                                cursor: "pointer",
                            }}
                        >
                            <span style={{
                                width: 6, 
                                height: 6,
                                borderRadius: "50%",
                                background: currentProfile.color,
                                boxShadow: `0 0 5px ${currentProfile.color}`,
                                display: "inline-block",
                                flexShrink: 0,
                            }} />
                            <span style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.7rem",
                                letterSpacing: "0.1em",
                                color: "rgba(232, 244, 253, 0.45)"
                            }}>
                                {currentProfile.label}
                            </span>
                        </button>
                    )}

                    {/* Badge de status da API */}
                    <div className="flex items-center gap-2"
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            letterSpacing: "0.1em",
                            color: apiOnline ? "rgba(61, 255, 160, 0.6)" : "rgba(255, 80, 80, 0.5)",
                            transition: "color 0.5s ease",
                        }}
                    >
                        <span style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: apiOnline ? "var(--c-green)" : "var(--c-red)",
                            boxShadow: apiOnline ? "0 0 6px var(--c-green)" : "0 0 4px var(--c-red)",
                            display: "inline-block",
                            animation: apiOnline ? "blink 2s infinite" : "none",
                            transition: "background 0.5s ease, box-shadow 0.5s ease",
                        }} />
                        {apiOnline ? "DADOS AO VIVO" : "DADOS SIMULADOS"}
                    </div>
                </div>

                {/* Botão hambúguer para mobile */}
                <button
                    className="lg:hidden flex flex-col justify-center gap-1.5 p-2"
                    onClick={() => setMenuOpen(v => !v)}
                    aria-label="Abrir menu"
                    aria-expanded={menuOpen}
                >
                    {[0, 1, 2].map(i => (
                        <span
                            key={i}
                            className="block transition-all duration-300"
                            style={{
                                width: 24,
                                height: 1,
                                background: "var(--c-cyan)",
                                transformOrigin: "center",
                                transform: menuOpen
                                    ? i === 0 ? "rotate(45deg) translate(3px, 3px)"
                                    : i === 1 ? "scaleX(0)"
                                    : "rotate(-45deg) translate(3px, -3px)"
                                    : "none",
                            }}
                        />
                    ))}
                </button>
            </div>

            {/* Menu mobile */}
            <div
                className="lg:hidden overflow-hidden transition-all duration-300"
                style={{
                    maxHeight: menuOpen ? "400px" : "0",
                    borderTop: menuOpen ? "0.5px solid var(--c-border)" : "none",
                }}
            >
                <nav
                    className="flex flex-col gap-5 px-10 py-6"
                    style={{background: "rgba(3, 5, 12, 0.98)"}}
                    aria-label="Navegação mobile"
                >
                    {NAV_LINKS.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/'}
                            onClick={() => setMenuOpen(false)}
                            className={({isActive}) =>
                                `nav-link text-base ${isActive ? 'active' : ''}`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    {/* Trocar perfil no mobile */}
                    {profile && (
                        <button
                            onClick={() => {setMenuOpen(false); onProfileChange();}}
                            style={{
                                background: "transparent",
                                border: "0.5px solid rgba(232, 244, 253, 0.12)",
                                borderRadius: "4px",
                                padding: "0.5rem 1rem",
                                cursor: "pointer",
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.65em",
                                letterSpacing: "0.1em",
                                color: "rgba(232, 244, 253, 0.4)",
                                textAlign: "left",
                            }}
                        >
                            Trocar perfil - {currentProfile?.label}
                        </button>
                    )}
                </nav>
            </div>
        </header>
    )
}
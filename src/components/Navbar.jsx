import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from '../assets/darksky-logo.png';

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

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    // Muda o fundo da navbar ao rolar a página
    useEffect(() => {
        const onScroll = () =>  setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll, {passive: true})
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

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
                    className="flex items-center flex-shrink-0"
                    onClick={() => setMenuOpen(false)}
                >
                    <img
                        src={logo}
                        alt="DarkSky - Plataforma de Proteção do Céu Noturno"
                        style={{height: "64px", width: "auto"}}
                    />
                </NavLink>

                {/* Links Desktop */}
                <nav 
                    className="hidden md:flex items-center"
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

                {/* Indicador de status - desktop */}
                <div
                    className="hidden md:flex items-center gap-2 flex-shrink-0"
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                        color: "rgba(232, 244, 253, 0.25)",
                    }}
                >
                    <span
                        style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "var(--c-green)",
                            boxShadow: "0 0 6px var(--c-green)",
                            display: "inline-block",
                            animation: "blink 2s infinite",
                        }}    
                    />
                    SISTEMA ATIVO
                </div>

                {/* Botão hambúguer para mobile */}
                <button
                    className="md:hidden flex flex-col justify-center gap-1.5 p-2"
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
                className="md:hidden overflow-hidden transition-all duration-300"
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
                </nav>
            </div>
        </header>
    )
}
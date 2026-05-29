import { NavLink } from "react-router-dom";
import logo from '../assets/darksky-logo.png';

const FOOTER_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/problema', label: 'O Problema' },
    { to: '/como-funciona', label: 'Como Funciona' },
    { to: '/mapa-ceu', label: 'Mapa do Céu' },
    { to: '/alertas', label: 'Alertas' },
    { to: '/impacto', label: 'Impacto' },
    { to: '/sobre', label: 'Sobre' },
]

const DATA_SOURCES = [
    { label: "NASA VIIRS", href: "https://www.nasa.gov/mission_pages/NPP/main/index.html" },
    { label: "NASA MODIS", href: "https://modis.gsfc.nasa.gov/" },
    { label: "CelesTrak TLE", href: "https://celestrak.org/" },
    { label: "Space-Track.org", href: "https://www.space-track.org/" },
    { label: "ESA", href: "https://www.esa.int/" },
]

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer
            className="relative z-10 mt-auto"
            style={{
                borderTop: "0.5px solid rgba(79, 158, 255, 0.1)",
                background: "rgba(3, 5, 12, 0.97)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
            }}
        >
            <div style={{ padding: "3rem 4rem" }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                    {/* Coluna 1 - Logo e descrição */}
                    <div className="flex flex-col gap-4">
                        <NavLink to="/" className="inline-flex">
                            <img
                                src={logo}
                                alt="DarkSky - Plataforma de Proteção do Céu Noturno"
                                style={{ height: "28px", width: "auto" }}
                            />
                        </NavLink>
                        <p style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.85rem",
                            lineHeight: "1.7",
                            color: "var(--c-muted)",
                            maxWidth: "240px",
                        }}>
                            Inteligência orbital aplicada à astronomia cidadã.
                            Dados reais da NASA e ESA para proteger o céu noturno.
                        </p>
                    </div>

                    {/* Coluna 2 - Navegação */}
                    <div className="flex flex-col gap-3">
                        <p className="section-kicker" style={{ marginBottom: "0.5rem" }}>
                            Navegação
                        </p>
                        {FOOTER_LINKS.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "0.85rem",
                                    color: "var(--c-muted)",
                                    textDecoration: "none",
                                    transition: "color 0.2s ease",
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = "var(--c-white)"}
                                onMouseLeave={e => e.currentTarget.style.color = "var(--c-muted)"}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Coluna 3 - Fontes de dados */}
                    <div className="flex flex-col gap-3">
                        <p className="section-kicker" style={{ marginBottom: "0.5rem" }}>
                            Fontes de Dados
                        </p>
                        {DATA_SOURCES.map(source => ( <a
                                key={source.label}
                                href={source.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "0.85rem",
                                    color: "var(--c-muted)",
                                    textDecoration: "none",
                                    transition: "color 0.2s ease",
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = "var(--c-cyan)"}
                                onMouseLeave={e => e.currentTarget.style.color = "var(--c-muted)"}
                            >
                                ↗ {source.label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Linha divisória */}
                <div style={{
                    borderTop: "0.5px solid rgba(79, 158, 255, 0.1)",
                    marginBottom: "1.5rem",
                }} />

                {/* Barra inferior */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        letterSpacing: "0.06em",
                        color: "var(--c-muted)",
                    }}>
                        © {year} DarkSky · FIAP — Engenharia de Software · Global Solution 2026
                    </p>

                    <div
                        className="flex items-center gap-2"
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            letterSpacing: "0.1em",
                            color: "rgba(232, 244, 253, 0.25)",
                        }}
                    >
                        <span style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "var(--c-green)",
                            boxShadow: "0 0 5px var(--c-green)",
                            display: "inline-block",
                        }} />
                        SISTEMA OPERACIONAL
                    </div>
                </div>
            </div>
        </footer>
    )
}
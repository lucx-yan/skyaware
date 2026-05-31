import { NavLink } from "react-router-dom";

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
    { label: "CelesTrak TLE", href: "https://celestrak.org/" },
    { label: "Open-Meteo API", href: "https://open-meteo.com/" },
    { label: "VIIRS / NASA", href: "https://www.nasa.gov/mission_pages/NPP/main/index.html" },
    { label: "Space-Track.org", href: "https://www.space-track.org/" },
    { label: "ESA", href: "https://www.esa.int/" },
]

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer
            className="relative z-10 mt-auto"
            style={{
                borderTop: "0.5px solid rgba(79, 158, 255, 0.15)",
                background: "rgba(3, 5, 12, 0.97)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
            }}
        >
            <div style={{ padding: "3rem 4rem" }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                    {/* Coluna 1 - Logo e descrição */}
                    <div className="flex flex-col gap-4">
                        <NavLink to="/" className="inline-flex items-center gap-3">
                            <svg width="22" height="22" viewBox="0 0 26 26" fill="none" aria-hidden="true">
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
                                fontSize: "0.95rem",
                                fontWeight: "700",
                                letterSpacing: "0.18em",
                                color: "var(--c-cyan)",
                            }}>
                                SKY<span style={{color: "var(--c-white)"}}>AWARE</span>
                            </span>
                        </NavLink>
                        <p style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.9rem",
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
                        <p className="section-kicker" style={{ marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                            Navegação
                        </p>
                        {FOOTER_LINKS.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "0.9rem",
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
                        <p className="section-kicker" style={{ marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                            Fontes de Dados
                        </p>
                        {DATA_SOURCES.map(source => ( <a
                                key={source.label}
                                href={source.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "0.9rem",
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
                    borderTop: "0.5px solid rgba(79, 158, 255, 0.15)",
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
                        © {year} SkyAware · FIAP — Engenharia de Software · Global Solution 2026
                    </p>
                </div>
            </div>
        </footer>
    )
}
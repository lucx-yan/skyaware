const EQUIPE = [
    {
        iniciais: "BC",
        nome: "Bruno Castilho",
        rm: "RM: 566799",
        disciplinas: ["FRONT-END", "WEB", "TKS"],
        cor: "#4f9eff",
        github: "https://github.com/Castilho8",
    },
    {
        iniciais: "JV",
        nome: "João Victor Melo",
        rm: "RM: 566640",
        disciplinas: ["PYTHON", "ANÁLISE ORBITAL"],
        cor: "#a78bfa",
        github: "https://github.com/JoaoVictorMelo10",
    },
    {
        iniciais: "MJ",
        nome: "Murilo Jeronimo",
        rm: "RM: 560641",
        disciplinas: ["EDGE COMPUTING", "IOT"],
        cor: "#3dffa0",
        github: "https://github.com/murilojeronimoferreiranunes10-collab",
    },
    {
        iniciais: "VK",
        nome: "Vinicius Kozonoe",
        rm: "RM: 567264",
        disciplinas: ["STORYTELLING", "DPS"],
        cor: "#f77f00",
        github: "https://github.com/Vinicius-Kozonoe",
    },
    {
        iniciais: "YL",
        nome: "Yan Lucas Gonçalves",
        rm: "RM: 567046",
        disciplinas: ["STORYTELLING", "DPS"],
        cor: "#ffd166",
        github: "https://github.com/lucx-yan",
    },
]

const STACK = [
    "React 18", "Vite 5", "Tailwind CSS v3", "React Router DOM",
    "Python 3.x", "DP4", "FIWARE Orion GE", "ETH Comet",
    "MQTT", "ESP32 / Mokel", "LDR / DH1755", "DHT22",
    "BMP280", "OLED SSD1306", "Docker Compose", "GitHub Pages",
    "NASA VIIRS", "NASA MODIS", "CelesTrak TLE", "Space-Track.org",
    "Cormorant Garamond", "Inter", "Space Mono",
]

function CardMembro({ membro, index }) {
    return (
        <div
            className="animate-fade-in-up"
            style={{
                animationDelay: `${index * 0.08}s`,
                padding: "1.6rem",
                background: "rgba(79, 158, 255, 0.03)",
                border: "0.5px solid rgba(79, 158, 255, 0.1)",
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                transition: "background 0.2s ease, border-color 0.2s ease",
                cursor: "default",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(79, 158, 255, 0.06)"
                e.currentTarget.style.borderColor = "rgba(79, 158, 255, 0.22)"
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(79, 158, 255, 0.03)"
                e.currentTarget.style.borderColor = "rgba(79, 158, 255, 0.1)"
            }}
        >
            {/* Avatar */}
            <div style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: `${membro.cor}18`,
                border: `1.5px solid ${membro.cor}55`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
            }}>
                <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: membro.cor,
                }}>
                    {membro.iniciais}
                </span>
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
                <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.15rem",
                    fontWeight: 500,
                    color: "var(--c-white)",
                    lineHeight: 1.2,
                    marginBottom: "0.35rem",
                }}>
                    {membro.nome}
                </p>
                <p style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.1em",
                    color: "rgba(79, 158, 255, 0.5)",
                    marginBottom: "0.9rem",
                }}>
                    {membro.rm}
                </p>

                {/* Disciplinas */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
                    {membro.disciplinas.map(d => (
                        <span key={d} style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.6rem",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "var(--c-muted)",
                            padding: "2px 7px",
                            background: "rgba(232, 244, 253, 0.04)",
                            border: "0.5px solid rgba(232, 244, 253, 0.08)",
                            borderRadius: "2px",
                        }}>
                            {d}
                        </span>
                    ))}
                </div>

                {/* GitHub */}
                <a
                    href={membro.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        letterSpacing: "0.08em",
                        color: "rgba(232, 244, 253, 0.25)",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = membro.cor}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(232, 244, 253, 0.25)"}
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    github
                </a>
            </div>
        </div>
    )
}

function PillStack() {
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {STACK.map(tech => (
                <span key={tech} style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.08em",
                    color: "var(--c-muted)",
                    padding: "4px 12px",
                    background: "rgba(79, 158, 255, 0.04)",
                    border: "0.5px solid rgba(79, 158, 255, 0.12)",
                    borderRadius: "2px",
                    transition: "color 0.2s ease, border-color 0.2s ease",
                    cursor: "default",
                }}
                    onMouseEnter={e => {
                        e.currentTarget.style.color = "var(--c-cyan)"
                        e.currentTarget.style.borderColor = "rgba(79, 158, 255, 0.35)"
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.color = "var(--c-muted)"
                        e.currentTarget.style.borderColor = "rgba(79, 158, 255, 0.12)"
                    }}
                >
                    {tech}
                </span>
            ))}
        </div>
    )
}

export default function Sobre() {
    return (
        <div className="relative z-10" style={{ paddingTop: "6rem" }}>

            {/* Hero */}
            <section style={{ padding: "4rem 4rem 3rem" }}>
                <p className="section-kicker animate-fade-in-up" style={{ fontSize: "0.76rem" }}>
                    ◈ Quem construiu o SkyAware
                </p>

                <div className="divider-line animate-fade-in-up delay-100" style={{ margin: "1.2rem 0" }} />

                <h1 className="animate-fade-in-up delay-200" style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.8rem, 5vw, 5rem)",
                    fontWeight: 300,
                    lineHeight: 1.02,
                    color: "var(--c-white)",
                }}>
                    A equipe
                    <br />
                    <em style={{ fontStyle: "italic", color: "var(--c-muted)" }}>
                        que olhou para cima.
                    </em>
                </h1>
            </section>

            {/* Cards da equipe */}
            <section style={{
                padding: "0 4rem 4rem",
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "1rem",
            }}>
                {EQUIPE.map((membro, i) => (
                    <CardMembro key={membro.iniciais} membro={membro} index={i} />
                ))}
            </section>

            {/* Rodapé da seção */}
            <section style={{
                padding: "2.5rem 4rem 5rem",
                borderTop: "0.5px solid rgba(232, 244, 253, 0.05)",
            }}>
                {/* Info FIAP */}
                <p style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
                    color: "var(--c-muted)",
                    marginBottom: "2rem",
                }}>
                    FIAP · Engenharia de Software · 1ESPA · Global Solution 2026 · 2° Semestre
                </p>

                {/* Stack */}
                <div>
                    <p className="section-kicker" style={{ marginBottom: "1rem", fontSize: "0.72rem" }}>
                        Stack tecnológico completo
                    </p>
                    <PillStack />
                </div>
            </section>
        </div>
    )
}

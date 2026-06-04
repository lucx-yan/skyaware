const EQUIPE = [
    {
        iniciais: "BC",
        nome: "Bruno Castilho",
        disciplinas: ["FRONT-END", "WEB DEV"],
        cor: "#4f9eff",
        github: "https://github.com/Castilho8",
    },
    {
        iniciais: "JV",
        nome: "João Victor Melo",
        disciplinas: ["EDGE COMPUTING", "IOT", "CÁLCULOS (DPS)", "STORYTELLING"],
        cor: "#a78bfa",
        github: "https://github.com/JoaoVictorMelo10",
    },
    {
        iniciais: "MJ",
        nome: "Murilo Jeronimo",
        disciplinas: ["FRONT-END", "WEB DEV", "EDGE COMPUTING", "IOT"],
        cor: "#3dffa0",
        github: "https://github.com/murilojeronimoferreiranunes10-collab",
    },
    {
        iniciais: "VK",
        nome: "Vinicius Kozonoe",
        disciplinas: ["PYTHON", "CÁLCULOS (DPS)", "STORYTELLING"],
        cor: "#f77f00",
        github: "https://github.com/Vinicius-Kozonoe",
    },
    {
        iniciais: "YL",
        nome: "Yan Lucas Gonçalves",
        disciplinas: ["FRONT-END", "WEB DEV", "SOFTWARE DESIGN"],
        cor: "#ffd166",
        github: "https://github.com/lucx-yan",
    },
]

const STACK = [
    // Frontend
    "React 19", "Vite 8", "Tailwind CSS v3", "React Router DOM", "Lucide React",
    // Backend
    "Python 3.x", "Flask API", "Nginx", "Let's Encrypt", "DuckDNS",
    // FIWARE
    "FIWARE Orion CB", "IoT Agent MQTT", "STH Comet", "Docker Compose",
    // Edge
    "ESP32 / Wokwi", "LDR / BH1750", "DHT22", "BMP180", "OLED SSD1306", "MQTT",
    // APIs
    "N2YO API", "Open-Meteo API", "VIIRS / NASA", "BORTLE_MAP", "Space-Track.org",
    // Infra
    "GitHub Pages", "VM Azure",
    // Tipografia
    "Cormorant Garamond", "Inter", "Space Mono",
]

function CardMembro({ membro, index }) {
    return (
        <div
            className="animate-fade-in-up flex flex-col gap-4 p-6 rounded cursor-default
                        border-[0.5px] border-[rgba(79,158,255,0.1)] bg-[rgba(79,158,255,0.03)]
                        transition-all duration-200
                        hover:bg-[rgba(79,158,255,0.06)] hover:border-[rgba(79,158,255,0.22)]"
            style={{ animationDelay: `${index * 0.08}s` }}
        >
            {/* Avatar */}
            <div
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                style={{
                    background: `${membro.cor}18`,
                    border: `1.5px solid ${membro.cor}55`,
                }}
            >
                <span
                    className="text-xs font-bold tracking-[0.06em] [font-family:var(--font-mono)]"
                    style={{ color: membro.cor }}
                >
                    {membro.iniciais}
                </span>
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 gap-0">
                <p className="[font-family:var(--font-display)] text-lg font-medium leading-tight mb-3 text-[var(--c-white)]">
                    {membro.nome}
                </p>

                {/* Disciplinas */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {membro.disciplinas.map(d => (
                        <span
                            key={d}
                            className="[font-family:var(--font-mono)] text-[0.6rem] tracking-[0.12em] uppercase
                                       text-[var(--c-muted)] px-1.5 py-0.5 rounded-sm
                                       bg-[rgba(232,244,253,0.04)] border-[0.5px] border-[rgba(232,244,253,0.08)]"
                        >
                            {d}
                        </span>
                    ))}
                </div>

                {/* GitHub */}
                <a
                    href={membro.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 [font-family:var(--font-mono)] text-[0.65rem]
                               tracking-[0.08em] no-underline transition-colors duration-200
                               text-[rgba(232,244,253,0.25)]"
                    onMouseEnter={e => e.currentTarget.style.color = membro.cor}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(232,244,253,0.25)"}
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    github
                </a>
            </div>
        </div>
    )
}

function PillStack() {
    return (
        <div className="flex flex-wrap gap-2">
            {STACK.map(tech => (
                <span
                    key={tech}
                    className="[font-family:var(--font-mono)] text-[0.68rem] tracking-[0.08em] cursor-default
                               text-[var(--c-muted)] px-3 py-1 rounded-sm
                               bg-[rgba(79,158,255,0.04)] border-[0.5px] border-[rgba(79,158,255,0.12)]
                               transition-colors duration-200
                               hover:text-[var(--c-cyan)] hover:border-[rgba(79,158,255,0.35)]"
                >
                    {tech}
                </span>
            ))}
        </div>
    )
}

export default function Sobre() {
    return (
        <div className="relative z-10 pt-24" style={{ overflowX: "hidden" }}>

            {/* Hero */}
            <section className="px-5 lg:px-16 pt-16 pb-12">
                <p className="section-kicker animate-fade-in-up text-[0.76rem]">
                    ◈ Quem construiu o SkyAware
                </p>

                <div className="divider-line animate-fade-in-up delay-100 my-5" />

                <h1
                    className="animate-fade-in-up delay-200 [font-family:var(--font-display)] font-light leading-[1.02] text-[var(--c-white)]"
                    style={{ fontSize: "clamp(2.8rem, 5vw, 5rem)" }}
                >
                    A equipe
                    <br />
                    <em className="italic text-[var(--c-muted)]">
                        que olhou para cima.
                    </em>
                </h1>
            </section>

            <section className="px-5 lg:px-16 pb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {EQUIPE.map((membro, i) => (
                    <CardMembro key={membro.iniciais} membro={membro} index={i} />
                ))}
            </section>

            <section className="px-5 lg:px-16 pt-10 pb-20 border-t border-[rgba(232,244,253,0.05)]">
                <p className="[font-family:var(--font-mono)] text-[0.72rem] tracking-[0.1em] text-[var(--c-muted)] mb-8">
                    FIAP · Engenharia de Software · 1ESPA · Global Solution 2026 · 2° Semestre
                </p>

                <div>
                    <p className="section-kicker text-[0.72rem] mb-4">
                        Stack tecnológico completo
                    </p>
                    <PillStack />
                </div>
            </section>
        </div>
    )
}
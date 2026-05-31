import { Link } from "react-router-dom"
import { ChevronRight, MapPin, RefreshCw } from "lucide-react"
import data from "../data/satellites.json"

// Hero
function Hero({ perfil }) {
    const { meta, scoreFactors } = data
    // Cálculo
    const B = (scoreFactors.orbital.value * scoreFactors.orbital.weight) + (scoreFactors.local.value * scoreFactors.local.weight)
    const score = (B * scoreFactors.matm.value * scoreFactors.mlum.value * 10).toFixed(1)
    // Definir cor
    function getStatus(s) {
        const n = parseFloat(s)
        if (n >= 7) return { label: "Janela ideal de observação", color: "var(--c-green)" }
        if (n >= 4) return { label: "Condições moderadas", color: "var(--c-yellow)" }
        return { label: "Condições desfavoráveis", color: "var(--c-red)" }
    }
    const status = getStatus(score)
    // Mensagem por perfil
    function getPerfilMsg() {
        if (perfil === "fotografo") return "3 rastros esperados na próxima hora"
        if (perfil === "profissional") return `B = ${B.toFixed(2)} · M_atm = ${scoreFactors.matm.value} · M_lum = ${scoreFactors.mlum.value}`
        return `${meta.starlinkActive.toLocaleString()} Starlink ativos agora`
    }
    return (
        <section className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12"
            style={{ padding: "6rem 4rem 4rem" }}
        >
            {/* Lado Esquerdo */}
            <div className="flex-1" style={{ maxWidth: "520px" }}>

                <p className="section-kicker animate-fade-in-up"
                    style={{
                        fontSize: "0.76rem"
                    }}>
                    ◈ Inteligência orbital aplicada à astronomia cidadã
                </p>

                <div className="divider-line animate-fade-in-up delay-100" style={{ margin: "1.2rem 0" }} />

                <h1 className="animate-fade-in-up delay-200"
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(2.8rem, 5vw, 5rem)",
                        fontWeight: 300,
                        lineHeight: 1.02,
                        color: "var(--c-white)",
                        marginBottom: "1.8rem"
                    }}
                >
                    <em style={{ fontStyle: "italic", color: "var(--c-muted)" }}>O céu</em>
                    <br />
                    <span style={{ fontWeight: 600 }}>que você</span>
                    <br />
                    <em style={{ fontStyle: "italic", color: "var(--c-muted)" }}>merece ver.</em>
                </h1>

                <p className="animate-fade-in-up delay-300"
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.95rem",
                        fontWeight: 300,
                        lineHeight: 1.8,
                        color: "var(--c-muted)",
                        marginBottom: "2.5rem",
                    }}
                >
                    Satélites da NASA e da ESA monitoram a Terra continuamente.
                    O DarkSky cruza esses dados com condições locais e responde uma pergunta simples: vale a pena observar agora?
                </p>

                <div className="flex flex-wrap gap-3 animate-fade-in-up delay-400">
                    <Link to="/mapa-ceu" className="btn-primary">
                        Ver o céu agora
                        <ChevronRight size={15} />
                    </Link>
                    <Link to="/problema" className="btn-ghost">
                        Entender o problema
                    </Link>
                </div>
            </div>

            {/* Lado Direito */}
            <div className="animate-fade-in-up delay-200 w-full"
                style={{ maxWidth: "800px" }}
            >
                <div className="panel"
                    style={{ borderRadius: "8px", padding: "2rem 2.4rem" }}
                >
                    <div className="flex items-start justify-between"
                        style={{ marginBottom: "1.2rem" }}
                    >
                        <div>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.76rem",
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                color: "rgba(79, 158, 255, 0.65)",
                            }}>
                                Sky Observation Score
                            </p>
                            <p className="flex items-center gap-1"
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.76rem",
                                    color: "var(--c-muted)",
                                    marginTop: "4px",
                                    letterSpacing: "0.04em",
                                }}
                            >
                                <MapPin size={12} />
                                {meta.location} - agora
                            </p>
                        </div>

                        <div className="flex items-center gap-2"
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.6rem",
                                letterSpacing: "0.1em",
                                color: "var(--c-cyan)",
                                background: "rgba(79, 158, 255, 0.08)",
                                border: "0.5px solid rgba(79, 158, 255, 0.22)",
                                borderRadius: "3px",
                                padding: "4px 10px",
                            }}
                        >
                            <span style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "var(--c-green)",
                                boxShadow: "0 0 5px var(--c-green)",
                                display: "inline-block",
                                animation: "blink 2s infinite",
                            }} />
                            AO VIVO
                        </div>
                    </div>

                    <p style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "6.5rem",
                        fontWeight: 300,
                        lineHeight: 0.4,
                        color: "var(--c-white)",
                        letterSpacing: "-0.02em",
                        marginBottom: "3rem",
                    }}>
                        {score}
                        <span style={{ fontSize: "2.5rem", color: "rgba(232, 244, 253, 0.22)" }}>
                            /10
                        </span>
                    </p>

                    <div className="flex items-center gap-2"
                        style={{ marginBottom: "1.4rem" }}
                    >
                        <span style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: status.color,
                            boxShadow: `0 0 6px ${status.color}`,
                            display: "inline-block",
                            flexShrink: 0,
                        }} />
                        <span style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.78rem",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: status.color,
                        }}>
                            {status.label}
                        </span>
                    </div>

                    <div style={{ marginBottom: "1.2rem" }}>
                        <div className="flex justify-between"
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.75rem",
                                color: "var(--c-muted)",
                                marginBottom: "5px",
                                letterSpacing: "0.04em",
                            }}
                        >
                            <span>18h</span>
                            <span>20h</span>
                            <span>22h</span>
                            <span>00h</span>
                            <span>02h</span>
                        </div>
                        <div style={{ display: "flex", gap: "2px", height: "16px" }}>
                            {["m", "r", "m", "r", "g", "g", "g", "g", "g", "m", "m", "g", "r", "g", "m", "r"].map((tipo, i) => {
                                const cor = tipo === "g" ? "#3dffa0" : tipo === "m" ? "#ffd166" : "#ff5050"
                                return (
                                    <div key={i} style={{
                                        flex: 1,
                                        borderRadius: "2px",
                                        background: cor,
                                        opacity: 0.7,
                                    }} />
                                )
                            })}
                        </div>
                        <p style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            color: "var(--c-muted)",
                            marginTop: "5px",
                            letterSpacing: "0.04em",
                        }}>
                            Próximas 12 horas · melhor janela: 20h-00h
                        </p>
                    </div>

                    {/* Mensagem por perfil */}
                    {perfil === "profissional" ? (
                        <div style={{
                            marginBottom: "1.4rem",
                            padding: "0.8rem",
                            background: "rgba(79, 158, 255, 0.05)",
                            border: "0.5px solid rgba(79, 158, 255,0.15)",
                            borderRadius: "3px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.4rem",
                        }}>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.8rem",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: "rgba(79, 158, 255, 0.5)",
                                marginBottom: "0.2rem"
                            }}>
                                Fórmula híbrida
                            </p>
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--c-muted)" }}>
                                B = ({scoreFactors.orbital.value} × {scoreFactors.orbital.weight}) + ({scoreFactors.local.value} × {scoreFactors.local.weight}) = <span style={{ color: "var(--c-white)" }}>{B.toFixed(2)}</span>
                            </p>
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--c-muted)" }}>
                                M_atm = <span style={{ color: "var(--c-cyan)" }}>{scoreFactors.matm.value}</span>
                                {"  ·  "}
                                M_lum = <span style={{ color: "var(--c-yellow)" }}>{scoreFactors.mlum.value}</span>
                            </p>
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--c-muted)" }}>
                                Score = {B.toFixed(2)} × {scoreFactors.matm.value} × {scoreFactors.mlum.value} × 10 = <span style={{ color: "var(--c-green)", fontWeight: "bold" }}>{score}</span>
                            </p>
                        </div>
                    ) : (
                        <p style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            color: "var(--c-muted)",
                            letterSpacing: "0.04em",
                            marginBottom: "1.4rem",
                            padding: "0.6rem 0.8rem",
                            background: "rgba(79, 158, 255, 0.05)",
                            border: "0.5px solid rgba(79, 158, 255, 0.01)",
                            borderRadius: "3px",
                        }}>
                            {getPerfilMsg()}
                        </p>
                    )}

                    {/* Fatores */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.6rem",
                    }}>
                        {[
                            { label: "Orbital", value: scoreFactors.orbital.value, color: "var(--c-cyan)" },
                            { label: "Local / ESP32", value: scoreFactors.local.value, color: "var(--c-green)" },
                            { label: "M_atm", value: scoreFactors.matm.value, color: "var(--c-cyan)" },
                            { label: "M_lum", value: scoreFactors.mlum.value, color: "var(--c-yellow)" },
                        ].map(f => (
                            <div key={f.label}
                                style={{
                                    background: "rgba(79, 158, 255, 0.03)",
                                    border: "0.5px solid rgba(79, 158, 255, 0.09)",
                                    borderRadius: "3px",
                                    padding: "0.7rem 0.9rem",
                                }}
                            >
                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.7rem",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    color: "rgba(79, 158, 255, 0.5)",
                                    marginBottom: "0.35rem",
                                }}>
                                    {f.label}
                                </p>

                                <div style={{
                                    height: "2px",
                                    background: "rgba(232, 244, 253, 0.07)",
                                    borderRadius: "1px",
                                    marginBottom: "0.35rem",
                                    overflow: "hidden",
                                }}>
                                    <div style={{
                                        height: "100%",
                                        width: `${(f.value / 5) * 100}%`,
                                        background: f.color,
                                        borderRadius: "1px",
                                        transition: "width 1s ease",
                                    }} />
                                </div>

                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.68rem",
                                    color: "rgba(232, 244, 253, 0.4)",
                                }}>
                                    {f.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-end gap-1"
                        style={{ marginTop: "1rem" }}
                    >
                        <RefreshCw size={10} style={{ color: "var(--c-muted)", opacity: 1 }} />
                        <p style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.7rem",
                            color: "var(--c-muted)",
                            letterSpacing: "0.04em",
                            opacity: 1,
                        }}>
                            Atualizado agora · próx. em 10 min
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default function Home({ perfil }) {
    return (
        <div className="relative z-10">
            <Hero perfil={perfil} />
        </div>
    )
}
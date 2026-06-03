import { Link } from "react-router-dom"
import { ChevronRight, MapPin, RefreshCw, Telescope, Camera, FlaskConical } from "lucide-react"
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
                    O SkyAware cruza esses dados com condições locais e responde uma pergunta simples: vale a pena observar agora?
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

// Estatísticas
function StatsBar() {
    const {meta} = data
    const stats = [
        {value: meta.starlinkActive.toLocaleString(), label: "Starlink em órbita"},
        {value: `${meta.affectedImages}%`, label: "Imagens científicas afetadas"},
        {value: 3, label: "Satélites NASA integrados"},
        {value: "7 dias", label: "Previsão em tempo real"},
    ]
    return (
        <div className="relative z-10"
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                borderTop: "0.5px solid rgba(232, 244, 253, 0.05)",
                borderBottom: "0.5px solid rgba(232, 244, 253, 0.05)",
            }}
        >
            {stats.map((stat, i) => (
                <div key={i}
                    style={{
                        padding: "2rem 3rem",
                        textAlign: "center",
                        borderRight: i < stats.length - 1
                            ? "0.5px solid rgba(232, 244, 253, 0.05)"
                            : "none",
                    }}
                >
                    <p style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "2.6rem",
                        fontWeight: 300,
                        lineHeight: 1,
                        color: "var(--c-white)",
                        marginBottom: "0.7rem",
                    }}>
                        {stat.value}
                    </p>
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--c-muted)",
                    }}>
                        {stat.label}
                    </p>
                </div>
            ))}
        </div>
    )
}

// Sobre
function Sobre() {
    const perfil = [
        {
            icon: Telescope,
            titulo: "Astrônomo Amador",
            descricao: "Score geral, previsão semanal e dicas do que observar esta noite.",
            cor: "var(--c-green)",
        },
        {
            icon: Camera,
            titulo: "Astrofotógrafo",
            descricao: "Risco de rastros por tempo de exposição, seeing e melhor janela.",
            cor: "var(--c-cyan)",
        },
        {
            icon: FlaskConical,
            titulo: "Astrônomo Profissional",
            descricao: "Fórmula híbrida completa, dados brutos das APIs e simulação.",
            cor: "var(--c-orange)",
        },
    ]
    return (
        <section className="relative z-10"
            style={{
                padding: "4rem 4rem",
                borderBottom: "0.5px solid rgba(232, 244, 253, 0.04)",
                display: "grid",
                gridTemplateColumns: "1fr 1.3fr",
                gap: "6rem",
                alignItems: "start",
            }}
        >
            {/* Coluna esquerda */}
            <div>
                <p className="section-kicker" 
                    style={{
                        fontSize: "0.9rem",
                        marginBottom: "1rem",
                    }}>
                    ◈ O que é o SkyAware
                </p>
                <h2 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2rem, 4vw, 3.2rem)",
                    fontWeight: 300,
                    lineHeight: 1.06,
                    color: "var(--c-white)",
                    marginBottom: "1.5rem",
                }}>
                    Dado orbital.<br/>
                    <em style={{fontStyle: "italic", color: "var(--c-muted)"}}>
                        Decisão humana.
                    </em>
                </h2>
                {/* Cards */}
                <div style={{display: "flex", flexDirection: "column", gap: "0.75rem"}}>
                    {perfil.map(p => {
                        const Icone = p.icon
                        return (
                            <div key={p.titulo}
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "0.75rem",
                                    padding: "0.9rem 1rem",
                                    background: "rgba(79, 158, 255, 0.03)",
                                    border: "0.5px solid rgba(79, 158, 255, 0.08)",
                                    borderRadius: "4px",
                                }}
                            >
                                <Icone size={18} color={p.cor} strokeWidth={1.5}
                                    style={{flexShrink: 0, marginTop: "2px"}}/>
                                <div>
                                    <p style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: "1rem",
                                        fontWeight: 500,
                                        color: "var(--c-white)",
                                        marginBottom: "0.2rem",
                                    }}>
                                        {p.titulo}
                                    </p>
                                    <p style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: "0.9rem",
                                        fontWeight: 300,
                                        color: "var(--c-muted)",
                                        lineHeight: 1.5,
                                    }}>
                                        {p.descricao}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Coluna direita */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.1rem",
                marginTop: "4.6rem",
            }}>
                {[
                    {texto: "Desde 2019, empresas como SpaceX, Amazon e OneWeb lançaram milhares de satélites em órbita baixa. A Starlink já possui mais de <b>6.000 ativos</b>, com aprovação para chegar a 42.000. Cada satélite reflete luz solar e deixa rastros visíveis nas fotografias e observações.,"},
                    {texto: "Observatórios como o <b>Vera C. Rubin</b> estimam que até <b>30% das imagens científicas</b> já são contaminadas. Para o astrônomo amador ou fotógrafo noturno, uma noite planejada com semanas de antecedência pode ser completamente arruinada."},
                    {texto: "O SkyAware responde uma pergunta simples: <b>o céu está livre agora?</b> Cruzando dados orbitais reais da NASA e ESA com condições locais medidas pelo ESP32, entregamos o momento exato de olhar para cima."},
                ].map((item, i) => (
                    <p key={i}
                        dangerouslySetInnerHTML={{__html: item.texto}}
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "1.1rem",
                            fontWeight: 300,
                            lineHeight: 1.8,
                            color: "rgba(232, 244, 253, 0.4)",
                        }}
                    />
                ))}
            </div>
        </section>
    )
}

// Características
function Features() {
    const features = [
        {
            num: "01",
            titulo: "Sky Observation Score",
            descricao: "Índice 0-10 calculado em tempo real combinando os dados orbitais, poluição luminosa e condições atmosféricas locais medidas pelo ESP32.",
        },
        {
            num: "02",
            titulo: "Previsão de 7 dias",
            descricao: "Visualize as janelas ideais de observação e os períodos de alta interferência de satélites com antecedência de até 7 dias.",
        },
        {
            num: "03",
            titulo: "Mapa Estelar ao Vivo",
            descricao: "Campo do céu com satélites em movimento real - veja exatamente quais Starlink cruzam seu campo de visão em tempo real.",
        },
        {
            num: "04",
            titulo: "Modo Fotografia",
            descricao: "Calcule rastros esperados por tempo de exposição e direção de câmera antes de sair para fotografar. Evite rastros nas longas exposições.",
        },
        {
            num: "05",
            titulo: "Alertas de Janela Ideal",
            descricao: "Notificação no dashboard e sinal físico no ESP32 - LED verde, buzzer e display OLED - quando as condições superam seu limiar.",
        },
        {
            num: "06",
            titulo: "Histórico Orbital",
            descricao: "Acompanhe como a qualidade do seu céu evoluiu nos últimos meses com seu crescimento das constelações de satélites.",
        },
    ]

    return (
        <section className="relative z-10">
            <div style={{
                    padding: "2.5rem 4rem 1.2rem",
                    borderBottom: "0.5px solid rgba(232, 244, 253, 0.04)",
                    display: "flex",
                    alignItems: "baseline",
                    gap: "1.5rem",
                }}
            >
                <p className="section-kicker" style={{opacity: 1, fontSize: "0.85rem"}}>
                    Funcionalidades
                </p>
                <p style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.85rem",
                    letterSpacing: "0.06em",
                    color: "var(--c-muted)",
                }}>
                    // o que o SkyAware entrega
                </p>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
            }}>
                {features.map((f, i) => (
                    <div key={f.num}
                        style={{
                            padding: "2.2rem 2.5rem",
                            borderRight: (i + 1) % 3 !== 0
                                ? "0.5px solid rgba(232, 244, 253, 0.05)"
                                : "none",
                            borderBottom: i < 3
                                ? "0.5px solid rgba(232, 244, 253, 0.05)"
                                : "none",
                            transition: "background 0.2s ease",  
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(79, 158, 255, 0.03)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                        <p style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.8rem",
                            letterSpacing: "0.1em",
                            color: "rgba(79, 158, 255, 0.75)",
                            marginBottom: "0.9rem",
                        }}>
                            {f.num} -
                        </p>

                        <p style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.5rem",
                            fontWeight: 400,
                            color: "var(--c-white)",
                            marginBottom: "0.5rem",
                            lineHeight: 1.2,
                        }}>
                            {f.titulo}
                        </p>

                        <p style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.9rem",
                            fontWeight: 300,
                            lineHeight: 1.65,
                            color: "var(--c-muted)",
                        }}>
                            {f.descricao}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}

// CTA
function CTA() {
    return (
        <section className="relative z-10"
            style={{
                padding: "5rem 4rem",
                textAlign: "center",
                borderTop: "0.5px solid rgba(232, 244, 253, 0.04)",
            }}
        >
            <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 300,
                lineHeight: 1.05,
                color: "var(--c-white)",
                marginBottom: "0.8rem",
            }}>
                Não perca<br/>
                <em style={{fontStyle: "italic", color: "var(--c-muted)"}}>
                    as estrelas.
                </em>
            </h2>

            <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.1rem",
                fontWeight: 300,
                color: "var(--c-muted)",
                marginBottom: "2.2rem",
            }}>
                O SkyAware avisa quando o céu está ideal. Você só precisa olhar para cima.
            </p>

            <div className="flex gap-3 justify-center flex-wrap">
                <Link to="/mapa-ceu" className="btn-primary">
                    Ver o céu agora →
                </Link>
                <Link to="/como-funciona" className="btn-ghost">
                    Ver funcionalidades
                </Link>
            </div>
        </section>
    )
}

export default function Home({ perfil }) {
    return (
        <div className="relative z-10">
            <Hero perfil={perfil} />
            <StatsBar />
            <Sobre />
            <Features />
            <CTA />
        </div>
    )
}
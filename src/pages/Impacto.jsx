import { Link } from "react-router-dom"
import { ChevronRight, FlaskConical, Camera, Telescope, ShieldOff, ShieldCheck } from "lucide-react"

// Hero 
function Hero() {
    const constelacoes = [
        { nome: "Starlink (SpaceX)", valor: 8000, max: 10000, color: "#FF4D4D" },
        { nome: "OneWeb",            valor: 648,  max: 10000, color: "#FFB800" },
        { nome: "Kuiper (Amazon)",   valor: 400,  max: 10000, color: "#4FC3F7" },
        { nome: "Outros",            valor: 320,  max: 10000, color: "rgba(232,244,253,0.3)" },
    ]

    return (
        <section style={{ position: "relative", overflow: "hidden" }}
            className="px-5 lg:px-20 pt-24 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center"
        >
            {/* Linha decorativa vertical */}
            <div className="hidden lg:block" style={{
                position: "absolute",
                left: "50%",
                top: 0,
                bottom: 0,
                width: "0.5px",
                background: "linear-gradient(to bottom, transparent, rgba(79,158,255,0.15) 30%, rgba(79,158,255,0.15) 70%, transparent)",
                transform: "translateX(-50%)",
            }} />

            {/* Coluna Esquerda */}
            <div style={{ position: "relative" }}>
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "2.5rem",
                }}>
                    <span style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#FF4D4D",
                        boxShadow: "0 0 8px #FF4D4D",
                        animation: "pulse 2s ease-in-out infinite",
                    }} />
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.72rem",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "rgba(232,244,253,0.45)",
                    }}>
                        Impacto global da poluição orbital
                    </p>
                </div>

                <h1 style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 200,
                    lineHeight: 1,
                    color: "var(--c-white)",
                    marginBottom: "2rem",
                }}>
                    <span style={{ display: "block", fontSize: "clamp(3rem, 6vw, 6.5rem)" }}>
                        O impacto
                    </span>
                    <span style={{
                        display: "block",
                        fontSize: "clamp(3rem, 6vw, 6.5rem)",
                        fontWeight: 700,
                        color: "transparent",
                        WebkitTextStroke: "1px rgba(232,244,253,0.7)",
                        letterSpacing: "-0.02em",
                    }}>
                        vai além
                    </span>
                    <span style={{
                        display: "block",
                        fontSize: "clamp(3rem, 6vw, 6.5rem)",
                        fontStyle: "italic",
                        color: "rgba(232,244,253,0.3)",
                    }}>
                        da astronomia.
                    </span>
                </h1>

                <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "1rem",
                    fontWeight: 300,
                    lineHeight: 1.9,
                    color: "rgba(232,244,253,0.45)",
                    marginBottom: "3rem",
                    maxWidth: "440px",
                    borderLeft: "2px solid rgba(79,158,255,0.3)",
                    paddingLeft: "1.2rem",
                }}>
                    A poluição luminosa orbital não afeta apenas telescópios profissionais.
                    Fotógrafos, astrônomos amadores e a própria herança cultural da humanidade
                    estão sendo comprometidos silenciosamente.
                </p>

                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <Link to="/mapa-ceu" className="btn-primary"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                        Ver o céu agora
                        <ChevronRight size={15} />
                    </Link>
                    <Link to="/problema" className="btn-ghost">
                        Entender o problema
                    </Link>
                </div>
            </div>

            {/* Coluna Direita — painel de dados */}
            <div>
                <div style={{
                    position: "relative",
                    background: "rgba(4, 8, 20, 0.7)",
                    border: "0.5px solid rgba(79,158,255,0.12)",
                    borderRadius: "2px",
                    padding: "2.5rem",
                    backdropFilter: "blur(8px)",
                }}>
                    {/* Cantos decorativos */}
                    {[
                        { top: -1, left: -1 },
                        { top: -1, right: -1 },
                        { bottom: -1, left: -1 },
                        { bottom: -1, right: -1 },
                    ].map((pos, i) => (
                        <span key={i} style={{
                            position: "absolute",
                            width: 10,
                            height: 10,
                            border: "1.5px solid rgba(79,158,255,0.5)",
                            borderRadius: "1px",
                            ...pos,
                        }} />
                    ))}

                    <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.68rem",
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                color: "rgba(79,158,255,0.6)",
                                marginBottom: "4px",
                            }}>
                                Interferência por constelação
                            </p>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.68rem",
                                color: "rgba(232,244,253,0.25)",
                                letterSpacing: "0.06em",
                            }}>
                                Satélites ativos · estimativa 2025
                            </p>
                        </div>
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.68rem",
                            color: "rgba(232,244,253,0.2)",
                            letterSpacing: "0.1em",
                        }}>
                            /01
                        </span>
                    </div>

                    {constelacoes.map((c) => (
                        <div key={c.nome} style={{ marginBottom: "1.4rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px", alignItems: "baseline" }}>
                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.73rem",
                                    color: "rgba(232,244,253,0.4)",
                                    letterSpacing: "0.06em",
                                }}>
                                    {c.nome}
                                </p>
                                <p style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "1.05rem",
                                    fontWeight: 300,
                                    color: c.color,
                                }}>
                                    {c.valor.toLocaleString()}
                                </p>
                            </div>
                            <div style={{
                                height: "3px",
                                background: "rgba(232,244,253,0.04)",
                                borderRadius: "1px",
                                overflow: "hidden",
                            }}>
                                <div style={{
                                    height: "100%",
                                    width: `${(c.valor / c.max) * 100}%`,
                                    background: c.color,
                                    borderRadius: "1px",
                                    transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
                                }} />
                            </div>
                        </div>
                    ))}

                    <div style={{
                        marginTop: "2rem",
                        paddingTop: "1.5rem",
                        borderTop: "0.5px solid rgba(232,244,253,0.05)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                    }}>
                        <div>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.68rem",
                                color: "rgba(232,244,253,0.2)",
                                marginBottom: "4px",
                                letterSpacing: "0.06em",
                            }}>
                                Projeção 2030
                            </p>
                            <p style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "2rem",
                                fontWeight: 200,
                                color: "#FF4D4D",
                                lineHeight: 1,
                            }}>
                                100.000+
                            </p>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.68rem",
                                color: "rgba(232,244,253,0.25)",
                                marginTop: "4px",
                            }}>
                                objetos em órbita baixa
                            </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.68rem",
                                color: "rgba(232,244,253,0.2)",
                                marginBottom: "4px",
                                letterSpacing: "0.06em",
                            }}>
                                FCC aprovados
                            </p>
                            <p style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "2rem",
                                fontWeight: 200,
                                color: "#FFB800",
                                lineHeight: 1,
                            }}>
                                42.000
                            </p>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.68rem",
                                color: "rgba(232,244,253,0.25)",
                                marginTop: "4px",
                            }}>
                                satélites Starlink
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// StatsBar 
function StatsBar() {
    const stats = [
        { value: "30%",    label: "Imagens científicas afetadas" },
        { value: "42.000", label: "Starlink aprovados pela FCC" },
        { value: "648+",   label: "Satélites OneWeb ativos" },
        { value: "100k+",  label: "Objetos previstos até 2030" },
    ]
    return (
        <div
            className="grid grid-cols-2 lg:grid-cols-4"
            style={{
                borderTop: "0.5px solid rgba(232,244,253,0.05)",
                borderBottom: "0.5px solid rgba(232,244,253,0.05)",
                position: "relative",
                zIndex: 10,
            }}
        >
            {stats.map((stat, i) => (
                <div key={i} style={{
                    padding: "1.5rem 1rem",
                    textAlign: "center",
                    borderRight: i % 2 === 0
                        ? "0.5px solid rgba(232,244,253,0.05)"
                        : "none",
                    borderBottom: i < 2
                        ? "0.5px solid rgba(232,244,253,0.05)"
                        : "none",
                    position: "relative",
                    overflow: "hidden",
                    transition: "background 0.3s ease",
                }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(79,158,255,0.03)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                    <p style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.6rem, 3.5vw, 3rem)",
                        fontWeight: 200,
                        lineHeight: 1,
                        color: "var(--c-white)",
                        marginBottom: "0.65rem",
                        letterSpacing: "-0.02em",
                    }}>
                        {stat.value}
                    </p>
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "rgba(232,244,253,0.28)",
                    }}>
                        {stat.label}
                    </p>
                </div>
            ))}
        </div>
    )
}

// Afetados 
function Afetados() {
    const grupos = [
        {
            icon: FlaskConical,
            titulo: "Astronomia Científica",
            descricao: "Observatórios profissionais enfrentam imagens contaminadas e custos crescentes. Cada nova constelação reduz a eficiência das observações.",
            cor: "#FF8A50",
            num: "01",
        },
        {
            icon: Camera,
            titulo: "Astrofotografia",
            descricao: "Uma passagem compromete horas de preparação. Em longas exposições, o rastro é irreversível — nenhum software elimina completamente o dano.",
            cor: "#4FC3F7",
            num: "02",
        },
        {
            icon: Telescope,
            titulo: "Observação Amadora",
            descricao: "Milhões observam o céu por lazer, educação ou paixão. A crescente presença de satélites altera permanentemente essa experiência.",
            cor: "#69F0AE",
            num: "03",
        },
    ]

    return (
        <section
            className="px-5 lg:px-20"
            style={{
                paddingTop: "4rem",
                paddingBottom: "4rem",
                borderBottom: "0.5px solid rgba(232,244,253,0.04)",
                position: "relative",
                zIndex: 10,
            }}
        >
            {/* Cabeçalho */}
            <div
                className="flex flex-col lg:flex-row lg:items-baseline lg:justify-between gap-3"
                style={{
                    marginBottom: "3rem",
                    paddingBottom: "2rem",
                    borderBottom: "0.5px solid rgba(232,244,253,0.05)",
                }}
            >
                <div className="flex flex-col lg:flex-row lg:items-baseline gap-3 lg:gap-6">
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "rgba(79,158,255,0.5)",
                    }}>
                        ◈ Quem sente o impacto
                    </p>
                    <h2 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                        fontWeight: 200,
                        color: "var(--c-white)",
                        lineHeight: 1,
                    }}>
                        Três mundos.{" "}
                        <em style={{ fontStyle: "italic", color: "rgba(232,244,253,0.3)" }}>
                            Um problema.
                        </em>
                    </h2>
                </div>
                <p className="hidden lg:block" style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    color: "rgba(232,244,253,0.15)",
                    letterSpacing: "0.1em",
                }}>
                    /02
                </p>
            </div>

            <div
                className="grid grid-cols-1 md:grid-cols-3 gap-px mb-16"
                style={{ background: "rgba(232,244,253,0.04)" }}
            >
                {grupos.map((p) => {
                    const Icone = p.icon
                    return (
                        <div key={p.titulo}
                            style={{
                                padding: "2.5rem 2rem",
                                background: "var(--c-bg, #040814)",
                                position: "relative",
                                overflow: "hidden",
                                transition: "background 0.3s ease",
                                cursor: "default",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(4,8,20,0.5)"}
                            onMouseLeave={e => e.currentTarget.style.background = "var(--c-bg, #040814)"}
                        >
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.68rem",
                                color: "rgba(232,244,253,0.15)",
                                marginBottom: "1.5rem",
                                letterSpacing: "0.12em",
                            }}>
                                {p.num}
                            </p>
                            <Icone size={22} color={p.cor} strokeWidth={1.2} style={{ marginBottom: "1.2rem" }} />
                            <p style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "1.5rem",
                                fontWeight: 400,
                                color: "var(--c-white)",
                                marginBottom: "0.8rem",
                                lineHeight: 1.2,
                            }}>
                                {p.titulo}
                            </p>
                            <p style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "1rem",
                                fontWeight: 300,
                                lineHeight: 1.75,
                                color: "rgba(232,244,253,0.35)",
                            }}>
                                {p.descricao}
                            </p>
                            <div style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: "2px",
                                background: p.cor,
                                opacity: 0.3,
                            }} />
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    "O céu noturno sempre foi uma das maiores fontes de conhecimento da humanidade. Das primeiras navegações aos observatórios modernos, nossa compreensão do universo começou olhando para cima — e essa herança está sendo comprometida.",
                    "A poluição luminosa orbital é um fenômeno novo e crescente. Diferente da poluição das cidades, ela não pode ser bloqueada por um anteparo. Os satélites estão em órbita, refletindo luz solar, visíveis mesmo de locais remotos e reservas de céu escuro.",
                    "Se nada for feito, gerações futuras poderão crescer sem nunca experienciar um céu verdadeiramente escuro. O SkyAware não reverte esse cenário — mas devolve o controle para quem ainda quer observar, entregando o momento exato de olhar para cima.",
                ].map((texto, i) => (
                    <p key={i} style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "1rem",
                        fontWeight: 300,
                        lineHeight: 1.9,
                        color: "rgba(232,244,253,0.28)",
                        paddingTop: "1.5rem",
                        borderTop: "0.5px solid rgba(232,244,253,0.06)",
                    }}>
                        {texto}
                    </p>
                ))}
            </div>
        </section>
    )
}

// ─── Comparativo ──────────────────────────────────────────────────────────────
function Comparativo() {
    const colunas = [
        {
            num: "01",
            titulo: "Sem SkyAware",
            icon: ShieldOff,
            cor: "#FF4D4D",
            itens: [
                "Aplicativos fragmentados e dados desconexos",
                "Sem integração entre dados orbitais e condições locais",
                "Planejamento por tentativa e erro",
                "Rastros em imagens descobertos só depois da captura",
                "Sem alertas proativos de janela ideal",
                "Horas de preparação perdidas em uma única noite",
            ],
        },
        {
            num: "02",
            titulo: "Com SkyAware",
            icon: ShieldCheck,
            cor: "#69F0AE",
            itens: [
                "Dados orbitais reais da NASA e ESA em tempo real",
                "Condições locais medidas pelo ESP32 integradas ao Score",
                "Sky Observation Score único, simples e acionável",
                "Previsão de rastros por direção e tempo de exposição",
                "Alertas físicos: LED, buzzer e display OLED",
                "Previsão de 7 dias para planejamento antecipado",
            ],
        },
    ]

    return (
        <section style={{ position: "relative", zIndex: 10 }}>
            {/* Cabeçalho */}
            <div
                className="px-5 lg:px-20 flex flex-col lg:flex-row lg:items-baseline lg:justify-between gap-3"
                style={{
                    paddingTop: "2.5rem",
                    paddingBottom: "2rem",
                    borderBottom: "0.5px solid rgba(232,244,253,0.04)",
                }}
            >
                <div className="flex flex-col lg:flex-row lg:items-baseline gap-2 lg:gap-5">
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.9rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "rgba(79,158,255,0.5)",
                    }}>
                        Comparativo
                    </p>
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.85rem",
                        color: "rgba(232,244,253,0.18)",
                        letterSpacing: "0.06em",
                    }}>
                        // por que o SkyAware é importante
                    </p>
                </div>
                <p className="hidden lg:block" style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    color: "rgba(232,244,253,0.15)",
                    letterSpacing: "0.1em",
                }}>
                    /03
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
                {colunas.map((col, i) => {
                    const Icone = col.icon
                    return (
                        <div key={col.num}
                            className="px-5 lg:px-16"
                            style={{
                                paddingTop: "2.5rem",
                                paddingBottom: "2.5rem",
                                borderRight: i === 0
                                    ? "0.5px solid rgba(232,244,253,0.05)"
                                    : "none",
                                borderBottom: i === 0
                                    ? "0.5px solid rgba(232,244,253,0.05)"
                                    : "none",
                                position: "relative",
                                overflow: "hidden",
                                transition: "background 0.25s ease",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(79,158,255,0.02)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                            {/* Faixa de cor no topo */}
                            <div style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "2px",
                                background: col.cor,
                                opacity: i === 0 ? 0.25 : 0.5,
                            }} />

                            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.5rem" }}>
                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.7rem",
                                    letterSpacing: "0.14em",
                                    color: "rgba(79,158,255,0.45)",
                                }}>
                                    {col.num}
                                </p>
                                <div style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: "50%",
                                    border: `0.5px solid ${col.cor}40`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <Icone size={14} color={col.cor} strokeWidth={1.5} />
                                </div>
                                <p style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "1.4rem",
                                    fontWeight: 300,
                                    color: "var(--c-white)",
                                    lineHeight: 1,
                                }}>
                                    {col.titulo}
                                </p>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                                {col.itens.map((item, j) => (
                                    <div key={j} style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "1rem",
                                        padding: "0.8rem 0",
                                        borderBottom: "0.5px solid rgba(232,244,253,0.04)",
                                    }}>
                                        <p style={{
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.65rem",
                                            color: `${col.cor}80`,
                                            letterSpacing: "0.1em",
                                            flexShrink: 0,
                                            marginTop: "2px",
                                            width: "20px",
                                        }}>
                                            {String(j + 1).padStart(2, "0")}
                                        </p>
                                        <p style={{
                                            fontFamily: "var(--font-body)",
                                            fontSize: "0.88rem",
                                            fontWeight: 300,
                                            lineHeight: 1.65,
                                            color: "rgba(232,244,253,0.38)",
                                        }}>
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

// CTA 
function CTA() {
    return (
        <section
            className="px-5 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center"
            style={{
                paddingTop: "5rem",
                paddingBottom: "5rem",
                borderTop: "0.5px solid rgba(232,244,253,0.04)",
                position: "relative",
                zIndex: 10,
            }}
        >
            {/* Esquerda */}
            <div>
                <p style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(79,158,255,0.45)",
                    marginBottom: "1.8rem",
                }}>
                    /04 — Conclusão
                </p>
                <h2 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                    fontWeight: 200,
                    lineHeight: 1.02,
                    color: "var(--c-white)",
                    letterSpacing: "-0.02em",
                }}>
                    O espaço está<br />
                    ficando mais<br />
                    <em style={{
                        fontStyle: "italic",
                        color: "rgba(232,244,253,0.28)",
                    }}>
                        conectado.
                    </em>
                </h2>
            </div>

            {/* Direita */}
            <div>
                <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "1.05rem",
                    fontWeight: 300,
                    lineHeight: 1.9,
                    color: "rgba(232,244,253,0.38)",
                    marginBottom: "3rem",
                    paddingLeft: "2rem",
                    borderLeft: "1px solid rgba(79,158,255,0.2)",
                }}>
                    O SkyAware existe para garantir que a humanidade não perca de vista
                    as estrelas enquanto corre em direção a elas.
                </p>

                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <Link to="/mapa-ceu" className="btn-primary"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                        Ver o céu agora →
                    </Link>
                    <Link to="/como-funciona" className="btn-ghost">
                        Como funciona
                    </Link>
                </div>
            </div>
        </section>
    )
}

// Page 
export default function Impacto() {
    return (
        <div style={{ position: "relative", zIndex: 10, overflowX: "hidden" }}>
            <Hero />
            <StatsBar />
            <Afetados />
            <Comparativo />
            <CTA />
        </div>
    )
}
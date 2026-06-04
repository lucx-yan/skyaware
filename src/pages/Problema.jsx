import { Link } from "react-router-dom"
import { ChevronRight, Eye, Camera, Globe } from "lucide-react"

// Hero
function Hero() {
    return (
        <section
            className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 px-5 lg:px-16"
            style={{ paddingTop: "5rem", paddingBottom: "3rem" }}
        >
            {/* Lado Esquerdo */}
            <div className="flex-1 w-full" style={{ maxWidth: "520px" }}>
                <p className="section-kicker animate-fade-in-up"
                    style={{ fontSize: "0.76rem" }}>
                    ◈ O problema que o SkyAware resolve
                </p>

                <div className="divider-line animate-fade-in-up delay-100" style={{ margin: "1.2rem 0" }} />

                <h1 className="animate-fade-in-up delay-200"
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(2.8rem, 5vw, 5rem)",
                        fontWeight: 300,
                        lineHeight: 1.02,
                        color: "var(--c-white)",
                        marginBottom: "1.8rem",
                    }}
                >
                    <em style={{ fontStyle: "italic", color: "var(--c-muted)" }}>Estamos</em>
                    <br />
                    <span style={{ fontWeight: 600 }}>perdendo</span>
                    <br />
                    <em style={{ fontStyle: "italic", color: "var(--c-muted)" }}>o céu noturno.</em>
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
                    Desde 2019, megaconstelações de satélites estão transformando o céu noturno.
                    A mesma expansão que conecta o mundo está comprometendo décadas de astronomia cidadã e científica.
                </p>

                <div className="flex flex-wrap gap-3 animate-fade-in-up delay-400">
                    <Link to="/mapa-ceu" className="btn-primary">
                        Ver o céu agora
                        <ChevronRight size={15} />
                    </Link>
                    <Link to="/como-funciona" className="btn-ghost">
                        Como o SkyAware ajuda
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
                        style={{ marginBottom: "1.6rem" }}
                    >
                        <div>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.76rem",
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                color: "rgba(79, 158, 255, 0.65)",
                            }}>
                                Crescimento orbital
                            </p>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.76rem",
                                color: "var(--c-muted)",
                                marginTop: "4px",
                                letterSpacing: "0.04em",
                            }}>
                                Satélites em órbita baixa · 2019 – 2025
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
                                background: "var(--c-red)",
                                boxShadow: "0 0 5px var(--c-red)",
                                display: "inline-block",
                                animation: "blink 2s infinite",
                            }} />
                            CRESCENDO
                        </div>
                    </div>

                    {/* Gráfico de barras */}
                    <div style={{ marginBottom: "1.6rem" }}>
                        {[
                            { ano: "2019", valor: 120,  total: 42000 },
                            { ano: "2020", valor: 900,  total: 42000 },
                            { ano: "2021", valor: 1800, total: 42000 },
                            { ano: "2022", valor: 3200, total: 42000 },
                            { ano: "2023", valor: 5000, total: 42000 },
                            { ano: "2024", valor: 6500, total: 42000 },
                            { ano: "2025", valor: 8000, total: 42000 },
                        ].map((item, i) => (
                            <div key={item.ano}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.8rem",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.72rem",
                                    color: "var(--c-muted)",
                                    width: "2.4rem",
                                    flexShrink: 0,
                                }}>
                                    {item.ano}
                                </p>
                                <div style={{
                                    flex: 1,
                                    height: "10px",
                                    background: "rgba(232, 244, 253, 0.05)",
                                    borderRadius: "2px",
                                    overflow: "hidden",
                                }}>
                                    <div style={{
                                        height: "100%",
                                        width: `${(item.valor / item.total) * 100}%`,
                                        background: i === 6
                                            ? "var(--c-red)"
                                            : `rgba(79, 158, 255, ${0.3 + i * 0.1})`,
                                        borderRadius: "2px",
                                        transition: "width 1s ease",
                                    }} />
                                </div>
                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.72rem",
                                    color: i === 6 ? "var(--c-red)" : "rgba(232, 244, 253, 0.35)",
                                    width: "3.5rem",
                                    textAlign: "right",
                                    flexShrink: 0,
                                }}>
                                    {item.valor >= 1000
                                        ? `${(item.valor / 1000).toFixed(1)}k`
                                        : item.valor}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Métricas */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: "0.6rem",
                    }}>
                        {[
                            { label: "Starlink ativos", value: "8.000+", color: "var(--c-red)" },
                            { label: "Previsão 2030", value: "100k+", color: "var(--c-yellow)" },
                            { label: "Imagens afetadas", value: "30%", color: "var(--c-cyan)" },
                        ].map(m => (
                            <div key={m.label}
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
                                    marginBottom: "0.4rem",
                                }}>
                                    {m.label}
                                </p>
                                <p style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "1.4rem",
                                    fontWeight: 300,
                                    color: m.color,
                                    lineHeight: 1,
                                }}>
                                    {m.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

// Estatísticas
function StatsBar() {
    const stats = [
        { value: "42.000", label: "Satélites aprovados pela FCC" },
        { value: "30%", label: "Imagens científicas afetadas" },
        { value: "7 min", label: "Intervalo médio de passagem" },
        { value: "2019", label: "Início da megaconstelação" },
    ]
    return (
        <div
            className="relative z-10 grid grid-cols-2 lg:grid-cols-4"
            style={{
                borderTop: "0.5px solid rgba(232, 244, 253, 0.05)",
                borderBottom: "0.5px solid rgba(232, 244, 253, 0.05)",
            }}
        >
            {stats.map((stat, i) => (
                <div key={i}
                    style={{
                        padding: "1.5rem 1rem",
                        textAlign: "center",
                        borderRight: i % 2 === 0
                            ? "0.5px solid rgba(232, 244, 253, 0.05)"
                            : "none",
                        borderBottom: i < 2
                            ? "0.5px solid rgba(232, 244, 253, 0.05)"
                            : "none",
                    }}
                >
                    <p style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
                        fontWeight: 300,
                        lineHeight: 1,
                        color: "var(--c-white)",
                        marginBottom: "0.7rem",
                    }}>
                        {stat.value}
                    </p>
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.62rem",
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

// Contexto
function Contexto() {
    const impactos = [
        {
            icon: Eye,
            titulo: "Astrônomo Amador",
            descricao: "Uma noite planejada com semanas de antecedência pode ser arruinada por uma única passagem de satélite no momento errado.",
            cor: "var(--c-green)",
        },
        {
            icon: Camera,
            titulo: "Astrofotógrafo",
            descricao: "Rastros brilhantes em longas exposições são irreversíveis. Nenhum software de edição elimina completamente o dano.",
            cor: "var(--c-cyan)",
        },
        {
            icon: Globe,
            titulo: "Ciência Profissional",
            descricao: "Observatórios como o Vera C. Rubin estimam perdas de até 30% das imagens científicas. Décadas de pesquisa em risco.",
            cor: "var(--c-orange)",
        },
    ]
    return (
        <section
            className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] px-5 lg:px-16"
            style={{
                paddingTop: "3rem",
                paddingBottom: "3rem",
                borderBottom: "0.5px solid rgba(232, 244, 253, 0.04)",
                gap: "3rem",
                alignItems: "start",
            }}
        >
            {/* Coluna esquerda */}
            <div>
                <p className="section-kicker"
                    style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
                    ◈ Quem é afetado
                </p>
                <h2 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2rem, 4vw, 3.2rem)",
                    fontWeight: 300,
                    lineHeight: 1.06,
                    color: "var(--c-white)",
                    marginBottom: "1.5rem",
                }}>
                    Problema real.<br />
                    <em style={{ fontStyle: "italic", color: "var(--c-muted)" }}>
                        Para todos.
                    </em>
                </h2>

                {/* Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {impactos.map(p => {
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
                                    style={{ flexShrink: 0, marginTop: "2px" }} />
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
            }}>
                {[
                    { texto: "Em 2019, a SpaceX lançou os primeiros 60 satélites Starlink. O que parecia uma novidade rapidamente se tornou uma constelação de <b>mais de 6.000 unidades ativas</b>, cada uma refletindo luz solar e deixando rastros nas imagens astronômicas." },
                    { texto: "A Amazon, com o Projeto Kuiper, e a OneWeb seguem o mesmo caminho. As aprovações regulatórias já permitem o lançamento de mais de <b>100.000 satélites</b> até o fim desta década — um número que transformará permanentemente o céu noturno como o conhecemos." },
                    { texto: "O problema não é apenas estético. É científico. <b>Cada rastro representa dados perdidos</b>, horas de observação comprometidas e, em última instância, descobertas que nunca acontecerão. O SkyAware não reverte esse cenário, mas devolve o controle para quem olha para cima." },
                ].map((item, i) => (
                    <p key={i}
                        dangerouslySetInnerHTML={{ __html: item.texto }}
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

// Linha do tempo
function Timeline() {
    const eventos = [
        {
            num: "01",
            ano: "2019",
            titulo: "Primeiro lote Starlink",
            descricao: "SpaceX lança 60 satélites em órbita baixa. Astrônomos registram imediatamente rastros visíveis nas primeiras noites.",
        },
        {
            num: "02",
            ano: "2020",
            titulo: "Alerta da IAU",
            descricao: "A União Astronômica Internacional emite alerta formal sobre o impacto das megaconstelações na astronomia profissional e amadora.",
        },
        {
            num: "03",
            ano: "2021",
            titulo: "1.000+ satélites ativos",
            descricao: "Starlink ultrapassa mil unidades ativas. Primeiros estudos quantificam o percentual de imagens científicas comprometidas.",
        },
        {
            num: "04",
            ano: "2022",
            titulo: "Amazon e OneWeb entram",
            descricao: "Projeto Kuiper e OneWeb iniciam lançamentos, multiplicando o número de operadores e intensificando o problema.",
        },
        {
            num: "05",
            ano: "2023",
            titulo: "Vera C. Rubin alerta",
            descricao: "O observatório mais avançado do mundo estima que até 30% de suas imagens serão afetadas quando estiver em plena operação.",
        },
        {
            num: "06",
            ano: "2025",
            titulo: "Hoje: 8.000+ satélites",
            descricao: "A constelação Starlink ultrapassa 8.000 unidades ativas. Aprovação para 42.000 já concedida pela FCC.",
        },
    ]

    return (
        <section className="relative z-10">
            {/* Header da seção */}
            <div
                className="px-5 lg:px-16"
                style={{
                    paddingTop: "2.5rem",
                    paddingBottom: "1.2rem",
                    borderBottom: "0.5px solid rgba(232, 244, 253, 0.04)",
                    display: "flex",
                    alignItems: "baseline",
                    gap: "1.5rem",
                }}
            >
                <p className="section-kicker" style={{ opacity: 1, fontSize: "0.85rem" }}>
                    Linha do tempo
                </p>
                <p style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.85rem",
                    letterSpacing: "0.06em",
                    color: "var(--c-muted)",
                }}>
                    // como chegamos até aqui
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {eventos.map((e, i) => (
                    <div key={e.num}
                        className="px-5 lg:px-10"
                        style={{
                            paddingTop: "2rem",
                            paddingBottom: "2rem",
                            borderBottom: "0.5px solid rgba(232, 244, 253, 0.05)",
                            transition: "background 0.2s ease",
                        }}
                        onMouseEnter={ev => ev.currentTarget.style.background = "rgba(79, 158, 255, 0.03)"}
                        onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}
                    >
                        <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", marginBottom: "0.9rem" }}>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.8rem",
                                letterSpacing: "0.1em",
                                color: "rgba(79, 158, 255, 0.75)",
                            }}>
                                {e.num} -
                            </p>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.8rem",
                                letterSpacing: "0.1em",
                                color: "var(--c-muted)",
                            }}>
                                {e.ano}
                            </p>
                        </div>

                        <p style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.5rem",
                            fontWeight: 400,
                            color: "var(--c-white)",
                            marginBottom: "0.5rem",
                            lineHeight: 1.2,
                        }}>
                            {e.titulo}
                        </p>

                        <p style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.9rem",
                            fontWeight: 300,
                            lineHeight: 1.65,
                            color: "var(--c-muted)",
                        }}>
                            {e.descricao}
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
        <section
            className="relative z-10 px-5 lg:px-16"
            style={{
                paddingTop: "4rem",
                paddingBottom: "4rem",
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
                O problema existe.<br />
                <em style={{ fontStyle: "italic", color: "var(--c-muted)" }}>
                    A solução também.
                </em>
            </h2>

            <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.1rem",
                fontWeight: 300,
                color: "var(--c-muted)",
                marginBottom: "2.2rem",
            }}>
                O SkyAware não muda o céu — ele te diz quando olhar para ele.
            </p>

            <div className="flex gap-3 justify-center flex-wrap">
                <Link to="/mapa-ceu" className="btn-primary">
                    Ver o céu agora →
                </Link>
                <Link to="/como-funciona" className="btn-ghost">
                    Como funciona
                </Link>
            </div>
        </section>
    )
}

export default function Problema() {
    return (
        <div className="relative z-10" style={{ overflowX: "hidden" }}>
            <Hero />
            <StatsBar />
            <Contexto />
            <Timeline />
            <CTA />
        </div>
    )
}
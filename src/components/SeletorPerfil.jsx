import { useEffect, useState } from "react"
import { Telescope, Camera, FlaskConical, ChevronRight, Stars } from "lucide-react"

// Configuração dos perfis
const PERFIS = [
    {
        id: "amador",
        icon: Telescope,
        nome: "Astrônomo Amador",
        descricao: "Quer saber simplesmente: vale a pena sair essa noite?",
        cor: "var(--c-green)",
        corRgb: "61, 255, 160",
        tags: ["Score geral", "Previsão semanal", "O que observar"],
    },
    {
        id: "fotografo",
        icon: Camera,
        nome: "Astrofotógrafo",
        descricao: "Planeja sessões com precisão e quer evitar rastros de satélites.",
        cor: "var(--c-cyan)",
        corRgb: "79, 158, 255",
        tags: ["Risco de rastros", "Melhor janela", "Seeing"],
    },
    {
        id: "profissional",
        icon: FlaskConical,
        nome: "Astrônomo Profissional",
        descricao: "Precisa de todos os dados: APIs, fórmulas e sensores brutos.",
        cor: "var(--c-orange)",
        corRgb: "247, 127, 0",
        tags: ["Fórmula híbrida", "Dados das APIs", "Simulação"],
    },
]

export default function SeletorPerfil({onSelecionar}) {
    const [visivel, setVisivel] = useState(false)
    const [selecionado, setSelecionado] = useState(null)
    const [saindo, setSaindo] = useState(false)

    // Animação de entrada
    useEffect(() => {
        const t = setTimeout(() => setVisivel(true), 80)
        return () => clearTimeout(t)
    }, [])

    function handleSelecionar(id) {
        setSelecionado(id)
        setSaindo(true)
        setTimeout(() => onSelecionar(id), 600)
    }

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 200,
                background: "var(--c-bg)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "clamp(2rem, 8vh, 5rem) 1.5rem 3rem",
                overflowY: "auto",
                opacity: saindo ? 0 : visivel ? 1 : 0,
                transform: saindo
                    ? "scale(1.02)"
                    : visivel ? "scale(1)" : "scale(0.98)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
        >
            {/* Ícone do topo */}
            <div
                style={{
                    marginBottom: "1.5rem",
                    flexShrink: 0,
                    opacity: visivel ? 1 : 0,
                    transform: visivel ? "translateY(0)" : "translateY(12px)",
                    transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
                }}
            >
                <Stars
                    size={28}
                    color="var(--c-cyan)"
                    style={{opacity: 0.6}}
                />
            </div>

            {/* Título */}
            <h1
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    fontWeight: 300,
                    lineHeight: 1.05,
                    color: "var(--c-white)",
                    textAlign: "center",
                    marginBottom: "0.6rem",
                    flexShrink: 0,
                    opacity: visivel ? 1 : 0,
                    transform: visivel ? "translateY(0)" : "translateY(16px)",
                    transition: "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s",
                }}
            >
                Como você{" "}
                <em style={{fontStyle: "italic", color: "var(--c-muted)"}}>
                    observa o céu?
                </em>
            </h1>

            {/* Subtítulo */}
            <p
                style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--c-muted)",
                    textAlign: "center",
                    marginBottom: "2.5rem",
                    flexShrink: 0,
                    opacity: visivel ? 1 : 0,
                    transform: visivel ? "translateY(0)" : "translateY(16px)",
                    transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
                }}
            >
                Selecione seu perfil para uma experiência personalizada
            </p>

            {/* Cards dos perfis */}
            <div
                style={{
                    display: "flex",
                    gap: "1.25rem",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    maxWidth: "900px",
                    width: "100%",
                    paddingBottom: "1rem",
                    opacity: visivel ? 1 : 0,
                    transform: visivel ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
                }}
            >
                {PERFIS.map((perfil) => {
                    const Icone = perfil.icon
                    const estaSelecionado = selecionado === perfil.id

                    return (
                        <button
                            key={perfil.id}
                            onClick={() => handleSelecionar(perfil.id)}
                            style={{
                                flex: 1,
                                minWidth: "min(100%, 220px)",
                                maxWidth: "270px",
                                background: estaSelecionado
                                    ? `rgba(${perfil.corRgb}, 0.08)`
                                    : "rgba(10, 22, 40, 0.6)",
                                border: `0.5px solid ${estaSelecionado ? perfil.cor : "rgba(232,244,253,0.08)"}`,
                                borderRadius: "12px",
                                padding: "2rem 1.75rem",
                                cursor: "pointer",
                                textAlign: "left",
                                transition: "all 0.25s ease",
                                position: "relative",
                                overflow: "hidden",
                            }}
                            onMouseEnter={e => {
                                if (selecionado) return
                                e.currentTarget.style.border = `0.5px solid rgba(${perfil.corRgb}, 0.5)`
                                e.currentTarget.style.background = `rgba(${perfil.corRgb}, 0.05)`
                                e.currentTarget.style.transform = "translateY(-4px)"
                            }}
                            onMouseLeave={e => {
                                if (selecionado) return
                                e.currentTarget.style.border = "0.5px solid rgba(232,244,253,0.08)"
                                e.currentTarget.style.background = "rgba(10, 22, 40, 0.6)"
                                e.currentTarget.style.transform = "translateY(0)"
                            }}
                        >
                            {/* Ícone */}
                            <div style={{marginBottom: "1.2rem"}}>
                                <Icone
                                    size={28}
                                    color={perfil.cor}
                                    strokeWidth={1.5}
                                />
                            </div>

                            {/* Nome */}
                            <p style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "1.3rem",
                                fontWeight: 400,
                                color: "var(--c-white)",
                                marginBottom: "0.5rem",
                                lineHeight: 1.2,
                            }}>
                                {perfil.nome}
                            </p>

                            {/* Descrição */}
                            <p style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "0.82rem",
                                fontWeight: 300,
                                color: "var(--c-muted)",
                                lineHeight: 1.55,
                                marginBottom: "1.25rem",
                            }}>
                                {perfil.descricao}
                            </p>

                            {/* Tags */}
                            <div style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "0.4rem",
                                marginBottom: "1.5rem",
                            }}>
                                {perfil.tags.map(tag => (
                                    <span
                                        key={tag}
                                        style={{
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.62rem",
                                            letterSpacing: "0.06em",
                                            color: `rgba(${perfil.corRgb}, 0.7)`,
                                            background: `rgba(${perfil.corRgb}, 0.06)`,
                                            border: `0.5px solid rgba(${perfil.corRgb}, 0.2)`,
                                            borderRadius: "3px",
                                            padding: "0.2rem 0.55rem",
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Seta de confirmar */}
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.4rem",
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.65rem",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: perfil.cor,
                                opacity: estaSelecionado ? 1 : 0.5,
                            }}>
                                {estaSelecionado ? "Entrando..." : "Selecionar"}
                                <ChevronRight size={13} />
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
import { useState } from "react";
import { MapPin, Bell, AlertTriangle, CheckCircle, Clock, Icon } from "lucide-react";
import data from "../data/satellites.json"

const ALERTAS_DATA = {
    amador: [
        {
            tipo: "critico",
            titulo: "Trem StarLink - passa em 4 minutos",
            descricao: "Vários satélites Starlink em fila vão cruzar o céu nos próximos 8 minutos. Visíveis a olho nu.",
            detalhe: "STARLINK-3847 ao STARLINK-3858 · 20h14",
        },
        {
            tipo: "atencao",
            titulo: "OneWeb passa pelo zênite em 28 min",
            descricao: "Um satélite vai cruzar bem no alto do céu. Boa hora para ver com binóculos.",
            detalhe: "ONEWEB-0312 · 22h42",
        },
        {
            tipo: "ideal",
            titulo: "Melhor janela da noite: 3h54 de céu limpo",
            descricao: "Das 20h20 até as 00h14 o céu vai estar ótimo para observar. Aproveite!",
            detalhe: "Score médio 8.4 · 2 satélites fracos · sem nuvens",
        },
        {
            tipo: "atencao",
            titulo: "Nuvens chegando na madrugada",
            descricao: "A partir das 00h18 o céu começa a nublar. Planeje suas observações antes disso.",
            detalhe: "Previsão Open-Meteo · 00h18",
        },
    ],
    fotografo: [
        {
            tipo: "critico",
            titulo: "⚠ Rastros garantidos — Starlink em 4 min",
            descricao: "12 satélites vão atravessar o campo de visão. Qualquer exposição acima de 10s vai registrar rastros. Pause agora.",
            detalhe: "STARLINK-3847→3858 · Az: 218°→165° · Alt: 542km · Mag: +2.1",
        },
        {
            tipo: "atencao",
            titulo: "ONEWEB cruza o zênite — risco alto em exposições longas",
            descricao: "Elevação máxima de 87°. Em exposições acima de 20s há alta chance de rastro visível na imagem.",
            detalhe: "ONEWEB-0312 · El: 87° · Mag: +4.2 · em 28 min",
        },
        {
            tipo: "ideal",
            titulo: "Janela limpa: 3h54 para astrofotografia",
            descricao: "Apenas 2 satélites de magnitude fraca (> +5) neste período. Ideal para exposições longas e composições de campo.",
            detalhe: "20h20 → 00h14 · Seeing estimado: bom · Transparência: alta",
        },
        {
            tipo: "atencao",
            titulo: "Frente de nuvens — encerra janela às 02h18",
            descricao: "Monitore a nebulosidade. MODIS indica 40% de cobertura chegando pelo sul.",
            detalhe: "Fonte: Open-Meteo · Última atualização: 21h30",
        },
    ],
    profissional: [
        {
            tipo: "critico",
            titulo: "Trem Starlink — interferência crítica iminente",
            descricao: "Série de 12 objetos STARLINK-3847→3858 em fila com separação angular de ~0.3°. Magnitude visual +2.1. Afetará qualquer observação zenital nos próximos 8 minutos.",
            detalhe: "f_orbital = 0.12 · Az: 218°→165° · El: 67° · Alt: 542km · Vel: 7.6km/s · NORAD IDs: 47688–47699",
        },
        {
            tipo: "atencao",
            titulo: "ONEWEB-0312 — passagem pelo zênite",
            descricao: "Elevação máxima de 87° em 28 minutos. Altitude de 1.200km confere maior brilho por maior área refletora visível. Magnitude estimada: +4.2.",
            detalhe: "NORAD: 47290 · Az: 90° → 310° · El max: 87° · Alt: 1.200km · Duração: 6 min",
        },
        {
            tipo: "ideal",
            titulo: "Janela de observação — Score 8.4",
            descricao: "Condições orbitais e atmosféricas favoráveis. B = 0.79 × M_atm = 0.90 × M_lum = 0.63 × 10 = 4.5 → Score = 8.4 após normalização local.",
            detalhe: "20h20 → 00h14 · f_orbital = 0.82 · M_atm = 0.90 · M_lum = 0.63 · f_local = 0.75",
        },
        {
            tipo: "atencao",
            titulo: "Frente de nebulosidade — M_atm em queda",
            descricao: "MODIS/NASA Terra detecta sistema nublado se aproximando. M_atm projetado: 0.60 às 02h18. Score projetado: 3.2 (abaixo do limiar crítico de 4.0).",
            detalhe: "Fonte: Open-Meteo · cloud_cover_mean projetado: 40% · 02h18 UTC-3",
        },
    ],
}

function getAlertStyle(tipo) {
    const map = {
        critico: {
            icon: AlertTriangle,
            color: "var(--c-red)",
            bg: "rgba(255, 80, 80, 0.05)",
            border: "rgba(255, 80, 80, 0.2)",
            label: "Crítico",
        },
        atencao: {
            icon: Clock,
            color: "var(--c-yellow)",
            bg: "rgba(255, 209, 102, 0.05)",
            border: "rgba(255, 209, 102, 0.2)",
            label: "Atenção",
        },
        ideal: {
            icon: CheckCircle,
            color: "var(--c-green)",
            bg: "rgba(61, 255, 160, 0.04)",
            border: "rgba(61, 255, 160, 0.18)",
            label: "Janela Ideal",
        },
    }
    return map[tipo]
}

// Cards

function AlertaCard({alerta}) {
    const style = getAlertStyle(alerta.tipo)
    const Icone = style.icon

    return (
        <div style={{
            padding: "1.4rem 1.6rem",
            background: style.bg,
            border: `0.5px solid ${style.border}`,
            borderRadius: "4px",
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
        }}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icone size={15} color={style.color} strokeWidth={1.8}/>
                    <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: style.color,
                        padding: "2px 8px",
                        background: `${style.border.replace("0.2", "0.08")}`,
                        border: `0.5px solid ${style.border}`,
                        borderRadius: "2px",
                    }}>
                        {style.label}
                    </span>
                </div>
            </div>

            <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                fontWeight: 500,
                color: "var(--c-white)",
                lineHeight: 1.3,
            }}>
                {alerta.titulo}
            </p>

            <p style={{
                fontFamily: "var(--font-body)",
                fontSize:   "0.82rem",
                fontWeight: 300,
                lineHeight: 1.65,
                color:      "var(--c-muted)",
            }}>
                {alerta.descricao}
            </p>

            <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.04em",
                color: "rgba(232, 244, 253, 0.25)",
                borderTop: "0.5px solid rgba(232, 244, 253, 0.06)",
                paddingTop: "0.5rem",
            }}>
                {alerta.detalhe}
            </p>
        </div>
    )
}

// Página
export default function Alertas({perfil}) {
    const {meta, scoreFactors} = data
    const alertas = ALERTAS_DATA[perfil] || ALERTAS_DATA.amador

    const B = (scoreFactors.orbital.value * scoreFactors.orbital.weight) + (scoreFactors.local.value * scoreFactors.local.weight)
    const score = (B * scoreFactors.matm.value * scoreFactors.mlum.value * 10).toFixed(1)

    const perfilLabel = {
        amador: "Astrônomo Amador",
        fotografo: "Astrofotógrafo",
        profissional: "Astrônomo Profissional",
    }[perfil] || "Astrônomo Amador"

    return (
        <div className="relative z-10" style={{minHeight: "100vh", padding: "5rem 4rem 4rem"}}>
            {/* Headeer */}
            <div style={{marginBottom: "3rem"}}>
                <p className="section-kicker" style={{marginBottom: "1rem"}}>
                    ◈ Central de alertas — tempo real
                </p>
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                    <h1 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(2.5rem, 5vw, 4rem)",
                        fontWeight: 300,
                        lineHeight: 1.0,
                        color: "var(--c-white)",
                    }}>
                        Alertas<br/>
                        <em style={{
                            fontSize: "italic",
                            color: "var(--c-muted)",
                        }}>
                            ativos.
                        </em>
                    </h1>

                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.4rem",
                        alignItems: "flex-start",
                    }}>
                        <div className="flex items-center gap-2">
                            <MapPin size={12} style={{color: "var(--c-muted)"}}/>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.68rem",
                                color: "var(--c-muted)",
                                letterSpacing: "0.04em",
                            }}>
                                {meta.location} · agora
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Bell size={12} style={{color: "var(--c-muted)"}}/>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.68rem",
                                color: "var(--c-muted)",
                                letterSpacing: "0.04em",
                            }}>
                                Perfil: {perfilLabel}
                            </p>    
                        </div>
                        <div className="flex items-center gap-2">
                            <span style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "var(--c-green)",
                                boxShadow: "0 0 5px var(--c-green)",
                                display: "inline-block",
                                animation: "blink 2s infinite",
                            }}/>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.68rem",
                                color: "rgba(232, 244, 253, 0.25)",
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                            }}>
                                Score atual: {score}/10
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="divider-line" style={{marginBottom: "2.5rem"}}/>

            <div className="grid-cols-1 lg:grid-cols-2" style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1rem",
                marginBottom: "4rem", 
            }}>
                {alertas.map((alerta, i) => (
                    <AlertaCard key={i} alerta={alerta}/>
                ))}
            </div>
        </div>
    )
}
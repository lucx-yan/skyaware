import { useState, useEffect, useRef } from "react"
import { MapPin, Bell, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { fetchScore, fetchForecast, fetchHistory } from "../services/api"
import staticData from "../data/satellites.json"

const HISTORICO_MOCK = [
    { ts: "21:00", score: 8.4 }, { ts: "21:05", score: 8.3 },
    { ts: "21:10", score: 8.5 }, { ts: "21:15", score: 7.8 },
    { ts: "21:20", score: 7.6 }, { ts: "21:25", score: 7.7 },
    { ts: "21:30", score: 7.5 }, { ts: "21:35", score: 7.6 },
    { ts: "21:40", score: 7.8 }, { ts: "21:45", score: 7.4 },
    { ts: "21:50", score: 7.3 }, { ts: "21:55", score: 7.5 },
    { ts: "22:00", score: 7.6 }, { ts: "22:05", score: 7.7 },
    { ts: "22:10", score: 7.4 }, { ts: "22:15", score: 7.2 },
    { ts: "22:20", score: 4.3 }, { ts: "22:25", score: 3.6 },
    { ts: "22:30", score: 3.4 }, { ts: "22:35", score: 3.5 },
    { ts: "22:40", score: 4.2 }, { ts: "22:45", score: 4.8 },
    { ts: "22:50", score: 8.4 }, { ts: "22:55", score: 8.5 },
    { ts: "23:00", score: 8.4 }, { ts: "23:05", score: 8.3 },
    { ts: "23:10", score: 8.5 }, { ts: "23:15", score: 8.4 },
    { ts: "23:20", score: 8.3 }, { ts: "23:25", score: 8.4 },
    { ts: "23:30", score: 8.5 }, { ts: "23:35", score: 8.4 },
    { ts: "23:40", score: 9.0 }, { ts: "23:45", score: 8.9 },
    { ts: "23:50", score: 2.3 }, { ts: "23:55", score: 1.8 },
    { ts: "00:00", score: 1.6 }, { ts: "00:05", score: 2.2 },
    { ts: "00:10", score: 1.9 }, { ts: "00:15", score: 1.4 },
    { ts: "00:20", score: 1.2 }, { ts: "00:25", score: 1.8 },
    { ts: "00:30", score: 3.5 }, { ts: "00:35", score: 7.0 },
    { ts: "00:40", score: 6.9 }, { ts: "00:45", score: 7.5 },
    { ts: "00:50", score: 7.8 }, { ts: "00:55", score: 0.8 },
    { ts: "01:00", score: 0.4 }, { ts: "01:05", score: 1.6 },
    { ts: "01:10", score: 3.5 }, { ts: "01:15", score: 5.0 },
    { ts: "01:20", score: 6.8 }, { ts: "01:25", score: 5.7 },
    { ts: "01:30", score: 5.5 }, { ts: "01:35", score: 6.1 },
    { ts: "01:40", score: 5.9 }, { ts: "01:45", score: 5.8 },
    { ts: "01:50", score: 6.0 }, { ts: "01:55", score: 5.7 },
]

// Gráfico
function GraficoHistorico({perfil, historico}) {
    const containerRef = useRef(null)
    const [tooltip, setTooltip] = useState(null)
    const [largura, setLargura] = useState(800)

    // Labels do eixo X
    const labelsX = historico
        .map((p, i) => ({ ts: p.ts, i }))
        .filter((_, i) => i % 6 === 0)

    useEffect(() => {
        if (!containerRef.current) return
        const obs = new ResizeObserver(entries => {
            setLargura(entries[0].contentRect.width)
        })
        obs.observe(containerRef.current)
        return () => obs.disconnect()
    }, [])

    const PAD = {top: 20, right: 20, bottom: 36, left: 36}
    const H = 180
    const W = largura
    const iW = W - PAD.left - PAD.right
    const iH = H - PAD.top  - PAD.bottom
    const n = historico.length

    function xPos(i) {return PAD.left + (n > 1 ? (i / (n - 1)) : 0) * iW}
    function yPos(s) {return PAD.top  + iH - (s / 10) * iH}

    // Caminho SVG da linha
    const path = historico.map((p, i) =>
        `${i === 0 ? "M" : "L"} ${xPos(i).toFixed(1)} ${yPos(p.score).toFixed(1)}`
    ).join(" ")

    // Área preenchida abaixo da linha
    const area = `${path} L ${xPos(n - 1).toFixed(1)} ${(PAD.top + iH).toFixed(1)} L ${PAD.left.toFixed(1)} ${(PAD.top + iH).toFixed(1)} Z`

    function scoreCor(s) {
        if (s >= 7) return "#3dffa0"
        if (s >= 4) return "#ffd166"
        return "#ff5050"
    }

    return (
        <div style={{ marginBottom: "4rem" }}>
            {/* Header */}
            <div style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: "1rem",
                paddingBottom: "1rem",
                borderBottom: "0.5px solid rgba(232, 244, 253, 0.05)",
            }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
                    <p className="section-kicker" style={{ opacity: 1, fontSize: "0.8rem" }}>
                        Histórico — Sky Observation Score
                    </p>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.06em", color: "rgba(232,244,253,0.2)" }}>
                        // SQLite · evolução do score na sessão
                    </p>
                </div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "rgba(232,244,253,0.2)" }}>
                    {historico.length} pontos
                </p>
            </div>

            {/* Gráfico SVG */}
            <div
                ref={containerRef}
                style={{
                    width: "100%",
                    position: "relative",
                    background: "rgba(3, 5, 12, 0.6)",
                    border: "0.5px solid rgba(79, 158, 255, 0.08)",
                    borderRadius: "4px",
                    overflow: "hidden",
                    userSelect: "none",
                }}
            >
                <svg
                    width="100%"
                    height={H}
                    viewBox={`0 0 ${W} ${H}`}
                    preserveAspectRatio="none"
                    onMouseMove={e => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const mouseX = (e.clientX - rect.left) * (W / rect.width)
                        const idx = Math.round(((mouseX - PAD.left) / iW) * (n - 1))
                        if (idx >= 0 && idx < n) setTooltip({ idx, x: mouseX })
                    }}
                    onMouseLeave={() => setTooltip(null)}
                >
                    <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(79,158,255,0.15)" />
                            <stop offset="100%" stopColor="rgba(79,158,255,0)" />
                        </linearGradient>
                    </defs>

                    {/* Linhas guia horizontais */}
                    {[0, 4, 7, 10].map(v => (
                        <g key={v}>
                            <line
                                x1={PAD.left} y1={yPos(v)}
                                x2={W - PAD.right} y2={yPos(v)}
                                stroke={v === 7 ? "rgba(61,255,160,0.1)" : v === 4 ? "rgba(255,209,102,0.1)" : "rgba(232,244,253,0.05)"}
                                strokeWidth={0.5}
                                strokeDasharray={v === 0 || v === 10 ? "none" : "4 4"}
                            />
                            <text
                                x={PAD.left - 6} y={yPos(v) + 4}
                                textAnchor="end"
                                fontSize={9}
                                fill="rgba(232,244,253,0.2)"
                                fontFamily="Space Mono, monospace"
                            >
                                {v}
                            </text>
                        </g>
                    ))}

                    {/* Área */}
                    <path d={area} fill="url(#areaGrad)" />

                    {/* Linha */}
                    <path
                        d={path}
                        fill="none"
                        stroke="rgba(79,158,255,0.7)"
                        strokeWidth={1.5}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />

                    {/* Pontos */}
                    {historico.map((p, i) => (
                        <circle
                            key={i}
                            cx={xPos(i)}
                            cy={yPos(p.score)}
                            r={tooltip?.idx === i ? 4 : 2.5}
                            fill={scoreCor(p.score)}
                            opacity={tooltip?.idx === i ? 1 : 0.7}
                        />
                    ))}

                    {/* Labels eixo X */}
                    {labelsX.map(({ ts, i }) => (
                        <text
                            key={ts}
                            x={xPos(i)}
                            y={H - 6}
                            textAnchor="middle"
                            fontSize={9}
                            fill="rgba(232,244,253,0.2)"
                            fontFamily="Space Mono, monospace"
                        >
                            {ts}
                        </text>
                    ))}

                    {/* Linha vertical do tooltip */}
                    {tooltip && (
                        <line
                            x1={xPos(tooltip.idx)} y1={PAD.top}
                            x2={xPos(tooltip.idx)} y2={PAD.top + iH}
                            stroke="rgba(79,158,255,0.3)"
                            strokeWidth={1}
                            strokeDasharray="3 3"
                        />
                    )}
                </svg>

                {/* Tooltip flutuante */}
                {tooltip && (() => {
                    const p = historico[tooltip.idx]
                    const cor = scoreCor(p.score)
                    const left = Math.min(Math.max(tooltip.x / W * 100, 8), 88)
                    return (
                        <div style={{
                            position: "absolute",
                            top: "8px",
                            left: `${left}%`,
                            transform: "translateX(-50%)",
                            background: "rgba(3,5,12,0.95)",
                            border: `0.5px solid ${cor}40`,
                            borderRadius: "3px",
                            padding: "0.35rem 0.6rem",
                            pointerEvents: "none",
                            whiteSpace: "nowrap",
                        }}>
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: cor, fontWeight: "bold" }}>
                                {p.score.toFixed(1)}
                            </p>
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "rgba(232,244,253,0.4)" }}>
                                {p.ts}
                            </p>
                        </div>
                    )
                })()}
            </div>

            {/* Legenda */}
            <div className="flex gap-4" style={{ marginTop: "0.6rem" }}>
                {[
                    { cor: "#3dffa0", label: "Ideal (≥7)" },
                    { cor: "#ffd166", label: "Moderado (4–7)" },
                    { cor: "#ff5050", label: "Interferência (<4)" },
                ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: l.cor, display: "inline-block" }} />
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "rgba(232,244,253,0.3)", letterSpacing: "0.06em" }}>
                            {l.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

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

function gerarAlertas(perfil, apiData, forecast, score) {
    const alertas = []
    const { satellites = [], scoreFactors } = apiData
    const scoreNum = parseFloat(score)
    const satelitesDanger = satellites.filter(s => s.danger)
    const numSats = satellites.length

    const coberturaPct = Math.round((1 - scoreFactors.matm.value) * 100)
    const poluicaoPct  = Math.min(Math.round(2 * (1 - scoreFactors.mlum.value) * 100), 100)
    const B = ((scoreFactors.orbital.value * scoreFactors.orbital.weight) + (scoreFactors.local.value * scoreFactors.local.weight)).toFixed(2)

    // Card 1: Satélites
    if (satelitesDanger.length > 0) {
        const nomes  = satelitesDanger.map(s => s.id).join(", ").substring(0, 80)
        const mais   = satelitesDanger[0]
        if (perfil === "amador") {
            alertas.push({
                tipo: "critico",
                titulo: `${satelitesDanger.length} satélite(s) passando agora`,
                descricao: `${satelitesDanger.length > 1 ? "Vários satélites" : "Um satélite"} cruzando o céu com menos de 10 minutos para a passagem sobre você.`,
                detalhe: `${nomes} · em menos de 10 min · Alt: ${mais.altitude}km`,
            })
        } else if (perfil === "fotografo") {
            alertas.push({
                tipo: "critico",
                titulo: `⚠ Rastros garantidos — ${satelitesDanger.length} satélite(s) iminente(s)`,
                descricao: `Pause agora. ${satelitesDanger.length} objeto(s) com passagem em menos de 10 min. Qualquer exposição acima de 10s registrará rastros.`,
                detalhe: `${nomes} · Az: ${mais.azimuth}° · El: ${mais.elevation}° · Alt: ${mais.altitude}km · Mag: ${mais.magnitude}`,
            })
        } else {
            alertas.push({
                tipo: "critico",
                titulo: `Interferência crítica — ${satelitesDanger.length} objeto(s) iminentes`,
                descricao: `${satelitesDanger.length} satélite(s) com passagem em menos de 10 minutos. f_orbital impactado diretamente. Afetará observações zenitais imediatamente.`,
                detalhe: `${nomes} · Az: ${mais.azimuth}° · El: ${mais.elevation}° · Alt: ${mais.altitude}km · Vel: ${mais.velocity}km/s`,
            })
        }
    } else if (numSats > 0) {
        const proximo = [...satellites].sort((a, b) => a.passesIn - b.passesIn)[0]
        if (perfil === "amador") {
            alertas.push({
                tipo: "atencao",
                titulo: `${numSats} satélite(s) visível(is) — próximo em ${proximo.passesIn} min`,
                descricao: `Há satélites no seu céu, mas nenhum vai interferir nos próximos 10 minutos. Boa janela aberta agora.`,
                detalhe: `${proximo.id} · em ${proximo.passesIn} min · Alt: ${proximo.altitude}km`,
            })
        } else if (perfil === "fotografo") {
            alertas.push({
                tipo: "atencao",
                titulo: `${numSats} satélite(s) visível(is) — próxima passagem em ${proximo.passesIn} min`,
                descricao: `Ainda há janela segura. Planeje exposições longas antes da próxima passagem.`,
                detalhe: `${proximo.id} · Az: ${proximo.azimuth}° · El: ${proximo.elevation}° · Mag: ${proximo.magnitude} · em ${proximo.passesIn} min`,
            })
        } else {
            alertas.push({
                tipo: "atencao",
                titulo: `${numSats} objeto(s) em órbita visível`,
                descricao: `Constelação ativa mas sem passagens críticas imediatas. Próxima passagem relevante em ${proximo.passesIn} minutos.`,
                detalhe: `${proximo.id} · Az: ${proximo.azimuth}° · El: ${proximo.elevation}° · Alt: ${proximo.altitude}km · Vel: ${proximo.velocity}km/s · em ${proximo.passesIn} min`,
            })
        }
    } else {
        if (perfil === "amador") {
            alertas.push({tipo: "favoravel", titulo: "Céu limpo de satélites agora", descricao: "Nenhum satélite Starlink ou OneWeb detectado. Ótimo momento para observar!", detalhe: "0 satélites · N2YO · agora"})
        } else if (perfil === "fotografo") {
            alertas.push({tipo: "favoravel", titulo: "Janela livre — sem rastros previstos", descricao: "Nenhum satélite no campo visível. Ideal para sessões longas sem risco de rastros.", detalhe: "0 satélites · N2YO · agora"})
        } else {
            alertas.push({tipo: "favoravel", titulo: "f_orbital máximo — nenhum objeto detectado", descricao: "Hemisfério visível sem satélites detectados. f_orbital atingindo valor ótimo para o período.", detalhe: `f_orbital = ${scoreFactors.orbital.value} · 0 satélites · N2YO · agora`})
        }
    }

    // Card 2
    if (scoreNum >= 7) {
        if (perfil === "amador") {
            alertas.push({tipo: "favoravel", titulo: `Noite excelente — score ${score}/10`, descricao: `Céu aberto, pouca poluição luminosa e boa condição orbital. Vale sair agora!`, detalhe: `Score ${score} · Orbital: ${Math.round(scoreFactors.orbital.value * 100)}% · Nuvens: ${coberturaPct}%`})
        } else if (perfil === "fotografo") {
            alertas.push({tipo: "favoravel", titulo: `Condições excelentes — score ${score}/10`, descricao: `Seeing bom e transparência alta. Ideal para longas exposições e composições de campo profundo.`, detalhe: `M_atm = ${scoreFactors.matm.value} · M_lum = ${scoreFactors.mlum.value} · f_local = ${scoreFactors.local.value}`})
        } else {
            alertas.push({tipo: "favoravel", titulo: `Score ${score}/10 — condições favoráveis`, descricao: `Condições orbitais e atmosféricas favoráveis. B = ${B} × M_atm = ${scoreFactors.matm.value} × M_lum = ${scoreFactors.mlum.value} × 10 = ${score}.`, detalhe: `f_orbital = ${scoreFactors.orbital.value} · M_atm = ${scoreFactors.matm.value} · M_lum = ${scoreFactors.mlum.value} · f_local = ${scoreFactors.local.value}`})
        }
    } else if (scoreNum >= 4) {
        if (perfil === "amador") {
            alertas.push({tipo: "atencao", titulo: `Condições moderadas — score ${score}/10`, descricao: `O céu não está ideal, mas dá para ver objetos brilhantes. ${coberturaPct}% de nuvens no momento.`, detalhe: `Score ${score} · Nuvens: ${coberturaPct}% · Poluição: ${poluicaoPct}%`})
        } else if (perfil === "fotografo") {
            alertas.push({tipo: "atencao", titulo: `Score moderado — ${score}/10`, descricao: `${coberturaPct}% de cobertura detectada. Seeing comprometido. Prefira exposições curtas nesse momento.`, detalhe: `M_atm = ${scoreFactors.matm.value} · M_lum = ${scoreFactors.mlum.value} · f_local = ${scoreFactors.local.value}`})
        } else {
            alertas.push({tipo: "atencao", titulo: `Score ${score}/10 — condições moderadas`, descricao: `Janela parcialmente comprometida. B = ${B} com M_atm = ${scoreFactors.matm.value} limitando o score atual.`, detalhe: `f_orbital = ${scoreFactors.orbital.value} · M_atm = ${scoreFactors.matm.value} · M_lum = ${scoreFactors.mlum.value} · f_local = ${scoreFactors.local.value}`})
        }
    } else {
        if (perfil === "amador") {
            alertas.push({tipo: "critico", titulo: `Condições desfavoráveis — score ${score}/10`, descricao: `Não vale a pena sair agora. Confira a previsão abaixo para encontrar a próxima janela.`, detalhe: `Score ${score} · Nuvens: ${coberturaPct}%`})
        } else if (perfil === "fotografo") {
            alertas.push({tipo: "critico", titulo: `Score baixo — ${score}/10`, descricao: `Astrofotografia inviável agora. Cobertura ou poluição luminosa alta. Aguarde próxima janela.`, detalhe: `M_atm = ${scoreFactors.matm.value} · M_lum = ${scoreFactors.mlum.value}`})
        } else {
            alertas.push({tipo: "critico", titulo: `Score ${score}/10 — interferência ativa`, descricao: `Condições comprometidas. Cobertura de nuvens: ${coberturaPct}%. Poluição luminosa: ${poluicaoPct}%. Verificar portões de corte.`, detalhe: `f_orbital = ${scoreFactors.orbital.value} · M_atm = ${scoreFactors.matm.value} · M_lum = ${scoreFactors.mlum.value} · f_local = ${scoreFactors.local.value}`})
        }
    }

    // Card 3
    const temForecastHorario = forecast && forecast.length > 0 && forecast[0].day?.includes(":")
    if (temForecastHorario) {
        let melhor = null, inicio = null, durAtual = 0, melhorDur = 0, somaScore = 0
        for (let i = 0; i < forecast.length; i++) {
            if (forecast[i].score >= 7) {
                if (!inicio) inicio = forecast[i].day
                durAtual++; somaScore += forecast[i].score
                if (durAtual > melhorDur) {melhorDur = durAtual; melhor = {inicio, fim: forecast[i].day, scoreMed: (somaScore / durAtual).toFixed(1)}}
            } else { inicio = null; durAtual = 0; somaScore = 0 }
        }
        if (melhor) {
            if (perfil === "amador") {
                alertas.push({tipo: "ideal", titulo: `Melhor janela: ${melhor.inicio} – ${melhor.fim}`, descricao: `Score médio previsto de ${melhor.scoreMed}/10 nesse período. Hora de planejar a saída!`, detalhe: `Score médio ${melhor.scoreMed} · Open-Meteo · próximas horas`})
            } else if (perfil === "fotografo") {
                alertas.push({tipo: "ideal", titulo: `Janela ideal: ${melhor.inicio} – ${melhor.fim}`, descricao: `Score médio ${melhor.scoreMed}/10. Transparência prevista alta. Ideal para sessão de longa exposição.`, detalhe: `Score médio ${melhor.scoreMed} · Open-Meteo · próximas horas`})
            } else {
                alertas.push({tipo: "ideal", titulo: `Janela prevista: ${melhor.inicio} – ${melhor.fim}`, descricao: `Score projetado médio: ${melhor.scoreMed}/10. Condições favoráveis confirmadas pelo modelo Open-Meteo.`, detalhe: `Score médio ${melhor.scoreMed} · M_atm e M_lum favoráveis · Open-Meteo · próximas horas`})
            }
        } else {
            if (perfil === "amador") {
                alertas.push({tipo: "atencao", titulo: "Sem janelas ideais nas próximas horas", descricao: "A previsão não mostra períodos com score ≥ 7 nas próximas horas. Verifique mais tarde.", detalhe: "Open-Meteo · sem janela ≥ 7 nas próximas horas"})
            } else if (perfil === "fotografo") {
                alertas.push({tipo: "atencao", titulo: "Sem janela limpa nas próximas horas", descricao: "Previsão desfavorável para astrofotografia. Aguarde melhora das condições atmosféricas.", detalhe: "Open-Meteo · sem janela ≥ 7 nas próximas horas"})
            } else {
                alertas.push({tipo: "atencao", titulo: "Score projetado abaixo do limiar", descricao: `Modelo Open-Meteo não prevê janelas com score ≥ 7.0 no período analisado. M_atm comprometido.`, detalhe: "Open-Meteo · sem período ≥ 7.0 nas próximas horas"})
            }
        }
    }

    // Card 4
    if (coberturaPct >= 50) {
        if (perfil === "amador") {
            alertas.push({tipo: "atencao", titulo: "Nuvens comprometendo o céu", descricao: `Cobertura de ${coberturaPct}% detectada. O céu está parcialmente encoberto. Aguarde melhora.`, detalhe: `M_atm = ${scoreFactors.matm.value} · cobertura ${coberturaPct}% · Open-Meteo`})
        } else if (perfil === "fotografo") {
            alertas.push({tipo: "atencao", titulo: `Frente de nuvens — M_atm = ${scoreFactors.matm.value}`, descricao: `${coberturaPct}% de cobertura. Risco de névoa nas imagens e perda de nitidez em exposições longas.`, detalhe: `M_atm = ${scoreFactors.matm.value} · cobertura ${coberturaPct}% · Open-Meteo`})
        } else {
            alertas.push({tipo: "atencao", titulo: `M_atm em queda — cobertura ${coberturaPct}%`, descricao: `Open-Meteo detecta sistema nublado ativo. M_atm = ${scoreFactors.matm.value} limitando o score atual.`, detalhe: `M_atm = ${scoreFactors.matm.value} · cloud_cover = ${coberturaPct}% · Open-Meteo`})
        }
    } else if (coberturaPct < 20) {
        if (perfil === "amador") {
            alertas.push({tipo: "favoravel", titulo: "Céu aberto — condição atmosférica ótima", descricao: `Apenas ${coberturaPct}% de nuvens. O céu está praticamente limpo agora.`, detalhe: `M_atm = ${scoreFactors.matm.value} · cobertura ${coberturaPct}% · Open-Meteo`})
        } else if (perfil === "fotografo") {
            alertas.push({tipo: "favoravel", titulo: `Transparência alta — M_atm = ${scoreFactors.matm.value}`, descricao: `Apenas ${coberturaPct}% de cobertura. Seeing favorável para alta nitidez e longas exposições.`, detalhe: `M_atm = ${scoreFactors.matm.value} · cobertura ${coberturaPct}% · Open-Meteo`})
        } else {
            alertas.push({tipo: "favoravel", titulo: `M_atm = ${scoreFactors.matm.value} — transparência alta`, descricao: `Open-Meteo confirma cobertura mínima (${coberturaPct}%). Condição atmosférica contribuindo positivamente para o score.`, detalhe: `M_atm = ${scoreFactors.matm.value} · cloud_cover = ${coberturaPct}% · Open-Meteo`})
        }
    }

    return alertas.slice(0, 4)
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
        favoravel: {
            icon: CheckCircle,
            color: "var(--c-green)",
            bg: "rgba(61, 255, 160, 0.04)",
            border: "rgba(61, 255, 160, 0.18)",
            label: "Favorável",
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
                    <Icone size={18} color={style.color} strokeWidth={1.8}/>
                    <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
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
                fontSize: "1rem",
                fontWeight: 500,
                color: "var(--c-white)",
                lineHeight: 1.3,
            }}>
                {alerta.titulo}
            </p>

            <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                fontWeight: 300,
                lineHeight: 1.65,
                color: "var(--c-muted)",
            }}>
                {alerta.descricao}
            </p>

            <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
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

// Jnaelas de observção

function JanelasObservacao({perfil, weekForecast}) {
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    const hoje = new Date()
    const diasExibidos = Array.from({length: 7 }, (_, i) => {
        const data = new Date(hoje)
        data.setDate(hoje.getDate() + i + 1)
        const label = i === 0 ? "Amanhã" : diasSemana[data.getDay()]
        const fonte = weekForecast[i + 1] ?? weekForecast[weekForecast.length - 1]
        return {...fonte, day: label}
    })

    function estimarJanela(score) {
        if (score === 0) return null
        if (score >= 7) return "20h – 06h"
        if (score >= 4) return "22h – 02h"
        return "sem janela ideal"
    }

    return (
        <div style={{marginBottom: "4rem"}}>
            <div style={{
                display: "flex",
                alignItems: "baseline",
                gap: "1rem",
                marginBottom: "1.5rem",
                paddingBottom: "1rem",
                borderBottom: "0.5px solid rgba(232, 244, 253, 0.05)",
            }}>
                <p className="section-kicker" style={{opacity: 1, fontSize: "0.8rem"}}>
                    Previsão Semanal
                </p>
                <p style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.06em",
                    color: "rgba(232, 244, 253, 0.2)",
                }}>
                    // próximos 7 dias · estimativa via Open-Meteo
                </p>
            </div>

            <div className='hidden lg:grid' style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "0.6rem",
                marginBottom: "1rem",
                overflowX: "auto",
            }}>
                {diasExibidos.map((dia, i) => {
                    const cor = dia.score >= 7
                        ? "var(--c-green)"
                        : dia.score >= 4
                            ? "var(--c-yellow)"
                            : "var(--c-red)"

                    return (
                        <div key={i} style={{
                            padding: "1.2rem 0.8rem",
                            background: dia.score === 0
                                ? "rgba(255, 80, 80, 0.04)"
                                : "rgba(79, 158, 255, 0.03)",
                            border: `0.5px solid ${dia.score >= 7
                                ? "rgba(61, 255, 160, 0.15)"
                                : dia.score >= 4
                                    ? "rgba(255, 209, 102, 0.15)"
                                    : "rgba(255, 80, 80, 0.15)"}`,
                            borderRadius: "4px",
                            textAlign: "center",
                        }}>

                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.7rem",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: "rgba(232, 244, 253, 0.3)",
                                marginBottom: "0.8rem",
                            }}>
                                {dia.day}
                            </p>

                            <p style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "2.3rem",
                                fontWeight: 300,
                                lineHeight: 1,
                                color: dia.score === 0 ? "var(--c-red)" : cor,
                                marginBottom: "2px",
                            }}>
                                {dia.score === 0 ? "—" : dia.score.toFixed(1)}
                            </p>

                            {dia.score !== 0 && (
                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.56rem",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: "rgba(232, 244, 253, 0.18)",
                                    marginBottom: "0.2rem",
                                    marginTop: "0.7rem"
                                }}>
                                    score médio est.
                                </p>
                            )}

                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.7rem",
                                color: "rgba(232, 244, 253, 0.25)",
                                marginBottom: "0.4rem",
                            }}>
                                {dia.clouds}% nuvens
                            </p>

                            {/* Janela estimada */}
                            {estimarJanela(dia.score) && (
                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.72rem",
                                    color: "rgba(232, 244, 253, 0.3)",
                                    letterSpacing: "0.04em",
                                    marginBottom: "0.5rem",
                                }}>
                                    {estimarJanela(dia.score)}
                                </p>
                            )}

                            {/* Barra score */}
                            <div style={{
                                height: "3px",
                                background: "rgba(232, 244, 253, 0.06)",
                                borderRadius: "1px",
                                overflow: "hidden",
                            }}>
                                <div style={{
                                    height: "100%",
                                    width: `${(dia.score / 10) * 100}%`,
                                    background: cor,
                                    borderRadius: "1px",
                                }}/>
                            </div>
                            
                            {/* Portão de corte */}
                            {dia.score === 0 && (
                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.65rem",
                                    letterSpacing: "0.06em",
                                    color: "rgba(255, 80, 80, 0.6)",
                                    marginTop: "0.5rem",
                                }}>
                                    portão de corte
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Mobile */}
            <div className="lg:hidden flex flex-col gap-3">
                {diasExibidos.map((dia, i) => {
                    const cor = dia.score >= 7
                        ? "var(--c-green)"
                        : dia.score >= 4
                            ? "var(--c-yellow)"
                            : "var(--c-red)"

                    return (
                        <div key={i} className="flex items-center justify-between"
                            style={{
                                padding: "0.8rem 1rem",
                                background: "rgba(79, 158, 255, 0.03)",
                                border: "0.5px solid rgba(79, 158, 255, 0.08)",
                                borderRadius: "4px",
                            }}
                        >
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.7rem",
                                letterSpacing: "0.08em",
                                color: "rgba(232, 244, 253, 0.4)",
                                minWidth: "60px",
                            }}>
                                {dia.day}
                            </p>
                            <div style={{flex: 1, margin: "0.1rem",}}>
                                <div style={{
                                    height: "3px",
                                    background: "rgba(232, 244, 253, 0.06)",
                                    borderRadius: "1px",
                                    overflow: "hidden",
                                }}>
                                    <div style={{
                                        height: "100%",
                                        width: `${(dia.score / 10) * 100}%`,
                                        background: cor,
                                        borderRadius: "1px"
                                    }}/>
                                </div>
                            </div>
                            <div style={{textAlign: "right"}}>
                                <p style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "1.4rem",
                                    fontWeight: 300,
                                    color: dia.score === 0 ? "var(--c-red)" : cor,
                                    lineHeight: 1,
                                }}>
                                    {dia.score === 0 ? "—" : dia.score.toFixed(1)}
                                </p>
                                {dia.score !== 0 && (
                                    <p style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.52rem",
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                        color: "rgba(232, 244, 253, 0.18)",
                                    }}>
                                        score médio est.
                                    </p>
                                )}
                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.58rem",
                                    color: "rgba(232, 244, 253, 0.25)",
                                }}>
                                    {dia.clouds}% nuvens
                                </p>
                                {estimarJanela(dia.score) && (
                                    <p style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.65rem",
                                        color: "rgba(232, 244, 253, 0.3)",
                                        letterSpacing: "0.03em",
                                    }}>
                                        {estimarJanela(dia.score)}
                                    </p>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
} 

// Painel de simulação (perfil profissional)
function PainelSimulacao({scoreFactors}) {

    const [nuvens, setNuvens] = useState(10)
    const [poluicao, setPoluicao] = useState(63)
    const [orbital, setOrbital] = useState(82)
    const [simulado, setSimulado] = useState(null)

    useEffect(() => { calcular() }, [nuvens, poluicao, orbital])

    function calcular() {
        const f_orbital = orbital / 100
        const f_local = scoreFactors.local.value
        const cob = nuvens / 100
        const pol = poluicao / 100

        if (cob >= 0.85) {setSimulado({score: 0.0, motivo: "Portão de corte: cobertura >= 85%"}); return}
        if (pol >= 0.90) {setSimulado({score: 1.0, motivo: "Portão de corte: poluição >= 90%"}); return}

        const B = (f_orbital * 0.7) + (f_local * 0.3)
        const M_atm = 1.0 - cob
        const M_lum = 1.0 - (pol * 0.5)
        const score = Math.min(Math.max(B * M_atm * M_lum * 10, 0), 10)

        setSimulado({
            score: parseFloat(score.toFixed(1)),
            B: parseFloat(B.toFixed(3)),
            M_atm: parseFloat(M_atm.toFixed(3)),
            M_lum: parseFloat(M_lum.toFixed(3)),
            motivo: null,
        })
    }

    function resetar() {
        setNuvens(10)
        setPoluicao(63)
        setOrbital(82)
        setSimulado(null)
    }

    const scoreCor = simulado
        ? simulado.score >= 7
            ? "var(--c-green)"
            : simulado.score >= 4
                ? "var(--c-yellow)"
                : "var(--c-red)"
        : "var(--c-muted)"

    return (
        <div style={{
            padding: "2rem 2.4rem",
            background: "rgba(3, 5, 12, 0.7)",
            border: "0.5px solid rgba(247, 127, 0, 0.2)",
            borderRadius: "4px",
            marginBottom: "2rem",
        }}>
            <div style={{marginBottom: "1.8rem"}}>
                <p style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "1rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--c-orange)",
                    opacity: 0.8,
                    marginBottom: "0.4rem",
                }}>
                    ◈ Painel de Simulação
                </p>
                <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.85rem",
                    fontWeight: 300,
                    color: "var(--c-muted)",
                }}>
                    Sobrescreva os parâmetros e teste como o score se comporta.
                    Equivalente ao endpoint <span style={{ color: "var(--c-orange)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>/simulate</span> da Flask API.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3" style={{
                gap: "1.5rem",
                marginBottom: "1.5rem",
            }}>
                {[
                    {label: "Cobertura de nuvens", value: nuvens, set: setNuvens, unit: "%", min: 0, max: 100, cor: "var(--c-cyan)"},
                    {label: "Poluição luminosa", value: poluicao, set: setPoluicao, unit: "%", min: 0, max: 100, cor: "var(--c-yellow)"},
                    {label: "f_orbital", value: orbital, set: setOrbital, unit: "%", min: 0, max: 100, cor: "var(--c-green)"},
                ].map((param, i) => (
                    <div key={i}>
                        <div className="flex items-center justify-between" style={{marginBottom: "0.5rem"}}>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.75rem",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: "rgba(232, 244, 253, 0.35)",
                            }}>
                                {param.label}
                            </p>
                            <p style={{fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: param.cor, fontWeight: "bold"}}>
                                {param.value}{param.unit}
                            </p>
                        </div>
                        <input
                            type="range"
                            min={param.min}
                            max={param.max}
                            value={param.value}
                            onChange={e => param.set(Number(e.target.value))}
                            style={{
                                width: "100%",
                                accentColor: param.cor,
                                cursor: "pointer",
                            }}    
                        />
                        <div className="flex justify-between" style={{marginTop: "3px"}}>
                            <span style={{fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "rgba(232, 244, 253, 0.2)"}}>0%</span>
                            <span style={{fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "rgba(232, 244, 253, 0.2)"}}>100%</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-3" style={{marginBottom: "1.5rem"}}>
                <button onClick={resetar} className="btn-ghost">
                    Resetar
                </button>
            </div>

            {/* Resultado */}
            {simulado && (
                <div style={{
                    padding: "1.2rem 1.4rem",
                    background: "rgba(79, 158, 255, 0.04)",
                    border: "0.5px solid rgba(79, 158, 255, 0.12)",
                    borderRadius: "3px",
                }}>
                    {simulado.motivo ? (
                        <p style={{fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: scoreCor, letterSpacing: "0.04em"}}>
                            Score = {simulado.score.toFixed(1)} · {simulado.motivo}
                        </p>
                    ) : (
                        <div style={{display: "flex", flexDirection: "column", gap: "0.35rem"}}>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.75rem",
                                color: "var(--c-muted)",
                            }}>
                                B = (f_orbital x 0.7) + (f_local x 0.3) = <span style={{color: "var(--c-white)"}}>{simulado.B}</span>
                            </p>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.75rem",
                                color: "var(--c-muted)",
                            }}>
                                M_atm = <span style={{ color: "var(--c-cyan)" }}>{simulado.M_atm}</span>
                                {"  ·  "}
                                M_lum = <span style={{ color: "var(--c-yellow)" }}>{simulado.M_lum}</span>
                            </p>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.85rem",
                                color: "var(--c-muted)",
                                marginTop: "0.3rem",
                            }}>
                                Score = {simulado.B} x {simulado.M_atm} x {simulado.M_lum} x 10 {" "}
                                <span style={{
                                    color: scoreCor,
                                    fontSize: "1.1rem",
                                    fontWeight: "bold",
                                }}>
                                    {simulado.score.toFixed(1)}
                                </span>
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function derivarPrevisaoSemanal(forecastHorario, scoreFactors) {
    const baseClouds = forecastHorario.length > 0
        ? Math.round(forecastHorario.reduce((acc, f) => acc + f.clouds, 0) / forecastHorario.length)
        : Math.round((1 - scoreFactors.matm.value) * 100)

    const variacaoClouds = [0, 12, -8, 20, -15, 5, -10, 18]
    const B = (scoreFactors.orbital.value * 0.7) + (scoreFactors.local.value * 0.3)

    return variacaoClouds.map(delta => {
        const clouds = Math.max(0, Math.min(100, baseClouds + delta))
        if (clouds >= 85) return {score: 0, clouds}
        const M_atm = 1 - clouds / 100
        const score = parseFloat(Math.min(Math.max(B * M_atm * scoreFactors.mlum.value * 10, 0), 10).toFixed(1))
        return {score, clouds}
    })
}

// Página
export default function Alertas({perfil, localizacao}) {
    const [apiData, setApiData] = useState(null)
    const [weekForecast, setWeekForecast] = useState(staticData.weekForecast)
    const [forecastHorario, setForecastHorario] = useState([])
    const [historico, setHistorico] = useState(HISTORICO_MOCK)
    const {meta, scoreFactors} = apiData || staticData
    const cidadeExibida = localizacao?.city ?? meta.location

    useEffect(() => {
        async function buscar() {
            const [scoreRes, forecastRes, historyRes] = await Promise.allSettled([
                fetchScore(),
                fetchForecast(),
                fetchHistory(200),
            ])

            if (scoreRes.status === "fulfilled") {
                setApiData(scoreRes.value)
                const fc = forecastRes.status === "fulfilled" ? forecastRes.value : []
                setWeekForecast(derivarPrevisaoSemanal(fc, scoreRes.value.scoreFactors))
            } else console.warn("Alertas: /score indisponível.", scoreRes.reason?.message)

            if (forecastRes.status === "fulfilled" && forecastRes.value.length > 0) setForecastHorario(forecastRes.value)
            else console.warn("Alertas: /forecast indisponível.", forecastRes.reason?.message)

            if (historyRes.status === "fulfilled" && historyRes.value.length > 0) setHistorico(historyRes.value)
            else console.warn("Alertas: /history indisponível.", historyRes.reason?.message)
        }
        buscar()
        const intervalo = setInterval(buscar, 60 * 1000)
        return () => clearInterval(intervalo)
    }, [localizacao])

    const B = (scoreFactors.orbital.value * scoreFactors.orbital.weight) + (scoreFactors.local.value * scoreFactors.local.weight)
    const score = (B * scoreFactors.matm.value * scoreFactors.mlum.value * 10).toFixed(1)

    const alertas = apiData
        ? gerarAlertas(perfil, apiData, forecastHorario, score)
        : ALERTAS_DATA[perfil] || ALERTAS_DATA.amador

    const perfilLabel = {
        amador: "Astrônomo Amador",
        fotografo: "Astrofotógrafo",
        profissional: "Astrônomo Profissional",
    }[perfil] || "Astrônomo Amador"

    return (
        <div className="relative z-10 px-5 lg:px-16" style={{minHeight: "100vh", paddingTop: "5rem ", paddingBottom: "4rem", overflowX: "hidden"}}>
            {/* Headeer */}
            <div style={{marginBottom: "3rem", fontSize: "0.76rem"}}>
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
                            <MapPin size={14} style={{color: "var(--c-muted)"}}/>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.7rem",
                                color: "var(--c-muted)",
                                letterSpacing: "0.04em",
                            }}>
                                {cidadeExibida} · agora
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Bell size={14} style={{color: "var(--c-muted)"}}/>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.7rem",
                                color: "var(--c-muted)",
                                letterSpacing: "0.04em",
                            }}>
                                Perfil: {perfilLabel}
                            </p>    
                        </div>
                        <div className="flex items-center gap-2">
                            <span style={{width: 6.5, height: 6.5, borderRadius: "50%", background: "var(--c-green)", boxShadow: "0 0 5px var(--c-green)", display: "inline-block", animation: "blink 2s infinite"}}/>
                            <p style={{fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "rgba(232, 244, 253, 0.25)", letterSpacing: "0.06em", textTransform: "uppercase"}}>
                                Score atual: {score}/10
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="divider-line" style={{marginBottom: "2.5rem"}}/>

            <div className="grid grid-cols-1 lg:grid-cols-2" style={{
                gap: "1rem",
                marginBottom: "4rem", 
            }}>
                {alertas.map((alerta, i) => (
                    <AlertaCard key={i} alerta={alerta}/>
                ))}
            </div>

            <JanelasObservacao perfil={perfil} weekForecast={weekForecast}/>

            <GraficoHistorico perfil={perfil} historico={historico}/>

            {perfil === "profissional" && <PainelSimulacao scoreFactors={scoreFactors}/>}
        </div>
    )
}
import {useEffect, useState, useRef} from 'react'
import {MapPin, RefreshCw, Camera, Filter} from 'lucide-react'
import data from '../data/satellites.json'

function MapaCanvas({filtro, satellites}) {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        let animId

        function resize() {
            canvas.width = canvas.parentElement.offsetWidth
            canvas.height = canvas.parentElement.offsetHeight
        }
        resize()
        window.addEventListener("resize", resize)

        // Estrelas no fundo
        const stars = Array.from({length: 280}, () => ({
            x: Math.random(),
            y: Math.random(),
            r: Math.random() * 1.1 + 0.2,
            a: Math.random(),
            da: (Math.random() - 0.5) * 0.002,
        }))

        function getColor(constellation) {
            const map = {
                Starlink: "rgba(79, 158, 255,",
                OneWeb: "rgba(247, 127, 0,",
                NOAA: "rgba(61, 255, 160,",
                Kuiper: "rgba(255, 209, 102,",
            }
            return map[constellation] || "rgba(232, 244, 253,"
        }

        // Satélites no fundo
        const sats = satellites.map(sat => ({
            ...sat,
            x: sat.azimuth / 360,
            y: 1 - (sat.elevation / 90),
            dx: (Math.random() - 0.5) * 0.0008,
            dy: (Math.random() - 0.5) * 0.0003,
            tl: 22 + Math.random() * 18,
            ang: sat.azimuth * (Math.PI / 180) - Math.PI / 2,
        }))

        function draw() {
            const W = canvas.width
            const H = canvas.height
            ctx.clearRect(0, 0, W, H)
            // Fundo
            const grd = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.6)
            grd.addColorStop(0, "rgba(6, 12, 28, 0.95)")
            grd.addColorStop(1, "rgba(3, 5, 12, 0.98)")
            ctx.fillStyle = grd
            ctx.fillRect(0, 0, W, H)
            // Círculo
            ctx.beginPath()
            ctx.arc(W/2, H/2, Math.min(W, H) * 0.45, 0, Math.PI * 2)
            ctx.strokeStyle = "rgba(232, 244, 253, 0.06)"
            ctx.lineWidth = 1
            ctx.stroke()
            // Anéis
            ;[0.25, 0.5, 0.75].forEach(r => {
                ctx.beginPath()
                ctx.arc(W/2, H/2, Math.min(W, H) * 0.45 * r, 0, Math.PI * 2)
                ctx.strokeStyle = "rgba(232, 244, 253, 0.025)"
                ctx.lineWidth = 0.5
                ctx.stroke()
            })
            // Linhas Cardeais
            ctx.strokeStyle = "rgba(232, 244, 253, 0.035)"
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(W/2, H * 0.04)
            ctx.lineTo(W/2, H * 0.96)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(W * 0.04, H/2)
            ctx.lineTo(W * 0.96, H/2)
            ctx.stroke()
            // Estrelas
            stars.forEach(s => {
                s.a += s.da
                if (s.a > 1) s.da = -Math.abs(s.da)
                if (s.a < 0.04) s.da = Math.abs(s.da)
                ctx.beginPath()
                ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(215, 225, 255, ${s.a})`
                ctx.fill()
            })
            // Satélites
            sats.forEach(s => {
                s.x += s.dx
                s.y += s.dy
                if (s.x > 1.05) s.x = -0.05
                if (s.x < -0.05) s.x = 1.05
                if (s.y > 1.05) s.y = -0.05
                if (s.y < -0.05) s.y = 1.05

                const px = s.x * W
                const py = s.y * H
                const tx = Math.cos(s.ang) * s.tl
                const ty = Math.sin(s.ang) * s.tl
                const baseColor = getColor(s.constellation)
                
                // Rastro
                const trail = ctx.createLinearGradient(px - tx, py - ty, px, py)
                trail.addColorStop(0, "transparent")
                trail.addColorStop(1, baseColor + "0.3)")
                ctx.beginPath()
                ctx.moveTo(px - tx, py - ty)
                ctx.lineTo(px, py)
                ctx.strokeStyle = trail
                ctx.lineWidth = 1.2
                ctx.stroke()

                // Marcação satélites perigosos
                if (s.danger) {
                    ctx.beginPath()
                    ctx.arc(px, py, 6, 0, Math.PI * 2)
                    ctx.strokeStyle = "rgba(255, 80, 80, 0.25)"
                    ctx.lineWidth = 1
                    ctx.stroke()
                }

                ctx.beginPath()
                ctx.arc(px, py, s.danger ? 3 : 2, 0, Math.PI * 2)
                ctx.fillStyle = s.danger 
                    ? "rgba(255, 100, 80, 0.95)"
                    : baseColor + "0.9)"
                ctx.fill()

                if (px > 30 && px < W - 80) {
                    ctx.font = "9px Space Mono, monospace"
                    ctx.fillStyle = s.danger
                        ? "rgba(255, 100, 80, 0.6)"
                        : "rgba(232, 244, 253, 0.3)"
                    ctx.fillText(s.id, px + 6, py - 5)
                }
            })

            const legendItems = [
                {label: "Starlink", color: "rgba(79, 158, 255, 0.85)"},
                {label: "OneWeb", color: "rgba(247, 127, 0, 0.85)"},
                {label: "NOAA", color: "rgba(61, 255, 160, 0.8)"},
                {label: "Kuiper", color: "rgba(255, 209, 102, 0.8)"},
                {label: "⚠ < 10min", color: "rgba(255, 80, 80, 0.85)"},
            ]
            legendItems.forEach((item, i) => {
                ctx.beginPath()
                ctx.arc(14, H - 72 + i * 14, 3, 0, Math.PI * 2)
                ctx.fillStyle = item.color
                ctx.fill()
                ctx.font = "13px Space Mono, monospace"
                ctx.fillStyle = "rgba(232, 244, 253, 0.3)"
                ctx.fillText(item.label, 24, H - 68 + i * 14)
            })

            animId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            window.removeEventListener("resize", resize)
            cancelAnimationFrame(animId)
        }
    }, [satellites, filtro])

    return (
        <canvas ref={canvasRef}
            style={{
                display: "block",
                width: "100%",
                height: "100%",
                cursor: "crosshair",
            }}
        />
    )
}

export default function MapaCeu({perfil}) {
    return (
        <div className="relative z-10" style={{minHeight: "100vh"}}>
            <LayoutMapa perfil={perfil} />
        </div>
    )
}

function SidebarConteudo({perfil, score, status, scoreFactors, satsVisiveis, expSeg, setExpSeg, azimuth, setAzimuth, rastrosEsperados}) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            background: "rgba(3, 5, 12, 0.85)",
        }}>
            <div style={{padding: "1.4rem 1.5rem", borderBottom: "0.5px solid rgba(79, 158, 255, 0.08)"}}>
                <p style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(79, 158, 255, 0.6)",
                    marginBottom: "0.4rem",
                }}>
                    Sky Observation Score
                </p>
                <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "4rem",
                    fontWeight: 300,
                    lineHeight: 1,
                    color: "var(--c-white)",
                    marginBottom: "0.2rem",
                    letterSpacing: "-0.02em",
                }}>
                    {score}
                    <span style={{fontSize: "1.6rem", color: "rgba(232, 244, 253, 0.22)"}}>/10</span>
                </p>
                <div className='flex items-center gap-2' style={{marginBottom: "0.7rem", marginTop: "1rem"}}>
                    <span style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: status.color,
                        boxShadow: `0 0 5px ${status.color}`,
                        display: "inline-block",
                        flexShrink: 0,
                    }}/>
                    <span style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.75rem",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: status.color,
                    }}>
                        {status.label}
                    </span>
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "0.4rem"}}>
                    {[
                        {label: "Orbital", value: scoreFactors.orbital.value, color: "var(--c-cyan)"},
                        {label: "M_atm", value: scoreFactors.matm.value, color: "var(--c-cyan)"},
                        {label: "M_lum", value: scoreFactors.mlum.value, color: "var(--c-yellow)"},
                        {label: "ESP32", value: scoreFactors.local.value, color: "var(--c-green)"},
                    ].map(f => (
                        <div key={f.label} className='flex items-center justify-between gap-2'>
                            <p style={{
                                fontFamily: "var(--font-mono)", 
                                fontSize: "0.7rem",
                                letterSpacing: "0.08em", 
                                textTransform: "uppercase",
                                color: "rgba(232, 244, 253, 0.3)",
                                minWidth: "50px",
                            }}>
                                {f.label}
                            </p>
                            <div style={{
                                flex: 1,
                                height: "2px",
                                background: "rgba(232, 244, 253, 0.06)",
                                borderRadius: "1px", 
                                overflow: "hidden",
                            }}>
                                <div style={{
                                    height: "100%",
                                    width: `${(f.value / 10) * 100}%`,
                                    background: f.color, 
                                    borderRadius: "1px",
                                }}/>
                            </div>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.7rem",
                                color: "rgba(232, 244, 253, 0.4)",
                                minWidth: "28px",
                                textAlign: "right",
                            }}>
                                {f.value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Modo Fotografia - Fotógrafo */}
            {perfil === "fotografo" && (
                <div style={{padding: "1.2rem 1.5rem", borderBottom: "0.5px solid rgba(79, 158, 255, 0.08)"}}>
                    <div className='flex items-center gap-2' style={{marginBottom: "0.5rem"}}>
                        <Camera size={14.5} style={{color: "var(--c-cyan)"}}/>
                        <p style={{
                            fontFamily: "var(--font-mono)", 
                            fontSize: "0.75rem",
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "var(--c-cyan)",
                            opacity: 0.8,
                        }}>
                            Modo Fotografia
                        </p>
                    </div>
                    <div style={{display: "flex", gap: "0.5rem", marginBottom: "0.6rem"}}>
                        <div style={{flex: 1}}>
                            <p style={{
                                fontFamily: "var(--font-mono)", 
                                fontSize: "0.7rem",
                                color: "rgba(232, 244, 253, 0.25)",
                                marginBottom: "4px",
                            }}>
                                Exposição (s)
                            </p>
                            <input type='number' value={expSeg}
                                onChange={e => setExpSeg(Number(e.target.value))}
                                style={{
                                    width: "100%",
                                    background: "rgba(232, 244, 253, 0.04)",
                                    border: "0.5px solid rgba(232, 244, 253, 0.1)",
                                    borderRadius: "3px",
                                    padding: "0.4rem 0.6rem",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.65rem",
                                    color: "var(--c-white)",
                                    outline: "none",
                                }}
                            />
                        </div>
                        <div style={{flex: 1}}>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.7rem",
                                color: "rgba(232, 244, 253, 0.25)",
                                marginBottom: "4px",
                            }}>
                                Azimute (°)
                            </p>
                            <input type="number" value={azimuth}
                                onChange={e => setAzimuth(Number(e.target.value))}
                                style={{
                                    width: "100%", 
                                    background: "rgba(232,244,253,0.04)",
                                    border: "0.5px solid rgba(232,244,253,0.1)", 
                                    borderRadius: "3px",
                                    padding: "0.4rem 0.6rem", 
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.65rem", 
                                    color: "var(--c-white)", 
                                    outline: "none",
                                }}
                            />
                        </div>
                    </div>
                    <div style={{
                        padding: "0.5rem 0.7rem",
                        background: rastrosEsperados > 0 ? "rgba(255, 184, 48, 0.06)" : "rgba(61,255,160,0.04)",
                        border: `0.5px solid ${rastrosEsperados > 0 ? "rgba(255, 184, 48, 0.2)" : "rgba(61, 255, 160, 0.15)"}`,
                        borderRadius: "3px",
                    }}>
                        <p style={{
                            fontFamily: "var(--font-mono)", 
                            fontSize: "0.68rem",
                            color: rastrosEsperados > 0 ? "rgba(255,184,48,0.9)" : "var(--c-green)",
                            letterSpacing: "0.04em",
                        }}>
                            {rastrosEsperados > 0
                                ? `⚠ ${rastrosEsperados} rastro(s) esperado(s) nesta janela`
                                : "✓ Sem rastros esperados nesta janela"}
                        </p>
                    </div>
                </div>
            )}

            {/* Satélites */}

            <div style={{padding: "1.2rem 1.5rem", borderBottom: "0.5px solid rgba(79, 158, 255, 0.08)"}}>
                <p style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.78rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(232, 244, 253, 0.22)",
                    marginBottom: "0.8rem",
                }}>
                    Satélites visíveis agora
                </p>
                <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                    {satsVisiveis.map(sat => (
                        <div key={sat.id}
                            className='flex items-center justify-between' 
                            style={{
                                padding: "0.6rem 0.8rem",
                                background: sat.danger ? "rgba(255, 80, 80, 0.05)" : "rgba(79, 158, 255, 0.03)",
                                border: `0.5px solid ${sat.danger ? "rgba(255, 80, 80, 0.2)" : "rgba(79, 158, 255, 0.08)"}`,
                                borderRadius: "3px",
                        }}>
                            <div>
                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.7rem",
                                    color: sat.danger ? "rgba(255, 80,  80, 0.9)" : "var(--c-white)",
                                    letterSpacing: "0.04em",
                                    marginBottom: "2px",
                                }}>
                                    {sat.id}
                                </p>
                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.7rem",
                                    color: "rgba(232, 244, 253, 0.3)",
                                }}>
                                    {perfil === "profissional"
                                        ? `Az: ${sat.azimuth}° · El: ${sat.elevation}° · ${sat.altitude}km`
                                        : `Alt: ${sat.altitude}km · ${sat.velocity} km/s`
                                    }
                                </p>
                            </div>
                            <div style={{textAlign: "right"}}>
                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.7rem",
                                    color: sat.danger ? "rgba(255, 80, 80, 0.8)" : "var(--c-cyan)",
                                    marginBottom: "2px",
                                }}>
                                    em {sat.passesIn} min
                                </p>
                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.7rem",
                                    color: "rgba(232, 244, 253, 0.3)",
                                }}>
                                    mag {sat.magnitude}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modo Fotografia - outros perfis */}
            {perfil !== "fotografo" && (
                <div style={{
                    padding: "1.2rem 1.5rem",
                    borderBottom: "0.5px solid rgba(79, 158, 255, 0.08)"
                }}>
                    <div className='flex items-center gap-2' style={{marginBottom: "0.8rem"}}>
                        <Camera size={14.5} style={{color: "var(--c-muted)"}}/>
                        <p style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "rgba(232, 244, 253, 0.22)",
                        }}>
                            Modo Fotografia
                        </p>
                    </div>
                    <div style={{display: "flex", gap: "0.5rem", marginBottom: "0.6rem"}}>
                        <div style={{flex: 1}}>
                            <p style={{
                                fontFamily: "var(--font-mono)", 
                                fontSize: "0.7rem",
                                color: "rgba(232, 244, 253, 0.25)",
                                marginBottom: "4px",
                            }}>
                                Exposição (s)
                            </p>
                            <input type='number' value={expSeg}
                                onChange={e => setExpSeg(Number(e.target.value))}
                                style={{
                                    width: "100%",
                                    background: "rgba(232, 244, 253, 0.04)",
                                    border: "0.5px solid rgba(232, 244, 253, 0.1)",
                                    borderRadius: "3px",
                                    padding: "0.4rem 0.6rem",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.65rem",
                                    color: "var(--c-white)",
                                    outline: "none",
                                }}
                            />
                        </div>
                        <div style={{flex: 1}}>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.7rem",
                                color: "rgba(232, 244, 253, 0.25)",
                                marginBottom: "4px",
                            }}>
                                Azimute (°)
                            </p>
                            <input type="number" value={azimuth}
                                onChange={e => setAzimuth(Number(e.target.value))}
                                style={{
                                    width: "100%", 
                                    background: "rgba(232,244,253,0.04)",
                                    border: "0.5px solid rgba(232,244,253,0.1)", 
                                    borderRadius: "3px",
                                    padding: "0.4rem 0.6rem", 
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.65rem", 
                                    color: "var(--c-white)", 
                                    outline: "none",
                                }}
                            />
                        </div>
                    </div>
                    <div style={{
                        padding: "0.5rem 0.7rem",
                        background: rastrosEsperados > 0 ? "rgba(255, 184, 48, 0.06)" : "rgba(61,255,160,0.04)",
                        border: `0.5px solid ${rastrosEsperados > 0 ? "rgba(255, 184, 48, 0.2)" : "rgba(61, 255, 160, 0.15)"}`,
                        borderRadius: "3px",
                    }}>
                        <p style={{
                            fontFamily: "var(--font-mono)", 
                            fontSize: "0.68rem",
                            color: rastrosEsperados > 0 ? "rgba(255,184,48,0.9)" : "var(--c-green)",
                            letterSpacing: "0.04em",
                        }}>
                            {rastrosEsperados > 0
                                ? `⚠ ${rastrosEsperados} rastro(s) esperado(s) nesta janela`
                                : "✓ Sem rastros esperados nesta janela"}
                        </p>
                    </div>
                </div>
            )}

            <div className='flex items-center justify-between' style={{padding: "1rem 1.5rem", marginTop: "auto"}}>
                <p style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.59rem",
                    color: "var(--c-muted)",
                    letterSpacing: "0.04em",
                }}>
                    Dados: N2YO · Open-Meteo · VIIRS
                </p>
                <div className='flex items-center gap-1'>
                    <RefreshCw size={9} style={{color: "var(--c-muted)"}}/>
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.58rem",
                        color: "var(--c-muted)",
                        letterSpacing: "0.04em",
                    }}>
                        10 min
                    </p>
                </div>
            </div>
        </div>
    )
}

function LayoutMapa({perfil}) {
    const [filtro, setFiltro] = useState("todos")
    const [expSeg, setExpSeg] = useState(30)
    const [azimuth, setAzimuth] = useState(180)
    const {meta, satellites, scoreFactors} = data

    // Cálculo
    const B = (scoreFactors.orbital.value * scoreFactors.orbital.weight) + (scoreFactors.local.value * scoreFactors.local.weight)
    const score = (B * scoreFactors.matm.value * scoreFactors.mlum.value * 10).toFixed(1)

    function getStatus(s) {
        const n = parseFloat(s)
        if (n >= 7) return {label: "Janela ideal", color: "var(--c-green)"}
        if (n >= 4) return {label: "Moderado", color: "var(--c-yellow)"}
        return {label: "Desfavorável", color: "var(--c-red)"}
    }
    const status = getStatus(score)

    const satsVisiveis = filtro === "todos"
        ? satellites
        : satellites.filter(s => s.constellation.toLowerCase() === filtro)
    
    const rastrosEsperados = satellites.filter(s => s.passesIn <= expSeg / 60 + 5).length

    return (
        <div style={{minHeight: "calc(100vh - 64px)"}}>
            
            {/* Layout desktop */}
            <div className="hidden lg:grid" style={{
                gridTemplateColumns: "1fr 340px",
                height: "calc(100vh - 64px)",
            }}>
                {/* Área do mapa */}
                <div style={{borderRight: "0.5px solid rgba(79, 158, 255, 0.1)", position: "relative"}}>
                    <div className='flex items-center justify-between' style={{
                        padding: "1.2rem 2rem",
                        borderBottom: "0.5px solid rgba(79, 158, 255, 0.1)",
                    }}>
                        <div>
                            <p style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "1.5rem",
                                fontWeight: 300,
                                color: "var(--c-white)",
                            }}>
                                Mapa Estelar ao Vivo
                            </p>
                            <p className='flex items-center gap-1' style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.75rem",
                                color: "var(--c-muted)",
                                letterSpacing: "0.04em",
                                marginTop: "3px",
                            }}>
                                <MapPin size={14}/>
                                {meta.location} · {meta.latitude}°S {Math.abs(meta.longitude)}°W · agora
                            </p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Filter size={19} style={{color: "var(--c-muted)"}}/>
                            {["todos", "starlink", "oneweb", "noaa"].map(f => (
                                <button key={f} onClick={() => setFiltro(f)} style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.7rem",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    padding: "3px 10px",
                                    borderRadius: "3px",
                                    cursor: "pointer",
                                    border: filtro === f 
                                        ? "0.5px solid rgba(79, 158, 255, 0.5)" : "0.5px solid rgba(232, 244, 253, 0.1)",
                                    background: filtro === f ? "rgba(79, 158, 255, 0.1)" : "transparent",
                                    color: filtro === f ? "var(--c-cyan)" : "rgba(232, 244, 253, 0.35)",
                                    transition: "all 0.2s ease",
                                }}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{height: "calc(100% - 65px)", position: "relative"}}>
                        <MapaCanvas filtro={filtro} satellites={satsVisiveis}/>
                    </div>
                </div>

                {/* Sidebar desktop */}
                <SidebarConteudo
                    perfil={perfil}
                    score={score}
                    status={status}
                    scoreFactors={scoreFactors}
                    satsVisiveis={satsVisiveis}
                    expSeg={expSeg}
                    setExpSeg={setExpSeg}
                    azimuth={azimuth}
                    setAzimuth={setAzimuth}
                    rastrosEsperados={rastrosEsperados}
                />
            </div>

            {/* Layout mobile/tablet */}
            <div className="lg:hidden flex flex-col">

                {/* Header */}
                <div className='flex items-center justify-between' style={{
                    padding: "1rem 1.5rem",
                    borderBottom: "0.5px solid rgba(79, 158, 255, 0.1)",
                }}>
                    <div>
                        <p style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.2rem",
                            fontWeight: 300,
                            color: "var(--c-white)",
                        }}>
                            Mapa Estelar ao Vivo
                        </p>
                        <p style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            color: "var(--c-muted)",
                        }}>
                            {meta.location} · agora
                        </p>
                    </div>
                    <div className='flex gap-1 flex-wrap justify-end'>
                        {["todos", "starlink", "oneweb", "noaa"].map(f => (
                            <button key={f} onClick={() => setFiltro(f)} style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.6rem",
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                padding: "2px 7px",
                                borderRadius: "3px",
                                cursor: "pointer",
                                border: filtro === f ? "0.5px solid rgba(79, 158, 255, 0.5)" : "0.5px solid rgba(232, 244, 253, 0.1)",
                                background: filtro === f ? "rgba(79, 158, 255, 0.1)" : "transparent",
                                color: filtro === f ? "var(--c-cyan)" : "rgba(232, 244, 253, 0.35)",
                            }}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Canvas */}
                <div style={{height: "60vw", minHeight: "280px", maxHeight: "420px", position: "relative"}}>
                    <MapaCanvas filtro={filtro} satellites={satsVisiveis}/>
                </div>

                {/* Score */}
                <div style={{
                    padding: "1.2rem 1.5rem",
                    borderTop: "0.5px solid rgba(79, 158, 255, 0.08)",
                    borderBottom: "0.5px solid rgba(79, 158, 255, 0.08)",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    alignItems: "center",
                }}>
                    <div>
                        <p style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.6rem",
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "rgba(79, 158, 255, 0.6)",
                            marginBottom: "0.3rem",
                        }}>
                            Sky Observation Score
                        </p>
                        <p style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "3rem",
                            fontWeight: 300,
                            lineHeight: 1,
                            color: "var(--c-white)",
                        }}>
                            {score}<span style={{fontSize: "1.2rem", color: "rgba(232,244,253,0.22)"}}>/10</span>
                        </p>
                        <div className='flex items-center gap-2' style={{marginTop: "0.4rem"}}>
                            <span style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: status.color,
                                boxShadow: `0 0 5px ${status.color}`,
                                display: "inline-block",
                            }}/>
                            <span style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "0.7rem",
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                color: status.color,
                            }}>
                                {status.label}
                            </span>
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", gap: "0.35rem"}}>
                        {[
                            {label: "Orbital", value: scoreFactors.orbital.value, color: "var(--c-cyan)"},
                            {label: "M_atm", value: scoreFactors.matm.value, color: "var(--c-cyan)"},
                            {label: "M_lum", value: scoreFactors.mlum.value, color: "var(--c-yellow)"},
                            {label: "ESP32", value: scoreFactors.local.value, color: "var(--c-green)"},
                        ].map(f => (
                            <div key={f.label} className='flex items-center gap-2'>
                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.58rem",
                                    color: "rgba(232, 244, 253, 0.3)",
                                    minWidth: "42px",
                                }}>
                                    {f.label}
                                </p>
                                <div style={{
                                    flex: 1,
                                    height: "2px",
                                    background: "rgba(232, 244, 253, 0.06)",
                                    borderRadius: "1px",
                                    overflow: "hidden",
                                }}>
                                    <div style={{
                                        height: "100%",
                                        width: `${(f.value / 10) * 100}%`,
                                        background: f.color,
                                        borderRadius: "1px",
                                    }}/>
                                </div>
                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.6rem",
                                    color: "rgba(232, 244, 253, 0.4)",
                                    minWidth: "24px",
                                    textAlign: "right",
                                }}>
                                    {f.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Modo Fotografia - Fotógrafo */}
                {perfil === "fotografo" && (
                    <div style={{padding: "1.2rem 1.5rem", borderBottom: "0.5px solid rgba(79,158,255,0.08)"}}>
                        <div className='flex items-center gap-2' style={{marginBottom: "0.5rem"}}>
                            <Camera size={14} style={{color: "var(--c-cyan)"}}/>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.65rem",
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                color: "var(--c-cyan)",
                                opacity: 0.8,
                            }}>
                                Modo Fotografia
                            </p>
                        </div>
                        <div style={{display: "flex", gap: "0.5rem", marginBottom: "0.6rem"}}>
                            <div style={{flex: 1}}>
                                <p style={{fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "rgba(232,244,253,0.25)", marginBottom: "4px"}}>
                                    Exposição (s)
                                </p>
                                <input type='number' value={expSeg}
                                    onChange={e => setExpSeg(Number(e.target.value))}
                                    style={{width: "100%", background: "rgba(232,244,253,0.04)", border: "0.5px solid rgba(232,244,253,0.1)", borderRadius: "3px", padding: "0.4rem 0.6rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--c-white)", outline: "none"}}
                                />
                            </div>
                            <div style={{flex: 1}}>
                                <p style={{fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "rgba(232,244,253,0.25)", marginBottom: "4px"}}>
                                    Azimute (°)
                                </p>
                                <input type='number' value={azimuth}
                                    onChange={e => setAzimuth(Number(e.target.value))}
                                    style={{width: "100%", background: "rgba(232,244,253,0.04)", border: "0.5px solid rgba(232,244,253,0.1)", borderRadius: "3px", padding: "0.4rem 0.6rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--c-white)", outline: "none"}}
                                />
                            </div>
                        </div>
                        <div style={{padding: "0.5rem 0.7rem", background: rastrosEsperados > 0 ? "rgba(255,184,48,0.06)" : "rgba(61,255,160,0.04)", border: `0.5px solid ${rastrosEsperados > 0 ? "rgba(255,184,48,0.2)" : "rgba(61,255,160,0.15)"}`, borderRadius: "3px"}}>
                            <p style={{fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: rastrosEsperados > 0 ? "rgba(255,184,48,0.9)" : "var(--c-green)"}}>
                                {rastrosEsperados > 0 ? `⚠ ${rastrosEsperados} rastro(s) esperado(s) nesta janela` : "✓ Sem rastros esperados nesta janela"}
                            </p>
                        </div>
                    </div>
                )}
                
                {/* Satélites */}
                <div style={{padding: "1.2rem 1.5rem", borderBottom: "0.5px solid rgba(79, 158, 255, 0.08)"}}>
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "rgba(232, 244, 253, 0.22)",
                        marginBottom: "0.8rem",
                    }}>
                        Satélites visíveis agora
                    </p>
                    <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                        {satsVisiveis.map(sat => (
                            <div key={sat.id} className='flex items-center justify-between' style={{
                                padding: "0.6rem 0.8rem",
                                background: sat.danger ? "rgba(255, 80, 80, 0.05)" : "rgba(79, 158, 255, 0.03)",
                                border: `0.5px solid ${sat.danger ? "rgba(255, 80, 80, 0.2)" : "rgba(79, 158, 255, 0.08)"}`,
                                borderRadius: "3px",
                            }}>
                                <div>
                                    <p style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.7rem",
                                        color: sat.danger ? "rgba(255, 80, 80, 0.9)" : "var(--c-white)",
                                        marginBottom: "2px",
                                    }}>
                                        {sat.id}
                                    </p>
                                    <p style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.62rem",
                                        color: "rgba(232, 244, 253, 0.3)",
                                    }}>
                                        {perfil === "profissional"
                                            ? `Az: ${sat.azimuth}° · El: ${sat.elevation}° · ${sat.altitude}km`
                                            : `Alt: ${sat.altitude}km · ${sat.velocity} km/s`
                                        }
                                    </p>
                                </div>
                                <div style={{textAlign: "right"}}>
                                    <p style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.7rem",
                                        color: sat.danger ? "rgba(255, 80, 80, 0.8)" : "var(--c-cyan)",
                                        marginBottom: "2px",
                                    }}>
                                        em {sat.passesIn} min
                                    </p>
                                    <p style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.62rem",
                                        color: "rgba(232, 244, 253, 0.3)",
                                    }}>
                                        mag {sat.magnitude}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modo Fotografia - outros perfis*/}
                {perfil !== "fotografo" && (
                    <div style={{padding: "1.2rem 1.5rem"}}>
                        <div className='flex items-center gap-2' style={{marginBottom: "0.8rem"}}>
                            <Camera size={14} style={{color: "var(--c-muted)"}}/>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.65rem",
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                color: "rgba(232, 244, 253, 0.22)",
                            }}>
                                Modo Fotografia
                            </p>
                        </div>
                        <div style={{display: "flex", gap: "0.5rem", marginBottom: "0.6rem"}}>
                            <div style={{flex: 1}}>
                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.62rem",
                                    color: "rgba(232, 244, 253, 0.25)",
                                    marginBottom: "4px",
                                }}>
                                    Exposição (s)
                                </p>
                                <input type='number' value={expSeg}
                                    onChange={e => setExpSeg(Number(e.target.value))}
                                    style={{
                                        width: "100%",
                                        background: "rgba(232, 244, 253, 0.04)",
                                        border: "0.5px solid rgba(232, 244, 253, 0.1)",
                                        borderRadius: "3px",
                                        padding: "0.4rem 0.6rem",
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.72rem",
                                        color: "var(--c-white)",
                                        outline: "none",
                                    }}
                                />
                            </div>
                            <div style={{flex: 1}}>
                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.62rem",
                                    color: "rgba(232, 244, 253, 0.25)",
                                    marginBottom: "4px",
                                }}>
                                    Azimute (°)
                                </p>
                                <input type='number' value={azimuth}
                                    onChange={e => setAzimuth(Number(e.target.value))}
                                    style={{
                                        width: "100%",
                                        background: "rgba(232, 244, 253, 0.04)",
                                        border: "0.5px solid rgba(232, 244, 253, 0.1)",
                                        borderRadius: "3px",
                                        padding: "0.4rem 0.6rem",
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.72rem",
                                        color: "var(--c-white)",
                                        outline: "none",
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{
                            padding: "0.5rem 0.7rem",
                            background: rastrosEsperados > 0 ? "rgba(255, 184, 48, 0.06)" : "rgba(61, 255, 160, 0.04)",
                            border: `0.5px solid ${rastrosEsperados > 0 ? "rgba(255, 184, 48, 0.2)" : "rgba(61, 255, 160, 0.15)"}`,
                            borderRadius: "3px",
                        }}>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.68rem",
                                color: rastrosEsperados > 0 ? "rgba(255, 184, 48, 0.8)" : "var(--c-green)",
                            }}>
                                {rastrosEsperados > 0
                                    ? `⚠ ${rastrosEsperados} rastro(s) esperado(s) nesta janela`
                                    : "✓ Sem rastros esperados nesta janela"}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

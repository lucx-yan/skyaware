import {useEffect, useState} from 'react'
import {MapPin, RefreshCw, Camera, Filter,} from 'lucide-react'
import data from '../data/satellites.json'

export default function MapaCeu({perfil}) {
    return (
        <div className="relative z-10" style={{minHeight: "100vh"}}>
            <LayoutMapa perfil={perfil} />
        </div>
    )
}

function LayoutMapa({perfil}) {
    const [filtro, setFiltro] = useState("todos")
    const [expSeg, setExpSeg] = useState(30)
    const [azimute, setAzimute] = useState(180)
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
        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            height: "calc(100vh - 64px)",
        }}>
            {/* Área do mapa */}
            <div style={{borderRight: "0.5px solid rgba(79, 158, 255, 0.1)", position: "relative"}}>
                <div className='flex items-center justify-between'
                    style={{
                        padding: "1.2rem 2rem",
                        borderBottom: "0.5px solid rgba(79, 158, 255, 0.1)",
                    }}
                >
                    <div>
                        <p style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.5rem",
                            fontWeight: 300,
                            color: "var(--c-white)",
                        }}>
                            Mapa Estelar ao Vivo
                        </p>
                        <p className='flex items-center gap-1'
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.75rem",
                                color: "var(--c-muted)",
                                letterSpacing: "0.04em",
                                marginTop: "3px",
                            }}    
                        >
                            <MapPin size={14}/>
                            {meta.location} · {meta.latitude}°S {Math.abs(meta.longitude)}°W · agora
                        </p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <Filter size={19} style={{color: "var(--c-muted)"}}/>
                        {["todos", "starlink", "oneweb", "noaa"].map(f => (
                            <button key={f}
                                onClick={() => setFiltro(f)}
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.7rem",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    padding: "3px 10px",
                                    borderRadius: "3px",
                                    cursor: "pointer",
                                    border: filtro === f
                                        ? "0.5px solid rgba(79, 158, 255, 0.5)"
                                        : "0.5px solid rgba(232, 244, 253, 0.1)",
                                    background: filtro === f
                                        ? "rgba(79, 158, 255, 0.1)"
                                        : "transparent",
                                    color: filtro === f
                                        ? "var(--c-cyan)"
                                        : "rgba(232, 244, 253, 0.35)",
                                    transition: "all 0.2s ease",
                                }}
                            >                                
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Temporário!!! */}
                {/* Canvas */}
                <div style={{
                        height: "calc(100% - 65px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(3, 5, 12, 0.6)",
                        position: "relative",
                    }}
                >
                    {[
                        {label: "N", top: "12px", left: "50%", transform: "translateX(-50%)"},
                        {label: "S", bottom: "12px", left: "50%", transform: "translateX(-50%)"},
                        {label: "L", top: "50%", right: "16px", transform: "translateY(-50%)"},
                        {label: "O", top: "50%", left: "16px", transform: "translateY(-50%)"},
                    ].map(d => (
                        <span key={d.label}
                            style={{
                                position: "absolute",
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.8rem",
                                letterSpacing: "0.1em",
                                color: "var(--c-muted)",
                                top: d.top,
                                bottom: d.bottom,
                                left: d.left,
                                right: d.right,
                                transform: d.transform,
                            }}
                        >
                            {d.label}
                        </span>
                    ))}

                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.8rem",
                        color: "var(--c-muted)",
                        letterSpacing: "0.08em",
                    }}>
                        Canvas carregando...
                    </p>
                </div>
            </div>

            {/* Sidebar */}
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
                            flexShrink: 0
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

                <div style={{
                    padding: "1.2rem 1.5rem ",
                    borderBottom: "0.5px solid rgba(79, 158, 255, 0.08)",
                }}>
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
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem"
                    }}>
                        {satsVisiveis.map(sat => (
                            <div key={sat.i}
                                className='flex items-center justify-between'
                                style={{
                                    padding: "0.6rem 0.8rem",
                                    background: sat.danger
                                        ? "rgba(255, 80, 80, 0.05)"
                                        : "rgba(79, 158, 255,  0.03)",
                                    border: `0.5px solid ${sat.danger ? "rgba(255,80,80,0.2)" : "rgba(79,158,255,0.08)"}`,
                                    borderRadius: "3px",
                                }}
                            >        
                                <div>
                                    <p style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.7rem",
                                        color: sat.danger 
                                            ? "rgba(255, 80, 80, 0.9)" 
                                            : "var(--c-white)",
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
                                        Alt: {sat.altitude}km · {sat.velocity} km/s
                                    </p>
                                </div>
                                <div style={{textAlign: "right"}}>
                                    <p style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.7rem",
                                        color: sat.danger 
                                            ? "rgba(255, 80, 80, 0.8)"
                                            : "var(--c-cyan)",
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

                {/* Modo Fotografia */}
                <div style={{padding: "1.2rem 1.5rem", borderBottom: "0.5px solid rgba(79, 158, 255, 0.08)"}}>
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
                    <div style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginBottom: "0.6rem",
                    }}>
                        <div style={{flex: 1}}>
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.7rem",
                                color: "rgba(232, 244, 253, 0.25)",
                                marginBottom: "4px",
                                letterSpacing: "0.06em",
                            }}>
                                Exposição (s)
                            </p>
                            <input
                                type='number'
                                value={expSeg}
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
                                letterSpacing: "0.06em",
                            }}>
                                Azimute (°)
                            </p>
                            <input
                                type='number'
                                value={azimute}
                                onChange={e => setAzimute(Number(e.target.value))}
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
                    </div>
                    <div style={{
                        padding: "0.5rem 0.7rem",
                        background: rastrosEsperados > 0
                            ? "rgba(255, 184, 48, 0.06)"
                            : "rgba(61, 255, 160, 0.04)",
                        border: `0.5px solid ${rastrosEsperados > 0
                            ? "rgba(255, 184, 48, 0.2)"
                            : "rgba(61, 255, 160, 0.15)"}`,
                        borderRadius: "3px",
                    }}>
                        <p style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.68rem",
                            color: rastrosEsperados > 0
                                ? "rgba(255, 184, 48, 0.8)"
                                : "var(--c-green)",
                            letterSpacing: "0.04em",
                        }}>
                            {rastrosEsperados > 0
                                ? `⚠ ${rastrosEsperados} rastro(s) esperado(s) nesta janela`
                                : "✓ Sem rastros esperados nesta janela"}
                        </p>
                    </div>
                </div>

                <div className='flex items-center justify-between'
                    style={{
                        padding: "1rem 1.5rem", marginTop: "auto",
                    }}
                >
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.59rem",
                        color: "var(--c-muted)",
                        letterSpacing: "0.04em",
                    }}>
                        Dados: CelesTrak · Open-Meteo · VIIRS
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
        </div>
    )
}

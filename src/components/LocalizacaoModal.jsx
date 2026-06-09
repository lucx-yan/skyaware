import { useState, useEffect, useRef } from "react"
import { MapPin, Search, X, Loader, CheckCircle } from "lucide-react"

const NOMINATIM = "https://nominatim.openstreetmap.org"
const HEADERS = { "User-Agent": "SkyAware-FIAP/1.0", "Accept-Language": "pt-BR,pt;q=0.9" }

async function reverseGeocode(lat, lon) {
    const url = `${NOMINATIM}/reverse?lat=${lat}&lon=${lon}&format=json`
    const res = await fetch(url, { headers: HEADERS })
    if (!res.ok) throw new Error("reverse geocoding falhou")
    const data = await res.json()
    const addr = data.address ?? {}
    return addr.city ?? addr.town ?? addr.village ?? addr.county ?? data.display_name ?? "Localização atual"
}

async function searchCity(query) {
    const url = `${NOMINATIM}/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`
    const res = await fetch(url, { headers: HEADERS })
    if (!res.ok) throw new Error("busca falhou")
    return await res.json()
}

export default function LocalizacaoModal({ onConfirmar, onFechar }) {
    const [fase, setFase] = useState("aguardando") 
    const [busca, setBusca] = useState("")
    const [sugestoes, setSugestoes] = useState([])
    const [buscando, setBuscando] = useState(false)
    const [selecionado, setSelecionado] = useState(null)
    const [erroGeo, setErroGeo] = useState("")
    const debounceRef = useRef(null)

    useEffect(() => {
        if (!navigator.geolocation) {
            setFase("manual")
            return
        }
        setFase("buscando-geo")
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude: lat, longitude: lon } = pos.coords
                    const city = await reverseGeocode(lat, lon)
                    setSelecionado({ city, lat, lon })
                    setFase("confirmando")
                } catch {
                    setFase("manual")
                }
            },
            () => {
                setFase("manual")
            },
            { timeout: 10000 }
        )
    }, [])

    function handleBuscaChange(e) {
        const val = e.target.value
        setBusca(val)
        setSugestoes([])
        if (debounceRef.current) clearTimeout(debounceRef.current)
        if (val.trim().length < 2) return
        debounceRef.current = setTimeout(async () => {
            setBuscando(true)
            try {
                const results = await searchCity(val)
                setSugestoes(results)
            } catch {
                setSugestoes([])
            } finally {
                setBuscando(false)
            }
        }, 600)
    }

    function handleSugestao(item) {
        const addr = item.address ?? {}
        const city = addr.city ?? addr.town ?? addr.village ?? addr.county ?? item.display_name
        setSelecionado({ city, lat: parseFloat(item.lat), lon: parseFloat(item.lon) })
        setSugestoes([])
        setBusca(city)
        setFase("confirmando")
    }

    function handleConfirmar() {
        if (!selecionado) return
        localStorage.setItem("darksky_localizacao", JSON.stringify(selecionado))
        onConfirmar(selecionado)
    }

    function handleVoltarManual() {
        setSelecionado(null)
        setBusca("")
        setSugestoes([])
        setFase("manual")
    }

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(3, 5, 12, 0.85)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                padding: "1rem",
            }}
        >
            <div
                style={{
                    background: "rgba(8, 12, 24, 0.98)",
                    border: "0.5px solid rgba(79, 158, 255, 0.2)",
                    borderRadius: "4px",
                    padding: "2rem 2.2rem",
                    width: "100%",
                    maxWidth: "420px",
                    position: "relative",
                }}
            >
                {onFechar && (
                    <button
                        onClick={onFechar}
                        style={{
                            position: "absolute",
                            top: "1rem",
                            right: "1rem",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "rgba(232,244,253,0.3)",
                            padding: "4px",
                        }}
                    >
                        <X size={16} />
                    </button>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                    <MapPin size={16} color="var(--c-cyan)" strokeWidth={1.5} />
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--c-cyan)",
                    }}>
                        Localização
                    </p>
                </div>

                <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.4rem",
                    fontWeight: 300,
                    color: "var(--c-white)",
                    marginBottom: "0.4rem",
                }}>
                    De onde você observa?
                </p>
                <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.85rem",
                    fontWeight: 300,
                    color: "var(--c-muted)",
                    marginBottom: "1.8rem",
                    lineHeight: 1.6,
                }}>
                    O SkyAware precisa saber sua localização para calcular o score do céu correto.
                </p>

                {fase === "buscando-geo" && (
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                        padding: "1.2rem",
                        background: "rgba(79, 158, 255, 0.05)",
                        border: "0.5px solid rgba(79, 158, 255, 0.15)",
                        borderRadius: "3px",
                    }}>
                        <Loader size={16} color="var(--c-cyan)" style={{ animation: "spin 1s linear infinite" }} />
                        <p style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            color: "var(--c-muted)",
                            letterSpacing: "0.05em",
                        }}>
                            Obtendo localização GPS…
                        </p>
                    </div>
                )}

                {fase === "confirmando" && selecionado && (
                    <>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.8rem",
                            padding: "1rem 1.2rem",
                            background: "rgba(61, 255, 160, 0.05)",
                            border: "0.5px solid rgba(61, 255, 160, 0.2)",
                            borderRadius: "3px",
                            marginBottom: "1.2rem",
                        }}>
                            <CheckCircle size={16} color="var(--c-green)" strokeWidth={1.5} />
                            <div>
                                <p style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "0.95rem",
                                    fontWeight: 500,
                                    color: "var(--c-white)",
                                }}>
                                    {selecionado.city}
                                </p>
                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.62rem",
                                    color: "rgba(232,244,253,0.3)",
                                    marginTop: "2px",
                                }}>
                                    {selecionado.lat.toFixed(4)}°  {selecionado.lon.toFixed(4)}°
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "0.6rem" }}>
                            <button
                                onClick={handleConfirmar}
                                className="btn-primary"
                                style={{ flex: 1 }}
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={handleVoltarManual}
                                className="btn-ghost"
                                style={{ flex: 1 }}
                            >
                                Trocar cidade
                            </button>
                        </div>
                    </>
                )}

                {fase === "manual" && (
                    <>
                        {erroGeo && (
                            <p style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.65rem",
                                color: "rgba(255,80,80,0.7)",
                                marginBottom: "0.8rem",
                                letterSpacing: "0.04em",
                            }}>
                                {erroGeo}
                            </p>
                        )}

                        <div style={{ position: "relative" }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                background: "rgba(79, 158, 255, 0.04)",
                                border: "0.5px solid rgba(79, 158, 255, 0.2)",
                                borderRadius: "3px",
                                padding: "0.6rem 0.9rem",
                            }}>
                                {buscando
                                    ? <Loader size={14} color="var(--c-cyan)" style={{ flexShrink: 0, animation: "spin 1s linear infinite" }} />
                                    : <Search size={14} color="rgba(79,158,255,0.5)" style={{ flexShrink: 0 }} />
                                }
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Buscar cidade…"
                                    value={busca}
                                    onChange={handleBuscaChange}
                                    style={{
                                        flex: 1,
                                        background: "transparent",
                                        border: "none",
                                        outline: "none",
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.8rem",
                                        color: "var(--c-white)",
                                        letterSpacing: "0.04em",
                                    }}
                                />
                            </div>

                            {sugestoes.length > 0 && (
                                <div style={{
                                    position: "absolute",
                                    top: "calc(100% + 4px)",
                                    left: 0,
                                    right: 0,
                                    background: "rgba(8, 12, 24, 0.99)",
                                    border: "0.5px solid rgba(79, 158, 255, 0.2)",
                                    borderRadius: "3px",
                                    zIndex: 10,
                                    overflow: "hidden",
                                }}>
                                    {sugestoes.map((item, i) => {
                                        const addr = item.address ?? {}
                                        const city = addr.city ?? addr.town ?? addr.village ?? addr.county ?? item.display_name
                                        const country = addr.country ?? ""
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => handleSugestao(item)}
                                                style={{
                                                    width: "100%",
                                                    background: "transparent",
                                                    border: "none",
                                                    borderBottom: i < sugestoes.length - 1
                                                        ? "0.5px solid rgba(79,158,255,0.08)"
                                                        : "none",
                                                    padding: "0.7rem 1rem",
                                                    cursor: "pointer",
                                                    textAlign: "left",
                                                    transition: "background 0.15s",
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = "rgba(79,158,255,0.07)"}
                                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                            >
                                                <p style={{
                                                    fontFamily: "var(--font-body)",
                                                    fontSize: "0.85rem",
                                                    color: "var(--c-white)",
                                                    marginBottom: "1px",
                                                }}>
                                                    {city}
                                                </p>
                                                <p style={{
                                                    fontFamily: "var(--font-mono)",
                                                    fontSize: "0.58rem",
                                                    color: "rgba(232,244,253,0.28)",
                                                    letterSpacing: "0.04em",
                                                }}>
                                                    {country}
                                                </p>
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        <p style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.62rem",
                            color: "rgba(232,244,253,0.2)",
                            marginTop: "0.6rem",
                            letterSpacing: "0.04em",
                        }}>
                            Digite ao menos 2 caracteres para buscar
                        </p>
                    </>
                )}

                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    )
}

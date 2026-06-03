import { useNavigate } from "react-router-dom"
import { useEffect, useRef } from "react"

export default function PaginaErro() {
    const navigate = useNavigate()
    const canvasRef = useRef(null)

    // Canvas
    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        let animId

        function resize() {
            canvas.width  = canvas.parentElement.offsetWidth
            canvas.height = canvas.parentElement.offsetHeight
        }
        resize()
        window.addEventListener("resize", resize)

        // Fragmentos
        const fragments = Array.from({ length: 40 }, () => ({
            x:   Math.random(),
            y:   Math.random(),
            r:   Math.random() * 1.2 + 0.2,
            a:   Math.random(),
            da:  (Math.random() - 0.5) * 0.004,
            dx:  (Math.random() - 0.5) * 0.0006,
            dy:  (Math.random() - 0.5) * 0.0003,
            tl:  8 + Math.random() * 12,
            ang: Math.random() * Math.PI * 2,
        }))

        function draw() {
            const W = canvas.width
            const H = canvas.height
            ctx.clearRect(0, 0, W, H)

            fragments.forEach(f => {

                f.x += f.dx
                f.y += f.dy
                f.a += f.da
                if (f.x > 1.05) f.x = -0.05
                if (f.x < -0.05) f.x = 1.05
                if (f.y > 1.05) f.y = -0.05
                if (f.y < -0.05) f.y = 1.05
                if (f.a > 1)    f.da = -Math.abs(f.da)
                if (f.a < 0.05) f.da =  Math.abs(f.da)

                const px = f.x * W
                const py = f.y * H
                const tx = Math.cos(f.ang) * f.tl
                const ty = Math.sin(f.ang) * f.tl

                // Rastro vermelho
                const trail = ctx.createLinearGradient(px - tx, py - ty, px, py)
                trail.addColorStop(0, "transparent")
                trail.addColorStop(1, `rgba(255, 80, 80, ${f.a * 5})`)
                ctx.beginPath()
                ctx.moveTo(px - tx, py - ty)
                ctx.lineTo(px, py)
                ctx.strokeStyle = trail
                ctx.lineWidth = 0.8
                ctx.stroke()

                // Ponto
                ctx.beginPath()
                ctx.arc(px, py, f.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 100, 80, ${f.a * 0.6})`
                ctx.fill()
            })

            animId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            window.removeEventListener("resize", resize)
            cancelAnimationFrame(animId)
        }
    }, [])

    return (
        <div
            className="relative z-10 flex flex-col items-center justify-center"
            style={{minHeight: "100vh", textAlign: "center", padding: "2rem"}}
        >
            {/* Canvas local de fragmentos */}
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: "none",
                    opacity: 0.6,
                }}
            />

            {/* Conteúdo */}
            <div className="relative" style={{zIndex: 1}}>

                <p style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.85rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(255,80,80,0.6)",
                    marginBottom: "1rem",
                }}>
                    ◈ Erro 404 — Objeto não encontrado
                </p>

                <h1 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(6rem, 20vw, 14rem)",
                    fontWeight: 300,
                    lineHeight: 0.9,
                    color: "var(--c-white)",
                    marginBottom: "1.5rem",
                    letterSpacing: "-0.02em",
                }}>
                    4
                    <span style={{color: "var(--c-red)"}}>0</span>
                    4
                </h1>

                <div style={{
                    width: "52px",
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, var(--c-red), transparent)",
                    margin: "0 auto 1.5rem",
                }}/>

                <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                    fontWeight: 300,
                    lineHeight: 1.2,
                    color: "var(--c-white)",
                    marginBottom: "0.8rem",
                }}>
                    Esta página se perdeu
                    <br/>
                    <em style={{fontStyle: "italic", color: "var(--c-muted)"}}>
                        em órbita.
                    </em>
                </p>

                <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    fontWeight: 300,
                    color: "var(--c-muted)",
                    lineHeight: 1.7,
                    maxWidth: "380px",
                    margin: "0 auto 2.5rem",
                }}>
                    A rota que você tentou acessar não existe ou foi movida.
                    Os fragmentos estão sendo rastreados pelo sistema.
                </p>

                <div style={{
                    display: "inline-flex",
                    flexDirection: "column",
                    gap: "0.3rem",
                    padding: "0.8rem 1.4rem",
                    background: "rgba(255,80,80,0.04)",
                    border: "0.5px solid rgba(255,80,80,0.15)",
                    borderRadius: "3px",
                    marginBottom: "2.5rem",
                    textAlign: "left",
                }}>
                    {[
                        {label: "STATUS", value: "404 NOT FOUND"},
                        {label: "ORBITAL", value: "TRAJETÓRIA INVÁLIDA"},
                        {label: "SISTEMA", value: "SKYAWARE v1.0"},
                    ].map(item => (
                        <p key={item.label} style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.7rem",
                            letterSpacing: "0.06em",
                            color: "rgba(232,244,253,0.25)",
                        }}>
                            <span style={{color: "rgba(255,80,80,0.6)", marginRight: "0.8rem"}}>
                                {item.label}
                            </span>
                            {item.value}
                        </p>
                    ))}
                </div>

                <div className="flex gap-3 justify-center flex-wrap">
                    <button
                        onClick={() => navigate("/")}
                        className="btn-primary"
                    >
                        Voltar ao início →
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="btn-ghost"
                    >
                        Página anterior
                    </button>
                </div>
            </div>
        </div>
    )
}
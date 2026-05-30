import { useEffect, useRef } from "react"

export default function StarfieldCanvas() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        let animationId

        function resize() {
            canvas.width  = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener("resize", resize)

        // Gera as estrelas
        const stars = Array.from({length: 320}, () => ({
            x:  Math.random(),
            y:  Math.random(),
            r:  Math.random() * 1.4 + 0.1,
            a:  Math.random(),
            // Velocidade de piscar
            da: (Math.random() - 0.5) * 0.0025,
            // 20% das estrelas tem tom azulado, o resto é branco
            c:  Math.random() > 0.8
                    ? [180, 205, 255]
                    : [215, 225, 255],
        }))

        // Gera os satélites
        const satellites = Array.from({length: 8}, () => ({
            x:   Math.random(),
            y:   0.03 + Math.random() * 0.9,
            spd: 0.00016 + Math.random() * 0.0002,
            // Ângulo inclinado
            ang: (Math.random() - 0.5) * 26,
            // Tamanho do rastro de luz
            tl:  28 + Math.random() * 26,
        }))

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Estrelas
            stars.forEach(s => {
                // Atualiza opacidade para efeito de piscar
                s.a += s.da
                if (s.a > 1) s.da = -Math.abs(s.da)
                if (s.a < 0.04) s.da =  Math.abs(s.da)

                ctx.beginPath()
                ctx.arc(
                    s.x * canvas.width,
                    s.y * canvas.height,
                    s.r,
                    0,
                    Math.PI * 2
                )
                ctx.fillStyle = `rgba(${s.c[0]}, ${s.c[1]}, ${s.c[2]}, ${s.a})`
                ctx.fill()
            })

            // Satélites
            satellites.forEach(s => {
                // Move da esquerda para a direita
                s.x += s.spd
                // Quando sai pelo lado direito, volta pelo esquerdo
                if (s.x > 1.08) s.x = -0.08

                const px  = s.x * canvas.width
                const py  = s.y * canvas.height
                const rad = s.ang * (Math.PI / 180)
                const tx  = Math.cos(rad) * s.tl
                const ty  = Math.sin(rad) * s.tl
                const trail = ctx.createLinearGradient(
                    px - tx, py - ty,
                    px, py
                )
                trail.addColorStop(0, "transparent")
                trail.addColorStop(1, "rgba(79, 158, 255, 0.22)")

                ctx.beginPath()
                ctx.moveTo(px - tx, py - ty)
                ctx.lineTo(px, py)
                ctx.strokeStyle = trail
                ctx.lineWidth   = 1.2
                ctx.stroke()

                ctx.beginPath()
                ctx.arc(px, py, 1.8, 0, Math.PI * 2)
                ctx.fillStyle = "rgba(160, 205, 255, 0.9)"
                ctx.fill()
            })
            animationId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            window.removeEventListener("resize", resize)
            cancelAnimationFrame(animationId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none",
                display: "block",
            }}
        />
    )
}
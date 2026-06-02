const CAMADAS = [
    {
        num: "01",
        nome: "Orbital",
        cor: "#4f9eff",
        descricao: "Dados reais de satélites em órbita. O sistema consome arquivos TLE (Two-Line Elements) do CelesTrak, usa a biblioteca SGP4 para calcular a posição futura de cada satélite, e integra VIIRS (poluição luminosa) e MODIS (nebulosidade) da NASA. Atualização a cada 6 horas.",
        tags: ["NASA", "ESA", "CELESTRAK"],
        pills: ["TLE / CelesTrak", "SGP4 Python", "NASA VIIRS", "NASA MODIS", "Space-Track.org"],
    },
    {
        num: "02",
        nome: "Analítica",
        cor: "#a78bfa",
        descricao: "O backend Python processa os dados orbitais, calcula o score parcial (orbital + luminoso + atmosférico) e publica no FIWARE Orion Context Broker. O STH Comet armazena o histórico temporal. O dado também é enviado ao ESP32 via MQTT para processamento local.",
        tags: ["PYTHON", "FIWARE"],
        pills: ["Python 3.x", "FIWARE Orion CB", "STH Comet", "MQTT", "Docker Compose"],
    },
    {
        num: "03",
        nome: "Edge",
        cor: "#3dffa0",
        descricao: "O ESP32 recebe o score parcial do FIWARE via MQTT e o combina com leituras físicas locais: LDR (poluição luminosa local), DHT22 (umidade e temperatura) e BMP280 (pressão). Calcula o score final localmente e aciona LED RGB, buzzer e display OLED.",
        tags: ["ESP32", "IOT"],
        pills: ["ESP32 Wokwi", "LDR / BH1755", "DHT22", "BMP280", "OLED SSD1306"],
    },
    {
        num: "04",
        nome: "Interface",
        cor: "#ffd166",
        descricao: "O dashboard em React 18 + Vite consome o JSON de dados e renderiza o Sky Observation Score, mapa estelar interativo, linha do tempo de 12h e alertas em tempo real. Roteamento via React Router DOM. Deploy estático no GitHub Pages.",
        tags: ["REACT", "VITE", "TAILWIND"],
        pills: ["React 18", "Vite 6", "Tailwind CSS v3", "React Router DOM", "GitHub Pages"],
    },
]

const FATORES = [
    {
        label: "FATOR ORBITAL",
        desc: "Fonte: TLE + SGP4 · CelesTrak · densidade de satélites visíveis",
        pct: 40,
        cor: "#4f9eff",
        peso: "0.40",
    },
    {
        label: "FATOR LUMINOSO",
        desc: "Fonte: VIIRS · NASA/NOAA · poluição luminosa 750m resolução",
        pct: 30,
        cor: "#ffd166",
        peso: "0.30",
    },
    {
        label: "FATOR ATMOSFÉRICO",
        desc: "Fonte: MODIS · NASA · cobertura de nuvens atualizada 1–2h",
        pct: 20,
        cor: "#a78bfa",
        peso: "0.20",
    },
    {
        label: "FATOR LOCAL (FÍSICO)",
        desc: "Fonte: LDR + DHT22 + BMP280 · dados físicos hiperlocais",
        pct: 10,
        cor: "#3dffa0",
        peso: "0.10",
    },
]

const FLUXO = [
    { label: "CelesTrak", sub: "TLE / SGP4", cor: "#4f9eff" },
    { label: "VIIRS\nMODIS", sub: "NASA", cor: "#4f9eff" },
    { label: "Python\nScore Parcial", sub: "ANALÍTICA", cor: "#a78bfa" },
    { label: "FIWARE\nOrion CB", sub: "CONTEXT BROKER", cor: "#a78bfa" },
    { label: "ESP32\n+ Sensores", sub: "EDGE", cor: "#3dffa0" },
    { label: "LDR + OLED\n+ Buzzer", sub: "FIRMWARE", cor: "#3dffa0" },
    { label: "React\nDashboard", sub: "INTERFACE", cor: "#ffd166" },
]

function Arrow({ cor }) {
    return (
        <div className="flex items-center justify-center shrink-0">
            <svg width="28" height="12" viewBox="0 0 28 12" fill="none">
                <line x1="0" y1="6" x2="22" y2="6" stroke={cor} strokeWidth="0.8" strokeOpacity="0.5" />
                <polyline points="18,2 24,6 18,10" stroke={cor} strokeWidth="0.8" strokeOpacity="0.5" fill="none" />
            </svg>
        </div>
    )
}

function FluxoNode({ node }) {
    return (
        <div
            className="flex flex-col items-center justify-center text-center px-3 py-2 rounded-sm min-w-[80px]"
            style={{
                background: `${node.cor}0d`,
                border: `0.5px solid ${node.cor}40`,
            }}
        >
            {node.label.split("\n").map((l, i) => (
                <span
                    key={i}
                    className="[font-family:var(--font-mono)] text-[0.65rem] font-bold tracking-[0.06em] leading-tight"
                    style={{ color: node.cor }}
                >
                    {l}
                </span>
            ))}
            <span className="[font-family:var(--font-mono)] text-[0.55rem] tracking-[0.1em] text-[var(--c-muted)] mt-1 uppercase">
                {node.sub}
            </span>
        </div>
    )
}

export default function ComoFunciona() {
    return (
        <div className="relative z-10 pt-10">

            {/* Hero */}
            <section className="px-16 pt-16 pb-12 grid grid-cols-2 gap-16 items-start">
                <div>
                    <p className="section-kicker animate-fade-in-up text-[0.76rem]">
                        ◈ Arquitetura — do satélite à sua tela
                    </p>
                    <div className="divider-line animate-fade-in-up delay-100 my-5" />
                    <h1
                        className="animate-fade-in-up delay-200 [font-family:var(--font-display)] font-light leading-[1.02] text-[var(--c-white)]"
                        style={{ fontSize: "clamp(2.8rem, 5vw, 5rem)" }}
                    >
                        Do espaço
                        <br />
                        <em className="italic text-[var(--c-muted)]">ao seu quintal.</em>
                    </h1>
                </div>

                <p className="animate-fade-in-up delay-300 [font-family:var(--font-body)] text-[0.95rem] font-light leading-[1.8] text-[var(--c-muted)] self-end pb-2">
                    O SkyAware opera em quatro camadas interdependentes: dados orbitais de satélites reais da NASA e ESA, processamento analítico em Python, validação física local pelo ESP32 e entrega visual em React. O dado percorre 600km de altitude até o seu dashboard em tempo real.
                </p>
            </section>

            {/* Diagrama de fluxo */}
            <section className="px-16 pb-14 border-b border-[rgba(232,244,253,0.04)]">
                <p className="section-kicker text-[0.72rem] mb-5">
                    ◈ Fluxo de dados — do satélite ao score
                </p>

                <div className="flex items-center gap-0 overflow-x-auto pb-2">
                    {FLUXO.map((node, i) => (
                        <div key={i} className="flex items-center">
                            <FluxoNode node={node} />
                            {i < FLUXO.length - 1 && <Arrow cor={FLUXO[i + 1].cor} />}
                        </div>
                    ))}
                </div>

                {/* Legenda */}
                <div className="flex gap-6 mt-4">
                    {[
                        { label: "Orbital", cor: "#4f9eff" },
                        { label: "Analítica", cor: "#a78bfa" },
                        { label: "Edge", cor: "#3dffa0" },
                        { label: "Interface", cor: "#ffd166" },
                    ].map(l => (
                        <div key={l.label} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: l.cor }} />
                            <span className="[font-family:var(--font-mono)] text-[0.62rem] tracking-[0.1em] text-[var(--c-muted)] uppercase">
                                {l.label}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quatro camadas */}
            <section className="px-16 pt-12 pb-14 border-b border-[rgba(232,244,253,0.04)]">
                <p className="section-kicker text-[0.72rem] mb-10">
                    ◈ As quatro camadas do sistema
                </p>

                <div className="flex flex-col gap-0">
                    {CAMADAS.map((c, i) => (
                        <div
                            key={c.num}
                            className="grid grid-cols-[220px_1fr_auto] gap-8 items-start py-8 transition-colors duration-200 hover:bg-[rgba(79,158,255,0.02)]"
                            style={{
                                borderTop: i === 0 ? `0.5px solid rgba(232,244,253,0.06)` : undefined,
                                borderBottom: `0.5px solid rgba(232,244,253,0.06)`,
                            }}
                        >
                            {/* Coluna esquerda — nome */}
                            <div className="flex flex-col gap-2">
                                <span className="[font-family:var(--font-mono)] text-[0.72rem] tracking-[0.1em]" style={{ color: `${c.cor}99` }}>
                                    {c.num} —
                                </span>
                                <p
                                    className="[font-family:var(--font-display)] text-2xl font-medium"
                                    style={{ color: c.cor }}
                                >
                                    {c.nome}
                                </p>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {c.tags.map(t => (
                                        <span
                                            key={t}
                                            className="[font-family:var(--font-mono)] text-[0.58rem] tracking-[0.12em] uppercase px-1.5 py-0.5 rounded-sm"
                                            style={{
                                                color: c.cor,
                                                background: `${c.cor}12`,
                                                border: `0.5px solid ${c.cor}30`,
                                            }}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Coluna central — descrição */}
                            <p className="[font-family:var(--font-body)] text-[0.9rem] font-light leading-[1.75] text-[var(--c-muted)] pt-1">
                                {c.descricao}
                            </p>

                            {/* Coluna direita — pills */}
                            <div className="flex flex-wrap justify-end gap-1.5 max-w-[280px] pt-1">
                                {c.pills.map(pill => (
                                    <span
                                        key={pill}
                                        className="[font-family:var(--font-mono)] text-[0.62rem] tracking-[0.08em] px-2.5 py-1 rounded-sm whitespace-nowrap"
                                        style={{
                                            color: c.cor,
                                            background: `${c.cor}0d`,
                                            border: `0.5px solid ${c.cor}35`,
                                        }}
                                    >
                                        {pill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Score breakdown */}
            <section className="px-16 pt-12 pb-20 grid grid-cols-2 gap-16 items-start">
                {/* Esquerda — texto */}
                <div>
                    <p className="section-kicker text-[0.72rem] mb-5">
                        ◈ Como o score é calculado
                    </p>
                    <h2
                        className="[font-family:var(--font-display)] font-light leading-[1.04] text-[var(--c-white)] mb-5"
                        style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
                    >
                        Quatro fatores.
                        <br />
                        <em className="italic text-[var(--c-muted)]">Uma decisão.</em>
                    </h2>
                    <p className="[font-family:var(--font-body)] text-[0.9rem] font-light leading-[1.8] text-[var(--c-muted)] mb-8">
                        O Sky Observation Score combina dados de quatro fontes distintas, cada uma com um peso específico baseado no impacto real que tem na qualidade de uma observação astronômica. O resultado é um número de 0 a 10, calculado localmente pelo ESP32 a partir do score parcial enviado pelo servidor.
                    </p>

                    {/* Fórmula */}
                    <div className="p-4 rounded-sm bg-[rgba(79,158,255,0.04)] border-[0.5px] border-[rgba(79,158,255,0.12)]">
                        <p className="[font-family:var(--font-mono)] text-[0.62rem] tracking-[0.16em] uppercase text-[rgba(79,158,255,0.5)] mb-3">
                            Fórmula híbrida
                        </p>
                        <p className="[font-family:var(--font-mono)] text-[0.78rem] text-[var(--c-muted)] leading-relaxed">
                            B = (F_orb × 0.40) + (F_lum × 0.30)
                            <br />
                            {"    "}+ (F_atm × 0.20) + (F_loc × 0.10)
                        </p>
                        <div className="border-t border-[rgba(79,158,255,0.1)] my-3" />
                        <p className="[font-family:var(--font-mono)] text-[0.78rem] text-[var(--c-muted)]">
                            Score = B × M_atm × M_lum × 10
                        </p>
                        <p className="[font-family:var(--font-mono)] text-[0.62rem] tracking-[0.06em] text-[rgba(79,158,255,0.4)] mt-2">
                            onde M_atm, M_lum ∈ [0.1, 1.0] — modificadores multiplicativos
                        </p>
                    </div>
                </div>

                {/* Direita — barras dos fatores */}
                <div className="flex flex-col gap-6 pt-1">
                    {FATORES.map(f => (
                        <div key={f.label}>
                            <div className="flex items-baseline justify-between mb-2">
                                <p className="[font-family:var(--font-mono)] text-[0.65rem] tracking-[0.14em] uppercase" style={{ color: f.cor }}>
                                    {f.label}
                                </p>
                                <span className="[font-family:var(--font-mono)] text-[0.75rem] font-bold" style={{ color: f.cor }}>
                                    {f.pct}%
                                </span>
                            </div>
                            {/* Barra */}
                            <div className="h-[3px] w-full rounded-full bg-[rgba(232,244,253,0.06)] mb-2 overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${f.pct}%`,
                                        background: f.cor,
                                        boxShadow: `0 0 8px ${f.cor}60`,
                                    }}
                                />
                            </div>
                            <p className="[font-family:var(--font-mono)] text-[0.62rem] tracking-[0.06em] text-[var(--c-muted)]">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

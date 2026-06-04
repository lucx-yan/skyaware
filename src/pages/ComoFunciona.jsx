const CAMADAS = [
    {
        num: "01",
        nome: "Orbital",
        cor: "#4f9eff",
        descricao: "Dados reais de satélites em órbita. O sistema consome posições orbitais em tempo real via N2YO API (REST v1), que retorna latitude, longitude, altitude, azimute e elevação de cada satélite monitorado. A poluição luminosa é derivada do BORTLE_MAP baseado no Atlas Mundial de Poluição Luminosa (Falchi et al., 2016). A cobertura de nuvens vem da Open-Meteo API, atualizada a cada 10 minutos por coordenada.",
        tags: ["N2YO", "NASA", "ESA"],
        pills: ["N2YO API v1", "Open-Meteo API", "VIIRS / NASA", "BORTLE_MAP", "Space-Track.org"],
    },
    {
        num: "02",
        nome: "Analítica",
        cor: "#a78bfa",
        descricao: "O backend Python processa os dados orbitais da N2YO API, os dados atmosféricos da Open-Meteo e os dados físicos do ESP32 (via FIWARE Orion CB), e calcula o score híbrido completo — Score = B × M_atm × M_lum × 10. O Python é o único responsável pelo cálculo. Os resultados são publicados no FIWARE Orion CB e expostos via Flask API com HTTPS.",
        tags: ["PYTHON", "FIWARE", "FLASK"],
        pills: ["Python 3.x", "Flask API", "FIWARE Orion CB", "Nginx + Let's Encrypt", "Docker Compose"],
    },
    {
        num: "03",
        nome: "Edge",
        cor: "#3dffa0",
        descricao: "O ESP32 coleta dados físicos brutos dos sensores locais — LDR (luminosidade), DHT22 (umidade e temperatura) e BMP180 (pressão atmosférica) — e os publica via MQTT ao FIWARE Orion CB. O Python busca esses dados, calcula o score híbrido completo e envia o comando de LED de volta ao ESP32 via MQTT. O ESP32 obedece o comando e acende o LED correspondente.",
        tags: ["ESP32", "IOT", "MQTT"],
        pills: ["ESP32 Wokwi", "LDR / BH1750", "DHT22", "BMP180", "OLED SSD1306"],
    },
    {
        num: "04",
        nome: "Interface",
        cor: "#ffd166",
        descricao: "O dashboard em React + Vite consome a Flask API via HTTPS (endpoints /score, /forecast, /location) e renderiza o Sky Observation Score, mapa estelar interativo, previsão semanal de 7 dias e alertas em tempo real. O conteúdo adapta por perfil de usuário (Amador, Fotógrafo, Profissional). Deploy estático no GitHub Pages.",
        tags: ["REACT", "VITE", "TAILWIND"],
        pills: ["React 19", "Vite 8", "Tailwind CSS v3", "React Router DOM", "GitHub Pages"],
    },
]

const FATORES = [
    {
        label: "F_ORBITAL",
        desc: "Fonte: N2YO API · posições em tempo real · peso 70% na base B",
        pct: 70,
        cor: "#4f9eff",
        peso: "0.70",
    },
    {
        label: "F_LOCAL (ESP32)",
        desc: "Fonte: LDR + DHT22 + BMP180 · dados físicos hiperlocais · peso 30% na base B",
        pct: 30,
        cor: "#3dffa0",
        peso: "0.30",
    },
    {
        label: "M_ATM (modificador)",
        desc: "Fonte: Open-Meteo API · cobertura de nuvens · multiplica o score final",
        pct: 90,
        cor: "#a78bfa",
        peso: "×",
    },
    {
        label: "M_LUM (modificador)",
        desc: "Fonte: VIIRS/NASA · BORTLE_MAP · poluição luminosa · multiplica o score final",
        pct: 63,
        cor: "#ffd166",
        peso: "×",
    },
]

const FLUXO = [
    { label: "N2YO\nAPI", sub: "ORBITAL", cor: "#4f9eff" },
    { label: "Open-Meteo\nVIIRS", sub: "ATMOSFÉRICO", cor: "#4f9eff" },
    { label: "Python\nFlask API", sub: "ANALÍTICA", cor: "#a78bfa" },
    { label: "FIWARE\nOrion CB", sub: "CONTEXT BROKER", cor: "#a78bfa" },
    { label: "ESP32\n+ Sensores", sub: "EDGE", cor: "#3dffa0" },
    { label: "LED + OLED\n+ Buzzer", sub: "FIRMWARE", cor: "#3dffa0" },
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
        <div className="relative z-10 pt-10" style={{ overflowX: "hidden" }}>

            {/* Hero */}
            <section className="px-5 lg:px-16 pt-16 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
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

                <p className="animate-fade-in-up delay-300 [font-family:var(--font-body)] text-[0.95rem] font-light leading-[1.8] text-[var(--c-muted)] lg:self-end lg:pb-2">
                    O SkyAware opera em quatro camadas interdependentes: dados orbitais via N2YO API e condições atmosféricas via Open-Meteo, processamento analítico completo em Python + Flask, validação física local pelo ESP32 e entrega visual em React. O dado percorre 600km de altitude até o seu dashboard em tempo real.
                </p>
            </section>

            {/* Diagrama de fluxo */}
            <section className="px-5 lg:px-16 pb-14 border-b border-[rgba(232,244,253,0.04)]">
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
                <div className="flex flex-wrap gap-4 lg:gap-6 mt-4">
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
            <section className="px-5 lg:px-16 pt-12 pb-14 border-b border-[rgba(232,244,253,0.04)]">
                <p className="section-kicker text-[0.72rem] mb-10">
                    ◈ As quatro camadas do sistema
                </p>

                <div className="flex flex-col gap-0">
                    {CAMADAS.map((c, i) => (
                        <div
                            key={c.num}
                            className="grid grid-cols-1 lg:grid-cols-[200px_1fr] xl:grid-cols-[220px_1fr_auto] gap-5 lg:gap-8 items-start py-8 transition-colors duration-200 hover:bg-[rgba(79,158,255,0.02)]"
                            style={{
                                borderTop: i === 0 ? `0.5px solid rgba(232,244,253,0.06)` : undefined,
                                borderBottom: `0.5px solid rgba(232,244,253,0.06)`,
                            }}
                        >
                            {/* Nome da camada */}
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

                            {/* Descrição */}
                            <p className="[font-family:var(--font-body)] text-[0.9rem] font-light leading-[1.75] text-[var(--c-muted)] pt-1">
                                {c.descricao}
                            </p>

                            {/* Pills — ocultas no mobile para não poluir */}
                            <div className="hidden xl:flex flex-wrap justify-end gap-1.5 max-w-[280px] pt-1">
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

                            {/* Pills mobile — linha horizontal com scroll */}
                            <div className="flex xl:hidden flex-wrap gap-1.5">
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
            <section className="px-5 lg:px-16 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                {/* Esquerda — texto e fórmula */}
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
                        O Sky Observation Score usa uma fórmula híbrida com portões de corte absolutos. A base B combina o fator orbital (dados N2YO API) e o fator local (sensores ESP32). Os multiplicadores M_atm e M_lum garantem que céu nublado ou poluição extrema resultem em score baixo, independentemente dos outros fatores.
                    </p>

                    <div className="p-4 rounded-sm bg-[rgba(79,158,255,0.04)] border-[0.5px] border-[rgba(79,158,255,0.12)]">
                        <p className="[font-family:var(--font-mono)] text-[0.62rem] tracking-[0.16em] uppercase text-[rgba(79,158,255,0.5)] mb-3">
                            Fórmula híbrida
                        </p>
                        <p className="[font-family:var(--font-mono)] text-[0.78rem] text-[var(--c-muted)] leading-relaxed">
                            B = (f_orbital × 0.7) + (f_local × 0.3)
                        </p>
                        <div className="border-t border-[rgba(79,158,255,0.1)] my-3" />
                        <p className="[font-family:var(--font-mono)] text-[0.78rem] text-[var(--c-muted)]">
                            Score = B × M_atm × M_lum × 10
                        </p>
                        <div className="border-t border-[rgba(79,158,255,0.1)] my-3" />
                        <p className="[font-family:var(--font-mono)] text-[0.7rem] text-[var(--c-muted)] leading-relaxed">
                            Portões de corte absolutos:
                        </p>
                        <p className="[font-family:var(--font-mono)] text-[0.7rem] text-[rgba(255,80,80,0.7)] leading-relaxed">
                            nuvens ≥ 85% → Score = 0.0 (céu inviável)
                            <br />
                            poluição ≥ 90% → Score = 1.0 (nota mínima)
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
                                    {f.peso === "×" ? `× ${f.pct}%` : `${f.pct}%`}
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
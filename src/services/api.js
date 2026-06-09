// SkyAware — Serviço de API
// Faz fetch na Flask API e transforma os dados para o formato
// que o front usa internamente. Centralizado aqui para que
// qualquer mudança no backend seja ajustada em um só lugar.

// Base URL da API:
const API_BASE = "https://darksky-fiap.duckdns.org"

// TODO: para desenvolvimento local, troca por: const API_BASE = "http://localhost:5000"

// Transformadores

// Transforma o /score do backend para o formato interno do front
function transformScore(raw) {
    const scoreFactors = {
        orbital: { value: parseFloat((raw.fatorOrbital  ?? 0.82).toFixed(2)), weight: 0.7 },
        local:   { value: parseFloat((raw.fatorLocal    ?? 0.75).toFixed(2)), weight: 0.3 },
        matm:    { value: parseFloat((raw.multiplicadorAtm ?? 0.90).toFixed(2)) },
        mlum:    { value: parseFloat((raw.multiplicadorLum ?? 0.63).toFixed(2)) },
    }

    const meta = {
        location:       raw.cidade     ?? "São Paulo, SP",
        latitude:       raw.lat        ?? -23.55,
        longitude:      raw.lon        ?? -46.63,
        starlinkActive: 6241,
        affectedImages: 30, 
    }

    // Satélites
    const satellites = (raw.satelites ?? []).map(s => ({
        id:            s.id,
        constellation: s.constellation,
        altitude:      s.altitude,
        velocity:      s.velocity,
        azimuth:       s.azimuth,
        elevation:     s.elevation,
        passesIn:      s.passesIn,
        magnitude:     s.magnitude,
        danger:        s.danger,
    }))

    // Sensores do ESP32
    const sensores = {
        temperatura: raw.temperatura ?? 22.0,
        umidade:     raw.umidade     ?? 60.0,
        pressao:     raw.pressao     ?? 1013,
        escuridao: raw.ldrRaw != null
            ? Math.max(0, Math.round((1 - raw.ldrRaw / 4095) * 100))
            : 50,
    }

    return {
        meta,
        satellites,
        scoreFactors,
        sensores,
        score:       parseFloat((raw.skyScore ?? 0).toFixed(1)),
        status:      raw.status      ?? "interferência",
        lastUpdate:  raw.lastUpdate  ?? "--:--",
        corteAtivo:  raw.corteAtivo  ?? false,
        corteMotivo: raw.corteMotivo ?? "",
    }
}

function transformForecast(raw) {
    return (raw.forecast ?? []).map(f => ({
        day:    f.hora,
        score:  parseFloat((f.scoreProjetado ?? 0).toFixed(1)),
        clouds: f.nuvens ?? 0,
    }))
}

// Transforma o /history para o formato do gráfico histórico
function transformHistory(raw) {
    return (raw.rows ?? []).map(r => ({
        
        ts:    r.ts ? r.ts.substring(11, 16) : "--:--",
        score: parseFloat((r.sky_score ?? 0).toFixed(1)),
    }))
}


// Funções de fetch exportadas
export async function setBackendLocation({lat,lon}) {
    const res = await fetch(`${API_BASE}/location`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({lat,lon}),
        signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) throw new Error(`/location retornou HTTP ${res.status}`)
    return await res.json()
}

// Busca score atual + satélites + telemetria ESP32
export async function fetchScore() {
    const res = await fetch(`${API_BASE}/score`, {
        signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) throw new Error(`/score retornou HTTP ${res.status}`)
    return transformScore(await res.json())
}

// Busca previsão das próximas horas
export async function fetchForecast() {
    const res = await fetch(`${API_BASE}/forecast`, {
        signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) throw new Error(`/forecast retornou HTTP ${res.status}`)
    return transformForecast(await res.json())
}

// Busca histórico do score para o gráfico
export async function fetchHistory(limit = 200) {
    const res = await fetch(`${API_BASE}/history?limit=${limit}`, {
        signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) throw new Error(`/history retornou HTTP ${res.status}`)
    return transformHistory(await res.json())
}
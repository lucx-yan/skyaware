# SkyAware — Plataforma Web de Inteligência Orbital
### Front-End Development & Web Development · Global Solution 2026 · FIAP

> Interface web de inteligência orbital para astronomia cidadã. Consome dados físicos coletados pelo ESP32 e informações orbitais em tempo real para calcular e exibir o **Sky Observation Score** — um índice de 0 a 10 que indica a qualidade do céu para observação astronômica. Inclui mapa estelar ao vivo, alertas dinâmicos, previsão das próximas 12 horas e sistema de localização do usuário.

---

## Equipe — 1ESPA

| Nome | RM |
|---|---|
| Yan Lucas Gonçalves da Silva | 567046 |
| João Victor Melo Santos | 566640 |
| Murilo Jeronimo Ferreira Nunes | 560641 |
| Vinicius Kozonoe Guaglini | 567264 |
| Bruno Santos Castilho | 566799 |

---

## Links

| Recurso | Link |
|---|---|
| Deploy (GitHub Pages) | https://lucx-yan.github.io/skyaware |
| Repositório GitHub | https://github.com/lucx-yan/skyaware |
| Repositório Edge Computing | https://github.com/JoaoVictorMelo10/skyaware-edge-computing |

---

## O Problema

Desde 2019, constelações como Starlink (SpaceX), Kuiper (Amazon) e OneWeb colocaram mais de 6.000 satélites em órbita baixa. Cada satélite reflete luz solar e aparece como rastro nas fotografias astronômicas. O Vera C. Rubin Observatory estima que até **30% de suas imagens científicas** de longa exposição já são contaminadas.

O problema não é só orbital — condições físicas locais como umidade alta, pressão instável e poluição luminosa também inviabilizam uma sessão de observação. O astrônomo amador ou fotógrafo noturno precisava de uma ferramenta que cruzasse todas essas variáveis e respondesse de forma clara:

> **Vale a pena observar agora?**

---

## Por que Front-End é essencial aqui

Os dados orbitais brutos — coordenadas de satélites, índices atmosféricos, leituras de sensores — são inúteis sem uma interface que os transforme em decisões compreensíveis. O SkyAware é a camada de inteligência visual que:

- Traduz a fórmula híbrida `Score = B × M_atm × M_lum × 10` em um índice visual com cor e linguagem natural
- Exibe os satélites Starlink e OneWeb em movimento real sobre o horizonte do usuário via Canvas API — algo impossível de comunicar em texto
- Adapta o nível de detalhe ao perfil do usuário (amador, fotógrafo, profissional) sem expor complexidade desnecessária
- Detecta automaticamente se o backend está respondendo e troca entre dados ao vivo e simulados sem quebrar a experiência
- Contextualiza a localização do usuário — São Paulo e Roma têm qualidades de céu completamente diferentes

Sem a camada de front-end, a DarkSky Station seria um terminal de texto inacessível ao público que o projeto pretende alcançar.

---

## Arquitetura da Aplicação

```
Usuário (Browser)
    │
    ├── GitHub Pages — SPA React 19 + Vite (estático, sempre disponível)
    │       │
    │       ├── LocalizacaoModal   → Nominatim API (geocoding, OpenStreetMap)
    │       │
    │       ├── src/services/api.js → Flask API (Azure VM)
    │       │       ├── GET /score     → score + satélites + sensores ESP32
    │       │       ├── GET /forecast  → previsão horária Open-Meteo
    │       │       └── GET /history   → histórico SQLite
    │       │
    │       └── Fallback automático → src/data/satellites.json
    │                                  (quando a VM estiver offline)
    │
    └── Badge DADOS AO VIVO / SIMULADOS (health check feito a cada 60s)
```

O frontend nunca quebra. Se o backend estiver offline, os dados estáticos de fallback são exibidos automaticamente e o badge **DADOS SIMULADOS** comunica o estado para o usuário.

---

## Sky Observation Score — Visualização da Fórmula

O cálculo é feito inteiramente pelo backend Python. O frontend recebe o score e os fatores individuais e os exibe com contexto visual:

```
Score = B × M_atm × M_lum × 10       [0 a 10]

B         = (f_orbital × 0.7) + (f_local × 0.3)
f_orbital → N2YO: densidade de satélites sobre o observador
f_local   → ESP32: umidade + pressão + escuridão (LDR)
M_atm     → Open-Meteo: cobertura de nuvens
M_lum     → Bortle Scale: poluição luminosa por localização
```

| Score | Status exibido | Cor |
|---|---|---|
| ≥ 7.0 | Janela ideal de observação | Verde |
| 4.0 – 6.9 | Condições moderadas | Amarelo |
| < 4.0 | Condições desfavoráveis | Vermelho |

---

## Funcionalidades

### Sistema de Perfis
Três modos de visualização selecionáveis na entrada do site. Alteram o nível de detalhe exibido em todas as páginas sem recarregar.

| Perfil | O que muda |
|---|---|
| Astrônomo Amador | Score geral, linguagem simplificada, previsão semanal |
| Astrofotógrafo | Rastros esperados por tempo de exposição, melhor janela |
| Profissional | Fórmula híbrida completa, dados brutos das APIs, sensores ESP32 |

### Localização do Usuário
Modal que solicita permissão de geolocalização do browser (`navigator.geolocation`). Se aceita, usa reverse geocoding via Nominatim (OpenStreetMap) para exibir o nome da cidade. Se recusada ou der erro, oferece busca manual com debounce de 600ms e sugestões em tempo real. Localização persistida em `localStorage` — para não perguntar em visitas futuras. Botão de troca disponível na Navbar.

> Rate limit do Nominatim respeitado: debounce no campo de busca e header `User-Agent: SkyAware-FIAP/1.0` em todas as requisições.

### Sky Observation Score ao Vivo
Card principal com score 0–10, indicador de status por cor, fatores individuais (Orbital, M_atm, M_lum, ESP32) com barras de progresso animadas e badge **AO VIVO / SIMULADO** dinâmico. Atualiza a cada 60 segundos via `setInterval`.

### Forecast Bar — Próximas 12 Horas
Barra de segmentos coloridos representando a qualidade do céu hora a hora, com 5 labels de horário sempre calculados como `hora_atual + 0h, +3h, +6h, +9h, +12h`:

```js
const nowH = new Date().getHours()
return [0, 3, 6, 9, 12].map(offset => {
    const h = (nowH + offset) % 24     // trata virada de meia-noite
    return `${String(h).padStart(2, "0")}:00`
})
```

Calcula e exibe automaticamente a melhor janela de observação dentro do período.

### Mapa Estelar ao Vivo — Canvas API
Canvas animado 60fps com:
- Estrelas com brilho oscilante procedural
- Satélites Starlink (azul) e OneWeb (laranja) em movimento com rastros de trajetória
- Marcação em vermelho para satélites a menos de 10 minutos do observador
- Bússola N/S/L/O desenhada após os satélites
- Legenda fixa no topo esquerdo

Filtros: Todos · Starlink · OneWeb · Satélites Chegando

### Alertas Dinâmicos
4 cards gerados em tempo real pela função `gerarAlertas()` com base nos dados da API:

| Card | Dado usado | Tipos possíveis |
|---|---|---|
| Interferência de satélites | `satelites.danger` | Crítico / Atenção / Favorável |
| Score atual | `skyScore` | Crítico / Atenção / Favorável |
| Melhor janela | `forecastHorario` | Ideal (com HH:MM–HH:MM) / sem janelas |
| Condição atmosférica | `nuvens %` | Atenção (≥50%) / Favorável (<20%) |

### Badge de Status da API
Presente na Navbar e no card principal da Home. Realiza health check ao endpoint `/score` a cada 60s com timeout de 5s via `AbortController`.

```
🟢 DADOS AO VIVO   → backend respondeu com status 200
🔴 DADOS SIMULADOS → timeout, erro de rede ou status != 200
```

### Responsividade
Layout completamente adaptado para mobile, tablet e desktop. Navbar com menu hambúrguer animado em mobile. Mapa estelar redimensionado via `ResizeObserver`. Sidebar do mapa vira seções empilhadas em telas pequenas.

---

## Design System

Variáveis CSS centralizadas em `src/styles/global.css`:

```css
/* Cores semânticas */
--c-cyan:    #4F9EFF   /* destaques, links, Starlink       */
--c-green:   #3DFFA0   /* status positivo, janela ideal    */
--c-yellow:  #FFB830   /* status moderado, atenção         */
--c-red:     #FF5050   /* status crítico, satélites danger */
--c-orange:  #F77F00   /* perfil profissional, OneWeb      */
--c-white:   #E8F4FD   /* texto principal                  */
--c-muted:   rgba(232, 244, 253, 0.35)  /* texto secundário */

/* Tipografia */
--font-display: Syne        /* headings e scores numéricos */
--font-mono:    Space Mono  /* labels, badges, dados       */
--font-body:    Inter       /* texto corrido               */
```


---

## Integração com o Backend

O frontend consome a Flask API desenvolvida no projeto de Edge Computing via `src/services/api.js`. Todas as chamadas usam `Promise.allSettled` — falhas individuais não quebram a página.

| Endpoint | Dado consumido | Componente |
|---|---|---|
| `GET /score` | Score, fatores, satélites, sensores | Home, MapaCeu, Alertas |
| `GET /forecast` | Previsão horária de score | Home (forecast bar), Alertas |
| `GET /history?limit=N` | Série temporal do score | Alertas (gráfico histórico) |

Intervalo de atualização: **60 segundos** em todos os componentes.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + Vite |
| Estilo | Tailwind CSS + CSS Variables |
| Roteamento | React Router v6 |
| Gráficos | Canvas API nativa (mapa estelar) |
| Ícones | Lucide React |
| Geocoding | Nominatim / OpenStreetMap (sem API key) |
| Deploy | GitHub Pages (`gh-pages`) |
| Hospedagem backend | Azure VM + Nginx + DuckDNS |

---

## Estrutura do Repositório

```
skyaware/
├── public/
│   └── 404.html
├── src/
│   ├── components/
│   │   ├── LocalizacaoModal.jsx   ← GPS + busca manual de cidade
│   │   ├── Navbar.jsx             ← navegação + badge de status
│   │   ├── SeletorPerfil.jsx      ← seletor amador/fotógrafo/profissional
│   │   ├── StarfieldCanvas.jsx    ← background de estrelas animado
│   │   └── Footer.jsx
│   ├── data/
│   │   └── satellites.json        ← fallback estático quando API offline
│   ├── pages/
│   │   ├── Home.jsx               ← score ao vivo + forecast bar
│   │   ├── MapaCeu.jsx            ← mapa estelar canvas + bússola + filtros
│   │   ├── Alertas.jsx            ← alertas dinâmicos + previsão semanal
│   │   ├── ComoFunciona.jsx
│   │   ├── Impacto.jsx
│   │   ├── Problema.jsx
│   │   ├── Sobre.jsx
│   │   └── PaginaErro.jsx
│   ├── services/
│   │   └── api.js                 ← fetchScore / fetchForecast / fetchHistory
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx                    ← roteamento + estado global
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Como Rodar Localmente

```bash
# Clone o repositório
git clone https://github.com/lucx-yan/skyaware.git
cd skyaware

# Instale as dependências
npm install

# Rode em modo desenvolvimento
npm run dev
```

O frontend funciona completamente offline com os dados estáticos de fallback em `src/data/satellites.json`. Para dados ao vivo, a VM Azure do backend precisa estar ativa.

---

> **Nota sobre avaliação:** o site é hospedado estaticamente no GitHub Pages e **está sempre disponível**, independente do estado da VM. Quando o backend estiver offline, o site exibe os dados de fallback com o badge **DADOS SIMULADOS** — comportamento intencional e documentado.

---

*FIAP · Engenharia de Software · 1ESPA · Global Solution 2026 · Guardiões da Galáxia*
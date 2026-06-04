# 🌌 SkyAware

**Plataforma de inteligência orbital para astronomia cidadã.**

O SkyAware calcula o **Sky Observation Score** — um índice de 0 a 10 — em tempo real, cruzando dados de satélites via N2YO API com poluição luminosa (VIIRS/NASA) e condições atmosféricas (Open-Meteo). O sistema integra sensores físicos via ESP32 e entrega uma resposta simples para astrônomos, astrofotógrafos e entusiastas: **vale a pena observar agora?**

> FIAP — Engenharia de Software · 1ESPA · Global Solution 2026

---

## 🔗 Links

| | |
|---|---|
| **Repositório** | https://github.com/lucx-yan/skyaware |
| **Deploy** | https://lucx-yan.github.io/skyaware |

---

## 👥 Equipe

| Nome completo | RM | Disciplinas |
|---|---|---|
| Bruno Castilho | RM566799 | Front-End Design, Web Development |
| João Victor Melo | RM566640 | Edge Computing & IoT, Cálculos (DPS), Storytelling |
| Murilo Jeronimo | RM560641 | Front-End Design, Web Development, Edge Computing & IoT |
| Vinicius Kozonoe | RM567264 | Computational Thinking com Python, Cálculos (DPS), Storytelling |
| Yan Lucas Gonçalves | RM567046 | Front-End Design, Web Development, Software & TXD |

---

## 📋 Sobre o projeto

O SkyAware opera em quatro camadas interdependentes:

- **Orbital** — dados de satélites em tempo real via N2YO API, poluição luminosa via VIIRS/NASA (BORTLE_MAP) e cobertura de nuvens via Open-Meteo API
- **Analítica** — backend Python + Flask calcula o score híbrido completo (`Score = B × M_atm × M_lum × 10`) e expõe endpoints REST via HTTPS
- **Edge** — ESP32 coleta dados físicos locais (temperatura, umidade, pressão, luminosidade) via MQTT ao FIWARE Orion CB e executa comandos de LED
- **Interface** — dashboard React com 7 páginas, adaptação por perfil de usuário (Amador, Fotógrafo, Profissional) e mapa estelar interativo

### Fórmula híbrida

```
B = (f_orbital × 0.7) + (f_local × 0.3)
Score = B × M_atm × M_lum × 10

Portões de corte:
  nuvens ≥ 85%   → Score = 0.0  (céu inviável)
  poluição ≥ 90% → Score = 1.0  (nota mínima)
```

### Páginas

| Rota | Descrição |
|---|---|
| `/` | Home com Score Card ao vivo, previsão de 12h e previsão semanal |
| `/problema` | O problema da poluição orbital e linha do tempo |
| `/como-funciona` | Arquitetura do sistema e explicação do score |
| `/mapa-ceu` | Mapa estelar interativo com satélites em tempo real |
| `/alertas` | Alertas ativos e painel de simulação (perfil Profissional) |
| `/impacto` | Impacto da poluição orbital e comparativo com/sem SkyAware |
| `/sobre` | Equipe e stack tecnológico |

### Perfis de usuário

O sistema possui onboarding com seleção de perfil. Cada perfil adapta o conteúdo do site:

| Perfil | Foco |
|---|---|
| **Astrônomo Amador** | Score geral, previsão semanal, o que observar |
| **Astrofotógrafo** | Risco de rastros, seeing, melhor janela de exposição |
| **Astrônomo Profissional** | Fórmula híbrida completa, dados brutos das APIs, painel de simulação |

> Não há sistema de login ou senhas. O perfil é salvo localmente no `localStorage` do navegador.

---

## 🚀 Instalação e execução

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm v9 ou superior

### Passo a passo

**1. Clone o repositório:**
```bash
git clone https://github.com/lucx-yan/skyaware.git
cd skyaware
```

**2. Instale as dependências:**
```bash
npm install
```

**3. Execute em modo de desenvolvimento:**
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173/skyaware/`

**4. Para gerar a build de produção:**
```bash
npm run build
```

**5. Para fazer o deploy no GitHub Pages:**
```bash
npm run deploy
```

---

## 🛠️ Stack tecnológico

### Frontend
- React 19 + Vite 8
- Tailwind CSS v3
- React Router DOM
- Lucide React

### Backend (disciplina de Edge Computing)
- Python 3.x + Flask API
- Nginx + Let's Encrypt + DuckDNS
- FIWARE Orion Context Broker
- IoT Agent MQTT + STH Comet
- Docker Compose
- VM Azure Ubuntu 22.04

### Edge Computing
- ESP32 (simulado no Wokwi)
- Sensores: LDR/BH1750, DHT22, BMP180, OLED SSD1306
- Protocolo MQTT (Eclipse Mosquitto)

### APIs e fontes de dados
- [N2YO API](https://www.n2yo.com/api/) — posições orbitais em tempo real
- [Open-Meteo](https://open-meteo.com/) — cobertura de nuvens
- [VIIRS/NASA](https://www.nasa.gov/mission_pages/NPP/main/index.html) — poluição luminosa (BORTLE_MAP)
- [Space-Track.org](https://www.space-track.org/) — dados complementares

### Tipografia
- Cormorant Garamond (títulos)
- Inter (corpo)
- Space Mono (dados e código)

---

## 📁 Estrutura do projeto

```
skyaware/
├── public/
│   └── 404.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── StarfieldCanvas.jsx
│   │   └── SeletorPerfil.jsx
│   ├── data/
│   │   └── satellites.json
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Problema.jsx
│   │   ├── ComoFunciona.jsx
│   │   ├── MapaCeu.jsx
│   │   ├── Alertas.jsx
│   │   ├── Impacto.jsx
│   │   ├── Sobre.jsx
│   │   └── PaginaErro.jsx
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 📄 Licença

Projeto acadêmico desenvolvido para a Global Solution 2026 — FIAP.
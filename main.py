"""
=========================================
PROJETO SkyAware
Análise Orbital com SGP4

- SGP4 (sgp4.api) para propagação orbital
- Sky Observation Score (lógica híbrida)
- Projeção de janelas de 12h (UC02)
- Fatores M_atm e M_lum (MODIS/VIIRS mock)
- Fator Orbital e Fator Local simulados
- Publicação do score em JSON (para React)
- Relatório TXT ordenado por impacto
- Menu interativo de navegação

Integrantes
- Bruno Santos Castilho, 566799
- João Victor Melo Santos, 566640
- Murilo Jeronimo Ferreira Nunes,560641
- Vinicius Kozonoe Guaglini, 564264
- Yan Lucas Gonçalves da Silva, 567046
=========================================
"""

# =========================================
# IMPORTAÇÕES
# =========================================

import os
import json
import random
import requests
from math import degrees, atan2, sqrt, asin
from datetime import datetime, timezone, timedelta
from sgp4.api import Satrec, jday


# =========================================
# CONSTANTES
# =========================================

# Arquivo de entrada com dados TLE (fallback local)
ARQUIVO_TLE = "tles.txt"

# Arquivo de relatório textual
ARQUIVO_RELATORIO = "relatorio.txt"

# Arquivo JSON publicado para o React/FIWARE
ARQUIVO_JSON = "SkyAware_score.json"

# =========================================
# CONFIGURAÇÃO N2YO API
# =========================================

# Chave de API do N2YO — obtenha em n2yo.com/api
# Substitua pela sua chave antes de rodar
N2YO_API_KEY = "Z7D9D5-TLDZB3-XELCS9-5RJB"

# URL base da API N2YO
N2YO_BASE_URL = "https://api.n2yo.com/rest/v1/satellite"

# Lista de NORAD IDs monitorados pelo SkyAware
# Apenas satélites Starlink — principal fonte
# de poluição luminosa orbital identificada
# no documento do projeto
N2YO_NORAD_IDS = [
    (44713,  "STARLINK-1007"),
    (47123,  "STARLINK-2030"),
    (52000,  "STARLINK-3500"),
    (53000,  "STARLINK-4000"),
    (44914,  "STARLINK-1113"),
    (45044,  "STARLINK-1204"),
    (48888,  "STARLINK-2713"),
    (53239,  "STARLINK-4041"),
    (55765,  "STARLINK-5523"),
]

# Limite de período para classificar LEO (min)
LIMITE_LEO = 128

# Portões de corte absoluto (documento p.6)
CORTE_NUVENS = 0.85     # M_atm <= 0.15 → score 0.0
CORTE_POLUICAO = 0.90   # M_lum <= 0.10 → score 1.0

# Pesos da Base Ponderada (documento p.6)
PESO_ORBITAL = 0.7
PESO_LOCAL = 0.3

# Limiares de score para classificação visual
SCORE_IDEAL = 7.0       # verde — janela ideal
SCORE_MODERADO = 4.0    # amarelo — moderado
# abaixo de 4.0          → vermelho — interferência

# Janela de projeção em horas (UC02)
HORAS_PROJECAO = 12

# Granularidade da projeção em minutos
GRANULARIDADE_MIN = 30

# Localização padrão do observador (usada se
# o usuário não informar uma cidade)
LAT_PADRAO = -23.55   # São Paulo, SP
LON_PADRAO = -46.63
CIDADE_PADRAO = "São Paulo, SP"


# =========================================
# FUNÇÃO: LER ARQUIVO TLE
# =========================================

def ler_arquivo(nome_arquivo):

    """
    Lê o arquivo TXT com blocos TLE e
    retorna lista de linhas sem vazias.

    Usado como fallback quando a API N2YO
    está indisponível ou sem chave válida.

    Parâmetros:
        nome_arquivo (str): caminho do arquivo

    Retorna:
        list: linhas limpas ou lista vazia
    """

    try:

        with open(nome_arquivo, "r", encoding="utf-8") as arquivo:
            linhas = arquivo.readlines()

        linhas = [l.strip() for l in linhas if l.strip()]

        print(f"\nArquivo carregado: {len(linhas)} linhas.")

        return linhas

    except FileNotFoundError:
        print(f"\nERRO: '{nome_arquivo}' não encontrado.")
        print("Coloque o arquivo tles.txt na mesma pasta do script.")
        return []

    except PermissionError:
        print(f"\nERRO: Sem permissão para ler '{nome_arquivo}'.")
        return []

    except UnicodeDecodeError:
        print(f"\nERRO: Encoding inválido em '{nome_arquivo}'. Use UTF-8.")
        return []


# =========================================
# FUNÇÃO: BUSCAR TLE INDIVIDUAL — N2YO API
# =========================================

def buscar_tle_n2yo(norad_id, nome):

    """
    Consulta a API N2YO para obter o TLE
    atualizado de um satélite específico,
    identificado pelo seu NORAD ID.

    Endpoint utilizado:
        GET /tle/{norad_id}&apiKey={chave}

    O N2YO não bloqueia IPs de cloud
    providers (Azure, AWS, GCP), sendo
    a alternativa ao CelesTrak para
    ambientes de produção em nuvem.

    Parâmetros:
        norad_id (int): ID NORAD do satélite
        nome     (str): nome para exibição

    Retorna:
        tuple: (nome, linha1, linha2)
        ou None se falhar
    """

    try:

        url = f"{N2YO_BASE_URL}/tle/{norad_id}&apiKey={N2YO_API_KEY}"
        resposta = requests.get(url, timeout=10)

        if resposta.status_code != 200:
            print(f"  AVISO N2YO [{nome}]: status {resposta.status_code}")
            return None

        dados = resposta.json()

        # N2YO retorna o TLE como string única
        # com nome, linha1 e linha2 separados por \r\n
        tle_raw = dados.get("tle", "")

        if not tle_raw:
            print(f"  AVISO N2YO [{nome}]: TLE vazio na resposta.")
            return None

        partes = [p.strip() for p in tle_raw.split("\r\n") if p.strip()]

        if len(partes) < 2:
            print(f"  AVISO N2YO [{nome}]: formato de TLE inesperado.")
            return None

        # N2YO retorna só linha1 e linha2 (sem nome)
        linha1 = partes[0]
        linha2 = partes[1]

        return (nome, linha1, linha2)

    except requests.exceptions.ConnectionError:
        print(f"  AVISO N2YO [{nome}]: sem conexão.")
        return None

    except requests.exceptions.Timeout:
        print(f"  AVISO N2YO [{nome}]: timeout.")
        return None

    except Exception as e:
        print(f"  AVISO N2YO [{nome}]: erro inesperado — {e}")
        return None


# =========================================
# FUNÇÃO: CARREGAR SATÉLITES — N2YO + LOCAL
# =========================================

def carregar_satelites_n2yo():

    """
    Busca os TLEs de todos os satélites
    monitorados via API N2YO, um por vez,
    usando a lista N2YO_NORAD_IDS.

    Se a chave não estiver configurada ou
    a API falhar para todos os satélites,
    usa o arquivo tles.txt como fallback.

    Estratégia:
        1. Verifica se a chave está definida
        2. Tenta buscar cada satélite no N2YO
        3. Monta lista de blocos (nome, l1, l2)
        4. Fallback para tles.txt se necessário

    Retorna:
        list: blocos TLE prontos para
        processar_satelites_blocos()
    """

    # Verifica se a chave foi configurada
    if N2YO_API_KEY == "SUA_CHAVE_AQUI":
        print("\nAVISO: Chave N2YO não configurada.")
        print("Defina N2YO_API_KEY no script ou use o tles.txt local.\n")
        return []

    print(f"\nBuscando {len(N2YO_NORAD_IDS)} satélites via N2YO API...")
    print("-" * 40)

    blocos = []

    for norad_id, nome in N2YO_NORAD_IDS:

        print(f"  N2YO → {nome} (NORAD {norad_id})")
        bloco = buscar_tle_n2yo(norad_id, nome)

        if bloco is not None:
            blocos.append(bloco)

    print("-" * 40)
    print(f"N2YO: {len(blocos)} de {len(N2YO_NORAD_IDS)} satélites obtidos.\n")

    return blocos


# =========================================
# FUNÇÃO: CALCULAR PERÍODO ORBITAL
# =========================================

def calcular_periodo(mean_motion):

    """
    Calcula o período orbital em minutos.

    Fórmula: período = 1440 / mean_motion
    (1440 = minutos em um dia)

    Parâmetros:
        mean_motion (float): revoluções/dia

    Retorna:
        float: período em minutos
    """

    if mean_motion <= 0:
        raise ValueError("mean_motion deve ser positivo.")

    return 1440 / mean_motion


# =========================================
# FUNÇÃO: VERIFICAR LEO
# =========================================

def verificar_leo(periodo):

    """
    Verifica se o satélite está em LEO.

    Parâmetros:
        periodo (float): período em minutos

    Retorna:
        bool: True se LEO, False caso contrário
    """

    return periodo < LIMITE_LEO


# =========================================
# FUNÇÃO: CALCULAR POSIÇÃO VIA SGP4
# =========================================

def calcular_posicao_sgp4(linha1, linha2):

    """
    Usa a biblioteca SGP4 (padrão NASA/ESA)
    para propagar a órbita e calcular a
    posição atual do satélite.

    SGP4 é o modelo de referência usado por
    agências militares e científicas para
    rastreamento orbital com erro < 1 km.

    Parâmetros:
        linha1 (str): primeira linha TLE
        linha2 (str): segunda linha TLE

    Retorna:
        tuple: (latitude, longitude, altitude_km)
        ou (None, None, None) se erro
    """

    try:

        # Cria objeto orbital com SGP4
        sat = Satrec.twoline2rv(linha1, linha2)

        # Obtém tempo atual em UTC
        agora = datetime.now(timezone.utc)

        # Converte para Julian Date (exigido pelo SGP4)
        jd, fr = jday(
            agora.year, agora.month, agora.day,
            agora.hour, agora.minute, agora.second
        )

        # Propaga a órbita — retorna vetor de posição
        # r em km no referencial ECI (Earth-Centered Inertial)
        erro, r, v = sat.sgp4(jd, fr)

        if erro != 0:
            return None, None, None

        # Converte ECI (x, y, z) para lat/lon/alt
        x, y, z = r

        # Raio do vetor de posição
        raio = sqrt(x**2 + y**2 + z**2)

        # Altitude = raio - raio médio da Terra
        altitude = raio - 6371.0

        # Latitude geocêntrica
        latitude = degrees(asin(z / raio))

        # Longitude (aproximação sem correção GMST)
        longitude = degrees(atan2(y, x))

        return round(latitude, 2), round(longitude, 2), round(altitude, 1)

    except Exception as e:
        print(f"  AVISO: Erro SGP4: {e}")
        return None, None, None


# =========================================
# FUNÇÃO: BUSCAR DADOS — OPEN-METEO API
# =========================================

def buscar_dados_openmeteo(lat, lon):

    """
    Consulta a API Open-Meteo para obter
    dados meteorológicos reais da localização
    informada.

    Open-Meteo é gratuita, sem chave de API,
    e retorna dados de modelos como ECMWF,
    NOAA e DWD com resolução de 1-11 km.

    Variáveis consultadas:
        cloudcover          — cobertura de
                              nuvens em % (0-100)
        relative_humidity_2m — umidade relativa
                              em % a 2m do solo
        surface_pressure    — pressão atmosférica
                              em hPa ao nível do solo

    Parâmetros:
        lat (float): latitude do observador
        lon (float): longitude do observador

    Retorna:
        dict: dados meteorológicos reais
        ou None se a API falhar
    """

    try:

        url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={lat}"
            f"&longitude={lon}"
            f"&current=cloudcover,relative_humidity_2m,surface_pressure"
        )

        resposta = requests.get(url, timeout=10)

        if resposta.status_code != 200:
            print(f"  AVISO: Open-Meteo retornou status {resposta.status_code}.")
            return None

        dados = resposta.json()["current"]

        print(f"  Open-Meteo: nuvens={dados['cloudcover']}% | umidade={dados['relative_humidity_2m']}% | pressão={dados['surface_pressure']} hPa")

        return dados

    except requests.exceptions.ConnectionError:
        print("  AVISO: Sem conexão com a internet. Usando dados estimados.")
        return None

    except requests.exceptions.Timeout:
        print("  AVISO: Open-Meteo não respondeu (timeout). Usando dados estimados.")
        return None

    except Exception as e:
        print(f"  AVISO: Erro ao consultar Open-Meteo: {e}")
        return None


# =========================================
# FUNÇÃO: BUSCAR COORDENADAS DA CIDADE
# =========================================

def buscar_coordenadas(nome_cidade):

    """
    Converte o nome de uma cidade em
    coordenadas geográficas (lat, lon)
    usando a API de Geocoding da Open-Meteo.

    A API é gratuita, sem chave, e suporta
    cidades do mundo inteiro em português.

    Exemplos de busca válida:
        "Curitiba"
        "Rio de Janeiro"
        "Lisboa"
        "Tokyo"

    Parâmetros:
        nome_cidade (str): nome da cidade

    Retorna:
        tuple: (latitude, longitude, nome_completo)
        ou (None, None, None) se não encontrar
    """

    try:

        # Substitui espaços por + para a URL
        cidade_url = nome_cidade.strip().replace(" ", "+")

        url = (
            f"https://geocoding-api.open-meteo.com/v1/search"
            f"?name={cidade_url}"
            f"&count=1"
            f"&language=pt"
            f"&format=json"
        )

        resposta = requests.get(url, timeout=10)

        if resposta.status_code != 200:
            print(f"  AVISO: Geocoding retornou status {resposta.status_code}.")
            return None, None, None

        dados = resposta.json()

        # Verifica se encontrou resultados
        if "results" not in dados or not dados["results"]:
            print(f"  AVISO: Cidade '{nome_cidade}' não encontrada.")
            return None, None, None

        resultado = dados["results"][0]

        lat = resultado["latitude"]
        lon = resultado["longitude"]
        nome_completo = resultado.get("name", nome_cidade)
        pais = resultado.get("country", "")
        nome_exibicao = f"{nome_completo}, {pais}" if pais else nome_completo

        return lat, lon, nome_exibicao

    except requests.exceptions.ConnectionError:
        print("  AVISO: Sem conexão. Usando localização padrão.")
        return None, None, None

    except requests.exceptions.Timeout:
        print("  AVISO: Geocoding não respondeu (timeout). Usando localização padrão.")
        return None, None, None

    except Exception as e:
        print(f"  AVISO: Erro no geocoding: {e}")
        return None, None, None


# =========================================
# FUNÇÃO: CONFIGURAR LOCALIZAÇÃO
# =========================================

def configurar_localizacao():

    """
    Solicita ao usuário o nome de uma cidade
    e converte para coordenadas via geocoding.

    Se o usuário não digitar nada ou a cidade
    não for encontrada, usa a localização
    padrão definida nas constantes.

    Retorna:
        tuple: (latitude, longitude, nome_cidade)
    """

    print("\n" + "-" * 45)
    print("  LOCALIZAÇÃO DO OBSERVADOR")
    print("-" * 45)
    print(f"  Padrão: {CIDADE_PADRAO}")
    print("  (pressione Enter para usar o padrão)")

    cidade = input("\n  Digite o nome da cidade: ").strip()

    if not cidade:
        print(f"  Usando localização padrão: {CIDADE_PADRAO}")
        return LAT_PADRAO, LON_PADRAO, CIDADE_PADRAO

    print(f"\n  Buscando coordenadas de '{cidade}'...")
    lat, lon, nome_completo = buscar_coordenadas(cidade)

    if lat is None:
        print(f"  Usando localização padrão: {CIDADE_PADRAO}")
        return LAT_PADRAO, LON_PADRAO, CIDADE_PADRAO

    print(f"  Encontrado: {nome_completo} ({lat}, {lon})")
    return lat, lon, nome_completo


# =========================================
# FUNÇÃO: CALCULAR M_ATM — OPEN-METEO
# =========================================

def calcular_m_atm(dados_meteo):

    """
    Calcula o multiplicador atmosférico
    M_atm a partir da cobertura de nuvens
    retornada pela Open-Meteo.

    Conversão:
        M_atm = 1.0 - (cloudcover / 100)

        cloudcover = 0%   → M_atm = 1.0 (céu limpo)
        cloudcover = 50%  → M_atm = 0.5 (parcialmente nublado)
        cloudcover = 100% → M_atm = 0.0 (totalmente nublado)

    Se dados_meteo for None (API indisponível),
    usa fallback com valor estimado conservador.

    Parâmetros:
        dados_meteo (dict | None): resposta da API

    Retorna:
        float: M_atm entre 0.0 e 1.0
    """

    if dados_meteo is None:
        # Fallback conservador — assume céu parcialmente nublado
        m_atm = round(random.uniform(0.4, 0.8), 2)
        print(f"  Fallback M_atm: {m_atm} (Open-Meteo indisponível)")
        return m_atm

    cobertura = dados_meteo["cloudcover"]
    m_atm = round(1.0 - (cobertura / 100), 2)

    return m_atm


# =========================================
# FUNÇÃO: OBTER FATOR LOCAL — OPEN-METEO
# =========================================

def obter_fator_local(dados_meteo):

    """
    Monta o dicionário de sensores locais
    combinando dados reais da Open-Meteo
    com estimativa de luminosidade.

    A Open-Meteo fornece umidade e pressão
    reais. A luminosidade local (poluição
    luminosa hiperlocal) em produção viria
    do sensor LDR/BH1750 do ESP32 via MQTT.
    Aqui é estimada de forma conservadora.

    Parâmetros:
        dados_meteo (dict | None): resposta da Open-Meteo

    Retorna:
        dict: {
            "luminosidade_lux": float,
            "umidade_pct":      float,
            "pressao_hpa":      float,
            "fonte":            str
        }
    """

    if dados_meteo is not None:

        return {
            "luminosidade_lux": round(random.uniform(0.0, 3.0), 2),
            "umidade_pct": float(dados_meteo["relative_humidity_2m"]),
            "pressao_hpa": float(dados_meteo["surface_pressure"]),
            "fonte": "Open-Meteo (real)"
        }

    # Fallback — todos os valores estimados
    return {
        "luminosidade_lux": round(random.uniform(0.0, 5.0), 2),
        "umidade_pct": round(random.uniform(30.0, 95.0), 1),
        "pressao_hpa": round(random.uniform(980.0, 1020.0), 1),
        "fonte": "estimado (fallback)"
    }


# =========================================
# FUNÇÃO: CALCULAR FATOR ORBITAL
# =========================================

def calcular_fator_orbital(satelites_leo):

    """
    Calcula o Fator Orbital com base na
    densidade de satélites LEO visíveis.

    Quanto mais satélites em LEO, menor
    o fator orbital (mais interferência).

    Parâmetros:
        satelites_leo (int): qtd em LEO

    Retorna:
        float: fator entre 0.0 e 10.0
    """

    # Quanto mais satélites, menor o fator
    # Referência: 0 sat = 10.0, 20+ sat = 1.0
    fator = max(1.0, 10.0 - (satelites_leo * 0.45))

    return round(fator, 2)


# =========================================
# FUNÇÃO: CALCULAR FATOR LOCAL
# =========================================

def calcular_fator_local(sensores):

    """
    Calcula o Fator Local a partir das
    leituras dos sensores do ESP32.

    Penalidades aplicadas:
    - Umidade > 80% → reduz fator em 10%
    - Luminosidade > 3 lux → reduz em 15%

    Parâmetros:
        sensores (dict): leituras do ESP32

    Retorna:
        float: fator entre 0.0 e 10.0
    """

    fator = 10.0

    if sensores["umidade_pct"] > 80:
        fator *= 0.90

    if sensores["luminosidade_lux"] > 3.0:
        fator *= 0.85

    return round(fator, 2)


# =========================================
# FUNÇÃO: CALCULAR SKY OBSERVATION SCORE
# =========================================

def calcular_score(fator_orbital, fator_local, m_atm, m_lum):

    """
    Calcula o Sky Observation Score usando
    a lógica híbrida definida no documento:

    B = (Fator_Orbital x 0.7) + (Fator_Local x 0.3)
    Score = B x M_atm x M_lum

    Portões de corte absoluto:
    - M_atm <= 0.15 (nuvens >= 85%) → 0.0
    - M_lum <= 0.10 (poluição >= 90%) → 1.0

    Parâmetros:
        fator_orbital (float): 0.0 a 10.0
        fator_local   (float): 0.0 a 10.0
        m_atm         (float): 0.0 a 1.0
        m_lum         (float): 0.0 a 1.0

    Retorna:
        float: score de 0.0 a 10.0
    """

    # Portão de corte absoluto — nuvens
    if m_atm <= (1.0 - CORTE_NUVENS):
        return 0.0

    # Portão de corte absoluto — poluição
    if m_lum <= (1.0 - CORTE_POLUICAO):
        return 1.0

    # Base ponderada
    b = (fator_orbital * PESO_ORBITAL) + (fator_local * PESO_LOCAL)

    # Score final com multiplicadores restritivos
    score = b * m_atm * m_lum

    # Garante intervalo 0.0 a 10.0
    return round(min(max(score, 0.0), 10.0), 2)


# =========================================
# FUNÇÃO: CLASSIFICAR SCORE
# =========================================

def classificar_score(score):

    """
    Classifica o score em categoria visual.

    >= 7.0 → IDEAL (verde)
    4.0 a 6.9 → MODERADO (amarelo)
    < 4.0 → INTERFERÊNCIA (vermelho)

    Parâmetros:
        score (float): Sky Observation Score

    Retorna:
        str: classificação visual
    """

    if score >= SCORE_IDEAL:
        return "IDEAL"

    elif score >= SCORE_MODERADO:
        return "MODERADO"

    else:
        return "INTERFERÊNCIA"


# =========================================
# FUNÇÃO: CLASSIFICAR IMPACTO DO SATÉLITE
# =========================================

def classificar_impacto(inclinacao, leo):

    """
    Classifica o nível de impacto visual
    de um satélite individual.

    Parâmetros:
        inclinacao (float): graus
        leo (bool): está em LEO?

    Retorna:
        str: "ALTO", "MÉDIO", "BAIXO", "NENHUM"
    """

    if not leo:
        return "NENHUM"

    if 45 <= inclinacao <= 75:
        return "ALTO"

    elif inclinacao > 75 or 30 <= inclinacao < 45:
        return "MÉDIO"

    else:
        return "BAIXO"


# =========================================
# FUNÇÃO: PROJEÇÃO DE 12 HORAS (UC02)
# =========================================

def projetar_janelas(satelites):

    """
    Projeta o Sky Observation Score para
    as próximas 12 horas com granularidade
    de 30 minutos, conforme UC02.

    Para cada intervalo calcula um score
    estimado variando o fator orbital
    conforme satélites passam sobre o ponto.

    Parâmetros:
        satelites (list): lista de dicionários

    Retorna:
        list: janelas com horário e score
    """

    janelas = []
    agora = datetime.now(timezone.utc)
    satelites_leo = [s for s in satelites if s["leo"]]

    for i in range(0, HORAS_PROJECAO * 60, GRANULARIDADE_MIN):

        horario = agora + timedelta(minutes=i)

        # Simula variação de satélites visíveis
        # Em produção: SGP4 propagado para cada instante
        variacao = len(satelites_leo) + random.randint(-2, 2)
        variacao = max(0, variacao)

        f_orbital = calcular_fator_orbital(variacao)
        f_local = round(random.uniform(7.0, 10.0), 2)
        m_atm = round(random.uniform(0.3, 1.0), 2)
        m_lum = round(random.uniform(0.2, 0.9), 2)

        score = calcular_score(f_orbital, f_local, m_atm, m_lum)
        classificacao = classificar_score(score)

        janelas.append({
            "horario": horario.strftime("%H:%M"),
            "score": score,
            "classificacao": classificacao,
            "sat_visiveis": variacao
        })

    return janelas


# =========================================
# FUNÇÃO: PROCESSAR SATÉLITES
# =========================================

def processar_satelites(linhas):

    """
    Processa todos os blocos TLE do arquivo.

    Converte as linhas brutas do arquivo
    tles.txt em blocos (nome, linha1, linha2)
    e delega para processar_satelites_blocos().

    Usado quando a fonte é o arquivo local.

    Parâmetros:
        linhas (list): linhas do arquivo TLE

    Retorna:
        list: dicionários com dados de cada satélite
    """

    blocos = []

    for i in range(0, len(linhas) - 2, 3):
        blocos.append((linhas[i], linhas[i + 1], linhas[i + 2]))

    return processar_satelites_blocos(blocos)


# =========================================
# FUNÇÃO: PROCESSAR BLOCOS TLE
# =========================================

def processar_satelites_blocos(blocos):

    """
    Processa uma lista de blocos TLE no
    formato (nome, linha1, linha2).

    Usada tanto pelo fluxo N2YO quanto
    pelo fluxo de arquivo local, evitando
    duplicação de lógica entre as fontes.

    Para cada bloco:
    - valida o formato TLE
    - extrai inclinação e mean_motion
      por posição fixa (padrão NORAD)
    - calcula período e classifica LEO
    - propaga posição atual via SGP4
    - classifica impacto visual

    Parâmetros:
        blocos (list): lista de tuplas
                       (nome, linha1, linha2)

    Retorna:
        list: dicionários com dados de cada satélite
    """

    satelites = []
    erros = 0

    print(f"Satélites encontrados: {len(blocos)}")
    print("Propagando órbitas via SGP4...\n" + "-" * 40)

    for nome, linha1, linha2 in blocos:

        try:

            if not linha1.startswith("1 ") or not linha2.startswith("2 "):
                raise ValueError("Formato TLE inválido.")

            inclinacao = float(linha2[8:16].strip())
            mean_motion = float(linha2[52:63].strip())

            periodo = calcular_periodo(mean_motion)
            leo = verificar_leo(periodo)
            impacto = classificar_impacto(inclinacao, leo)

            print(f"  SGP4 → {nome}")
            lat, lon, alt = calcular_posicao_sgp4(linha1, linha2)

            satelite = {
                "nome": nome,
                "inclinacao": inclinacao,
                "periodo": round(periodo, 2),
                "leo": leo,
                "impacto": impacto,
                "latitude": lat,
                "longitude": lon,
                "altitude": alt
            }

            satelites.append(satelite)

        except ValueError as e:
            print(f"  AVISO: TLE inválido [{nome}]: {e}")
            erros += 1

        except Exception as e:
            print(f"  AVISO: Erro inesperado [{nome}]: {e}")
            erros += 1

    print("-" * 40)
    print(f"Válidos: {len(satelites)} | Erros: {erros}\n")

    return satelites


# =========================================
# FUNÇÃO: PUBLICAR JSON (para React/FIWARE)
# =========================================

def publicar_json(satelites, score_atual, janelas, sensores, m_atm, m_lum):

    """
    Gera o arquivo JSON com todos os dados
    calculados — simulando a publicação no
    FIWARE Orion Context Broker que o React
    consome para o dashboard.

    Parâmetros:
        satelites  (list):  lista de satélites
        score_atual (float): score calculado
        janelas    (list):  projeção 12h
        sensores   (dict):  leituras ESP32
        m_atm      (float): multiplicador atmosférico
        m_lum      (float): multiplicador luminoso
    """

    payload = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "sky_observation_score": score_atual,
        "classificacao": classificar_score(score_atual),
        "fatores": {
            "M_atm": m_atm,
            "M_lum": m_lum,
            "sensores_esp32": sensores
        },
        "satelites": satelites,
        "janelas_12h": janelas
    }

    try:

        with open(ARQUIVO_JSON, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)

        print(f"JSON publicado: '{ARQUIVO_JSON}'")

    except OSError as e:
        print(f"ERRO ao gerar JSON: {e}")


# =========================================
# FUNÇÃO: GERAR RELATÓRIO TXT
# =========================================

def gerar_relatorio(satelites, score_atual, janelas, m_atm, m_lum):

    """
    Gera relatório TXT com score, fatores,
    satélites ordenados por impacto e
    projeção das janelas de 12h.

    Parâmetros:
        satelites   (list):  lista de satélites
        score_atual (float): Sky Observation Score
        janelas     (list):  projeção 12h
        m_atm       (float): multiplicador atmosférico
        m_lum       (float): multiplicador luminoso
    """

    try:

        ordem = {"ALTO": 0, "MÉDIO": 1, "BAIXO": 2, "NENHUM": 3}
        ordenados = sorted(satelites, key=lambda s: ordem.get(s["impacto"], 4))
        data = datetime.now().strftime("%d/%m/%Y às %H:%M:%S")

        with open(ARQUIVO_RELATORIO, "w", encoding="utf-8") as f:

            f.write("=" * 60 + "\n")
            f.write(" SKYAWARE — RELATÓRIO DE ANÁLISE ORBITAL\n")
            f.write("  Global Solution 2026 | FIAP\n")
            f.write("=" * 60 + "\n")
            f.write(f"  Gerado em       : {data}\n")
            f.write(f"  Satélites       : {len(satelites)}\n\n")

            f.write("-" * 60 + "\n")
            f.write("  SKY OBSERVATION SCORE\n")
            f.write("-" * 60 + "\n")
            f.write(f"  Score atual     : {score_atual:.2f} / 10.0\n")
            f.write(f"  Classificação   : {classificar_score(score_atual)}\n")
            f.write(f"  M_atm (MODIS)   : {m_atm} (nebulosidade)\n")
            f.write(f"  M_lum (VIIRS)   : {m_lum} (poluição luminosa)\n")
            f.write(f"  Fórmula         : B x M_atm x M_lum\n\n")

            f.write("-" * 60 + "\n")
            f.write("  SATÉLITES ORDENADOS POR IMPACTO VISUAL\n")
            f.write("-" * 60 + "\n")

            for s in ordenados:

                orbita = "LEO" if s["leo"] else "MEO/GEO/HEO"
                alt_str = f"{s['altitude']:.1f} km" if s["altitude"] else "N/D"
                lat_str = f"{s['latitude']:.2f}°" if s["latitude"] else "N/D"
                lon_str = f"{s['longitude']:.2f}°" if s["longitude"] else "N/D"

                f.write(f"NOME      : {s['nome']}\n")
                f.write(f"INCLINAÇÃO: {s['inclinacao']:.2f}° | PERÍODO: {s['periodo']} min | ÓRBITA: {orbita}\n")
                f.write(f"POSIÇÃO   : lat {lat_str} | lon {lon_str} | alt {alt_str}\n")
                f.write(f"IMPACTO   : {s['impacto']}\n")
                f.write("-" * 60 + "\n")

            f.write("\n")
            f.write("-" * 60 + "\n")
            f.write("  PROJEÇÃO DE JANELAS — PRÓXIMAS 12 HORAS (UC02)\n")
            f.write("-" * 60 + "\n")
            f.write(f"  {'HORÁRIO':<10}{'SCORE':<10}{'STATUS':<16}{'SAT. VISÍVEIS'}\n")
            f.write("-" * 60 + "\n")

            for j in janelas:
                f.write(f"  {j['horario']:<10}{j['score']:<10}{j['classificacao']:<16}{j['sat_visiveis']}\n")

            f.write("\n" + "=" * 60 + "\n")
            f.write(" SkyAware — Protegendo a escuridão\n")
            f.write("  que nos conecta ao universo.\n")
            f.write("=" * 60 + "\n")

        print(f"Relatório salvo: '{ARQUIVO_RELATORIO}'")

    except PermissionError:
        print(f"ERRO: Sem permissão para criar '{ARQUIVO_RELATORIO}'.")

    except OSError as e:
        print(f"ERRO ao gerar relatório: {e}")


# =========================================
# FUNÇÃO: LISTAR SATÉLITES
# =========================================

def listar_todos(satelites):

    """
    Exibe tabela numerada com todos os
    satélites carregados.

    Parâmetros:
        satelites (list): lista de dicionários
    """

    print("\n" + "=" * 60)
    print("  SATÉLITES DISPONÍVEIS")
    print("=" * 60)
    print(f"  {'#':<4}{'NOME':<25}{'ÓRBITA':<8}{'ALT(km)':<10}{'IMPACTO'}")
    print("-" * 60)

    for i, s in enumerate(satelites, start=1):
        orbita = "LEO" if s["leo"] else "MEO+"
        alt = f"{s['altitude']:.0f}" if s["altitude"] else "N/D"
        print(f"  {i:<4}{s['nome']:<25}{orbita:<8}{alt:<10}{s['impacto']}")

    print("=" * 60)
    print(f"  Total: {len(satelites)} satélite(s)")


# =========================================
# FUNÇÃO: EXIBIR DETALHES DO SATÉLITE
# =========================================

def exibir_detalhes(satelite):

    """
    Exibe dados completos de um satélite,
    incluindo posição calculada via SGP4.

    Parâmetros:
        satelite (dict): dados do satélite
    """

    orbita = "LEO" if satelite["leo"] else "MEO/GEO/HEO"
    lat_str = f"{satelite['latitude']:.2f}°" if satelite["latitude"] else "N/D"
    lon_str = f"{satelite['longitude']:.2f}°" if satelite["longitude"] else "N/D"
    alt_str = f"{satelite['altitude']:.1f} km" if satelite["altitude"] else "N/D"

    print("\n" + "=" * 55)
    print(f"  {satelite['nome']}")
    print("=" * 55)
    print(f"  Inclinação orbital : {satelite['inclinacao']:.2f}°")
    print(f"  Período orbital    : {satelite['periodo']} min")
    print(f"  Tipo de órbita     : {orbita}")
    print(f"  Impacto visual     : {satelite['impacto']}")
    print(f"  Latitude (SGP4)    : {lat_str}")
    print(f"  Longitude (SGP4)   : {lon_str}")
    print(f"  Altitude (SGP4)    : {alt_str}")
    print("=" * 55)

    explicacoes = {
        "ALTO":   "  ⚠  Muito visível — interfere fortemente na observação.",
        "MÉDIO":  "  ~  Visível em trajetórias menos centrais.",
        "BAIXO":  "  ✓  Raramente interfere — inclinação baixa.",
        "NENHUM": "  ✓  Fora de LEO — invisível a olho nu."
    }

    print(explicacoes.get(satelite["impacto"], ""))


# =========================================
# FUNÇÃO: MENU INTERATIVO
# =========================================

def menu_navegacao(satelites, score_atual, janelas, sensores, m_atm, m_lum):

    """
    Menu interativo principal.

    Opções:
    1. Ver todos os satélites
    2. Selecionar por número
    3. Buscar por nome
    4. Ver satélites de ALTO impacto
    5. Ver projeção de 12h (UC02)
    6. Ver Sky Observation Score atual
    7. Gerar relatório TXT
    8. Publicar JSON (React/FIWARE)
    0. Sair

    Parâmetros:
        satelites   (list):  lista de satélites
        score_atual (float): score calculado
        janelas     (list):  projeção 12h
        sensores    (dict):  leituras ESP32
        m_atm       (float): multiplicador atmosférico
        m_lum       (float): multiplicador luminoso
    """

    while True:

        print("\n" + "=" * 45)
        print("  SKYAWARE — MENU PRINCIPAL")
        print("=" * 45)
        print("  1. Ver todos os satélites")
        print("  2. Selecionar por número")
        print("  3. Buscar por nome")
        print("  4. Ver só os de ALTO impacto")
        print("  5. Projeção de janelas — 12h (UC02)")
        print("  6. Sky Observation Score atual")
        print("  7. Gerar relatório TXT")
        print("  8. Publicar JSON (React/FIWARE)")
        print("  0. Sair")
        print("=" * 45)

        opcao = input("\n  Escolha uma opção: ").strip()

        match opcao:

            # ----------------------------------
            # OPÇÃO 1: Lista todos
            # ----------------------------------

            case "1":
                listar_todos(satelites)

            # ----------------------------------
            # OPÇÃO 2: Seleciona por número
            # ----------------------------------

            case "2":

                listar_todos(satelites)

                try:
                    numero = int(input("\n  Digite o número do satélite: "))

                    if 1 <= numero <= len(satelites):
                        exibir_detalhes(satelites[numero - 1])
                    else:
                        print(f"\n  Número inválido. Digite entre 1 e {len(satelites)}.")

                except ValueError:
                    print("\n  Digite apenas números.")

            # ----------------------------------
            # OPÇÃO 3: Busca por nome
            # ----------------------------------

            case "3":

                termo = input("\n  Digite parte do nome (ex: starlink, iss): ").strip().lower()

                if not termo:
                    print("\n  Nenhum termo digitado.")
                    continue

                encontrados = [s for s in satelites if termo in s["nome"].lower()]

                if not encontrados:
                    print(f"\n  Nenhum satélite encontrado com '{termo}'.")
                    print("  Dica: tente 'starlink', 'iss', 'hubble' ou 'gps'.")

                elif len(encontrados) == 1:
                    exibir_detalhes(encontrados[0])

                else:

                    print(f"\n  {len(encontrados)} resultado(s):\n")

                    for i, s in enumerate(encontrados, start=1):
                        print(f"  {i}. {s['nome']} — {s['impacto']}")

                    try:
                        escolha = int(input("\n  Escolha o número: "))

                        if 1 <= escolha <= len(encontrados):
                            exibir_detalhes(encontrados[escolha - 1])
                        else:
                            print("\n  Número fora do intervalo.")

                    except ValueError:
                        print("\n  Digite apenas números.")

            # ----------------------------------
            # OPÇÃO 4: Filtra alto impacto
            # ----------------------------------

            case "4":

                alto = [s for s in satelites if s["impacto"] == "ALTO"]

                if not alto:
                    print("\n  Nenhum satélite de ALTO impacto encontrado.")

                else:

                    print("\n  Satélites de ALTO impacto visual:\n")

                    for i, s in enumerate(alto, start=1):
                        alt_str = f"{s['altitude']:.0f} km" if s["altitude"] else "N/D"
                        print(f"  {i}. {s['nome']} — {alt_str} | Incl: {s['inclinacao']:.1f}°")

                    try:
                        escolha = int(input("\n  Ver detalhes (número) ou 0 para voltar: "))

                        if 1 <= escolha <= len(alto):
                            exibir_detalhes(alto[escolha - 1])

                    except ValueError:
                        pass

            # ----------------------------------
            # OPÇÃO 5: Projeção 12h (UC02)
            # ----------------------------------

            case "5":

                print("\n" + "=" * 60)
                print("  PROJEÇÃO DE JANELAS — PRÓXIMAS 12 HORAS")
                print("=" * 60)
                print(f"  {'HORÁRIO':<10}{'SCORE':<10}{'STATUS':<18}{'SAT. VISÍVEIS'}")
                print("-" * 60)

                for j in janelas:
                    print(f"  {j['horario']:<10}{j['score']:<10}{j['classificacao']:<18}{j['sat_visiveis']}")

                print("=" * 60)

                ideais = [j for j in janelas if j["classificacao"] == "IDEAL"]
                if ideais:
                    print(f"\n  Melhor janela: {ideais[0]['horario']} — Score {ideais[0]['score']}")
                else:
                    print("\n  Nenhuma janela ideal nas próximas 12h.")

            # ----------------------------------
            # OPÇÃO 6: Score atual
            # ----------------------------------

            case "6":

                classe = classificar_score(score_atual)

                print("\n" + "=" * 50)
                print("  SKY OBSERVATION SCORE ATUAL")
                print("=" * 50)
                print(f"  Score           : {score_atual:.2f} / 10.0")
                print(f"  Classificação   : {classe}")
                print(f"  M_atm (MODIS)   : {m_atm} (nebulosidade)")
                print(f"  M_lum (VIIRS)   : {m_lum} (poluição luminosa)")
                print(f"  Umidade ESP32   : {sensores['umidade_pct']}%")
                print(f"  Pressão ESP32   : {sensores['pressao_hpa']} hPa")
                print(f"  Luminosidade    : {sensores['luminosidade_lux']} lux")
                print("=" * 50)
                print(f"  Fórmula: B = (F_orbital x 0.7) + (F_local x 0.3)")
                print(f"           Score = B x {m_atm} x {m_lum}")

            # ----------------------------------
            # OPÇÃO 7: Relatório TXT
            # ----------------------------------

            case "7":
                gerar_relatorio(satelites, score_atual, janelas, m_atm, m_lum)

            # ----------------------------------
            # OPÇÃO 8: Publica JSON
            # ----------------------------------

            case "8":
                publicar_json(satelites, score_atual, janelas, sensores, m_atm, m_lum)

            # ----------------------------------
            # OPÇÃO 0: Sair
            # ----------------------------------

            case "0":
                print("\n  Encerrando SkyAware...")
                print("  Protegendo a escuridão que nos conecta ao universo.\n")
                break

            # ----------------------------------
            # OPÇÃO INVÁLIDA
            # ----------------------------------

            case _:
                print("\n  Opção inválida. Digite um número de 0 a 8.")


# =========================================
# FUNÇÃO PRINCIPAL
# =========================================

def main():

    """
    Ponto de entrada do SkyAware.

    Fluxo conforme documento:
    1. Lê arquivo TLE
    2. Processa satélites via SGP4
    3. Consulta Open-Meteo para dados reais
    de nuvens, umidade e pressão
    4. Calcula M_atm com dados reais
    5. Obtém fator local (Open-Meteo + estimativa)
    6. Calcula Sky Observation Score
    7. Projeta janelas de 12h (UC02)
    8. Inicia menu interativo
    """

    print("\n" + "=" * 45)
    print("  SKYAWARE — Proteção do Céu Noturno")
    print("  Global Solution 2026 | FIAP")
    print("=" * 45)

    # 1. Tenta carregar satélites via N2YO API
    #    Se a chave não estiver configurada ou
    #    a API falhar, usa o arquivo tles.txt
    print("\nFonte de dados TLE: N2YO API")
    blocos = carregar_satelites_n2yo()

    if blocos:
        satelites = processar_satelites_blocos(blocos)
    else:
        print("Fallback: usando arquivo local tles.txt")

        if not os.path.exists(ARQUIVO_TLE):
            print(f"\nERRO: '{ARQUIVO_TLE}' também não encontrado.")
            print("Configure N2YO_API_KEY ou coloque o tles.txt na pasta.\n")
            return

        linhas = ler_arquivo(ARQUIVO_TLE)

        if not linhas:
            print("\nNenhuma linha carregada. Encerrando.\n")
            return

        satelites = processar_satelites(linhas)

    if not satelites:
        print("\nNenhum satélite válido. Encerrando.\n")
        return

    # 2. Configura localização do observador
    lat, lon, cidade = configurar_localizacao()

    # 3. Consulta Open-Meteo com localização escolhida
    print(f"\nConsultando Open-Meteo para {cidade}...")
    dados_meteo = buscar_dados_openmeteo(lat, lon)

    # 4. Calcula M_atm com dados reais (ou fallback)
    m_atm = calcular_m_atm(dados_meteo)

    # 5. M_lum continua estimado (VIIRS não disponível)
    m_lum = round(random.uniform(0.2, 0.9), 2)
    print(f"  M_lum estimado: {m_lum} (VIIRS não disponível)")

    # 6. Obtém fator local com dados reais
    sensores = obter_fator_local(dados_meteo)
    print(f"  Fonte dos sensores: {sensores['fonte']}")

    # 7. Calcula fatores do score
    satelites_leo = [s for s in satelites if s["leo"]]
    fator_orbital = calcular_fator_orbital(len(satelites_leo))
    fator_local = calcular_fator_local(sensores)

    # 7. Calcula Sky Observation Score
    score_atual = calcular_score(fator_orbital, fator_local, m_atm, m_lum)

    print(f"\nSky Observation Score: {score_atual:.2f} — {classificar_score(score_atual)}")
    print(f"M_atm: {m_atm} | M_lum: {m_lum} | F_orbital: {fator_orbital} | F_local: {fator_local}\n")

    # 8. Projeta janelas de 12h (UC02)
    janelas = projetar_janelas(satelites)

    # 9. Inicia menu
    menu_navegacao(satelites, score_atual, janelas, sensores, m_atm, m_lum)


# =========================================
# INÍCIO DO PROGRAMA
# =========================================

main()
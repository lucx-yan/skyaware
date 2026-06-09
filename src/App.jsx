import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"

import StarfieldCanvas from "./components/StarfieldCanvas"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import SeletorPerfil from "./components/SeletorPerfil"
import LocalizacaoModal from "./components/LocalizacaoModal"
import { setBackendLocation } from "./services/api"

import Home from "./pages/Home"
import Problema from "./pages/Problema"
import ComoFunciona from "./pages/ComoFunciona"
import MapaCeu from "./pages/MapaCeu"
import Alertas from "./pages/Alertas"
import Impacto from "./pages/Impacto"
import Sobre from "./pages/Sobre"
import PaginaErro from "./pages/PaginaErro"

function ScrollToTop() {
  const {pathname} = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Componente principal
function AppContent() {
  const [perfil, setPerfil] = useState(() => {
    return localStorage.getItem("darksky_perfil") || null
  })

  const [mostrarSeletor, setMostrarSeletor] = useState(() => {
    return !localStorage.getItem("darksky_perfil")
  })

  const [localizacao, setLocalizacao] = useState(() => {
    try {
      const salvo = localStorage.getItem("darksky_localizacao")
      return salvo ? JSON.parse(salvo) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (localizacao) {
      setBackendLocation({ lat: localizacao.lat, lon: localizacao.lon }).catch(err =>
        console.warn("App: falha ao sincronizar localização salva com backend.", err.message)
      )
    }
  }, [])

  const [mostrarModalLoc, setMostrarModalLoc] = useState(() => {
    return !localStorage.getItem("darksky_localizacao")
  })

  function handleSelecionarPerfil(id) {
    setPerfil(id)
    localStorage.setItem("darksky_perfil", id)
    setMostrarSeletor(false)
  }

  function handleTrocarPerfil() {
    setMostrarSeletor(true)
  }

  function handleConfirmarLocalizacao(loc) {
    setLocalizacao(loc)
    setMostrarModalLoc(false)
    setBackendLocation({lat: loc.lat, lon: loc.lon}).catch(err =>
      console.warn("App: falha ao sincronizar localização com backend.", err.message)
    )
  }

  function handleTrocarLocalizacao() {
    setMostrarModalLoc(true)
  }

  return (
    <>
      <StarfieldCanvas />
      {mostrarSeletor && (
        <SeletorPerfil onSelecionar={handleSelecionarPerfil} />
      )}

      {mostrarModalLoc && !mostrarSeletor && (
        <LocalizacaoModal
          onConfirmar={handleConfirmarLocalizacao}
          onFechar={localizacao ? () => setMostrarModalLoc(false) : null}
        />
      )}

      {!mostrarSeletor && (
        <div className="relative flex flex-col min-h-screen"
          style={{zIndex: 1}}
        >
          <ScrollToTop />

          <Navbar
            profile={perfil}
            onProfileChange={handleTrocarPerfil}
            localizacao={localizacao}
            onLocalizacaoChange={handleTrocarLocalizacao}
          />

          <main className="flex-1"
            style={{paddingTop: "64px"}}
          >
            <Routes>
              <Route path="/" element={<Home perfil={perfil} localizacao={localizacao} />}/>
              <Route path="/problema" element={<Problema/>}/>
              <Route path="/como-funciona" element={<ComoFunciona/>}/>
              <Route path="/mapa-ceu" element={<MapaCeu perfil={perfil} localizacao={localizacao} />} />
              <Route path="/alertas" element={<Alertas perfil={perfil} localizacao={localizacao} />}/>
              <Route path="/impacto" element={<Impacto/>}/>
              <Route path="/sobre" element={<Sobre/>}/>
              <Route path="*" element={<PaginaErro/>}/>
            </Routes>
          </main>
          <Footer />
        </div>
      )}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/skyaware">
        <AppContent />
    </BrowserRouter>
  )
}
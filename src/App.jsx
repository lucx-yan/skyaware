import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import StarfieldCanvas from "./components/StarfieldCanvas"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import SeletorPerfil from "./components/SeletorPerfil"

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

  function handleSelecionarPerfil(id) {
    setPerfil(id)
    localStorage.setItem("darksky_perfil", id)
    setMostrarSeletor(false)
  }

  function handleTrocarPerfil() {
    setMostrarSeletor(true)
  }

  return (
    <>
      <StarfieldCanvas />
      {mostrarSeletor && (
        <SeletorPerfil onSelecionar={handleSelecionarPerfil} />
      )}

      {!mostrarSeletor && (
        <div className="relative flex flex-col min-h-screen"
          style={{zIndex: 1}}
        >
          <ScrollToTop />

          <Navbar
            profile={perfil}
            onProfileChange={handleTrocarPerfil}
          />

          <main className="flex-1"
            style={{paddingTop: "64px"}}
          >
            <Routes>
              
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
    <BrowserRouter>
        <AppContent />
    </BrowserRouter>
  )
}
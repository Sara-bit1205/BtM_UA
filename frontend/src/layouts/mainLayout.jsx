/*MainLayout define la estructura base de la aplicación: renderiza el
 Navbar arriba, el Footer abajo, y en medio (<Outlet />) se cargan 
 dinámicamente las páginas según la ruta activa (gracias a React Router).
  Es básicamente el “esqueleto” de toda la app.*/

import { Outlet } from 'react-router-dom'
import NavBar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

function MainLayout() {
  return (
    <>
      <NavBar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  )
}

export default MainLayout
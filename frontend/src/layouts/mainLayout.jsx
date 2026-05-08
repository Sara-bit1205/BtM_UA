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
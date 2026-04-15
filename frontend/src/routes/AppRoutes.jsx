import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/mainLayout'

// Páginas públicas
import HomePage from '../pages/public/HomePage'
import LoginPage from '../pages/public/LoginPage'
import RegisterPage from '../pages/public/RegisterPage'
import AboutBTMPage from '../pages/public/AboutBTMPage'
import PersonalityTestPage from '../pages/public/PersonalityTestPage'
import CategoriesPage from '../pages/public/CategoriesPage'
import CharacterDetailPage from '../pages/public/CharacterDetailPage'
import SearchPage from '../pages/public/SearchPage'
import AboutUsPage from '../pages/public/AboutUsPage'
import PrivacyPolicyPage from '../pages/public/PrivacyPolicyPage'
import Clasificador from '../pages/public/Clasificador'
import Politica_Privacidad from '../pages/public/Politica_privacidad'
import MBTITypesPage from '../pages/public/MBTITypesPage'
import HowMBTIWorksPage from '../pages/public/HowMBTIWorksPage'

// Páginas de usuario autenticado
import UserProfilePage from '../pages/user/UserProfilePage'
import FavoritesPage from '../pages/user/FavoritesPage'
import EditUserPage from '../pages/user/EditUserPage'
import MyMBTIPage from '../pages/user/MyMBTIPage'
import GaleriaUsuario from '../pages/public/galeriaUsuario'

// Páginas de administrador
import AdminProfilePage from '../pages/admin/AdminProfilePage'
import CharactersAdminPage from '../pages/admin/CharactersAdminPage'
import CategoriesAdminPage from '../pages/admin/CategoriesAdminPage'
import UsersListPage from '../pages/admin/UsersListPage'
// Página de lista de personajes (prueba)
import ListaPersonajes from '../pages/admin/listaPersonajes'
import FormularioPersonaje from '../pages/admin/FormularioPersonaje'
import EliminarPersonaje from '../pages/admin/EliminarPersonaje'

// Rutas protegidas
import ProtectedRoute from '../components/common/ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/que-es-btm" element={<AboutBTMPage />} />
        <Route path="/test-personalidad" element={<PersonalityTestPage />} />
        <Route path="/tipos-personalidad" element={<MBTITypesPage />} />
        <Route path="/como-se-calcula" element={<HowMBTIWorksPage />} />
        <Route path="/categorias/:universo" element={<CategoriesPage />} />
        <Route path="/personaje/:slug" element={<CharacterDetailPage />} />
        <Route path="/busqueda" element={<SearchPage />} />
        <Route path="/sobre-nosotros" element={<AboutUsPage />} />
        <Route path="/politica-privacidad" element={<PrivacyPolicyPage />} />
        <Route path="/clasificador/:categoria" element={<Clasificador />} />
        <Route path="/clasificador/:categoria" element={<Clasificador />} />
        <Route path="/clasificador/:categoria" element={<Clasificador />} />
        <Route path="/politica_privacidad" element={<Politica_Privacidad />} />
        

        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/perfil" element={<UserProfilePage />} />
          <Route path="/perfil/favoritos" element={<FavoritesPage />} />
          <Route path="/perfil/editar" element={<EditUserPage />} />
          <Route path="/perfil/mi-mbti" element={<MyMBTIPage />} />
          <Route path="/perfil/galeria" element={<GaleriaUsuario />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminProfilePage />} />
          <Route path="/admin/personajes" element={<CharactersAdminPage />} />
          <Route path="/admin/categorias" element={<CategoriesAdminPage />} />
          <Route path="/admin/usuarios" element={<UsersListPage />} />
          <Route path="/admin/lista-personajes" element={<ListaPersonajes />} />
          <Route path="/admin/formulario-personaje" element={<FormularioPersonaje />} />
          <Route path="/admin/eliminar-personaje" element={<EliminarPersonaje />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
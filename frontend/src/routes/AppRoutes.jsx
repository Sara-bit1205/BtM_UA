import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/mainLayout'

// Páginas públicas
import HomePage from '../pages/public/HomePage'
import LoginPage from '../pages/public/LoginPage'
import RegisterPage from '../pages/public/RegisterPage'
import AboutBTMPage from '../pages/public/AboutBTMPage'
import PersonalityTestPage from '../pages/public/PersonalityTestPage'
import CategoriesPage from '../pages/public/CategoriesPage'
import CategoryDetailPage from '../pages/public/CategoryDetailPage'
import CharacterDetailPage from '../pages/public/CharacterDetailPage'
import SearchPage from '../pages/public/SearchPage'
import AboutUsPage from '../pages/public/AboutUsPage'
import PrivacyPolicyPage from '../pages/public/PrivacyPolicyPage'
import Universos from '../pages/public/Universos';
import Personalidades from '../pages/public/Personalidades';
import Psicologia from '../pages/public/Psicologia';
import Politica_Privacidad from '../pages/public/Politica_privacidad';
// Página de lista de personajes (prueba) Tendría que estar en admin, pero la dejo aquí para que ver el diseño y luego la movemos
import ListaPersonajes from '../pages/public/listaPersonajes';
import FormularioPersonaje from '../pages/public/FormularioPersonaje';
import EliminarPersonaje from '../pages/public/EliminarPersonaje';

// Páginas de usuario autenticado
import UserProfilePage from '../pages/user/UserProfilePage'
import FavoritesPage from '../pages/user/FavoritesPage'
import EditUserPage from '../pages/user/EditUserPage'
import MyMBTIPage from '../pages/user/MyMBTIPage'

// Páginas de administrador
import AdminProfilePage from '../pages/admin/AdminProfilePage'
import CharactersAdminPage from '../pages/admin/CharactersAdminPage'
import CategoriesAdminPage from '../pages/admin/CategoriesAdminPage'
import UsersListPage from '../pages/admin/UsersListPage'

// Rutas protegidas
import ProtectedRoute from '../components/common/ProtectedRoute'

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* ── Rutas públicas ── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/que-es-btm" element={<AboutBTMPage />} />
        <Route path="/test-personalidad" element={<PersonalityTestPage />} />
        <Route path="/categorias" element={<CategoriesPage />} />
        <Route path="/categorias/:id" element={<CategoryDetailPage />} />
        <Route path="/personaje/:slug" element={<CharacterDetailPage />} />
        <Route path="/busqueda" element={<SearchPage />} />
        <Route path="/sobre-nosotros" element={<AboutUsPage />} />
        <Route path="/politica-privacidad" element={<PrivacyPolicyPage />} />
        <Route path="/universos" element={<Universos />} />
        <Route path="/personalidades" element={<Personalidades />} />
        <Route path="/psicologia" element={<Psicologia />} />
        <Route path="/lista-personajes" element={<ListaPersonajes />} />
        <Route path="/formulario-personaje" element={<FormularioPersonaje />} />
        <Route path="/politica_privacidad" element={<Politica_Privacidad />} />
        <Route path="/eliminar-personaje" element={<EliminarPersonaje />} />

        {/* ── Rutas de usuario (rol: user) ── */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/perfil" element={<UserProfilePage />} />
          <Route path="/perfil/favoritos" element={<FavoritesPage />} />
          <Route path="/perfil/editar" element={<EditUserPage />} />
          <Route path="/perfil/mi-mbti" element={<MyMBTIPage />} />
        </Route>

        {/* ── Rutas de administrador (rol: admin) ── */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminProfilePage />} />
          <Route path="/admin/personajes" element={<CharactersAdminPage />} />
          <Route path="/admin/categorias" element={<CategoriesAdminPage />} />
          <Route path="/admin/usuarios" element={<UsersListPage />} />
        </Route>
      </Route>

      {/* ── Ruta fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
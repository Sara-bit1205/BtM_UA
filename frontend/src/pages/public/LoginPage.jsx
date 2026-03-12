import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'

// Página de inicio de sesión
// Tras autenticar, redirige a /perfil (user) o /admin (admin)
function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { user, token } = await authService.login(form)
    login(user, token)
    navigate(user.role === 'admin' ? '/admin' : '/perfil')
  }

  return (
    <main>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        {/* Campos email y password */}
      </form>
    </main>
  )
}

export default LoginPage

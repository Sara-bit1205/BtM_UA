import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Página Mi MBTI:
// - Si el usuario ya realizó el test → muestra su tipo y personajes relacionados
// - Si no lo ha realizado → redirige a /test-personalidad
function MyMBTIPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user?.mbtiType) {
    navigate('/test-personalidad')
    return null
  }

  return (
    <main>
      <h1>Mi MBTI: {user.mbtiType}</h1>
      {/* Lista de personajes con el mismo tipo de personalidad */}
    </main>
  )
}

export default MyMBTIPage

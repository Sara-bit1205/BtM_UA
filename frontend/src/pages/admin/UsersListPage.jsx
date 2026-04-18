import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
// import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import userService from '../../services/userService'
import '../../assets/styles/AdminProfileUsers.css'

function UsersListPage() {
  const { isAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAdminUsersList()
        setUsers(data)
      } catch (err) {
        console.error('Error cargando usuarios:', err.message)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      fetchUsers()
    } else {
      setLoading(false)
    }
  }, [isAdmin])

  if (loading) {
    return <p>Cargando usuarios...</p>
  }

  return (
    <main className="container py-4 users-list-page">
      <h1 className="mb-4 ">Usuarios Registrados</h1>

      <section className="user-list ">
        <table className="table users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Fecha registro</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <th scope="row">{index + 1}</th>
                <td>{user.username}</td>
                <td>{user.name || '—'}</td>
                <td>{user.email}</td>
                <td>
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p>No hay usuarios registrados.</p>
        )}
      </section>

      <div className="favorites-actions mt-4">
          <Link to="/admin" className="favorites-back ">
            ← Volver a mi perfil
          </Link>
      </div>
    </main>
  )
}

export default UsersListPage
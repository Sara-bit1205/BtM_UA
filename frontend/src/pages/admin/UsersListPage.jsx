import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import userService from '../../services/userService'
import '../../assets/styles/AdminProfileUsers.css'

function BackBtn({ onClick, to }) {
  const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
         viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
         aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
  if (to) return <Link to={to} className="admin-cat-back-btn" aria-label="Volver">{icon}</Link>
  return (
    <button type="button" className="admin-cat-back-btn" onClick={onClick} aria-label="Volver">
      {icon}
    </button>
  )
}

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
          <BackBtn to="/admin" />
      </div>
    </main>
  )
}

export default UsersListPage
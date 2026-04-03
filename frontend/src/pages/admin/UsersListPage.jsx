import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import '../../assets/styles/AdminProfileUsers.css'

function UsersListPage() {
  const { isAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, name, email, created_at, role')
          .eq('role', 'user')
          .order('created_at', { ascending: false })

        if (error) throw error

        setUsers(data || [])
      } catch (err) {
        console.error('Error cargando usuarios:', err.message)
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      fetchUsers()
    }
  }, [isAdmin])

  if (loading) {
    return <p>Cargando usuarios...</p>
  }

  return (
    <main className="container py-4 users-list-page">
      <h1 className="mb-4 ">Usuarios Registrados</h1>

      <section className="user-list ">
        <table className="table table-striped users-table">
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
    </main>
  )
}

export default UsersListPage
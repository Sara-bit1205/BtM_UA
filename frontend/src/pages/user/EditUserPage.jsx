import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../../assets/styles/Login.css'

function EditUserPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    birth_date: '',
    profileImage: null,
    newProfileImage: null
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, files, type } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // lógica de envío
  }

  return (
    <main className="edit-user-page">
      <section className="profile-page">
        <h1 className="profile-greeting">EDITAR MIS DATOS</h1>

        <article className="profile-card">
          <form className="edit-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="custom-label" htmlFor="nombre">Nombre:</label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                className="form-control custom-input"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label className="custom-label" htmlFor="username">Username:</label>
              <input
                id="username"
                type="text"
                name="username"
                className="form-control custom-input"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label className="custom-label" htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                name="email"
                className="form-control custom-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label className="custom-label" htmlFor="birth_date">Fecha de nacimiento:</label>
              <input
                id="birth_date"
                type="date"
                name="birth_date"
                className="form-control custom-input"
                value={formData.birth_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label className="custom-label" htmlFor="password">Contraseña:</label>
              <input
                id="password"
                type="password"
                name="password"
                className="form-control custom-input"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
              />
            </div>

            <div className="form-field">
              <label className="custom-label" htmlFor="confirmPassword">Repetir contraseña:</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                className="form-control custom-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength={6}
              />
            </div>

            <div className="form-field">
              <label className="custom-label" htmlFor="profileImage">Foto perfil:</label>
              <input
                id="profileImage"
                type="file"
                name="profileImage"
                className="form-control custom-input"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label className="custom-label" htmlFor="newProfileImage">Cambiar foto perfil:</label>
              <input
                id="newProfileImage"
                type="file"
                name="newProfileImage"
                className="form-control custom-input"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <div className="botonesEdit">
              <button type="submit" className="btn-aceptar">
                Aceptar
              </button>
              <Link to="/perfil" className="btn-cancelar">
                Cancelar
              </Link>
            </div>
          </form>
        </article>
      </section>

      <div className="favorites-actions mt-4">
        <Link to="/perfil" className="favorites-back ">
          ← Volver a mi perfil
        </Link>
     </div>      
    </main>
  )
}

export default EditUserPage

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../../services/authService'
import '../../assets/styles/Login.css'

function RegisterPage() {
  const [validated, setValidated] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    nombre: '',
    username: '',
    email: '',
    birth_date: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
  })

  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value, files, type } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }))

    if (error) setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const formElement = e.currentTarget

    if (!formElement.checkValidity()) {
      setValidated(true)
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setValidated(true)
      return
    }

    setValidated(true)

    try {
     await authService.register({
        email: form.email,
        password: form.password,
        username: form.username,
        name: form.nombre,
        birth_date: form.birth_date,
        profileImage: form.profileImage,
      })

      navigate('/login', { replace: true })
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error al registrarse')
    }
  }

  return (
    <main className="login-container">
      <div className="login-box">
        <h1 className="login-title">REGÍSTRATE</h1>

        <form
          onSubmit={handleSubmit}
          className={`row g-3 needs-validation ${validated ? 'was-validated' : ''}`}
          noValidate
        >
          {error && <p className="text-danger">{error}</p>}

          <div className="col-12 col-md-6 text-start">
            <label className="custom-label">NOMBRE</label>
            <input
              type="text"
              name="nombre"
              className="form-control custom-input"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Ana Pérez"
              required
            />
          </div>

          <div className="col-12 col-md-6 text-start">
            <label className="custom-label">USERNAME</label>
            <input
              type="text"
              name="username"
              className="form-control custom-input"
              value={form.username}
              onChange={handleChange}
              placeholder="Ej: ana_perez123"
              required
            />
          </div>

          <div className="col-12 text-start">
            <label className="custom-label">EMAIL</label>
            <input
              type="email"
              name="email"
              className="form-control custom-input"
              value={form.email}
              onChange={handleChange}
              placeholder="Ej: ana@example.com"
              required
            />
          </div>

          <div className="col-12 text-start">
            <label className="custom-label">FECHA DE NACIMIENTO</label>
            <input
              type="date"
              name="birth_date"
              className="form-control custom-input"
              value={form.birth_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 col-md-6 text-start">
            <label className="custom-label">CONTRASEÑA</label>
            <input
              type="password"
              name="password"
              className="form-control custom-input"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="col-12 col-md-6 text-start">
            <label className="custom-label">REPETIR CONTRASEÑA</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control custom-input"
              value={form.confirmPassword}
              onChange={handleChange}
              required
             
            />
          </div>

          <div className="col-12 text-start">
            <label className="custom-label">FOTO DE PERFIL</label>
            <input
              type="file"
              name="profileImage"
              className="form-control custom-input"
              onChange={handleChange}
              accept="image/*"
              aria-describedby="profileImageHelp"
            />
            <div id="profileImageHelp" className="form-text text-white">Formato JPG/PNG. Tamaño recomendado &lt; 2MB.</div>
          </div>

          <div className="col-12 text-center">
            <button type="submit" className="btn-login">
              REGISTRARSE
            </button>
          </div>
        </form>

        <div className="login-footer mt-3">
          <p className="text-white mb-1">¿Ya tienes cuenta?</p>
          <Link to="/login" className="register-link">LOG IN</Link>
        </div>
      </div>
    </main>
  )
}

export default RegisterPage
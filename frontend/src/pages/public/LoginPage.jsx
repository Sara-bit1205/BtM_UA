/*useState → para estado local
useEffect → para ejecutar lógica al montar o cuando cambian datos
useNavigate → para redirigir
Link → para enlazar a registro
useAuth → para leer estado de autenticación desde tu contexto
supabase → para iniciar sesión
CSS → estilos de la página*/

//MIGRADO
  
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
// import { supabase } from '../../lib/supabase.js'
import '../../assets/styles/Login.css'

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false }) //Guarda los valores del formulario y el estado de "recordar mis datos"
  const [error, setError] = useState(null) //Guarda el mensaje de error a mostrar al usuario.
  const { role, isAuthenticated } = useAuth() //Lee el estado de autenticación y el rol del usuario desde el contexto de autenticación. isAuthenticated → si hay sesión válida y role --> admin o user
  const navigate = useNavigate() //Sirve para redirigir programáticamente.
  const [validated, setValidated] = useState(false) //Esto parece usarse para activar clases de validación visual en el formulario.

  //Recupera el email guardado en localStorage al montar el componente, y si existe lo pone en el formulario y marca "recordar mis datos" como true.
  useEffect(() => {
    const savedEmail = localStorage.getItem('email')
    /*si existe --> copia el estado anterior con ...prev
      sustituye email
      marca el checkbox rememberMe como true*/
    if (savedEmail) {
      setForm((prev) => ({
        ...prev,
        email: savedEmail,
        rememberMe: true,
      }))
    }
  }, [])

  //Redirección automática: si el usuario ya está autenticado, lo redirige a la página de perfil o admin según su rol.
  useEffect(() => {
    if (!isAuthenticated) return
    navigate(role === 'admin' ? '/admin' : '/perfil')
  }, [isAuthenticated, role, navigate])

  //Cade vez que el usuario cambia un campo del formulario, actualiza el estado form con el nuevo valor, y si había un error lo borra para que no se muestre más.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (error) setError(null)
  }

  //Envío de formulario
  const handleSubmit = async (e) => {
    //Evita que el navegador recargue la página.
    e.preventDefault()
    //Evita que el evento siga propagándose.
    e.stopPropagation()

    const formElement = e.currentTarget //currentTarget es el propio <form> que disparó el submit.

    /*Comprueba si el formulario cumple las reglas HTML del propio JSX:
      required
      type="email"
      minLength={6}*/
    if (!formElement.checkValidity()) {
      setValidated(true)
      return
    }

    try {
      //Envía email y contraseña a Supabase Auth.
      /*Si son correctos:

        Supabase crea la sesión
        guarda internamente el estado de autenticación
        AuthContext podrá detectarlo

        Si fallan, devuelve error.*/
      await authService.login({
        email: form.email,
        password: form.password,
      })

      /*Si marcó “Recordar mis datos”
        Guarda el email en localStorage.
        Si no lo marcó
        Elimina el email guardado.*/
      if (form.rememberMe) {
        localStorage.setItem('email', form.email)
      } else {
        localStorage.removeItem('email')
      }

      //Limpia el mensaje de error en caso de que hubiera uno mostrado.
      setError(null)
    } catch (err) {
      console.error(err)
      if (err.message === 'Esta cuenta ha sido dada de baja y no puede iniciar sesión.') {
        setError(err.message)
      } else {
        setError('Credenciales incorrectas. Inténtalo de nuevo.')
      }
    }
    //Marca el formulario como validado para activar las clases de validación visual.
    setValidated(true)
  }

  return (
    <main className="login-container">
      <div className="login-box">
        <h1 className="login-title">INICIA SESIÓN</h1>

        <form
          onSubmit={handleSubmit}
          className={`login-form needs-validation ${validated ? 'was-validated' : ''}`}
          noValidate
        >
          {error && <p className="text-danger">{error}</p>}

          <div className="text-start">
            <label className="custom-label">EMAIL</label>
            <input
              type="email"
              name="email"
              className="form-control custom-input"
              placeholder="ejemplo@correo.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">
              Introduce un email válido
            </div>
          </div>

          <div className="text-start">
            <label className="custom-label">CONTRASEÑA</label>
            <input
              type="password"
              name="password"
              className="form-control custom-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            <div className="invalid-feedback">
              La contraseña debe tener al menos 6 caracteres
            </div>
          </div>

          <div className="form-check text-start">
            <input
              className="form-check-input"
              type="checkbox"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
            />
            <label className="form-check-label text-white">
              Recordar mis datos
            </label>
          </div>

          <div>
            <button type="submit" className="btn-login">LOG IN</button>
          </div>
        </form>

        <div className="login-footer">
          <p>
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="register-link">
              REGÍSTRATE
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
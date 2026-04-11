/*Esta versión registra al usuario en Supabase Auth, deja que el trigger 
cree automáticamente su fila en profiles, luego completa ese perfil
 con username, name y birth_date, y si el usuario ha subido una imagen,
  la guarda en Storage y actualiza el campo avatar con la URL pública.*/

//MIGRADO

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
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

  const updateProfileWithRetry = async (userId, updates, retries = 10, delay = 300) => {
    for (let i = 0; i < retries; i++) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()

      if (error) throw error

      if (data && data.length > 0) {
        return data[0]
      }

      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    throw new Error('No se pudo completar el perfil del usuario')
  }

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
      const cleanEmail = form.email.trim().toLowerCase()
      const cleanUsername = form.username.trim()
      const cleanName = form.nombre.trim()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: form.password,
        options: {
          data: {
            username: cleanUsername,
            name: cleanName,
          },
        },
      })

      if (signUpError) throw signUpError

      const user = data.user
      if (!user) {
        throw new Error('No se pudo crear el usuario')
      }

      await updateProfileWithRetry(user.id, {
        username: cleanUsername,
        name: cleanName,
        birth_date: form.birth_date || null,
      })

      if (form.profileImage) {
        const fileExt = form.profileImage.name.split('.').pop()
        const fileName = `${user.id}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, form.profileImage, {
            upsert: true,
          })

        if (uploadError) throw uploadError

        await updateProfileWithRetry(user.id, {
          avatar_path: fileName,
        })
      }

      await supabase.auth.signOut()
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
            />
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
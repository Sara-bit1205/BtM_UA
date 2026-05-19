
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import userService from '../../services/userService'
import '../../assets/styles/Login.css'
import { getAvatarUrl, STORAGE_BUCKETS, uploadFile } from '../../lib/storage'

function EditUserPage() {
  const { profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    nombre: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    birth_date: '',
    profileImage: null,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!profile) return

    setFormData((prev) => ({
      ...prev,
      nombre: profile.name || '',
      username: profile.username || '',
      email: profile.email || '',
      birth_date: profile.birth_date || '',
      password: '',
      confirmPassword: '',
      profileImage: null,
    }))
  }, [profile])

  const currentAvatarUrl = useMemo(() => {
    return getAvatarUrl(profile?.avatar_path)
  }, [profile?.avatar_path])

  const handleChange = (e) => {
    const { name, value, files, type } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files?.[0] ?? null : value,
    }))

    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!profile?.id) {
      setError('No se ha podido cargar el perfil.')
      return
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const cleanName = formData.nombre.trim()
      const cleanUsername = formData.username.trim()
      const cleanEmail = formData.email.trim().toLowerCase()

      let avatarValue = profile.avatar_path || null

      if (formData.profileImage) {
        const fileExt = formData.profileImage.name.split('.').pop()
        const filePath = `${profile.id}.${fileExt}`

        await uploadFile(STORAGE_BUCKETS.avatars, filePath, formData.profileImage, {
          upsert: true,
        })

        avatarValue = filePath
      }

      const profileUpdates = {
        name: cleanName,
        username: cleanUsername,
        email: cleanEmail,
        birth_date: formData.birth_date || null,
        avatar_path: avatarValue,
      }

      await userService.updateProfile(profileUpdates)

      const authPayload = {}

      if (cleanEmail && cleanEmail !== profile.email) {
        authPayload.email = cleanEmail
      }

      if (formData.password) {
        authPayload.password = formData.password
      }

      if (Object.keys(authPayload).length > 0) {
        const { error: authError } = await supabase.auth.updateUser(authPayload)
        if (authError) throw authError
      }

      await refreshProfile()

      setSuccess(
        Object.keys(authPayload).length > 0
          ? 'Perfil actualizado. Si cambiaste email o contraseña, puede que Supabase te pida confirmación.'
          : 'Perfil actualizado correctamente.'
      )

      setTimeout(() => navigate('/perfil'), 800)
    } catch (err) {
      console.error(err)
      setError(err.message || 'No se pudieron actualizar los datos.')
    } finally {
      setLoading(false)
    }
  }

  if (!profile) {
    return (
      <main className="edit-user-page">
        <section className="profile-page">
          <h1 className="profile-greeting">EDITAR MIS DATOS</h1>
          <p>Cargando perfil...</p>
        </section>
      </main>
    )
  }

  return (
    <main className="edit-user-page">
      <section className="profile-page">
        <h1 className="profile-greeting">EDITAR MIS DATOS</h1>

        <article className="profile-card">
          <form className="edit-form" onSubmit={handleSubmit}>
            <div className="mb-3 text-center">
              <img
                src={currentAvatarUrl}
                alt="Avatar actual"
                style={{
                  width: '110px',
                  height: '110px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
              />
            </div>

            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">{success}</p>}

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
              />
            </div>

            <div className="form-field">
              <label className="custom-label" htmlFor="password">Nueva contraseña:</label>

              <div className="position-relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control custom-input pe-5"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                />

                <i
                  className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "var(--color-principal)",
                    fontSize: "1.2rem",
                  }}
                ></i>
              </div>
            </div>

            <div className="form-field">
              <label className="custom-label" htmlFor="confirmPassword">Repetir contraseña:</label>

              <div className="position-relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="form-control custom-input pe-5"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={6}
                />

                <i
                  className={`bi ${showConfirmPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "var(--color-principal)",
                    fontSize: "1.2rem",
                  }}
                ></i>
              </div>
            </div>

            <div className="form-field">
              <label className="custom-label" htmlFor="profileImage">Cambiar foto perfil:</label>
              <input
                id="profileImage"
                type="file"
                name="profileImage"
                className="form-control custom-input"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <div className="botonesEdit">
              <button type="submit" className="btn-aceptar" disabled={loading}>
                {loading ? 'Guardando...' : 'Aceptar'}
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
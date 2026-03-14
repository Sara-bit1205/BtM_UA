import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom' // <-- CORRECCIÓN AQUÍ
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import '../../assets/styles/Login.css'

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const { login } = useAuth() // Asegúrate que AuthContext no esté rompiendo la app
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user, token } = await authService.login(form);
      if (login) login(user, token); // Verificación de seguridad
      navigate(user.role === 'admin' ? '/admin' : '/perfil');
    } catch (error) {
      console.error("Error al iniciar sesión", error);
    }
  };

  return (
    <main className="login-container">
      <div className="login-box">
        <h1 className="login-title">INICIA SESIÓN</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="mb-4 text-start">
            <label className="form-label custom-label">USUARIO/EMAIL</label>
            <input
              type="email"
              name="email"
              className="form-control custom-input"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 text-start">
            <label className="form-label custom-label">CONTRASEÑA</label>
            <input
              type="password"
              name="password"
              className="form-control custom-input"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-login">LOG IN</button>
        </form>
        <div className="login-footer mt-4">
          <p className="text-white mb-1">¿No tienes cuenta?</p>
          <Link to="/register" className="register-link">REGISTRATE</Link>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
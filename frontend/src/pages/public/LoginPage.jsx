import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import '../../assets/styles/Login.css';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null); // Estado para feedback de error
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(form);
      if (login) {
        login(response.user, response.token);
        navigate(response.user.role === 'admin' ? '/admin' : '/perfil');
      }
    } catch (err) {
      setError("Credenciales incorrectas. Inténtalo de nuevo.");
      console.error("Error al iniciar sesión", err);
    }
  };

  return (
    <main className="login-container">
      <div className="login-box">
        <h1 className="login-title">INICIA SESIÓN</h1>
        
        {error && <p style={{ color: '#ff4d4d', marginBottom: '1rem' }}>{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="text-start">
            <label className="custom-label">USUARIO/EMAIL</label>
            <input
              type="email"
              name="email"
              className="custom-input"
              placeholder="ejemplo@correo.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="text-start">
            <label className="custom-label">CONTRASEÑA</label>
            <input
              type="password"
              name="password"
              className="custom-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <button type="submit" className="btn-login">LOG IN</button>
          </div>
        </form>

        <div className="login-footer">
          <p>¿No tienes cuenta? <Link to="/register" className="register-link">REGÍSTRATE</Link></p>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
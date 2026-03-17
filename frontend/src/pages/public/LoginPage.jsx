import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import '../../assets/styles/Login.css';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [error, setError] = useState(null); // Estado para feedback de error
  const { login } = useAuth();
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setForm(prev => ({
        ...prev,
        email: savedEmail,
        rememberMe: true
      }));
    }
  }, []);
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });

    if (error) setError(null);
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const formElement = e.currentTarget;

    if (!formElement.checkValidity()) {
      setValidated(true);
      return;
    }

    try {
      const response = await authService.login(form);

      if (form.rememberMe) {
        localStorage.setItem("email", form.email);
      } else {
        localStorage.removeItem("email");
      }

      login(response.user, response.token);
      navigate(response.user.role === 'admin' ? '/admin' : '/perfil');

    } catch (err) {
      setError("Credenciales incorrectas. Inténtalo de nuevo.");
    }

    setValidated(true);
  };

  return (
    <main className="login-container">
      <div className="login-box">
        <h1 className="login-title">INICIA SESIÓN</h1>
        <form onSubmit={handleSubmit}   className={`login-form needs-validation ${validated ? 'was-validated' : ''}`} noValidate>
          <div className="text-start">
            <label className="custom-label">USUARIO/EMAIL</label>
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
            />
            <div className="invalid-feedback">
              La contraseña debe tener al menos 6 caracteres
            </div>
          </div>

           <div className="form-check text-start">
            <input
              className="form-check-input"
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
            />
            <label className="form-check-label text-white" htmlFor="rememberMe">
              Recordar mis datos
            </label>
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
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import '../../assets/styles/Login.css'; // Reutilizamos los mismos estilos

function RegisterPage() {
  const [form, setForm] = useState({ 
    nombre: '', 
    username: '', 
    password: '', 
    confirmPassword: '', 
    email: '' 
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    try {
      await authService.register(form);
      navigate('/login'); // Redirigir al login tras registrarse
    } catch (error) {
      console.error("Error al registrarse", error);
    }
  };

  return (
    <main className="login-container">
      <div className="login-box">
        <h1 className="login-title">REGISTRATE</h1>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Nombre */}
          <div className="mb-3 text-start">
            <label className="custom-label">NOMBRE</label>
            <input type="text" name="nombre" className="form-control custom-input" onChange={handleChange} required />
          </div>

          {/* Nombre de usuario */}
          <div className="mb-3 text-start">
            <label className="custom-label">NOMBRE DE USUARIO</label>
            <input type="text" name="username" className="form-control custom-input" onChange={handleChange} required />
          </div>

          {/* Contraseñas */}
          <div className="mb-3 text-start">
            <label className="custom-label">CONTRASEÑA</label>
            <input type="password" name="password" className="form-control custom-input" placeholder="Ejemplo: Usu1234" onChange={handleChange} required />
          </div>
          <div className="mb-3 text-start">
            <label className="custom-label">REPETIR CONTRASEÑA</label>
            <input type="password" name="confirmPassword" className="form-control custom-input" placeholder="Ejemplo: Contras_1" onChange={handleChange} required />
          </div>

          {/* Email */}
          <div className="mb-4 text-start">
            <label className="custom-label">EMAIL</label>
            <input type="email" name="email" className="form-control custom-input" placeholder="Ejemplo: correo@gmail.com" onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-login">REGISTRARSE</button>
        </form>

        <div className="login-footer mt-3">
          <p className="text-white mb-1">¿Ya tienes cuenta?</p>
          <Link to="/login" className="register-link">LOG IN</Link>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;
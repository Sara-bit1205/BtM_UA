import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import '../../assets/styles/Login.css'; // Reutilizamos los mismos estilos

function RegisterPage() {
  
  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState({ 
    nombre: '', 
    username: '', 
    password: '', 
    confirmPassword: '', 
    email: '' 
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm({
      ...form,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const formElement = e.currentTarget;

    if (!formElement.checkValidity()) {
      setValidated(true);
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden");
      setValidated(true);
      return;
    }

    const data = new FormData();

    Object.keys(form).forEach(key => {
      data.append(key, form[key]);
    });

    try {
      await authService.register(data);
      navigate('/login');
    } catch (error) {
      console.error("Error al registrarse", error);
    }

    setValidated(true);
  };

  return (
    <main className="login-container">
      <div className="login-box">
        <h1 className="login-title">REGISTRATE</h1>

        <form onSubmit={handleSubmit} className={`row g-3 needs-validation ${validated ? 'was-validated' : ''}`} noValidate>

          {/* Nombre */}
          <div className="col-12 col-md-6 text-start">
            <label className="custom-label">NOMBRE</label>
            <input type="text" name="nombre" className="form-control custom-input" onChange={handleChange} required />
            <div className="invalid-feedback">
              Introduce tu nombre
            </div>          
          </div>

          {/* Username */}
          <div className="col-12 col-md-6 text-start">
            <label className="custom-label">NOMBRE DE USUARIO</label>
            <input type="text" name="username" className="form-control custom-input" onChange={handleChange} required />
            <div className="invalid-feedback">
              Introduce un nombre de usuario
            </div>          
          </div>

          {/* Password */}
          <div className="col-12 col-md-6 text-start">
            <label className="custom-label">CONTRASEÑA</label>
            <input 
              type="password" 
              name="password" 
              className="form-control custom-input" 
              onChange={handleChange} 
              required 
              minLength="6"
            />            
            <div className="invalid-feedback">
              La contraseña debe tener al menos 6 caracteres
            </div>
          </div>

          {/* Confirm Password */}
          <div className="col-12 col-md-6 text-start">
            <label className="custom-label">REPETIR CONTRASEÑA</label>
            <input 
              type="password" 
              name="confirmPassword" 
              className="form-control custom-input" 
              onChange={handleChange} 
              required 
            />
            <div className="invalid-feedback">
              Las contraseñas deben coincidir
            </div>          
          </div>

          {/* Email */}
          <div className="col-12 text-start">
            <label className="custom-label">EMAIL</label>
            <input 
              type="email" 
              name="email" 
              className="form-control custom-input" 
              onChange={handleChange} 
              required 
            />
            <div className="invalid-feedback">
              Introduce un email válido
            </div>          
          </div>

          <div className="col-12 text-start">
            <label htmlFor="profileImage" className="form-label custom-label">
              FOTO DE PERFIL
            </label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              className="form-control form-control-sm custom-input"
              onChange={handleChange}
            />
          </div>

          {/* Botón */}
          <div className="col-12 text-center">
            <button type="submit" className="btn-login">REGISTRARSE</button>
          </div>

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
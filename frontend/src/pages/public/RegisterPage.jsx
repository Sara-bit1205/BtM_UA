import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import '../../assets/styles/Login.css';

function RegisterPage() {
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);

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

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setValidated(true);
      return;
    }

    try {
      // 🔐 1. CREAR USUARIO EN AUTH
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            username: form.username,
            name: form.nombre
          }
        }
      });

      if (error) throw error;

      const user = data.user;

      // 🧠 2. ACTUALIZAR PROFILE (opcional pero recomendado)
      // (el trigger ya lo crea, aquí solo añadimos datos extra)
      await supabase
        .from('profiles')
        .update({
          username: form.username,
          name: form.nombre
        })
        .eq('id', user.id);

      // 🖼️ 3. SUBIR AVATAR (opcional)
      if (form.profileImage) {
        const fileExt = form.profileImage.name.split('.').pop();
        const fileName = `${user.id}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars') // 👈 debes crear este bucket
          .upload(fileName, form.profileImage);

        if (!uploadError) {
          const { data: publicUrl } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

          await supabase
            .from('profiles')
            .update({ avatar: publicUrl.publicUrl })
            .eq('id', user.id);
        }
      }

      navigate('/login');

    } catch (err) {
      console.error(err);
      setError(err.message || "Error al registrarse");
    }

    setValidated(true);
  };

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

          {/* Nombre */}
          <div className="col-12 col-md-6 text-start">
            <label className="custom-label">NOMBRE</label>
            <input type="text" name="nombre" className="form-control custom-input" onChange={handleChange} required />
          </div>

          {/* Username */}
          <div className="col-12 col-md-6 text-start">
            <label className="custom-label">USERNAME</label>
            <input type="text" name="username" className="form-control custom-input" onChange={handleChange} required />
          </div>

          {/* Password */}
          <div className="col-12 col-md-6 text-start">
            <label className="custom-label">CONTRASEÑA</label>
            <input type="password" name="password" className="form-control custom-input" onChange={handleChange} required minLength="6" />
          </div>

          {/* Confirm Password */}
          <div className="col-12 col-md-6 text-start">
            <label className="custom-label">REPETIR CONTRASEÑA</label>
            <input type="password" name="confirmPassword" className="form-control custom-input" onChange={handleChange} required />
          </div>

          {/* Email */}
          <div className="col-12 text-start">
            <label className="custom-label">EMAIL</label>
            <input type="email" name="email" className="form-control custom-input" onChange={handleChange} required />
          </div>

          {/* Avatar */}
          <div className="col-12 text-start">
            <label className="custom-label">FOTO DE PERFIL</label>
            <input type="file" name="profileImage" className="form-control custom-input" onChange={handleChange} />
          </div>

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
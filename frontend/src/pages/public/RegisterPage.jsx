import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../../assets/styles/Login.css';

function RegisterPage() {
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    nombre: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));

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
      const cleanEmail = form.email.trim().toLowerCase();
      const cleanUsername = form.username.trim();
      const cleanName = form.nombre.trim();

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: form.password,
        options: {
          data: {
            username: cleanUsername,
            name: cleanName
          }
        }
      });

      if (error) throw error;

      const user = data.user;

      await supabase
        .from('profiles')
        .update({
          username: cleanUsername,
          name: cleanName
        })
        .eq('id', user.id);

      if (form.profileImage) {
        const fileExt = form.profileImage.name.split('.').pop();
        const fileName = `${user.id}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
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

          <div className="col-12 col-md-6 text-start">
            <label className="custom-label">NOMBRE</label>
            <input
              type="text"
              name="nombre"
              className="form-control custom-input"
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
  );
}

export default RegisterPage;
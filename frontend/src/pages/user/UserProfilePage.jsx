/* La nueva versión de UserProfilePage toma los datos del profile cargado
 por AuthContext, muestra la información del usuario y, en vez de borrar
 una cuenta desde una tabla inexistente, usa el servicio de usuario para
 darla de baja de forma segura marcando is_active = false y cerrando
 sesión después. */

//HECHO

import { useRef, useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase.js";
import userService from "../../services/userService";
import mbtiService from "../../services/mbtiService";
import "../../assets/styles/profile.css";
import "../../assets/styles/mbti.css";

const DEFAULT_AVATAR = "default-avatar.jpg";

function getAvatarValue(profile) {
  return profile?.avatar_path || profile?.avatar || DEFAULT_AVATAR;
}

function resolveAvatarUrl(value) {
  if (!value) {
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(DEFAULT_AVATAR);
    return data.publicUrl;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(value);
  return data.publicUrl;
}

function UserProfilePage() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const dialogRef = useRef(null);
  const unsubscribeDialogRef = useRef(null);
  const logoutDialogRef = useRef(null);

  const [loadingUnsubscribe, setLoadingUnsubscribe] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [mbtiResult, setMbtiResult] = useState(null);

  useEffect(() => {
    mbtiService
      .getMyResults()
      .then((results) => setMbtiResult(results?.[0] ?? null))
      .catch(() => setMbtiResult(null));
  }, []);

  const avatarUrl = useMemo(() => {
    const avatarValue = getAvatarValue(profile);
    return resolveAvatarUrl(avatarValue);
  }, [profile?.avatar_path, profile?.avatar]);

  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();

  const openUnsubscribe = () => {
    unsubscribeDialogRef.current?.showModal();
  };

const handleConfirmBaja = async () => {
  const confirmar = window.confirm(
    "¿Estás seguro? Se borrarán permanentemente tu cuenta, tu avatar, tus audios y tus fotos de la galería."
  );
  if (!confirmar) return;

  try {
    setLoadingUnsubscribe(true);
    
    // 1. Obtener el ID del usuario actual
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no encontrado");

    // --- PASO A: RECOLECTAR TODAS LAS RUTAS (Antes de que desaparezcan de la DB) ---

    // 1.1 Ruta del Avatar
    const { data: perfil } = await supabase
      .from('profiles')
      .select('avatar_path')
      .eq('id', user.id)
      .single();

    // 1.2 Rutas de Fotos en Gallery
    const { data: fotos } = await supabase
      .from('community_photos')
      .select('image_path')
      .eq('user_id', user.id);

    // 1.3 Rutas de Audios
    const { data: audios } = await supabase
      .from('audios')
      .select('audio_path')
      .eq('uploaded_by', user.id);


    // --- PASO B: LIMPIEZA FÍSICA DEL STORAGE ---

    // Borrar Avatar (Bucket: 'avatars')
    if (perfil?.avatar_path) {
      await supabase.storage.from('avatars').remove([perfil.avatar_path]);
    }

    // Borrar Fotos de Galería (Bucket: 'gallery')
    if (fotos && fotos.length > 0) {
      const rutasFotos = fotos.map(f => f.image_path).filter(Boolean);
      if (rutasFotos.length > 0) {
        await supabase.storage.from('gallery').remove(rutasFotos);
      }
    }

    // Borrar Audios (Bucket: 'audios')
    if (audios && audios.length > 0) {
      const rutasAudios = audios.map(a => a.audio_path).filter(Boolean);
      if (rutasAudios.length > 0) {
        await supabase.storage.from('audios').remove(rutasAudios);
      }
    }

    // --- PASO C: BORRADO DE CUENTA (Efecto Dominó en la DB) ---
    // Esto activará el CASCADE que configuramos en el SQL Editor
    const { error: errorRpc } = await supabase.rpc('borrar_mi_cuenta');
    if (errorRpc) throw errorRpc;

    // --- PASO D: SALIDA FINAL ---
    await logout(); 
    navigate('/');
    alert('Tu cuenta y todos tus archivos han sido eliminados del sistema.');

  } catch (error) {
    console.error('Error en el proceso de baja total:', error);
    alert('Hubo un error al intentar borrar todos tus datos. Por favor, contacta con soporte.');
  } finally {
    setLoadingUnsubscribe(false);
  }
};

  const openLogoutDialog = () => logoutDialogRef.current?.showModal();

  const closeLogoutDialog = () => {
    if (!loadingLogout) logoutDialogRef.current?.close();
  };

  const handleConfirmLogout = async () => {
    try {
      setLoadingLogout(true);
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      alert(
        "No hemos podido procesar el cierre de sesión. Inténtalo de nuevo.",
      );
    } finally {
      setLoadingLogout(false);
    }
  };

  const saludo = useMemo(() => {
    const hora = new Date().getHours();

    if (hora >= 6 && hora < 13) return "BUENOS DÍAS";
    if (hora >= 13 && hora < 21) return "BUENAS TARDES";
    return "BUENAS NOCHES";
  }, []);

  const saludoNombre = `${saludo}, ${profile?.username || "usuario"}`;

  if (!profile) {
    return (
      <section className="profile-page">
        <p>Cargando perfil...</p>
      </section>
    );
  }

  return (
    <section className="profile-page">
      <h1 className="profile-greeting">{saludoNombre}</h1>

      <article className="profile-card">
        <img
          className="profile-card__avatar"
          src={avatarUrl}
          alt={`Avatar de ${profile?.name || "usuario"}`}
          onError={(e) => {
            e.currentTarget.src = resolveAvatarUrl(DEFAULT_AVATAR);
          }}
        />

        <div className="profile-card__body">
          <p className="profile-card__username">{profile.username}</p>

          <dl className="profile-card__details" aria-label="Datos del perfil">
            <div className="profile-card__row">
              <dt>Nombre:</dt>
              <dd>{profile.name || "—"}</dd>
            </div>
            <div className="profile-card__row">
              <dt>Email:</dt>
              <dd>{profile.email || "—"}</dd>
            </div>
            <div className="profile-card__row">
              <dt>Contraseña:</dt>
              <dd>*************</dd>
            </div>
            <div className="profile-card__row">
              <dt>Fecha de nacimiento:</dt>
              <dd>{profile.birth_date || "—"}</dd>
            </div>
            <div className="profile-card__row">
              <dt>Tipo MBTI:</dt>
              <dd>
                {mbtiResult ? (
                  <Link to="/perfil/mi-mbti" style={{ textDecoration: "none" }}>
                    <span
                      className="mbti-type-badge"
                      style={{ fontSize: "0.8rem", padding: "0.2rem 0.6rem" }}
                    >
                      {mbtiResult.mbti_types?.code}
                    </span>{" "}
                    <span style={{ color: "var(--colorTexto)" }}>
                      {mbtiResult.mbti_types?.title}
                    </span>
                  </Link>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </dl>
        </div>
      </article>

      <dialog
        ref={dialogRef}
        className="mbti-invite-dialog"
        aria-labelledby="mbti-dialog-title"
        aria-describedby="mbti-dialog-desc"
        onClose={closeDialog}
      >
        <button
          className="mbti-invite-banner__close"
          onClick={closeDialog}
          aria-label="Cerrar"
          type="button"
        >
          ✕
        </button>

        <h2 id="mbti-dialog-title">¿Conoces tu tipo de personalidad?</h2>

        <p id="mbti-dialog-desc">
          Completa el test MBTI y descubre qué personajes comparten tu forma de
          ser. ¡Solo son 10 preguntas!
        </p>

        <div className="mbti-invite-banner__actions">
          <Link
            className="mbti-btn-primary"
            to="/test-personalidad"
            onClick={closeDialog}
          >
            Hacer el test
          </Link>

          <Link
            className="mbti-btn-secondary"
            to="/tipos-personalidad"
            onClick={closeDialog}
          >
            Ver los 16 tipos
          </Link>
        </div>
      </dialog>

      <nav className="profile-actions" aria-label="Acciones del perfil">
        <Link className="profile-action" to="/perfil/favoritos">
          MIS FAVORITOS
        </Link>

        <Link className="profile-action" to="/perfil/editar">
          EDITAR MIS DATOS
        </Link>

        {mbtiResult ? (
          <Link className="profile-action" to="/perfil/mi-mbti">
            MI MBTI
          </Link>
        ) : (
          <button className="profile-action" type="button" onClick={openDialog}>
            MI MBTI
          </button>
        )}

        <Link className="profile-action" to="/perfil/galeria">
          MIS FOTOS SUBIDAS
        </Link>

        <button
          className="profile-action"
          type="button"
          onClick={openLogoutDialog}
        >
          LOGOUT
        </button>

        <button
          className="profile-action profile-action--danger"
          type="button"
          onClick={openUnsubscribe}
        >
          DARSE DE BAJA
        </button>
      </nav>

      <dialog
        ref={logoutDialogRef}
        className="mbti-invite-dialog modal-baja-personalizado"
      >
        <div className="modal-baja-content">
          <h2 className="modal-baja-titulo">
            ¿SEGURO QUE QUIERES CERRAR SESIÓN?
          </h2>

          <div className="modal-baja-acciones">
            <button
              className="btn-confirm"
              onClick={handleConfirmLogout}
              disabled={loadingLogout}
            >
              {loadingLogout ? "CERRANDO SESIÓN..." : "ACEPTAR"}
            </button>

            <button
              className="btn-cancel"
              onClick={closeLogoutDialog}
              disabled={loadingLogout}
            >
              CANCELAR
            </button>
          </div>
        </div>
      </dialog>

      <dialog
        ref={unsubscribeDialogRef}
        className="mbti-invite-dialog modal-baja-personalizado"
      >
        <div className="modal-baja-content">
          <h2 className="modal-baja-titulo">
            ¿SEGURO QUE QUIERES DARTE DE BAJA?
          </h2>

          <div className="modal-baja-acciones">
            <button
              className="btn-confirm"
              onClick={handleConfirmBaja}
              disabled={loadingUnsubscribe}
            >
              {loadingUnsubscribe ? "PROCESANDO..." : "ACEPTAR"}
            </button>

            <button
              className="btn-cancel"
              onClick={() => unsubscribeDialogRef.current?.close()}
              disabled={loadingUnsubscribe}
            >
              CANCELAR
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}

export default UserProfilePage;

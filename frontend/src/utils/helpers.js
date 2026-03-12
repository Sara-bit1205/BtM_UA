// Funciones de utilidad generales del frontend

// Trunca un texto a una longitud máxima añadiendo "..."
export const truncate = (text, maxLength = 100) =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text

// Devuelve el token almacenado en localStorage
export const getToken = () => localStorage.getItem('btm_token')

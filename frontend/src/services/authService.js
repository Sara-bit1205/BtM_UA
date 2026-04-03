/*Es simplemente un wrapper (o capa fina) sobre las funciones de supabase.auth.
Básicamente, son como unas funciones reutilizables para no usar directamente supabase.auth*/

//importamos la configuración de Supabase 
import { supabase } from '../lib/supabase'

/*Es un objeto que agrupa funciones relacionadas con autenticación:

register → registrarse
login → iniciar sesión
logout → cerrar sesión*/

const authService = {
  //Crea un usuario nuevo en Supabase
  // email y password --> credenciales y options.data --> datos adicionales (username y name) (son como metadatos que se guardan en el perfil del usuario)

  async register({ email, password, username, name }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          name,
        },
      },
    })

    /*Si algo falla → lanza el error
      Si todo va bien → devuelve data*/
    if (error) throw error
    return data
  },

  //Autentica a un usuario existente.
  /*Comprueba email + contraseña
  Si son correctos → devuelve sesión + usuario*/

  async login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  //Cierra la sesión del usuario actual
  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
}

export default authService
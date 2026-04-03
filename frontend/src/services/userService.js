/*Este nuevo userService sustituye las llamadas al backend Express por 
consultas directas a Supabase, utilizando la sesión activa para 
identificar al usuario en lugar de tokens manuales, y gestionando 
perfil y favoritos directamente sobre las tablas profiles y favorites,
 mientras que la seguridad queda controlada por las políticas RLS.*/
 
import { supabase } from '../lib/supabase'

const userService = {
  //Obtener el perfil
  async getProfile() {
    //Primero obtenemos el usuario autenticado para saber su id, si no hay usuario autenticado lanzamos un error
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    //Luego obtenemos el perfil de la tabla profiles filtrando por el id del usuario, y devolvemos los datos del perfil
    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

    //Obtenemos el perfil de la tabla profiles filtrando por el id del usuario, y devolvemos los datos del perfil
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  },

  //Actualiza el perfil del usuario actual.
  async updateProfile(values) {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

    // Copiamos avatar -> avatar_path si llega avatar pero no avatar_path
    const normalizedValues = { ...values }

    if (normalizedValues.avatar && !normalizedValues.avatar_path) {
      normalizedValues.avatar_path = normalizedValues.avatar
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(normalizedValues)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  //"Borra la cuenta" --> realmente lo que hace es marca al usuario como inactivo, Así el perfil sigue existiendo en la base de datos, pero queda desactivado.
  async deleteAccount() {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

    //Busca el perfil del usuario actual y pone su campo is_active a false, para marcarlo como inactivo, y devuelve los datos actualizados del perfil
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_active: false })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    //Después de desactivar el perfil, cierra la sesión del usuario.
    await supabase.auth.signOut()

    return data
  },

  //Trae los favoritos del usuario actual.
  async getFavorites() {
    //Obtenemos el usuario autenticado para saber su id, si no hay usuario autenticado lanzamos un error
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    //Obtiene el id del usuario autenticado
    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

    //Obtiene la lista de favoritos de la tabla favorites filtrando por el id del usuario, e incluyendo los datos relacionados del personaje, su tipo MBTI y su universo, ordenados por fecha de creación (los más nuevos primero)
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        characters (
          id,
          name,
          slug,
          cover_image,
          mbti_types (
            code
          ),
          universes (
            name
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  //Añade un personaje a favoritos para el usuario actual.
  async addFavorite(characterId) {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

    //Inserta un nuevo registro en la tabla favorites con el user_id, character_id y la fecha de creación automática, y devuelve el nuevo favorito insertado
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        character_id: characterId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  //Quitamos un personaje de favoritos para el usuario actual.
  async removeFavorite(characterId) {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

    //Borra la fila de favorites que cumpla --> que pertece al usuario actual y correcponde a ese personaje
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('character_id', characterId)

    if (error) throw error
    return true
  },

  //Función para el admin --> Recupera todos los usuarios registrados, ordenados por fecha de creación (los más nuevos primero)
  async getAll() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },
}

export default userService
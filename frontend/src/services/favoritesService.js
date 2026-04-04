//HECHO

import { supabase } from '../lib/supabase'

// Función para sacar la URL pública de la portada del personaje
function getCharacterCoverUrl(coverPath) {
  if (!coverPath) return null

  const { data } = supabase.storage
    .from('character-covers')
    .getPublicUrl(coverPath)

  return data.publicUrl
}

const favoritesService = {
  // Trae los favoritos del usuario autenticado
  async getFavorites() {
    // Primero obtenemos el usuario autenticado
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

    // Luego obtenemos los favoritos de ese usuario junto con los datos del personaje
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        character_id,
        created_at,
        characters (
          id,
          name,
          slug,
          cover_path
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Formateamos los datos para que la página los use fácil
    return (data || []).map((item) => {
      const character = Array.isArray(item.characters)
        ? item.characters[0]
        : item.characters

      return {
        favoriteId: item.id,
        characterId: item.character_id,
        slug: character?.slug || '',
        name: character?.name || 'Personaje sin nombre',
        image: getCharacterCoverUrl(character?.cover_path),
      }
    })
  },

  // Añade un personaje a favoritos
  async addFavorite(characterId) {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

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

  // Quita un personaje de favoritos
  async removeFavorite(characterId) {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('character_id', characterId)

    if (error) throw error
    return true
  },

  // Comprueba si un personaje ya está en favoritos
  async isFavorite(characterId) {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const userId = userData?.user?.id
    if (!userId) return false

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('character_id', characterId)
      .maybeSingle()

    if (error) throw error

    return !!data
  },
}

export default favoritesService
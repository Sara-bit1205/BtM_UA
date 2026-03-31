/*Este nuevo userService sustituye las llamadas al backend Express por 
consultas directas a Supabase, utilizando la sesión activa para 
identificar al usuario en lugar de tokens manuales, y gestionando 
perfil y favoritos directamente sobre las tablas profiles y favorites,
 mientras que la seguridad queda controlada por las políticas RLS.*/
 
import { supabase } from '../lib/supabase'

const userService = {
  // ── PERFIL ───────────────────────────────
  async getProfile() {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  },

  async updateProfile(values) {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

    const { data, error } = await supabase
      .from('profiles')
      .update(values)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // ── BORRAR CUENTA (SOFT DELETE) ───────────
  async deleteAccount() {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

    const { data, error } = await supabase
      .from('profiles')
      .update({ is_active: false })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    await supabase.auth.signOut()

    return data
  },

  // ── FAVORITOS ─────────────────────────────
  async getFavorites() {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

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

  // ── ADMIN ────────────────────────────────
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
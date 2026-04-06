/* Este userService sustituye las llamadas al backend Express por
consultas directas a Supabase, utilizando la sesión activa para
identificar al usuario en lugar de tokens manuales, y gestionando
perfil y favoritos directamente sobre las tablas profiles y favorites,
mientras que la seguridad queda controlada por las políticas RLS. */

import { supabase } from '../lib/supabase'

const userService = {
  // Obtener el perfil del usuario activo
  async getProfile() {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  },

  // Actualiza el perfil del usuario actual
  async updateProfile(values) {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

    const normalizedValues = { ...values }

    // Si llega avatar pero no avatar_path, lo normalizamos
    if (normalizedValues.avatar && !normalizedValues.avatar_path) {
      normalizedValues.avatar_path = normalizedValues.avatar
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...normalizedValues,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .eq('is_active', true)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Baja lógica: marca al usuario como inactivo
  async deleteAccount() {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

    const { error } = await supabase
      .from('profiles')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (error) throw error

    return true
  },

  // Función para admin: recuperar todos los usuarios
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
import { supabase } from '../lib/supabase'

const userService = {
  // Obtener el usuario autenticado de Supabase Auth
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) throw error
    if (!user) throw new Error('No hay usuario autenticado')

    return user
  },

  // Obtener el perfil del usuario activo
  async getProfile() {
    const user = await this.getCurrentUser()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  },

  // Actualiza el perfil del usuario actual
  async updateProfile(values) {
    const user = await this.getCurrentUser()

    const normalizedValues = { ...values }

    if (normalizedValues.avatar && !normalizedValues.avatar_path) {
      normalizedValues.avatar_path = normalizedValues.avatar
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...normalizedValues,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .eq('is_active', true)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Baja lógica: marca al usuario como inactivo
  async deleteAccount() {
    const user = await this.getCurrentUser()

    const { error } = await supabase
      .from('profiles')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) throw error

    return true
  },

  // Obtener avatar_path del usuario actual
  async getAvatarPath() {
    const user = await this.getCurrentUser()

    const { data, error } = await supabase
      .from('profiles')
      .select('avatar_path')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return data?.avatar_path || null
  },

  // Obtener rutas de fotos de comunidad del usuario actual
  async getCommunityPhotoPaths() {
    const user = await this.getCurrentUser()

    const { data, error } = await supabase
      .from('community_photos')
      .select('image_path')
      .eq('user_id', user.id)

    if (error) throw error
    return (data || []).map((item) => item.image_path).filter(Boolean)
  },

  // Obtener rutas de audios del usuario actual
  async getAudioPaths() {
    const user = await this.getCurrentUser()

    const { data, error } = await supabase
      .from('audios')
      .select('audio_path')
      .eq('uploaded_by', user.id)

    if (error) throw error
    return (data || []).map((item) => item.audio_path).filter(Boolean)
  },

  // Ejecutar RPC de borrado total de cuenta
  async deleteAccountCompletely() {
    const { error } = await supabase.rpc('borrar_mi_cuenta')
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
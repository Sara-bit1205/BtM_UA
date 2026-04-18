import { supabase } from '../lib/supabase'
import { getPublicUrl, STORAGE_BUCKETS, removeFiles } from '../lib/storage'
import { getRelationValue } from '../utils/relation'

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

  async getMyCommunityPhotos() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) return []

    const { data, error } = await supabase
      .from('community_photos')
      .select(`
        id,
        user_id,
        image_path,
        description,
        characters(id, name)
      `)
      .eq('user_id', user.id)

    if (error) throw error

    return (data || []).map((foto) => ({
      id: foto.id,
      usuario: foto.user_id,
      imageUrl: getPublicUrl(STORAGE_BUCKETS.gallery, foto.image_path),
      imagePath: foto.image_path,
      descripcion: foto.description,
      personajeNombre: getRelationValue(foto.characters, 'name'),
    }))
  },

  async deleteMyCommunityPhotos(photoIds, currentPhotos = []) {
    if (!photoIds || photoIds.length === 0) return true

    const fotosABorrar = currentPhotos.filter((foto) => photoIds.includes(foto.id))
    const rutasStorage = fotosABorrar.map((foto) => foto.imagePath).filter(Boolean)

    if (rutasStorage.length > 0) {
      await removeFiles(STORAGE_BUCKETS.gallery, rutasStorage)
    }

    const { error } = await supabase
      .from('community_photos')
      .delete()
      .in('id', photoIds)

    if (error) throw error

    return true
  },

  async getAdminUsersList() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, name, email, created_at, role')
      .eq('role', 'user')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

}

export default userService
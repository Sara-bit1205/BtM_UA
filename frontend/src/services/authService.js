import { supabase } from '../lib/supabase'

async function updateProfileWithRetry(userId, updates, retries = 10, delay = 300) {
  for (let i = 0; i < retries; i++) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()

    if (error) throw error

    if (data && data.length > 0) {
      return data[0]
    }

    await new Promise((resolve) => setTimeout(resolve, delay))
  }

  throw new Error('No se pudo completar el perfil del usuario')
}

const authService = {
  async register({ email, password, username, name, birth_date, profileImage }) {
    const cleanEmail = email.trim().toLowerCase()
    const cleanUsername = username.trim()
    const cleanName = name.trim()

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          username: cleanUsername,
          name: cleanName,
        },
      },
    })

    if (error) throw error

    const user = data?.user
    if (!user) {
      throw new Error('No se pudo crear el usuario')
    }

    await updateProfileWithRetry(user.id, {
      username: cleanUsername,
      name: cleanName,
      birth_date: birth_date || null,
    })

    if (profileImage) {
      const fileExt = profileImage.name.split('.').pop()
      const fileName = `${user.id}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, profileImage, { upsert: true })

      if (uploadError) throw uploadError

      await updateProfileWithRetry(user.id, {
        avatar_path: fileName,
      })
    }

    await supabase.auth.signOut()

    return data
  },

  async login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    const userId = data?.user?.id
    if (!userId) throw new Error('No se ha podido obtener el usuario autenticado')

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, is_active')
      .eq('id', userId)
      .single()

    if (profileError) {
      await supabase.auth.signOut()
      throw profileError
    }

    if (!profile?.is_active) {
      await supabase.auth.signOut()
      throw new Error('Esta cuenta ha sido dada de baja y no puede iniciar sesión.')
    }

    return data
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
}

export default authService
/*Es simplemente un wrapper (o capa fina) sobre las funciones de supabase.auth.*/

import { supabase } from '../lib/supabase'

const authService = {
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

    if (error) throw error
    return data
  },

  async login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
}

export default authService
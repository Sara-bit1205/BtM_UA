import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [authUser, setAuthUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  const clearAuthState = () => {
    setSession(null)
    setAuthUser(null)
    setProfile(null)
    setRole(null)
  }

  const fetchProfile = async (userId, retries = 8, delay = 300) => {
    if (!userId) {
      setProfile(null)
      setRole(null)
      return
    }

    for (let i = 0; i < retries; i++) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error al cargar el perfil:', error.message)

        const message = error.message?.toLowerCase?.() || ''

        if (message.includes('jwt expired') || message.includes('invalid jwt')) {
          await supabase.auth.signOut()
          clearAuthState()
          return
        }

        setProfile(null)
        setRole(null)
        return
      }

      if (data) {
        if (data.is_active === false) {
          console.warn('Usuario inactivo → cerrando sesión')

          await supabase.auth.signOut()
          clearAuthState()
          return
        }

        setProfile(data)
        setRole(data?.role ?? null)
        return
      }

      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    setProfile(null)
    setRole(null)
  }

  const applySession = async (session) => {
    setSession(session)
    setAuthUser(session?.user ?? null)

    if (session?.user) {
      await fetchProfile(session.user.id)
    } else {
      setProfile(null)
      setRole(null)
    }
  }

  const refreshProfile = async () => {
    const userId = authUser?.id
    if (!userId) return
    await fetchProfile(userId)
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  useEffect(() => {
    let isMounted = true

    const loadInitialSession = async () => {
      try {
        setLoading(true)

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error('Error al obtener la sesión:', error.message)
          clearAuthState()
          return
        }

        if (!isMounted) return
        await applySession(session)
      } catch (err) {
        console.error('Error en loadInitialSession:', err)
        if (isMounted) {
          clearAuthState()
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return

      setSession(session)
      setAuthUser(session?.user ?? null)

      setTimeout(async () => {
        if (!isMounted) return

        try {
          if (session?.user) {
            await fetchProfile(session.user.id)
          } else {
            setProfile(null)
            setRole(null)
          }
        } catch (err) {
          console.error('Error al sincronizar auth:', err)
        } finally {
          if (isMounted) setLoading(false)
        }
      }, 0)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      authUser,
      profile,
      role,
      loading,
      logout,
      refreshProfile,
      isAuthenticated: !!authUser,
      isAdmin: role === 'admin',
    }),
    [session, authUser, profile, role, loading]
  )
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
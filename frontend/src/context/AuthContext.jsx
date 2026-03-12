import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('btm_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (userData, token) => {
    localStorage.setItem('btm_user', JSON.stringify(userData))
    localStorage.setItem('btm_token', token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('btm_user')
    localStorage.removeItem('btm_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

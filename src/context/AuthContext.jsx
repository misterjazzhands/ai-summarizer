import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('synapse_user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('synapse_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('synapse_user')
    }
  }, [user])

  const login = (email, password) => {
    // Accept any credentials — simulate auth
    const name = email.split('@')[0]
    const displayName = name.charAt(0).toUpperCase() + name.slice(1)
    const userData = {
      email,
      displayName,
      initials: displayName.slice(0, 2).toUpperCase(),
      joinedAt: new Date().toISOString(),
    }
    setUser(userData)
    return userData
  }

  const register = (name, email, password) => {
    const userData = {
      email,
      displayName: name,
      initials: name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      joinedAt: new Date().toISOString(),
    }
    setUser(userData)
    return userData
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}

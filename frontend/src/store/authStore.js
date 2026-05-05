import { create } from 'zustand'

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role'),
  fullName: localStorage.getItem('fullName'),
  login: (token, role, fullName) => {
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    localStorage.setItem('fullName', fullName)
    set({ token, role, fullName })
  },
  logout: () => {
    localStorage.clear()
    set({ token: null, role: null, fullName: null })
  },
}))

export default useAuthStore

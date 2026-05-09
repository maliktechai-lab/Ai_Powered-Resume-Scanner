import { create } from 'zustand'

const useAuthStore = create((set) => ({
  role: localStorage.getItem('role'),
  setRole: (role) => {
    localStorage.setItem('role', role)
    set({ role })
  },
  clearRole: () => {
    localStorage.removeItem('role')
    set({ role: null })
  },
}))

export default useAuthStore

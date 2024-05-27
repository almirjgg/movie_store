export default {
  login(email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find((u: any) => u.email === email && u.password === password)
    if (user) {
      localStorage.setItem('isAuthenticated', 'true')
      return true
    }
    return false
  },

  logout() {
    localStorage.removeItem('isAuthenticated')
  },

  isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true'
  }
}

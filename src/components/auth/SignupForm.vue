<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
      <h2 class="text-2xl font-bold mb-4 text-center">Sign up</h2>
      <form @submit.prevent="signup">
        <div class="mb-4">
          <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <input
            type="text"
            id="name"
            v-model="name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div class="mb-4">
          <label for="email" class="block text-gray-700 text-sm font-bold mb-2"
            >Email:</label
          >
          <input
            type="email"
            id="email"
            v-model="email"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-gray-700 text-sm font-bold mb-2"
            >Password:</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div class="mb-6">
          <label for="confirmPassword" class="block text-gray-700 text-sm font-bold mb-2"
            >Confirm Password:</label
          >
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div class="flex items-center justify-between">
          <button
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
          Sign up
          </button>
          <router-link
            to="/login"
            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
          Sign in
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
export default defineComponent({
  setup() {
    const toast = useToast()
    const router = useRouter()
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')

    const signup = () => {
      const validationErrors = validateForm()

      if (validationErrors.length === 0) {
        // Lógica de registro simulada (almacenamiento local)
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const existingUser = users.find((user: any) => user.email === email.value)

        if (existingUser) {
          toast.error('El correo electrónico ya está registrado')
        } else {
          users.push({ name: name.value, email: email.value, password: password.value })
          localStorage.setItem('users', JSON.stringify(users))
          router.push('/login')
          toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.')
        }
      } else {
        validationErrors.forEach((error) => toast.error(error))
      }
    }

    const validateForm = (): string[] => {
      const errors: string[] = []
      if (name.value.trim() === '') {
        errors.push('El nombre es obligatorio')
      }
      if (!validateEmail(email.value)) {
        errors.push('El correoelectrónico no es válido')
      }
      if (password.value.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres')
      }
      if (password.value !== confirmPassword.value) {
        errors.push('Las contraseñas no coinciden')
      }
      return errors
    }

    const validateEmail = (email: string): boolean => {
      const re = /\S+@\S+\.\S+/
      return re.test(email)
    }

    return {
      name,
      email,
      password,
      confirmPassword,
      signup
    }
  }
})
</script>

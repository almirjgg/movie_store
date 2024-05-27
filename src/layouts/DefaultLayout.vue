<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-gray-800 text-white p-4">
      <nav class="container mx-auto flex justify-between items-center">
        <router-link to="/movies" class="text-xl font-bold">Movie Store</router-link>
        <div>
          <button
            @click="logout"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>

    <main class="container mx-auto p-4 flex-grow">
      <router-view />
    </main>

    <footer class="bg-gray-800 text-white text-center p-4">
      <p>Movie Store &copy; 2024</p>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/authService'

export default defineComponent({
  setup() {
    const router = useRouter()

    const logout = () => {
      authService.logout()
      router.push('/login')
    }
    return { logout }
  }
})
</script>

<template>
  <div class="bg-black min-h-screen text-white">
    <div v-if="isLoading" class="flex items-center justify-center h-screen">
      <div class="text-white text-center p-4">Cargando detalles de la película...</div>
    </div>
    <div v-else-if="error" class="flex items-center justify-center h-screen">
      <div class="text-red-500 text-center p-4">
        <p>Error al cargar los detalles de la película:</p>
        <p>{{ errorMessage }}</p>
        <button
          @click="fetchMovie"
          class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Reintentar
        </button>
      </div>
    </div>
    <div v-else class="container mx-auto p-4">
      <div class="bg-white rounded-lg overflow-hidden shadow-md md:flex md:flex-row">
        <img
          :src="movie?.Poster"
          :alt="movie?.Title"
          class="w-full md:w-1/3 object-cover mb-4 md:mb-0"
        />
        <div class="p-4 md:w-2/3">
          <h1 class="text-2xl font-bold mb-2 text-black">{{ movie?.Title }}</h1>
          <p class="text-gray-600 text-sm mb-2">{{ movie?.Year }}</p>
          <p class="flex items-center mb-2">
            <span class="material-symbols-outlined text-yellow-500 mr-1">star</span>
            <span class="ml-1 text-yellow-500">({{ movie?.imdbRating }})</span>
          </p>

          <div v-if="movie">
            <p v-if="movie.Genre" class="mb-2">
              <span class="font-semibold text-black">Género:</span>
              <span class="text-gray-700"> {{ movie.Genre }}</span>
            </p>
            <p v-if="movie.Director" class="mb-2">
              <span class="font-semibold text-black">Director:</span>
              <span class="text-gray-700"> {{ movie.Director }}</span>
            </p>
            <p v-if="movie.Actors" class="mb-2">
              <span class="font-semibold text-black">Actores:</span>
              <span class="text-gray-700"> {{ movie.Actors }}</span>
            </p>
            <p v-if="movie.Plot" class="mb-2">
              <span class="font-semibold text-black">Trama:</span>
              <span class="text-gray-700"> {{ movie.Plot }}</span>
            </p>
            <p v-if="movie.Awards" class="mb-2">
              <span class="font-semibold text-black">Premios:</span>
              <span class="text-gray-700"> {{ movie.Awards }}</span>
            </p>
          </div>

          <button
            @click="$router.go(-1)"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Regresar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import movieService from '@/services/movieService'
import type { Movie } from '@/types/Movie'

export default defineComponent({
  setup() {
    const route = useRoute()
    const toast = useToast()
    const movie = ref<Movie | null>(null)
    const isLoading = ref(false)
    const error = ref(false)
    const errorMessage = ref('')

    const fetchMovie = async () => {
      isLoading.value = true
      error.value = false
      try {
        const movieId = route.params.id as string
        const response = await movieService.getMovieById(movieId)
        movie.value = response
      } catch (err: any) {
        error.value = true
        errorMessage.value =
          err.message === 'Incorrect IMDb ID.' ? 'Película no encontrada' : 'Error de conexión'
        toast.error(errorMessage.value)
        console.error(err)
      } finally {
        isLoading.value = false
      }
    }

    onMounted(fetchMovie)

    return {
      movie,
      isLoading,
      error,
      errorMessage,
      fetchMovie
    }
  }
})
</script>

<style scoped>
.transform {
  transition: transform 0.2s;
}

.transform:hover {
  transform: scale(1.05);
}
</style>

<template>
  <div class="bg-black min-h-screen">
    <h1 class="text-white text-3xl font-bold p-4">Movies</h1>

    <div class="container mx-auto p-4">
      <input
        v-model="searchQuery"
        @keydown="handleKeyDown"
        type="text"
        placeholder="Search movies..."
        class="w-full p-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-500"
      />
    </div>

    <div v-if="isLoading" class="text-white text-center p-4">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center p-4">
      Error al cargar las películas: {{ error }}
    </div>

    <div v-else class="container mx-auto p-4">
      <section class="flex justify-between items-center mb-4">
        <div v-if="searchQuery.trim() !== ''" class="text-white">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
      </section>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        <div
          v-for="movie in filteredMovies"
          :key="movie.imdbID"
          class="transform bg-white rounded-lg overflow-hidden shadow-md"
        >
          <router-link :to="`/movies/${movie.imdbID}`">
            <img :src="movie.Poster" :alt="movie.Title" class="w-full h-64 object-cover" />
            <div class="p-4">
              <h2 class="text-lg font-semibold text-black mb-1">{{ movie.Title }}</h2>
              <p class="text-gray-600 text-sm">{{ movie.Year }}</p>
            </div>
          </router-link>
        </div>
      </div>

      <div
        class="mt-4 flex justify-center"
        v-if="!isLoading && !error && movies.length > 0 && searchQuery.trim() !== ''"
      >
        <button
          @click="previousPage"
          v-if="currentPage !== 1"
          class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-l-md"
        >
          Previous
        </button>
        <button
          @click="nextPage"
          v-if="hasMorePages"
          class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-r-md"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import type { Movie } from '@/types/Movie'
import movieService from '@/services/movieService'

export default defineComponent({
  setup() {
    const toast = useToast()
    const router = useRouter()
    const movies = ref<Movie[]>([])
    const searchQuery = ref('')
    const currentPage = ref(1)
    const totalResults = ref(0)
    const isLoading = ref(false)
    const error = ref('')

    const genres = ref<string[]>([])
    const years = ref<number[]>([])
    const selectedGenre = ref('')
    const selectedYear = ref('')

    const filteredMovies = computed(() => {
      let filtered = movies.value
      if (selectedGenre.value) {
        filtered = filtered.filter((movie) => movie.Genre?.includes(selectedGenre.value))
      }
      if (selectedYear.value) {
        filtered = filtered.filter((movie) => movie.Year === selectedYear.value)
      }
      return filtered
    })

    const totalPages = computed(() => {
      // Asegurarse de que totalResults sea un número antes de calcular totalPages
      return isNaN(totalResults.value) ? 0 : Math.ceil(totalResults.value / 10)
    })

    const fetchMovies = async (
      query: string = '',
      page: number = currentPage.value,
      plot: 'short' | 'full' = 'short',
      searchType?: 's' | 'i'
    ) => {
      isLoading.value = true
      error.value = ''

      try {
        const response = await movieService.searchMovies(query, page, plot, searchType)
        if (response.Response === 'True' && Array.isArray(response.Search)) {
          movies.value = response.Search
          totalResults.value = parseInt(response.totalResults ?? '0', 10) // Manejar NaN
          isLoading.value = false
        } else {
          movies.value = []
          error.value = response.Error || 'No se encontraron películas'
          toast.error(error.value)
        }
      } catch (err) {
        error.value = 'Error al cargar las películas'
        toast.error(error.value)
        console.error(err)
      }
    }
    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        fetchMovies(searchQuery.value, currentPage.value, 'short', 's') // Pasa los parámetros
      }
    }

    const nextPage = () => {
      if (hasMorePages.value) {
        currentPage.value++

        fetchMovies(searchQuery.value, currentPage.value, 'short', 's') // Pasa los parámetros
      }
    }

    const hasMorePages = computed(() => {
      return currentPage.value < totalPages.value // Compara con totalPages
    })
    let debounceTimeout: ReturnType<typeof setTimeout> | null = null

    watch(searchQuery, (newQuery) => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }

      if (newQuery.trim() === '') {
        fetchMovies('batman', 1, 'short', 's')
      } else {
        debounceTimeout = setTimeout(() => {
          fetchMovies(newQuery, currentPage.value)
        }, 300)
      }
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        fetchMovies(searchQuery.value, currentPage.value)
      }
    }

    onMounted(async () => {
      await fetchMovies('batman', 1, 'short', 's')
    })

    return {
      movies,
      searchQuery,
      currentPage,
      isLoading,
      error,
      previousPage,
      nextPage,
      hasMorePages,
      genres,
      years,
      selectedGenre,
      selectedYear,
      filteredMovies,
      totalPages,
      handleKeyDown
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

import type { Movie } from '@/types/Movie'

interface SearchResponse {
  Search?: Movie[]
  totalResults?: string
  Response: string
  Error?: string
}

const API_KEY = import.meta.env.VITE_OMDB_API_KEY
const BASE_URL = 'http://www.omdbapi.com/'

async function searchMovies(
  query: string,
  page = 1,
  plot: 'short' | 'full' = 'short',
  searchType?: 's' | 'i'
): Promise<SearchResponse> {
  const searchParam = searchType === 'i' ? 'i' : 's' // Determinar el parámetro de búsqueda
  const url = `${BASE_URL}?apikey=${API_KEY}&${searchParam}=${query}&page=${page}&plot=${plot}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Error en la solicitud a la API')
  }
  const data = await response.json()
  return data
}

async function getMovieById(imdbID: string, plot: 'short' | 'full' = 'short'): Promise<Movie> {
  const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=${plot}`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }
    const data: Movie = await response.json()
    if (!data) {
      throw new Error('Película no encontrada')
    }
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al obtener la película: ${error.message}`)
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export default {
  searchMovies,
  getMovieById
}

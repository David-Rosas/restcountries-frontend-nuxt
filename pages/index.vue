<template>
  <div class="min-h-screen bg-gray-100 py-10 px-4">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">
        🌍 Consulta de países con mayor densidad
      </h1>

      <form
        @submit.prevent="fetchCountries"
        class="grid grid-cols-1 md:grid-cols-[1fr_120px_auto] gap-4 mb-6"
      >
        <input
          v-model="username"
          placeholder="Nombre de usuario"
          class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
        />
        <input
          v-model.number="limit"
          type="number"
          min="1"
          max="50"
          placeholder="Cantidad"
          class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
        />
        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg transition duration-200"
        >
          Consultar
        </button>
      </form>

      <!-- Alerta de error -->
      <div
        v-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
      >
        <strong class="font-bold">Error:</strong>
        <span class="block">{{ error }}</span>
      </div>

      <!-- Tabla de resultados -->
      <div v-if="countries.length" class="overflow-x-auto rounded-lg shadow">
        <table class="w-full text-left border border-gray-200">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="py-3 px-4 border-b">Nombre</th>
              <th class="py-3 px-4 border-b">Área (km²)</th>
              <th class="py-3 px-4 border-b">Población</th>
              <th class="py-3 px-4 border-b">Densidad</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in countries"
              :key="c.name"
              class="hover:bg-gray-50 transition"
            >
              <td class="py-3 px-4 border-b">{{ c.name }}</td>
              <td class="py-3 px-4 border-b">{{ c.area.toLocaleString() }}</td>
              <td class="py-3 px-4 border-b">{{ c.population.toLocaleString() }}</td>
              <td class="py-3 px-4 border-b">{{ c.density.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gql } from '@apollo/client/core'

const username = ref('')
const limit = ref(10)
const countries = ref([])
const error = ref('')

const fetchCountries = async () => {
  error.value = ''

  if (!username.value.trim()) {
    error.value = 'Por favor ingresa un nombre de usuario válido.'
    setTimeout(() => (error.value = ''), 3000)
    return
  }

  const { $apollo } = useNuxtApp()

  const query = gql`
    query ($username: String!, $limit: Int!) {
      topCountries(username: $username, limit: $limit) {
        name
        area
        population
        density
      }
    }
  `

  try {
    const response = await $apollo.query({
      query,
      variables: {
        username: username.value,
        limit: limit.value,
      },
    })

    countries.value = response.data.topCountries
  } catch (e) {
    error.value = 'Hubo un error consultando los países.'
    setTimeout(() => (error.value = ''), 3000)
  }
}
</script>

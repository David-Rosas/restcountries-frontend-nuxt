<template>
  <div>
    <nav class="bg-gray-100 border-b mb-6">
      <div class="max-w-4xl mx-auto px-4 py-3 flex gap-4">
        <NuxtLink to="/" class="text-blue-600 hover:underline font-semibold">Consulta de Países</NuxtLink>
        <NuxtLink to="/logs" class="text-blue-600 hover:underline font-semibold">Ver Logs</NuxtLink>
      </div>
    </nav>
    <NuxtPage />
  </div>
</template>
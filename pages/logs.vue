<template>
  <div class="max-w-6xl mx-auto p-6 ">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">
      Historial de Consultas
    </h1>

    <DateRangeFilter
      :start-date="startDate"
      :end-date="endDate"
      @filter="updateDateRange"
    />

    <div v-if="error" class="text-red-600 mt-4">{{ error }}</div>

    <div v-if="logs.length" class="mt-6 overflow-x-auto rounded-lg shadow">
      <LogTable :logs="logs" @update="updateLog" @delete="deleteLog" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { gql } from "@apollo/client/core";
import DateRangeFilter from "~/components/logs/LogsFilter.vue";
import LogTable from "~/components/logs/LogsTable.vue";

const logs = ref([]);
const error = ref("");
const startDate = ref("");
const endDate = ref("");

const { $apollo } = useNuxtApp();

const fetchLogs = async () => {
  try {
    const response = await $apollo.query({
      query: gql`
        query ($startDate: String, $endDate: String) {
          logs(startDate: $startDate, endDate: $endDate) {
            id
            username
            request_timestamp
            num_countries_returned
            countries_details {
              name
              area
              population
              density
            }
          }
        }
      `,
      variables: { startDate: startDate.value, endDate: endDate.value },
      fetchPolicy: "no-cache",
    });
    logs.value = response.data.logs;
  } catch (err) {
    error.value = "Error al obtener los logs.";
  }
};

const updateDateRange = ( data: object ) => {
  startDate.value = data.startDate;
  endDate.value = data.endDate;
  fetchLogs();
};

const updateLog = async (id: number, newUsername: string) => {
  try {
    await $apollo.mutate({
      mutation: gql`
        mutation ($id: ID!, $username: String!) {
          updateLog(id: $id, username: $username) {
            id
          }
        }
      `,
      variables: { id, username: newUsername },
    });
    fetchLogs();
  } catch (err) {
    error.value = "Error actualizando el log.";
  }
};

const deleteLog = async (id: number) => {
  try {
    await $apollo.mutate({
      mutation: gql`
        mutation ($id: ID!) {
          deleteLog(id: $id)
        }
      `,
      variables: { id },
    });
    fetchLogs();
  } catch (err) {
    error.value = "Error eliminando el log.";
  }
};

onMounted(fetchLogs);
</script>

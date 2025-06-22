import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'

export default defineNuxtPlugin((nuxtApp) => {
  
  const config = useRuntimeConfig()
console.log('Apollo plugin initialized:', config.public.graphqlEndpoint)
  const httpLink = createHttpLink({
    uri: config.public.graphqlEndpoint,
  })

  const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  })

  nuxtApp.provide('apollo', apolloClient)
})
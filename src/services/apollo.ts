import { ApolloClient, InMemoryCache } from '@apollo/client'

const baseUrl =
  process.env.NEXT_PUBLIC_SUBGRAPH_API_KEY && process.env.NEXT_PUBLIC_SUBGRAPH_ID
    ? `https://gateway.thegraph.com/api/${process.env.NEXT_PUBLIC_SUBGRAPH_API_KEY}/subgraphs/id/${process.env.NEXT_PUBLIC_SUBGRAPH_ID}`
    : `https://api.studio.thegraph.com/query/39661/simple-marketplace/version/latest`

const client = new ApolloClient({
  uri: baseUrl,
  cache: new InMemoryCache(),
})

export default client

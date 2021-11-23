import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";


// const subgraphUrl = 'http://graph-node-8000-963457672.us-east-2.elb.amazonaws.com'
// const subgraphUrl = 'http://18.117.103.245:8000'
// 生产环境直接通过url访问
const subgraphUrl = process.env.REACT_APP_GRAPQL

export const client = new ApolloClient({
  uri: `/query`,
  cache: new InMemoryCache(),
})


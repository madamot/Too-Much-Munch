import { GraphQLClient } from 'graphql-request';

export function graphQLClient({ query, variables, preview }) {

  const endpoint = `https://toomuchmunch.herokuapp.com/graphql`;

  const client = new GraphQLClient(endpoint, {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  return client.request(query, variables);
}
import { GraphQLClient } from 'graphql-request';

export function StrapiGQLClient({ query, variables, preview }) {

const endpoint = 'http://localhost:1337/graphql';

const client = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  }
});

return client.request(query, variables);
}
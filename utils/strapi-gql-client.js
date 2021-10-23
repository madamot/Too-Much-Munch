import { GraphQLClient } from 'graphql-request';

export function StrapiGQLClient({ query, variables, preview }) {

const endpoint = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/graphql`;

const client = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  }
});

return client.request(query, variables);
}
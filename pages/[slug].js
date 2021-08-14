import React from 'react'
import SliceManager from '../components/SliceManager';
import { graphQLClient } from '../lib/graphql-client';

const universal = ({ data }) => {
    const slices = data.universals[0].slices
    return <>{slices && <SliceManager slices={slices} />}</>
}

export default universal

const UNIVERSAL_QUERY = `
    query Universal {
        universals(where: {slug:"who-we-are"}) {
        id
        slug
        name
        slices {
            ... on ComponentSlicesHero {
            __typename
            id
            image {
                url
            }
            content {
                id
                label
                title
                text
                theme
            }
            }
        }
        }
    }
`;

export async function getStaticProps({ params, preview = null }) {
  const data = await graphQLClient({
    query: UNIVERSAL_QUERY,
    variables: { "slug": params.slug }
  });
  return {
    props: { data, preview },
  };
}

const PATHS_QUERY = `
    query Universal {
        universals {
        slug
        }
    }
`;

export async function getStaticPaths() {
  const universals = await graphQLClient({
    query: PATHS_QUERY,
  });

  const paths = universals.universals.map((universal) => ({
    params: { slug: universal.slug },
  }))

  return { paths, fallback: false }
}
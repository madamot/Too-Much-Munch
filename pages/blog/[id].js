import React, { useState } from 'react';
import Head from 'next/head'
import useSWR from 'swr';
import { gql } from 'graphql-request';
import Layout from '../../components/layout/layout';
import Button from '../../components/Button/Button';
import EditForm from '../../components/EditForm/EditForm';
import { graphQLClient } from '../../utils/graphql-client';

import { request } from "../../utils/datocms";

const PATHS_QUERY = `
  query MyQuery {
    allBlogs {
      id
    }
  }
`;

export async function getStaticPaths() {
  const blogs = await request({
    query: PATHS_QUERY,
  });

  const paths = blogs.allBlogs.map((blog) => ({
    params: { id: blog.id },
  }))

  return { paths, fallback: false }
}


const BLOG_QUERY = `
query MyQuery($id: ItemId) {
  blog(filter: {id: {eq: $id}}) {
    title
  }
}
`;

export async function getStaticProps({ params }) {
  const blog = await request({
    query: BLOG_QUERY,
    variables: { id: params.id },
    // preview: context.preview
  });
  return {
    props: { blog }
  };
}

export default function BlogPost({ blog }) {

  return (
    <Layout>
      <h1>{blog.blog.title}</h1>
    </Layout>
  );
};

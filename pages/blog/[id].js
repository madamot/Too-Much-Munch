import React, { useState } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import Router from 'next/router';
import useSWR from 'swr';
import { gql } from 'graphql-request';
import Layout from '../../components/layout/layout';
import Button from '../../components/Button/Button';
import EditForm from '../../components/EditForm/EditForm';
import { graphQLClient } from '../../utils/graphql-client';

import { request } from "../../utils/datocms";


const BLOG_QUERY = `
query MyQuery($id: ItemId) {
  blog(filter: {id: {eq: $id}}) {
    title
  }
}
`;

export async function getStaticProps(context) {
  const data = await request({
    query: BLOG_QUERY,
    variables: { limit: 10 },
    preview: context.preview
  });
  return {
    props: { data }
  };
}


const PATHS_QUERY = `
  query MyQuery {
    allBlogs {
      id
    }
  }
`;

export async function getStaticPaths() {
  const data = await request({
    query: PATHS_QUERY,
    variables: { limit: 10 },
  });

  const paths = data.allBlogs.map((blog) => ({
    params: { id: blog.id },
  }))

  return { paths, fallback: false }
}

export default function BlogPost({data}) {

  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <h1>blog post</h1>
      <h2>{data.blog.title}</h2>
    </Layout>
  );
};

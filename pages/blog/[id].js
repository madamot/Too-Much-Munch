import React, { useState } from 'react';
import Head from 'next/head'
import useSWR from 'swr';
import { gql } from 'graphql-request';
import Layout from '../../components/layout/layout';
import Button from '../../components/Button/Button';
import EditForm from '../../components/EditForm/EditForm';
import { graphQLClient } from '../../utils/graphql-client';

import { StructuredText } from "react-datocms";

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
    id
    title
    subtitle
    blogImage {
      url
      alt
    }
    blogDate
    content {
      value
      blocks {
        __typename
        ... on ImageRecord {
          id
          image {
            url
          }
        }
        ... on VideoRecord {
          __typename
          id
          video {
            url
          }
        }
      }
    }
  }
}
`;

export async function getStaticProps(context) {
  const blog = await request({
    query: BLOG_QUERY,
    variables: { id: context.params.id },
    preview: context.preview
  });
  return {
    props: { blog }
  };
}

export default function BlogPost({ blog }) {

  console.log(blog);

  return (
    <Layout>
      <h1>{blog.blog.title}</h1>
      <h2 style={{
        fontWeight: 200
      }}>{blog.blog.subtitle}</h2>
      <img width='100%' src={blog.blog.blogImage.url} alt={blog.blog.blogImage.alt} />
      <StructuredText
        data={blog.blog.content}
        renderInlineRecord={({ record }) => {
          switch (record.__typename) {
            case "BlogPostRecord":
              return <a href={`/blog/${record.slug}`}>{record.title}</a>;
            default:
              return null;
          }
        }}
        renderLinkToRecord={({ record, children }) => {
          switch (record.__typename) {
            case "BlogPostRecord":
              return <a href={`/blog/${record.slug}`}>{children}</a>;
            default:
              return null;
          }
        }}
        renderBlock={({ record }) => {
          switch (record.__typename) {
            case "ImageRecord":
              return <img width='100%' src={record.image.url} alt={record.image.alt} />;
            default:
              return null;
          }
        }}
      />

    </Layout>
  );
};

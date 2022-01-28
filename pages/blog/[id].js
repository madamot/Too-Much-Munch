import React, { useState } from 'react';
import Head from 'next/head'
import useSWR from 'swr';
import { gql } from 'graphql-request';
import Layout from '../../components/layout/layout';
import Button from '../../components/Button/Button';
import EditForm from '../../components/EditForm/EditForm';
import { graphQLClient } from '../../utils/graphql-client';

import { useRouter } from 'next/router'

// import { StructuredText } from "react-datocms";

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
      links {
        __typename
        ... on BlogRecord {
          id
          slug
          title
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

export default function BlogPost({ blog, href }) {
const router = useRouter()
  console.log(blog);

  return (
    <Layout>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="description" content={blog.blog.subtitle}></meta>

        <meta property="og:title" content={blog.blog.title} key="ogtitle" />
        <meta property="og:description" content={blog.blog.subtitle} key="ogdesc" />

        <meta property="og:url" content={`www.toomuchmunch.com/blog/${blog.blog.id}`} key="ogurl" />
        <meta property="og:image" content={blog.blog.blogImage.url} key="ogimage" />
        <meta property="og:site_name" content='TooMuchMunch' key="ogsitename" />
        <meta property="og:title" content={blog.blog.title} key="ogtitle" />
        <meta property="og:description" content={blog.blog.subtitle} key="ogdesc" />

        <title>{blog.blog.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>{blog.blog.title}</h1>
      <h2 style={{
        fontWeight: 200
      }}>{blog.blog.subtitle}</h2>
      <img width='100%' src={blog.blog.blogImage.url} alt={blog.blog.blogImage.alt} />
      {/* <StructuredText
        data={blog.blog.content}
        renderInlineRecord={({ record }) => {
          switch (record.__typename) {
            case "BlogRecord":
              return <a target="_blank" href={`/blog/${record.id}`}>{record.title}</a>;
            default:
              return null;
          }
        }}
        renderLinkToRecord={({ record, children }) => {
          switch (record.__typename) {
            case "BlogRecord":
              return <a style={{color: "#848484", borderBottom: ".05em solid #848484", cursor: "pointer"}} target="_blank" href={`/blog/${record.slug}`}>{children}</a>;
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
      /> */}

    </Layout>
  );
};

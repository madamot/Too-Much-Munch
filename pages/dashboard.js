import React from 'react';
import Head from 'next/head'
import Layout from '../components/layout/layout'
import Button from '../components/Button/Button';
import { useAuth0 } from '@auth0/auth0-react';

import { withAuthenticationRequired } from '@auth0/auth0-react';

function Profile() {
  const {
      isLoading,
      isAuthenticated,
      error,
      user,
      loginWithRedirect,
      logout,
    } = useAuth0();

  return (
    <Layout>
      <Head>
        <title>Too Much Munch</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1>Profile</h1>
        <p>This is the profile page.</p>
        <pre>{JSON.stringify(user.nickname || { }, null, 2)}</pre>
      </div>
    </Layout>
      );
      }

      export default withAuthenticationRequired(Profile, {
        // Show a message while the user waits to be redirected to the login page.
        onRedirecting: () => <div>Redirecting you to the login page...</div>,
      });

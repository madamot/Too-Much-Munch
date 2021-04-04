import '../styles/globals.css'
import '../static/style.css'
import Head from 'next/head'
import { Auth0Provider } from '@auth0/auth0-react';

const App = ({ Component, pageProps }) => {
  let url = "";
  if (typeof window !== "undefined") {
    url = window.location.href;
    console.log(url);
  }
  return (
   <Auth0Provider
     domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
     clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
     redirectUri={url}
   >
     <Head>
       <link rel="preconnect" href="https://fonts.gstatic.com" />
       <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
       <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300&display=swap" rel="stylesheet" />
       </Head>

     <Component {...pageProps} />
   </Auth0Provider>
  )
}

export default App

import '../styles/globals.css'
import { Auth0Provider } from '@auth0/auth0-react';

export default ({ Component, pageProps }) => (
 <Auth0Provider
   domain="madamot.eu.auth0.com"
   clientId="nEQCfkAaLNeddxUxQu0MYDNQB88OyLi6"
   redirectUri="http://localhost:3000"
 >
  <Component {...pageProps} />
 </Auth0Provider>
)

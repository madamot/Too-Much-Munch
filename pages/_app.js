import '../styles/globals.css'
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

     <Component {...pageProps} />
   </Auth0Provider>
  )
}

export default App

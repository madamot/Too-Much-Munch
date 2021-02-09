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
     domain="madamot.eu.auth0.com"
     clientId="nEQCfkAaLNeddxUxQu0MYDNQB88OyLi6"
     redirectUri={url}
   >

     <Component {...pageProps} />
   </Auth0Provider>
  )
}

export default App

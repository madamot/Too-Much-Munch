import Head from 'next/head'
import Layout from '../components/layout/layout'
import Button from '../components/Button/Button';
import Link from 'next/link';
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { useAuth0 } from '@auth0/auth0-react';

export default function Home() {
    const { pathname, query } = useRouter();
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

      <main className={styles.main}>
        <h1 className={styles.title}>
          Too Much Munch 🌮
        </h1>

        <p className={styles.description}>Breakfast, Dinner & Lunch</p>

        {isLoading ? (
          <div>Loading...</div>
        ) : (null)}

        {error ? (
          <div>Oops... {error.message}</div>
        ) : (null)}

        {isAuthenticated ? (
          <div>
            Hello {user.name}{' '}
            <button onClick={() => logout({ returnTo: window.location.origin })}>
              Log out
            </button>
          </div>
        ) : (
          <button onClick={loginWithRedirect}>Log in</button>
        )}


        {!isLoading && (
          isAuthenticated ? (
            <div className="multiButtons">
              <Link href='/dashboard'>
                <Button primary size="small" label="Dashboard" />
              </Link>
            </div>
          ) : (
            <div className="multiButtons">
              <Button size="small" onClick={loginWithRedirect} label="Log in" />
            </div>
          )
        )}

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Find your food favourites &rarr;</h3>
            <p>Collect your favourite recipes and store them in a personal cookbook.</p>
          </div>


          <div className={styles.card}>
            <h3>Share &rarr;</h3>
            <p>Add friends, family, partners or housemates to a shared cookbook.</p>
          </div>


          <div className={styles.card}>
            <h3>Discover &rarr;</h3>
            <p>View the food favourites of members in your shared cookbook.</p>
          </div>


          <div className={styles.card}>
            <h3>Eat Healthier & Plan &rarr;</h3>
            <p>Plan out your meals for the week with your favoruites.</p>
          </div>

        </div>

        <p className={styles.description}>Coming Soon...</p>
      </main>
    </Layout>
  )
}

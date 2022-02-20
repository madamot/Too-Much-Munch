import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Head from 'next/head'
import Link from 'next/link';
import Layout from '../../components/layout/layout'
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import Filter from '../../components/Filter/Filter';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/client"

import { useAuth0 } from '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

import { useDisplay } from "../../utils/hooks";

import useSWR from 'swr';
import { gql } from 'graphql-request';
import { StrapiGQLClient } from '../../utils/strapi-gql-client';
import { graphQLClient } from '../../utils/graphql-client';


const Grid = styled.div`
  display: ${props => props.display == 'card' ? "flex" : "block"}; 
  grid-template-columns: auto auto auto;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  &:after {
  content: "";
  width: 250px;
  margin: 1rem;
  @media (max-width: 850px) {
        border-radius: 0;
        margin: 0;
        /* height: 25rem; */
        width: 45vw;
        /* max-width: 200px;
        min-width: 200px; */
      }
      @media (max-width: 588px) {
        border-radius: 0;
        margin: 1rem;
        height: 25rem;
        width: 100vw;
        /* max-width: 200px;
        min-width: 200px; */
      }
}
`;

const Dashboard = () => {
  const [session, loading] = useSession()

  const router = useRouter();

    const [ display, setDisplay ] = useDisplay('card');

    let id = router.query.id;

    let you = session?.id;

  const fetcher = async (query) => await StrapiGQLClient({
    query: query,
    variables: {
        id,
        you
    },
  });
  const query = gql`
    query getRecipesByUser($id: ID!) {
      user(id: $id) {
        id
        username
        recipes {
          id
          title
          image {
            url
          }
          course {
            id
            uid
            name
          }
          cuisine {
            id
            uid
            name
          }
          meal {
            id
            uid
            name
          }
        }
      }
    }
  `;

  const { data, error } = useSWR(() => id ? query : null, fetcher);

  const [recipes, setRecipes] = useState(data?.user?.recipes)

  useEffect(() => {
    setRecipes(data?.user?.recipes);
}, [data]);

  console.log("recipes", data?.user?.recipes);

    const following = data?.UserFollowing?.following.map(function (obj) {
      return parseInt(obj.id);
    });

   if (error) return <div>{`failed to load: ${error}`}</div>;

   const filterCuisine = (category, displaying) => {
    const result = displaying?.filter(item => !category.includes(item.cuisine.uid));
    return result
  }

  const filterCourse = (category, displaying) => {
    const result = displaying?.filter(item => !category.includes(item.course.uid));
    return result
  }

  const filterMeal = (category, displaying) => {
    const result = displaying?.filter(item => !category.includes(item.meal.uid));
    return result
  }

  const filterAction = (category) => {

    let cuisine = filterCuisine(category, data?.user?.recipes)

    let course = filterCourse(category, cuisine)
    let meal = filterMeal(category, course)

    setRecipes(meal)
  }


  return (
    <Layout dashboard>
      <Head>
        <title>Dashboard</title>
        <meta property="og:image" content='/image.PNG' />
        <meta name="twitter:image" content='/image.PNG' />
      </Head>


      {loading ? (
        <div>Loading...</div>
      ) : (null)}

      <div>
        {you == id ? (
          <h1>Your recipes 🍳</h1>
        ) : (<h1>{data?.user?.username}</h1>)}

        <div>
          <Button size='small' label='Card View' onClick={() => setDisplay('card')}/>
          <Button size='small' label='List View' onClick={() => setDisplay('list')}/>
        </div><br />
        <Filter filterAction={filterAction} />
        {you != id && <div>
          <FollowHandler
            client={graphQLClient}
            you={you}
            id={id}
          />
        </div>}

        {data ? (
            <>
              <Grid display={display}>
                {recipes?.map(recipe => (
                  <div key={recipe.id}>
                  <Link href={`/[id]/[rid]`} as={`/${id}/${recipe.id}`}>
                    <a>
                      <Card state='recipe' display={display} key={recipe.id} id={recipe.id} imagesrc={recipe?.image?.url}>
                        {recipe.title} <br />
                        {recipe.course.name} | {recipe.cuisine.name} | {recipe.meal.name} 
                      </Card>
                    </a>
                  </Link>
                </div>
                ))}
              </Grid>
              {session?.id == router.query.id && <div style={{ margin: 0,
                        top: 'auto',
                        right: '5em',
                        bottom: 25.5,
                        left: 'auto',
                        position: 'fixed', }}>
                <Link href="/new">
                  <a>
                    <Button size='large' primary label='+ New recipe' />
                  </a>
                </Link>
              </div>}
            </>

        ): (
          <div>loading...</div>
        )}
      </div>
    </Layout>

      );
    }




    const FollowHandler = ({ client, you, id }) => {

      const router = useRouter();

      const fetcher = async (query) => await client.request(query, {you});
    
      const query = gql`
        query getUserFollowing($you: ID!) {
                UserFollowing: user(id: $you) {
                    following {
                      id
                    }
                }
            }
      `;
    
    const { data, error } = useSWR(() => you ? query : null, fetcher);
    
      if (error) {
        console.log(error)
        return null
      }
    
      console.log('call', data);
    
      const following = data?.UserFollowing?.following.map(function (obj) {
        return parseInt(obj.id);
      });
    
      console.log(following);
    
      const FollowUser = async (id, you, following) => {
        const newFollow = [
          ...following,
          id,
        ];
        const query = gql`
          mutation FollowUser($you: ID!, $newFollow: [ID]) {
            updateUser(
              input: {
                where: {
                  id: $you
                }
                data: {
                  following: $newFollow
                }
              }
            ) {
              user {
                id
              }
            }
          }
        `;
    
      try {
        await graphQLClient.request(query, {you,  newFollow});
        router.push(`/following`)
      } catch (error) {
        console.error(error);
      }
    };
    
    const UnFollowUser = async (id, you, following) => {
      const newFollow = following.filter(num => num != id);
      console.log('newFollow', newFollow);
      const query = gql`
        mutation FollowUser($you: ID!, $newFollow: [ID]) {
          updateUser(
            input: {
              where: {
                id: $you
              }
              data: {
                following: $newFollow
              }
            }
          ) {
            user {
              id
            }
          }
        }
      `;
    
    try {
      await graphQLClient.request(query, {you,  newFollow});
      router.push(`/following`)
    } catch (error) {
      console.error(error);
    }
    };
    
      return (
        <>
            {data?.UserFollowing?.following.some(person => person.id == id) ? (
              <Button size='small' label='Following' onClick={() => UnFollowUser(id, you, following)} />
            ) : (
              <Button size='small' label='+ Follow' onClick={() => you ? FollowUser(id, you, following) : signIn() } />
            )}
        </>
      )
    }

      export default Dashboard;

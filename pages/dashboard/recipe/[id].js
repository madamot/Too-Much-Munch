import { useRouter } from 'next/router';
import Router from 'next/router';
import useSWR from 'swr';
import { gql } from 'graphql-request';
import Layout from '../../../components/layout/layout';
import Button from '../../../components/Button/Button';
import EditForm from '../../../components/EditForm/EditForm';
import { graphQLClient } from '../../../utils/graphql-client';

const Todo = () => {
  const router = useRouter();
  const { id } = router.query;

  const fetcher = async (query) => await graphQLClient.request(query, { id });

  const query = gql`
    query FindARecipeByID($id: ID!) {
      findRecipeByID(id: $id) {
        name
        description
      }
    }
  `;

  const { data, error } = useSWR([query, id], fetcher);

  if (error) return <div>failed to load</div>;

  const deleteATodo = async (id) => {
    const query = gql`
      mutation DeleteARecipe($id: ID!) {
        deleteRecipe(id: $id) {
          _id
        }
      }
    `;

  try {
    await graphQLClient.request(query, { id });
    Router.push('/dashboard');
  } catch (error) {
    console.error(error);
  }
};

  return (
    <Layout>
      <h1>Edit Todo</h1>

      {data ? (
        <>
          <h2>{data.findRecipeByID.name}</h2>
          <br />
          <p>{data.findRecipeByID.description}</p>
          <Button size="small" onClick={() => deleteATodo(id)} label="Delete" />
        </>
      ) : (
        <div>loading...</div>
      )}


      {data ? (
        <EditForm defaultValues={data.findRecipeByID} id={id} />
      ) : (
        <div>loading...</div>
      )}
    </Layout>
  );
};

export default Todo;

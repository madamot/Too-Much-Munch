import { useRouter } from 'next/router';
import useSWR from 'swr';
import { gql } from 'graphql-request';
import Layout from '../../../components/layout/layout';
// import EditForm from '../../components/edit-form';
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

  return (
    <Layout>
      <h1>Edit Todo</h1>

      {data ? (
        <>
          <h2>{data.findRecipeByID.name}</h2>
          <br />
          <p>{data.findRecipeByID.description}</p>
        </>
      ) : (
        <div>loading...</div>
      )}


      {/* {data ? (
        <EditForm defaultValues={data.findTodoByID} id={id} />
        ) : (
        <div>loading...</div>
      )} */}
    </Layout>
  );
};

export default Todo;

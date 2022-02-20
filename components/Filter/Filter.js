import React, { useState, useEffect } from 'react'
import { gql } from 'graphql-request';
import useSWR from 'swr';
import Button from '../Button/Button';
import { StrapiGQLClient } from '../../utils/strapi-gql-client';

const Filter = ({ filterAction }) => {

    const fetcher = async (query) => await StrapiGQLClient({
        query: query,
        variables: {
    
        },
      });
    
      const query = gql`
        query FindCategories {
          courses {
            id
            uid
            name
          }
              cuisines {
            id
            uid
            name
          }
              meals {
            id
            uid
            name
          }
        }
      `;
    
      const { data, error } = useSWR(query, fetcher);
  
  
    const tick = "\u2705"
    const cross = "\u274C"
  
    const [filters, addFilters] = useState([])
    const [show, setShow] = useState(false)

    console.log("filters", filters);
  
    useEffect(() => {
        filterAction(filters);
    }, [filters]);
  
  
      const filterHandler = async (id, filterPosts) => {
        if (filters.includes(id)) {
          const newArr = filters.filter(category => id != category);
          addFilters(newArr);
  
          // console.log(filters);
        } else {
          // const notIn = filters.push(id)
          await addFilters(oldArray => [...oldArray, id]);
          // addFilters([...filters, id]);
          // props.filterPosts(filters);
          // console.info(filters);
        }
  
      }
  
  
  
  
    return (
      <div>
          <Button size='small' label='Filter &darr;' onClick={() => setShow(value => !value)}/>
        {show && <div>
          <ul>
            {data?.courses.map( courses => (
              <li onClick={() => filterHandler(courses.uid)} key={courses.id}>
                {courses.name} {filters.includes(courses.uid) ? cross : tick}
              </li>
            ))}
          </ul>
          <ul>
            {data?.cuisines.map( cuisines => (
              <li onClick={() => filterHandler(cuisines.uid)} key={cuisines.id}>
                {cuisines.name} {filters.includes(cuisines.uid) ? cross : tick}
              </li>
            ))}
          </ul>
          <ul>
            {data?.meals.map( meals => (
              <li onClick={() => filterHandler(meals.uid)} key={meals.id}>
                {meals.name} {filters.includes(meals.uid) ? cross : tick}
              </li>
            ))}
          </ul>
        <hr />
        </div>}
      </div>
    )
  }


export default Filter;
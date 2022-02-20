import React, { useState, useEffect } from 'react'
import { gql } from 'graphql-request';
import useSWR from 'swr';
import styled, { css } from 'styled-components';
import Button from '../Button/Button';
import { StrapiGQLClient } from '../../utils/strapi-gql-client';

const FilterContainer = styled.div`
    padding: .5em;
    margin: .5em 0;
    box-shadow: gba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;
    border: solid .5px grey;
    border-radius: .3em;
`;

const FilterList = styled.ul`
  padding: 0 0 1em 0;
`;

const FilterButton = styled.li`
  list-style-type: none;
  display: inline;
`;

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
          <Button size='small' primary label='Filter &darr;' onClick={() => setShow(value => !value)}/>
        {show && <FilterContainer>
          <FilterList>
            {data?.courses.map( courses => (
              <FilterButton onClick={() => filterHandler(courses.uid)} key={courses.id}>
                <Button size='medium' label={`${courses.name} ${filters.includes(courses.uid) ? cross : tick}`} />
              </FilterButton>
            ))}
          </FilterList>
          <FilterList>
            {data?.cuisines.map( cuisines => (
              <FilterButton onClick={() => filterHandler(cuisines.uid)} key={cuisines.id}>
                <Button size='medium' label={`${cuisines.name} ${filters.includes(cuisines.uid) ? cross : tick}`} />
              </FilterButton>
            ))}
          </FilterList>
          <FilterList>
            {data?.meals.map( meals => (
              <FilterButton onClick={() => filterHandler(meals.uid)} key={meals.id}>
                <Button size='medium' label={`${meals.name} ${filters.includes(meals.uid) ? cross : tick}`} />
              </FilterButton>
            ))}
          </FilterList>
        </FilterContainer>}
      </div>
    )
  }


export default Filter;
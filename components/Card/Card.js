import styled, { css } from 'styled-components';
import React from 'react';

const Container = styled.div`
  border: 0;
  min-width: 30%;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  display: inline-block;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;
  margin: 1rem;
  flex-basis: auto;
  text-align: left;
  color: inherit;
  text-decoration: none;
`;

const Details = styled.div`
  padding: 10px;
  height: 100%;
  cursor: pointer;
  color: ${props => props.primary ? "white" : "#333"};
`;

const Image = styled.img`
  border: 0;
  cursor: pointer;
  color: ${props => props.primary ? "white" : "#333"};
`;

const Card = ({ recipe, children}) => {

    return (
      <Container>
        <Details>
          {children}
        </Details>
        <Image src="https://via.placeholder.com/300" />
      </Container>
    );


};

export default Card

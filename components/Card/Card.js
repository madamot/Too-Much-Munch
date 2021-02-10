import styled, { css } from 'styled-components';
import React from 'react';

const Container = styled.div`
  flex: 1;
  border: 0;
  ${'' /* max-width: 200px; */}
  max-height: 306px;
  max-width: 250px;
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

  ${({ add }) =>
  add  &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      background: grey;
      height: 306px;
      width: 250px;
    `}
`;

const Details = styled.div`
  padding: 10px;
  max-height: 56px;
  cursor: pointer;
  color: ${props => props.primary ? "white" : "#333"};
`;

const Image = styled.img`
  border: 0;
  cursor: pointer;
  color: ${props => props.primary ? "white" : "#333"};
`;

const Card = ({ add, children}) => {

    return (
      <Container add={add}>
        {
          (add) ? (
            <svg width="158" height="156" viewBox="0 0 158 156" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.5 88.5V67.5H68.5V0.5H89.5V67.5H157.5V88.5H89.5V155.5H68.5V88.5H0.5Z" fill="#E5E5E5"/>
            </svg>
          )
          : (
            <>
              <Details>
                {children}
              </Details>
              <Image src="https://via.placeholder.com/250" />
            </>
          )

        }
      </Container>
    );


};

export default Card

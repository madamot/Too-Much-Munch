import styled, { css } from 'styled-components';
import React from 'react';
import Link from 'next/link';

const Container = styled.div`
  flex: 1;
  border-radius: 5%;
  ${'' /* max-width: 200px; */}
  overflow: hidden;
  position: relative;
  cursor: pointer;
  display: inline-block;
  flex-basis: auto;
  text-align: left;
  color: inherit;
  text-decoration: none;
  min-width: 0;

  ${({ state, display }) =>
  state === 'add' && display === 'card' &&
    css`
      display: flex;
      margin: 1rem;
      align-items: center;
      justify-content: center;
      background: grey;
      height: 306px;
      max-width: 250px;
      ${'' /* min-width: 250px; */}

      ${'' /* @media (max-width: 900px) {
        max-width: 200px;
        min-width: 200px;
      } */}
    `}

    ${({ display }) =>
    display === 'card'  &&
      css`
      margin: 1rem;
      height: 15rem;
      width: 15rem;
      border: solid 1px lightgrey;
      ${'' /* @media (max-width: 900px) {
        max-width: 200px;
        min-width: 200px;
      } */}
      `}

    ${({ display }) =>
    display === 'list'  &&
      css`
      max-width: 100%;
      padding: 20px;
      border-bottom: solid 1px lightgrey;
      transition: 0.3s;

      &:hover {
      background-color: lightgrey;
      transition: 0.3s;

    }
      `}
`;

const Details = styled.div`
  cursor: pointer;
  color: ${props => props.primary ? "white" : "#333"};

  ${({ display }) =>
  display === 'card'  &&
    css`
      padding: 10px;
      max-height: 56px;
    `}

  ${({ display }) =>
  display === 'list'  &&
    css`
      min-width: 100vw;
    `}
`;

const Image = styled.img`
  border: 0;
  cursor: pointer;
  width: 100%;
  max-height: 100%;
  overflow: hidden;
  object-fit: cover;
  color: ${props => props.primary ? "white" : "#333"};

  ${({ display }) =>
  display === 'list'  &&
    css`
      display: none;
    `}
`;

const ImageContainer = styled.div`
  object-fit: contain;
  height: 15vh;
`;

const Card = ({ display, state, id, children, imagesrc}) => {
  if (!imagesrc) {
    const imagesrc = "https://via.placeholder.com/250";
  }
    return (
      <Container display={display} state={state}>
        {
          (state == 'add') ? (
            // <Link href="/dashboard/new">
              <>
                {
                  (display == 'list') ? (
                    <p>➕ New</p>
                  )
                  : (
                    <svg width="158" height="156" viewBox="0 0 158 156" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.5 88.5V67.5H68.5V0.5H89.5V67.5H157.5V88.5H89.5V155.5H68.5V88.5H0.5Z" fill="#E5E5E5"/>
                    </svg>
                  )
                }
              </>

            // </Link>
          )
          : (
            <div>
              {/* <Link href={`/dashboard/${state}/[id]`} as={`/dashboard/${state}/${id}`}>
              <a> */}
              <ImageContainer>
                <Image display={display} state={state} src={imagesrc} />
              </ImageContainer>
              <Details display={display} state={state}>
                {children}
              </Details>
              {/* </a>
              </Link> */}
            </div>
          )

        }
      </Container>
    );


};

export default Card

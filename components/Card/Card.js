import styled, { css } from 'styled-components';
import React from 'react';
import Image from 'next/image'
import Link from 'next/link';

const Container = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  /* display: inline-block; */
  flex-basis: auto;
  text-align: left;
  color: inherit;
  text-decoration: none;

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
      border-radius: 5%;
      margin: 1rem;
      height: 15rem;
      width: 15rem;
      border: solid 1px lightgrey;

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
  min-height: 30%;
  position: relative;
  bottom: 0;
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

const Img = styled(Image)`
  border: 0;
  cursor: pointer;
  /* width: 100%; */
  /* max-height: 100%; */
  /* min-height: 80%; */
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
  position: relative;
  object-fit: contain;
  min-height: 70%;

  ${({ display }) =>
  display === 'list'  &&
    css`
      height: 0vh;
    `}
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
            <Container>
              {/* <Link href={`/dashboard/${state}/[id]`} as={`/dashboard/${state}/${id}`}>
              <a> */}
              <ImageContainer display={display}>
                <Img display={display} state={state} src={!imagesrc ? 'https://via.placeholder.com/250' : imagesrc} layout='fill' />
              </ImageContainer>
              <Details display={display} state={state}>
                {children}
              </Details>
              {/* </a>
              </Link> */}
            </Container>
          )

        }
      </Container>
    );


};

export default Card

import React, { useState, useRef } from "react";
import styled, { css } from 'styled-components';
import Button from '../Button/Button';
import Link from 'next/link';
import { useRouter, withRouter } from 'next/router'

import useSWR from 'swr';
import { gql } from 'graphql-request';
import { StrapiGQLClient } from '../../utils/strapi-gql-client';

import { useSession, signIn, signOut } from "next-auth/client"

const Wrapper = styled.div`
  font-family: Bebas Neue, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DashNavWrapper = styled.div`
  font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 20px 0px;
  max-height: 40px;
  text-align: center;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.svg`
  display: inline-block;
  vertical-align: top;
`;

const Title = styled.h1`
  font-weight: 900;
  font-size: 20px;
  line-height: 1;
  margin: 6px 0 6px 10px;
  display: inline-block;
  vertical-align: top;
`;

const DashNav = styled.ul`
  display: flex;
  margin: 0;
  height: 100%;
  list-style-type: none;
  padding: 0;
  ${'' /* width: 50%; */}
  position: absolute;
  overflow: auto;
  align-items: center;
  justify-content: space-between;
`;

const NavSub = styled.ul`
  display: flex;
  margin: 0;
  height: 100%;
  list-style-type: none;
  padding: 0;
  ${'' /* width: 50%; */}
  /* position: absolute; */
  overflow: auto;
  align-items: center;
  justify-content: space-between;
`;

const NavItem = styled.li`
  display: inline-block;
  height: 100%;
  list-style: none;
  align-items: center;
  display: flex;
  min-height: 100%;
  padding: 10px;
  border-bottom: ${props => props.router == props.location ? "solid 2px black" : "none"};

`;

const Navrow = styled.div`
  @media only screen and (max-width: 40em) {
      width: 100vw;
      height: 5em;;
      padding: 0;
      margin: 0;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: solid 1px lightgrey;
    }

`;

const Nav = styled.div`
  display: flex;
  list-style-type: none;
  padding: 0;
  overflow: auto;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  overflow: hidden;

  @media only screen and (max-width: 40em) {
      position: fixed;
      right: 0;
      bottom: 0;
      height: 100%;
      width: 100%;
      flex-direction: column;
      z-index: 1;
      border: none;
      background-color: #FFF;
      padding: 2em;
      padding-top: 70vh;
      transition: 0.2s ease-out;

      transform: ${({ openDrawer }) =>
        openDrawer ? `translateX(0)` : `translateX(100%)`};
    }
`;

const HamburgerButton = {
  Wrapper: styled.button`
    height: 3rem;
    width: 3rem;
    position: relative;
    font-size: 12px;;
    display: none;

    @media only screen and (max-width: 40em) {
      display: block;
    }

    /* Remove default button styles */
    border: none;
    background: transparent;
    outline: none;
    z-index: 5;
    cursor: pointer;

    &:after {
      content: "";
      display: block;
      position: absolute;
      height: 150%;
      width: 150%;
      top: -25%;
      left: -25%;
    }
  `,
  Lines: styled.div`
    top: 50%;
    margin-top: -0.125em;

    &,
    &:after,
    &:before {
      /* Create lines */
      height: 2px;
      pointer-events: none;
      display: block;
      content: "";
      width: 100%;
      background-color: black;
      position: absolute;
    }

    &:after {
      /* Move bottom line below center line */
      top: -0.8rem;
    }

    &:before {
      /* Move top line on top of center line */
      top: 0.8rem;
    }
  `
};


const Header = ({dashboard}) => {
  const [session, loading] = useSession()
  const router = useRouter();

  const [openDrawer, toggleDrawer] = useState(false);
  const toggleChecked = () => toggleDrawer(value => !value);
  const drawerRef = useRef(null);

  let url = "";
  if (typeof window !== "undefined") {
    url = window.location.href;
  }

  const fetcher = async (query) => await StrapiGQLClient({
    query: query,
    variables: {

      },
  });

  const { data, error } = useSWR(
    gql`
      {
        global {
          navigation {
            theme
            ... on ComponentGlobalNavigation {
              panels {
                ... on ComponentGlobalNavigationPanel {
                  id
                  link {
                    id
                    href
                    label
                    target
                  }
                }
              }
            }
          }
        }
      }
    `,
    fetcher
  );

   if (error) return <div>failed to load</div>;


  return (
    <header>
      <Wrapper>
        <Nav ref={drawerRef} openDrawer={openDrawer}>
            
            
            <Navrow>
              <Link href="/">
                <a>
                  <Title className="title">🍴 Too Much Munch</Title>
                </a>
              </Link>
            </Navrow>
            <NavSub>
              {data?.global?.navigation?.panels && data.global.navigation.panels.map(item => (
                <Navrow key={item.id} href={item.link.href}>
                  <Link href="/blog">
                    <a>
                      {item.link.label}
                    </a>
                  </Link>
                </Navrow>
              ))}
            </NavSub>

            { session ? (
              <Navrow>
                  <div className="multiButtons">
                    <Button size="small" onClick={() => signOut()} label="Log out" />
                    <Link href={`/[id]`} as={`/${session?.id}`}>
                      <Button primary size="small" label="Dashboard" />
                    </Link>
                  </div>
                </Navrow>
            ) : (
              <Navrow>
                  <div className="multiButtons">
                    <Button size="small" onClick={() => signIn()} label="Log in" />
                    {/* <Button primary size="small" onClick={() => loginWithRedirect({
                      screen_hint: "signup",
                    })} label="Sign Up" /> */}
                  </div>
                </Navrow>
            )}

          {/* </Navrow> */}
        </Nav>
        <HamburgerButton.Wrapper onClick={() => toggleChecked(true)}>
          <HamburgerButton.Lines />
        </HamburgerButton.Wrapper>
      </Wrapper>


      {!dashboard ? (
        null
      ) :
      <DashNavWrapper>
        <DashNav>
          <NavItem router={router.pathname} location={`/[id]`}><Link href={`/`}>Recipes</Link></NavItem>
          <NavItem router={router.pathname} location='/following'><Link href='/following'>Following</Link></NavItem>
          <NavItem router={router.pathname}>Coming soon...</NavItem>
        </DashNav>
      </DashNavWrapper>
      }
    </header>
  )
}

export default Header;

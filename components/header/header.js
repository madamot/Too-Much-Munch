import styled, { css } from 'styled-components';
import Button from '../Button/Button';
import Link from 'next/link';
import { useRouter, withRouter } from 'next/router'

import { useAuth0 } from '@auth0/auth0-react';

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
  width: 50%;
  position: absolute;
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
  padding: 0;
  border-bottom: ${props => props.router == props.location ? "solid 2px black" : "none"};

`;


const Header = ({dashboard}) => {
  const { isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
  const router = useRouter();

  console.log(router.pathname);
  let url = "";
  if (typeof window !== "undefined") {
    url = window.location.href;
    console.log(url);
  }
  return (
    <header>
      <Wrapper>
        <div>
          <Link href="/">
            <a>
              <Title className="title">🍴 Too Much Munch</Title>
            </a>
          </Link>
        </div>
        <div>
          <Link href="/blog">
            <a>
              Blog
            </a>
          </Link>
        </div>
        <div>
          {!isLoading && (
            isAuthenticated ? (
              <div className="multiButtons">
                <Button size="small" onClick={() => logout({ returnTo: url })} label="Log out" />
                <Link href='/dashboard'>
                  <Button primary size="small" label="Dashboard" />
                </Link>
              </div>
            ) : (
              <div className="multiButtons">
                <Button size="small" onClick={loginWithRedirect} label="Log in" />
                <Button primary size="small" onClick={() => loginWithRedirect({
                  screen_hint: "signup",
                })} label="Sign Up" />
              </div>
            )
          )}
        </div>
      </Wrapper>
      {!dashboard ? (
        null
      ) :
      <DashNavWrapper>
        <DashNav>
          <NavItem router={router.pathname} location='/dashboard'><Link href='/dashboard'>Recipes</Link></NavItem>
          <NavItem router={router.pathname} location='/dashboard/groups'><Link href='/dashboard/groups'>Groups</Link></NavItem>
          <NavItem router={router.pathname}>Coming soon...</NavItem>
        </DashNav>
      </DashNavWrapper>
      }
    </header>
  )
}

export default Header;

import styled, { css } from 'styled-components';
import Button from '../Button/Button';
import Link from 'next/link';
import { useRouter } from 'next/router'

import { useAuth0 } from '@auth0/auth0-react';

const Wrapper = styled.div`
  font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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


const Header = () => {
  const { pathname, query } = useRouter();
  const { isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();

  return (
    <header>
      <Wrapper>
        <div>
          {/* <Logo width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <path
            d="M10 0h12a10 10 0 0110 10v12a10 10 0 01-10 10H10A10 10 0 010 22V10A10 10 0 0110 0z"
            fill="#FFF"
              />
              <path
            d="M5.3 10.6l10.4 6v11.1l-10.4-6v-11zm11.4-6.2l9.7 5.5-9.7 5.6V4.4z"
            fill="#555AB9"
              />
              <path
            d="M27.2 10.6v11.2l-10.5 6V16.5l10.5-6zM15.7 4.4v11L6 10l9.7-5.5z"
            fill="#91BAF8"
              />
            </g>
          </Logo> */}
          <Link href="/">
            <a>
              <Title className="title">🍴 Too Much Munch</Title>
            </a>
          </Link>
        </div>
        <div>
          {!isLoading && (
            isAuthenticated ? (
              <div className="multiButtons">
                <Button size="small" onClick={() => logout({ returnTo: 'http://localhost:3000' })} label="Log out" />
                <Link href='/dashboard'>
                  <Button primary size="small" label="Dashboard" />
                </Link>
              </div>
            ) : (
              <div className="multiButtons">
                <Button size="small" onClick={loginWithRedirect} label="Log in" />
                <Button primary size="small" onClick={loginWithRedirect} label="Log in" />
              </div>
            )
          )}
        </div>
      </Wrapper>
    </header>
  )
}

export default Header;

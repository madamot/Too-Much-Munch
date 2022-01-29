import styled, { css } from 'styled-components';
import Header from "../header/header"
import Footer from "../footer/footer"
import { Container, Row, Col } from 'react-grid-system';

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 0 1.0875rem 0;
  ${'' /* justify-content: center; */}
  ${'' /* align-items: center; */}
`;

export default function Layout({ children, dashboard }) {
  return (
    <>
      <Header dashboard={dashboard}></Header>
      <Wrapper>
        <main>{children}</main>
      </Wrapper>
      <Footer></Footer>
    </>
    )
  }

import styled, { css } from 'styled-components';
import Header from "../header/header"
import Footer from "../footer/footer"

const Wrapper = styled.div`
  ${'' /* min-height: 80vh; */}
  margin: 0 auto;
  max-width: 960px;
  padding: 0 1.0875rem 0;
  ${'' /* justify-content: center; */}
  ${'' /* align-items: center; */}
`;

export default function Layout({ children }) {
  return (
    <>
      <Header></Header>
      <Wrapper>
        <main>{children}</main>
      </Wrapper>
      <Footer></Footer>
    </>
    )
  }

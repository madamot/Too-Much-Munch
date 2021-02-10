import styled, { css } from 'styled-components';
import Header from "../header/header"
import Footer from "../footer/footer"

const Wrapper = styled.div`
  min-height: 80vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

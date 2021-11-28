import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100px;
  bottom: 0;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Link = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
`;


export default function Footer() {
  return (
    <Wrapper>
      <Link
        href="https://adamhorne.co.uk"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by Adam Horne
      </Link>
    </Wrapper>
    )
  }

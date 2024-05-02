import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';


// 스타일드 컴포넌트 정의
const StyledHeader = styled.header`
  background-color: #131829;
  color: white;
  font-weight: bold;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const StyledNav = styled.nav`
  display: flex;
`;

const StyledLink = styled(RouterLink)`
  color: white;
  margin-right: 20px;
  text-decoration: none;
  padding: 10px;
  border-radius: 5px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: gray;
  }
`;

const TitleLink = styled(StyledLink)`
  margin-right: auto;
`;

function Header() {
    return (
        <StyledHeader>
            <Container>
                <TitleLink to="/">Stock Tracker</TitleLink>
                <StyledNav>
                    <StyledLink to="/portfolio">My Portfolio</StyledLink>
                    <StyledLink to="/login">Login</StyledLink>
                    <StyledLink to="/signup">Sign up</StyledLink>
                </StyledNav>
            </Container>
        </StyledHeader>
    );
}

export default Header;
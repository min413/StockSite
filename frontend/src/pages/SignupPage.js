import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

// 전역 스타일 정의
const GlobalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
    background-color: #131722;
    color: #FEFEFE;
    font-family: Arial, sans-serif;
  }
`;

const Container = styled.div`
    text-align: center;
    margin-bottom: 100px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 5px;
    max-width: 300px;
    margin: auto;
`;

const Input = styled.input`
    margin: 10px 0;
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
`;

const Button = styled.button`
    padding: 10px 20px;
    cursor: pointer;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    &:hover {
        background-color: #0056b3;
    }
`;

function SignupPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <>
            <GlobalStyle />
            <Container>
                <h2>Sign Up</h2>
                <Form>
                    <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button type="submit">Sign Up</Button>
                </Form>
            </Container>
        </>
    );
}

export default SignupPage;

import React from "react";
import { useParams } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
    background-color: #131722;
    color: #FEFEFE;
    font-family: Arial, sans-serif;
  }
`;

const DetailContainer = styled.div`
  padding: 20px;
  background-color: #1b1f2c;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TickerTitle = styled.h1`
  color: #FFFFFF;
`;

function StockDetailPage() {
  // useParams 훅을 사용하여 URL에서 티커 값을 가져옴
  const { ticker } = useParams();

  return (
    <>
      <GlobalStyle />
      <DetailContainer>
        <TickerTitle>{ticker}</TickerTitle>
        {/* 여기에 추가 정보를 렌더링할 수 있습니다 */}
      </DetailContainer>
    </>
  );
}

export default StockDetailPage;

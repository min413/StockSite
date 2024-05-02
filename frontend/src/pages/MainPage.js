import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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

const FavoriteArea = styled.div`
  background-color: #1b1f2c;
  padding: 20px;
`;

const StockList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StockInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #2e2f3e;
  padding: 20px;
  
  &:hover {
    background-color: #202637;
  }
`;

const StockDetail = styled.div`
  display: flex;
  align-items: center;
`;


const CompanyName = styled.span`
  font-size: 30px;
  font-weight: bold;
  margin-right: 10px;
`;

const Change = styled.span`
  color: ${(props) => (props.value >= 0 ? "lightgreen" : "red")};
`;

const StockPrices = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const StockDividend = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

function MainPage() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    async function fetchStockData() {
      const tickers = ["AAPL", "MSFT", "TSLA", "SPY", "005930.KS"];
      const fetchedStocks = await Promise.all(
        tickers.map(async (ticker) => {
          try {
            const response = await axios.post(
              "http://localhost:5000/get-stock-data",
              { stockName: ticker }
            );
            return { ticker, ...response.data };
          } catch (error) {
            console.error("Error fetching data for", ticker, ":", error);
            return { ticker, error: true };
          }
        })
      );
      setStocks(fetchedStocks);
    }
    fetchStockData();
  }, []);

  const getCompanyName = (ticker) => {
    // 한국 주식의 번호를 기업 이름으로 매핑
    const mappings = {
      "005930.KS": "삼성전자",
    };
    return mappings[ticker] || ticker;
  };

  const renderChange = (stock) => {
    if (stock.error) {
      return "Error fetching data";
    }
    const change = stock.latest_close - stock.last_close;
    const percentChange = ((change / stock.last_close) * 100).toFixed(2);
    return (
      <>
        <Change value={change}>{change.toFixed(2)}</Change>{" "}
        (<Change value={change}>{percentChange}%</Change>)
      </>
    );
  };


  
  const formatPrice = (price) => {
    // 숫자가 정수인지 확인합니다.
    if (Number.isInteger(price)) {
      return price.toString(); // 정수인 경우, 그대로 문자열로 변환합니다.
    } else {
      return price.toFixed(2); // 정수가 아닌 경우, 소수점 둘째 자리까지 표현합니다.
    }
  }


  return (
    <>
      <GlobalStyle />
      <FavoriteArea>
        <StockList>
          {stocks.map((stock, index) => (
            <Link key={index} to={`/stock/${stock.ticker}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <StockInfo>
                <StockDetail>
                  <CompanyName>{getCompanyName(stock.ticker)}</CompanyName>
                </StockDetail>
                
                <StockPrices>
                  <div>${formatPrice(stock.last_close)}</div>
                  <div>{renderChange(stock)}</div>
                </StockPrices>
                <StockDividend>
                  <div>최근 배당금_수정</div>
                  <div>{"N/A"}</div>
                </StockDividend>
                  
                
              </StockInfo>
            </Link>
          ))}
        </StockList>
      </FavoriteArea>
    </>
  );
}

export default MainPage;


/*
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled, {createGlobalStyle} from "styled-components";
const GlobalStyle = createGlobalStyle`
    body{
        padding: 0;
        margin: 0;
        border: 0;
        background-color: #131722;
        color: #FEFEFE;
    }
`

function MainPage() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    async function fetchStockData() {
      const tickers = ["AAPL", "MSFT", "TSLA", "SPY", "005930.KS"];
      const fetchedStocks = await Promise.all(
        tickers.map(async (ticker) => {
          try {
            const response = await axios.post(
              "http://localhost:5000/get-stock-data",
              { stockName: ticker }
            );
            console.log("Data for", ticker, ":", response.data);
            return { ticker, ...response.data };
          } catch (error) {
            console.error("Error fetching data for", ticker, ":", error);
            return { ticker, error: true };
          }
        })
      );
      setStocks(fetchedStocks);
      console.log("Fetched stocks:", fetchedStocks);
    }
    fetchStockData();
  }, []);

  
  const FavoriteArea = styled.div`
    background-color: #1b1f2c;
    display: flex;
    flex-direction: column;
  `;

  const Textarea = styled.div`
    display: flex;
    justify-content: center;
    padding-right: 460px;
    color: #bfcada;
    font-weight: bold;
    margin: 20px 0px;
  `;

  const StockList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  const StockInfo = styled.div`
    width: 500px;
    border: 1px solid black;
    padding: 10px;
    margin-bottom: 10px;
    color: #FEFEFE;

    &:hover {
      background-color: #202637;
      color: #bfcada;
    }
  `;
  return (
    <>
    <GlobalStyle />
      <div>
        야호~~
      </div>
      <FavoriteArea>
        <Textarea>관심 종목</Textarea>
        <StockList>
          {stocks.map((stock, index) => (
            <Link style={{ textDecoration: 'none' }} to={`/stock/${stock.ticker}`}>
            <StockInfo key={index}>
              <p>Ticker: {stock.ticker}</p>
              <p>Last Close Price: {stock.last_close}</p>
              <p>Latest Close Price: {stock.latest_close}</p>
              <p>
                Change:{" "}
                {stock.error
                  ? "Error fetching data"
                  : (stock.latest_close - stock.last_close).toFixed(2)}
              </p>
              <p>
                Change Percent:{" "}
                {stock.error
                  ? "N/A"
                  : (
                      ((stock.latest_close - stock.last_close) /
                        stock.last_close) *
                      100
                    ).toFixed(2)}
                %
              </p>
              
            </StockInfo>
            </Link>
          ))}
        </StockList>
      </FavoriteArea>
    </>
  );
}

export default MainPage;
*/
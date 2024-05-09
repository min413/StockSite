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
  margin-bottom: 30px;
`;

const StockList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StockInfo = styled.div`
  width: 30em;
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
    if (price === null || price === undefined || isNaN(Number(price))) {
      return 'N/A'; 
    }
    return Number(price).toFixed(2);
  };


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
                  <div>최근 배당금</div>
                  <div>{stock.latest_div_date}</div>
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

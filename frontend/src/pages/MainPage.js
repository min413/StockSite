import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { useAuthContext } from "../auth/useAuthContext";
import { apiManager } from "../utils/api";
import companyMappings from "../data/companyMappings.json"; // JSON 파일을 임포트합니다.

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
`;

const StockDividend = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const AddStockForm = styled.form`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const StockInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #2e2f3e;
  border-radius: 4px;
  background-color: #131722;
  color: #FEFEFE;
  margin-right: 10px;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  background-color: #3a3f51;
  color: #FEFEFE;
  cursor: pointer;
  &:hover {
    background-color: #4a4f61;
  }
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  background-color: #e74c3c;
  color: #FEFEFE;
  cursor: pointer;
  &:hover {
    background-color: #c0392b;
  }
`;


function MainPage() {
  const [stocks, setStocks] = useState([]);
  const { user } = useAuthContext();
  const [newStock, setNewStock] = useState("");
  const [userObj, setUserObj] = useState('')

  useEffect(() => {
    const fetchStockData = async () => {
      const fetchedStocks = await Promise.all(
        JSON.parse(user?.favorite).map(async (ticker) => {
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
      console.log(user)
    };

    fetchStockData();
    setUserObj({...user})
  }, []);

  const getCompanyName = (ticker) => {
    return companyMappings[ticker] || ticker;
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

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (newStock.trim() === "") return;
    try {
      const response = await axios.post(
        "http://localhost:5000/get-stock-data",
        { stockName: newStock }
      );
      setStocks([...stocks, { ticker: newStock, ...response.data }]);
      setNewStock("");
      setUserObj({
        ...user,
        ['favorite']: JSON.stringify(stocks)
      })
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  const handleDeleteStock = (e, ticker) => {
    e.preventDefault();
    setStocks(stocks.filter(stock => stock.ticker !== ticker));
    setUserObj({
      ...user,
      ['favorite']: JSON.stringify(stocks)
    })
  };

  const onChangeUserInfo = async () => {

    let result = await apiManager('auth/change-info', 'update', {
      user_name: userObj?.user_name,
      user_pw: userObj?.user_pw,
      nickname: userObj?.nickname,
      favorite: userObj?.favorite,
      portfolio: userObj?.portfolio
    })
    if (result) {
      toast.success('성공적으로 변경되었습니다.');
    }
  }


  return (
    <>
      <GlobalStyle />
      <FavoriteArea>
        <AddStockForm onSubmit={handleAddStock}>
          <StockInput
            type="text"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            placeholder="종목을 입력하세요"
          />
          <AddButton type="submit">추가</AddButton>
        </AddStockForm>
        <StockList>
        {user && 
                stocks.map((stock, idx) => (
                  <Link key={idx} to={`/stock/${stock.ticker}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                <DeleteButton onClick={(e) => handleDeleteStock(e, stock.ticker)}>제거</DeleteButton>

                </StockInfo>
                  </Link>
                ))
              }
              <div onClick={onChangeUserInfo}>변경사항 저장</div>
        </StockList>
      </FavoriteArea>
    </>
  );
}

export default MainPage;

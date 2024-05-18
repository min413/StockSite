import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';

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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const TopSection = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 20px;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-right: 20px;
`;

const RightColumn = styled.div`
  width: 50%;
`;

const BottomSection = styled.div`
  width: 100%;
`;

const Section = styled.div`
  background-color: #1b1f2c;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
`;

const TotalAssetSection = styled(Section)`
  flex: 1;
`;

const ChartSection = styled(Section)`
  flex: 1;
`;

const PortfolioSection = styled(Section)`
  height: 100%;
`;

const NewsSection = styled(Section)`
  height: 200px;
`;

const AddStockButton = styled.button`
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

const ModalContainer = styled.div`
  background-color: #1b1f2c;
  width: 300px;
  padding: 20px;
  border-radius: 10px;
  color: #FEFEFE;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #2e2f3e;
  border-radius: 4px;
  background-color: #131722;
  color: #FEFEFE;
  margin-bottom: 10px;
  width: 100%;
  appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::-moz-appearance {
    appearance: none;
  }
`;

const SubmitButton = styled.button`
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

const StockItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-bottom: 10px;
  background-color: #2e2f3e;
  border-radius: 10px;
`;

const StockHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const StockDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
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

const EditButton = styled.button`
  padding: 5px 10px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  background-color: #3498db;
  color: #FEFEFE;
  cursor: pointer;
  margin-right: 5px;
  &:hover {
    background-color: #2980b9;
  }
`;

const Change = styled.span`
  color: ${(props) => (props.value >= 0 ? "lightgreen" : "red")};
`;

const PortfolioPage = () => {
  const [stocks, setStocks] = useState([
    { ticker: 'AAPL', quantity: 4, avgPrice: 150 },
    { ticker: 'MSFT', quantity: 6, avgPrice: 400 }
  ]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [stockData, setStockData] = useState({ ticker: '', quantity: '', avgPrice: '' });

  const openModal = (index = null) => {
    if (index !== null) {
      setIsEdit(true);
      setEditIndex(index);
      setStockData(stocks[index]);
    } else {
      setIsEdit(false);
      setStockData({ ticker: '', quantity: '', avgPrice: '' });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStockData({ ...stockData, [name]: value });
  };

  const addStock = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/get-stock-data",
        { stockName: stockData.ticker }
      );
      const newStock = { ...stockData, quantity: Number(stockData.quantity), avgPrice: Number(stockData.avgPrice), currentPrice: response.data.last_close || 0 };
      setStocks([...stocks, newStock]);
      closeModal();
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  const editStock = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/get-stock-data",
        { stockName: stockData.ticker }
      );
      const updatedStock = { ...stockData, quantity: Number(stockData.quantity), avgPrice: Number(stockData.avgPrice), currentPrice: response.data.last_close || 0 };
      const updatedStocks = [...stocks];
      updatedStocks[editIndex] = updatedStock;
      setStocks(updatedStocks);
      closeModal();
    } catch (error) {
      console.error("Error editing stock:", error);
    }
  };

  const deleteStock = (index) => {
    setStocks(stocks.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchCurrentPrices = async () => {
      const updatedStocks = await Promise.all(stocks.map(async (stock) => {
        try {
          const response = await axios.post(
            "http://localhost:5000/get-stock-data",
            { stockName: stock.ticker }
          );
          return { ...stock, currentPrice: response.data.last_close || 0 };
        } catch (error) {
          console.error("Error fetching data for", stock.ticker, ":", error);
          return { ...stock, currentPrice: 0 };
        }
      }));
      setStocks(updatedStocks);
    };

    fetchCurrentPrices();
  }, []);

  const calculateProfit = (stock) => {
    return ((stock.currentPrice - stock.avgPrice) * stock.quantity).toFixed(2);
  };

  const calculateProfitPercent = (stock) => {
    return (((stock.currentPrice - stock.avgPrice) / stock.avgPrice) * 100).toFixed(2);
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
      <Container>
        <TopSection>
          <LeftColumn>
            <TotalAssetSection>
              <h2>총 자산 영역</h2>
              {/* 총 자산 데이터 및 수익률 계산 */}
            </TotalAssetSection>
            <ChartSection>
              <h2>차트 형식 영역</h2>
              {/* 차트 데이터 */}
            </ChartSection>
          </LeftColumn>
          <RightColumn>
            <PortfolioSection>
              <h2>포트폴리오 자산</h2>
              {stocks.map((stock, index) => (
                <StockItem key={index}>
                  <StockHeader>
                    <div>{stock.ticker}</div>
                    <div>
                      <EditButton onClick={() => openModal(index)}>편집</EditButton>
                      <DeleteButton onClick={() => deleteStock(index)}>삭제</DeleteButton>
                    </div>
                  </StockHeader>
                  <StockDetail>
                    <div>수량: {stock.quantity}</div>
                  </StockDetail>
                  <StockDetail>
                    <div>자산가치: ${(stock.quantity * stock.avgPrice).toFixed(2)}</div>
                                        <div>평단가: ${stock.avgPrice.toFixed(2)}</div>
                  </StockDetail>
                  <StockDetail>
                    <div>
                      수익: ${calculateProfit(stock)} (
                      <Change value={calculateProfit(stock)}>
                        {calculateProfitPercent(stock)}%
                      </Change>)
                    </div>
                    <div>현재가: ${formatPrice(stock.currentPrice)}</div>
                  </StockDetail>
                </StockItem>
              ))}
              <AddStockButton onClick={() => openModal()}>주식 추가</AddStockButton>
            </PortfolioSection>
          </RightColumn>
        </TopSection>
        <BottomSection>
          <NewsSection>
            <h2>관련 뉴스 영역</h2>
            {/* 뉴스 데이터 */}
          </NewsSection>
        </BottomSection>
      </Container>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add/Edit Stock Modal"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)'
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1b1f2c',
            borderRadius: '10px',
            padding: '20px',
            color: '#FEFEFE',
          },
        }}
      >
        <ModalContainer>
          <h2>{isEdit ? '주식 수정' : '주식 추가'}</h2>
          <form onSubmit={(e) => { e.preventDefault(); isEdit ? editStock() : addStock(); }}>
            <Input
              type="text"
              name="ticker"
              value={stockData.ticker}
              onChange={handleInputChange}
              placeholder="종목 이름"
              required
            />
            <Input
              type="number"
              name="quantity"
              value={stockData.quantity}
              onChange={handleInputChange}
              placeholder="수량"
              required
            />
            <Input
              type="number"
              name="avgPrice"
              value={stockData.avgPrice}
              onChange={handleInputChange}
              placeholder="평단가"
              required
            />
            <SubmitButton type="submit">{isEdit ? '수정' : '추가'}</SubmitButton>
          </form>
        </ModalContainer>
      </Modal>
    </>
  );
};

export default PortfolioPage;


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Headers';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import StockDetailPage from './pages/StockDetailPage';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" exact element={<MainPage/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/signup" element={<SignupPage/>} />
                <Route path="/stock/:ticker" element={<StockDetailPage />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
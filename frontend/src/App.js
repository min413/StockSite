import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Headers';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" exact element={<MainPage/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/signup" element={<SignupPage/>} />
                {/* 추가 페이지 경로 */}
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
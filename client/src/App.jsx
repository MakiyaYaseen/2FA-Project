import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import AnimatedAuth from './components/AnimatedAuth';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<AnimatedAuth><Register /></AnimatedAuth>} />
          <Route path="/login" element={<AnimatedAuth><Login /></AnimatedAuth>} />
          <Route path="/verify" element={<VerifyOTP />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
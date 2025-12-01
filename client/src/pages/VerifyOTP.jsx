import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import axios from 'axios';
import './VerifyOTP.css'; // ✅ Import your CSS here

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate(); // ✅ For redirection
  const location = useLocation(); // ✅ For reading state

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate('/register');
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/verify-otp', {
        email,
        otp
      });

      if (response.data.success) {
        alert('Verification successful! You can now login.');
        navigate('/login');
      } else {
        setMessage(response.data.message || 'Verification failed');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 
                'Verification error. Please try again.');
      console.error('Verification error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm title="Verify OTP" onSubmit={handleSubmit}>
      <p className="otp-info">OTP sent to: <strong>{email}</strong></p>
      
      <div className="input-group">
        <input
          type="text"
          className="otp-input"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          required
        />
      </div>

      {message && <div className="error-text">{message}</div>}

      <button 
        type="submit" 
        className="submit-button"
        disabled={isSubmitting || otp.length !== 6}
      >
        {isSubmitting ? 'Verifying...' : 'Verify OTP'}
      </button>
    </AuthForm>
  );
};

export default VerifyOTP;

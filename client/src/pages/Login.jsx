import React, { useState } from 'react';
import axios from 'axios';
import AuthForm from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/send-otp', { email });
      if (response.data.success) {
        alert('OTP sent to your email');
        navigate('/verify', { state: { email } });
      } else {
        setError('Failed to send OTP. Try again.');
      }
    } catch (error) {
      console.error("Error sending OTP:", error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm title="Login" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={error ? 'error-input' : ''}
        />
        {error && <span className="error-text">{error}</span>}
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="spinner"></span> Sending OTP...
          </>
        ) : 'Send OTP'}
      </button>
    </AuthForm>
  );
};

export default Login;

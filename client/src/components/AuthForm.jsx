import React from 'react';
import './AuthForm.css';

const AuthForm = ({ title, onSubmit, children }) => (
  <div className="auth-form-container">
    <div className="auth-form">
      <h2>{title}</h2>
      <form onSubmit={onSubmit}>
        {children}
        <button type="submit" className="submit-button">
          {title === 'Verify OTP' ? 'Verify' : 'Submit'}
        </button>
      </form>
    </div>
  </div>
);

export default AuthForm;
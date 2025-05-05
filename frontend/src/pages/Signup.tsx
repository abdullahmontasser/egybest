import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
import '../css/Auth.css';
import * as authService from '../services/authService';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const clearErrors = () => {
    setError('');
    setUsernameError('');
    setEmailError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.register({ username, email, password });

      if (!response.success) {
        // Parse error message to determine if it's a username or email error
        const errorMsg = response.error || '';
        if (errorMsg.toLowerCase().includes('username')) {
          setUsernameError(errorMsg);
        } else if (errorMsg.toLowerCase().includes('email')) {
          setEmailError(errorMsg);
        } else {
          setError(errorMsg || 'Failed to create an account. Please try again.');
        }
        return;
      }

      // If registration succeeded, store the token and navigate to home
      if (response.token) {
        localStorage.setItem('token', response.token);
        navigate('/');
      } else {
        setError('Failed to create an account. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('An error occurred during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (usernameError) setUsernameError('');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Create an Account</h2>
        <p>Join EgyBest to watch your favorite movies</p>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className={usernameError ? 'input-error' : ''}
            value={username}
            onChange={handleUsernameChange}
            placeholder="Choose a username"
            required
          />
          {usernameError && <small className="error-text">{usernameError}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className={emailError ? 'input-error' : ''}
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            required
          />
          {emailError && <small className="error-text">{emailError}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              Creating account
              <span className="loading-spinner"></span>
            </>
          ) : (
            'Sign up'
          )}
        </button>
      </form>

      <div className="auth-link">
        <p>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

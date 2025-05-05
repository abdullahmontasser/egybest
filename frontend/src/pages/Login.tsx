import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../css/Auth.css';
import * as authService from '../services/authService';

interface LocationState {
  from?: string;
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const from = state?.from || '/';

  const clearErrors = () => {
    setError('');
    setEmailError('');
    setPasswordError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // First try to login using the service directly to get detailed error messages
      const response = await authService.login({ email, password });

      if (!response.success) {
        const errorMsg = response.error || '';
        if (errorMsg.toLowerCase().includes('email')) {
          setEmailError(errorMsg);
        } else if (errorMsg.toLowerCase().includes('password')) {
          setPasswordError(errorMsg);
        } else if (errorMsg.toLowerCase().includes('credentials')) {
          setError('Invalid email or password');
        } else {
          setError(errorMsg || 'Login failed');
        }
        return;
      }

      // If service call succeeded, now use the context login method which will set the user state
      const success = await login(email, password);

      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', error);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Sign in to continue to EgyBest</p>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
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
            className={passwordError ? 'input-error' : ''}
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            required
          />
          {passwordError && <small className="error-text">{passwordError}</small>}
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? (
            <>
              Signing in
              <span className="loading-spinner"></span>
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      <div className="auth-link">
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>

      <div className="auth-demo-info">
        <p style={{ marginTop: '2rem', fontSize: '0.9rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Demo credentials: user@example.com / password
        </p>
      </div>
    </div>
  );
};

export default Login;

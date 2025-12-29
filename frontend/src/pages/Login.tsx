import { useState } from 'react';
import { AuthService } from '../services/authService';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailedMessage, setLoginFailedMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { statusCode, token } = await new AuthService().getLoginToken({
        name,
        password,
      });

      if (token) {
        localStorage.setItem('JWT', token);
        window.location.href = '/';
        return;
      }

      if (statusCode === 401) {
        setLoginFailedMessage('Incorrect credentials. Please try again.');
        return;
      }

      setLoginFailedMessage('Something went wrong. Please try again later.');
    } catch (error) {
      setLoginFailedMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <article className="loginComponent">
      <form className="loginForm" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
        </div>
        <p>{loginFailedMessage}</p>
        <button type="submit" className="loginButton">
          Login
        </button>
      </form>
    </article>
  );
};

export default Login;

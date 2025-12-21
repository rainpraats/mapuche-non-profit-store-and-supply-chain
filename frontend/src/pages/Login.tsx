import { useState } from 'react';
import { AdminService } from '../services/adminService';
import { AuthService } from '../services/authService';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailedMessage, setLoginFailedMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await new AuthService().getLoginToken({
        name,
        password,
      });

      console.log(response);

      if (response && response.token) {
        localStorage.setItem('JWT', response.token);
        window.location.reload();
        return;
      }

      if (response && response.message) {
        setLoginFailedMessage(response.message);
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

import React from 'react';

const Login = ({
  setIsSignedIn,
}: {
  setIsSignedIn: (value: boolean) => void;
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignedIn(true);
  };

  return (
    <article className="loginComponent">
      <form className="loginForm" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Full name</label>
          <input id="name" type="text" placeholder="Enter your name" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="loginButton">
          Login
        </button>
      </form>
    </article>
  );
};

export default Login;

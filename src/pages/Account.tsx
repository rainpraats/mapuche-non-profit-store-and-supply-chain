import React from 'react';
import { Link } from 'react-router';

const Account = () => {
  return (
    <main>
      <Link to="/">&#10094; go back</Link>
      <p>Name: current user</p>
      <button
        onClick={() => {
          /* delete account logic */
        }}
      >
        Delete Account
      </button>
    </main>
  );
};

export default Account;

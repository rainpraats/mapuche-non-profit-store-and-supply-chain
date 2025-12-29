import { useOutletContext, Link } from 'react-router';
import type { User } from '../interfaces/user';
import { AuthService } from '../services/authService';
import { useState } from 'react';

const Account = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const { signedInUser } = useOutletContext<{ signedInUser: User }>();
  const formatedDate = new Date(signedInUser.memberSince);

  const deleteThisAccount = async () => {
    setErrorMessage('');
    const accountWasDeleted = await new AuthService().deleteCurrentUser();
    if (accountWasDeleted) {
      localStorage.clear();
      window.location.href = '/';
    } else {
      setErrorMessage('Failed to delete account. Try again later.');
    }
  };
  return (
    <main>
      <Link to="/">&#10094; go back</Link>
      <p>Name: {signedInUser.name}</p>
      <p>Member since: {formatedDate.toString()}</p>
      <button
        onClick={() => {
          deleteThisAccount();
        }}
      >
        Delete Account
      </button>
      <p>{errorMessage}</p>
    </main>
  );
};

export default Account;

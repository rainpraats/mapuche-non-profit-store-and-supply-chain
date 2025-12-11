import { Outlet } from 'react-router';
import Banner from '../components/Banner';
import Login from '../pages/Login.tsx';
import { useState, useEffect } from 'react';
import { AuthService } from '../services/authService.ts';
import type { User } from '../interfaces/user.ts';

const Layout = () => {
  const [signedInUser, setSignedInUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const verifyAuthorization = async () => {
    const user = await new AuthService().getCurrentUser();
    console.log(user);
    setSignedInUser(user);
    setIsLoading(false);
  };

  // should recive and populate site with user name and load roles based on the user role.
  // get from

  useEffect(() => {
    const attemptVerification = async () => {
      let maxAttempts = 10;
      const delayMs = 5000;

      while (maxAttempts >= 1) {
        try {
          await verifyAuthorization();
          return;
        } catch (error) {
          console.error(error);
          setTimeout(() => {}, delayMs);
        }
        maxAttempts--;
      }

      setIsLoading(false);
    };

    attemptVerification();
  }, []);

  if (isLoading) {
    return (
      <>
        <img src="./assets/corn.svg" alt="" />
        <p>Loading</p>
      </>
    );
  }

  if (!signedInUser) {
    return <Login />;
  }

  return (
    <>
      <Banner signedInUser={signedInUser} />
      <Outlet context={{ signedInUser }} />
    </>
  );
};

export default Layout;

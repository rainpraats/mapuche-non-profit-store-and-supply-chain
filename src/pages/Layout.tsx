import { Outlet } from 'react-router';
import Banner from '../components/Banner';
import Login from '../pages/Login.tsx';
import { useState, useEffect } from 'react';

const Layout = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check sign-in status
    setIsLoading(false);
    setIsSignedIn(true); // replace with auth
  }, []);

  if (isLoading) {
    return (
      <>
        <img src="./assets/corn.svg" alt="" />
        <p>Loading</p>
      </>
    );
  }

  if (!isSignedIn) {
    return <Login setIsSignedIn={setIsSignedIn} />;
  }

  return (
    <>
      <Banner setIsSignedIn={setIsSignedIn} />
      <Outlet />
    </>
  );
};

export default Layout;

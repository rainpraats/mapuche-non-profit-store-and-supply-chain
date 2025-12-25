import { Outlet } from "react-router";
import Banner from "../components/Banner";
import Login from "../pages/Login.tsx";
import { useState, useEffect } from "react";
import { AuthService } from "../services/authService.ts";
import type { User } from "../interfaces/user.ts";

const Layout = () => {
  const [signedInUser, setSignedInUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const verifyAuthorization = async () => {
    try {
      const user = await new AuthService().getCurrentUser();
      setSignedInUser(user);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyAuthorization();
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

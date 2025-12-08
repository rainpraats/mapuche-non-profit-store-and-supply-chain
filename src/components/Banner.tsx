import React from 'react';
import cornLogo from '../assets/corn.svg';
import logoutIcon from '../assets/logout.svg';

const Banner = ({
  setIsSignedIn,
}: {
  setIsSignedIn: (value: boolean) => void;
}) => {
  return (
    <header>
      <img
        src={cornLogo}
        alt="mapuche supply chain and store's logo, a picture of corn"
        height="64px"
        width="64px"
      />
      <p className="displayUsername">current user</p>
      <button
        title="log out"
        className="logoutButton"
        onClick={() => setIsSignedIn(false)}
      >
        <img src={logoutIcon} alt="Log out button" height="24px" width="24px" />
      </button>
    </header>
  );
};

export default Banner;

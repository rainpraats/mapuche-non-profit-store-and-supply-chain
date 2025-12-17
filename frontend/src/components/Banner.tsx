import { Link } from 'react-router';
import cornLogo from '../assets/corn.svg';
import logoutIcon from '../assets/logout.svg';
import type { User } from '../interfaces/user';

const Banner = ({ signedInUser }: { signedInUser: User }) => {
  return (
    <header>
      <span>
        <Link to="/" title="Return to homepage">
          <img
            src={cornLogo}
            alt="mapuche supply chain and store's logo, a picture of corn"
            height="64px"
            width="64px"
          />
        </Link>
      </span>
      <p className="displayUsername">Signed in as: {signedInUser.name}</p>
      <button
        title="log out"
        className="logoutButton"
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
      >
        <img src={logoutIcon} alt="Log out button" height="24px" width="24px" />
      </button>
    </header>
  );
};

export default Banner;

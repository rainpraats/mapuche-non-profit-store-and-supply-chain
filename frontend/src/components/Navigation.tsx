import { Link } from 'react-router';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/account">Account</Link>
        </li>
        <li>
          <Link to="/checkout">Purchase</Link>
        </li>
        <li>
          <Link to="/orders">Orders</Link>
        </li>
        <li>
          <Link to="/stock">Stock</Link>
        </li>
        <li>
          <Link to="/manageUsers">Manage Users</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;

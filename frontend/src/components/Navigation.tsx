import { Link, useOutletContext } from 'react-router';
import type { User } from '../interfaces/user';

const Navigation = () => {
  const { signedInUser } = useOutletContext<{ signedInUser: User }>();
  const role = signedInUser.role;

  return (
    <nav>
      <ul>
        <li>
          <Link to="/account">Account</Link>
        </li>
        <li>
          <Link to="/checkout">Purchase</Link>
        </li>
        {(role === 'admin' || role === 'volunteer' || role === 'supplier') && (
          <>
            <li>
              <Link to="/orders">Orders</Link>
            </li>
            {(role === 'admin' || role === 'volunteer') && (
              <>
                <li>
                  <Link to="/stock">Stock</Link>
                </li>
                <li>
                  <Link to="/manage-users">Manage Users</Link>
                </li>
              </>
            )}
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;

import { useEffect, useState } from 'react';
import { AdminService } from '../services/adminService';
import type { User } from '../interfaces/user';
import { Link } from 'react-router';
import AddUser from '../components/AddUser';
import UserCard from '../components/UserCard';

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState('');

  const fetchUsers = async () => {
    setStatus('Loading...');
    try {
      const result = await new AdminService().getUsers();
      setUsers(result);
      setStatus('');
    } catch (error) {
      console.error(error);
      setStatus('Could not load users. Try again later.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main>
      <Link to="/">&#10094; go back</Link>
      <AddUser fetchUsers={fetchUsers} />
      {status && <p>{status}</p>}
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            <UserCard user={user} fetchUsers={fetchUsers} />
          </li>
        ))}
      </ul>
    </main>
  );
};

export default ManageUsers;

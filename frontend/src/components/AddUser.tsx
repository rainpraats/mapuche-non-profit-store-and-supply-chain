import { useRef, useState } from 'react';
import { AdminService } from '../services/adminService';
import type { UserRole } from '../interfaces/userRole';

const AddUser = ({ fetchUsers }: { fetchUsers: () => void }) => {
  const [status, setStatus] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const createNewUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newUser = {
      name: formData.get('name') as string,
      role: formData.get('role') as UserRole,
      password: formData.get('password') as string,
    };

    try {
      await new AdminService().createUser(newUser);
      await fetchUsers();
      formRef.current?.reset();
    } catch (error) {
      console.error(error);
      setStatus('A problem occured when creating a user.');
    }
  };

  return (
    <form onSubmit={createNewUser} ref={formRef}>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" required />
      </div>
      <div>
        <label htmlFor="role">Role:</label>
        <select name="role" required>
          <option value="">Select a role</option>
          <option value="customer">Customer</option>
          <option value="volunteer">Volunteer</option>
          <option value="supplier">Supplier</option>
          <option value="delivery">Delivery</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="text" name="password" required />
      </div>
      <button type="submit">Add User</button>
      {status && <p>{status}</p>}
    </form>
  );
};

export default AddUser;

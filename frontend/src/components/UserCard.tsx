import { useState } from 'react';
import type { User } from '../interfaces/user';
import { AdminService } from '../services/adminService';
import type { UserRole } from '../interfaces/userRole';

const UserCard = ({
  user,
  fetchUsers,
}: {
  user: User;
  fetchUsers: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const [newPassword, setNewPassword] = useState('');
  const [deleteStatus, setDeleteStatus] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const deleteUser = async () => {
    try {
      await new AdminService().deleteUser(user.name);
      await fetchUsers();
    } catch (error) {
      console.error(error);
      setDeleteStatus('Failed to delete user.');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedUser = {
      ...editedUser,
      ...(newPassword && { password: newPassword }),
    };

    try {
      await new AdminService().editUser(user.name, updatedUser);
      setIsEditing(false);
      await fetchUsers();
    } catch (error) {
      console.error(error);
      setEditStatus('Failed to save changes.');
    }
  };

  const displayTemplate = (
    <>
      <p>{user.name}</p>
      <p>{user.role}</p>
      <p>{user.memberSince.toString()}</p>
      <button
        onClick={() => {
          setIsEditing(true);
        }}
      >
        Edit
      </button>
      <button onClick={deleteUser}>Delete</button>
      {deleteStatus && <p>{deleteStatus}</p>}
    </>
  );

  const editTemplate = (
    <form onSubmit={handleSaveEdit}>
      <input
        type="text"
        value={editedUser.name}
        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
        placeholder="Username"
      />
      <select
        value={editedUser.role}
        onChange={(e) =>
          setEditedUser({ ...editedUser, role: e.target.value as UserRole })
        }
      >
        <option value="customer">Customer</option>
        <option value="volunteer">Volunteer</option>
        <option value="supplier">Supplier</option>
        <option value="delivery">Delivery</option>
        <option value="admin">Admin</option>
      </select>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Save</button>
      <button
        onClick={() => {
          setIsEditing(false);
        }}
      >
        Cancel
      </button>
      {editStatus && <p>{editStatus}</p>}
    </form>
  );
  return isEditing ? editTemplate : displayTemplate;
};

export default UserCard;

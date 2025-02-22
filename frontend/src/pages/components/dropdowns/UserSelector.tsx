import { useState } from "react";
import { useUsers } from "../../../hooks/useUsers";

interface Props {
  onSelect: (selectedUser: string) => void;
}

const UserDropdown: React.FC<Props> = ({ onSelect }) => {
  const { users, loading, error, fetchUsers } = useUsers();
  const [selectedUser, setSelectedUser] = useState("");

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(e.target.value);
    onSelect(e.target.value);
  };

  return (
    <div>
      <select
        value={selectedUser}
        onChange={handleSelect}
        onClick={fetchUsers}
        className="px-4 py-3 bg-gray-100 w-full text-gray-800 text-sm border-none focus:outline-yellow-600 focus:bg-transparent rounded-lg"
      >
        <option value="">Select a user</option>
        {loading ? (
          <option disabled>Loading...</option>
        ) : error ? (
          <option disabled>{error}</option>
        ) : (
          users.map((user) => (
            <option key={user.id} value={user.username}>
              {user.username}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default UserDropdown;

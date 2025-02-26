import { useState, useEffect } from "react";
import { useUsers } from "../../../hooks/useUsers";

interface Props {
  onSelect: (selectedUser: string) => void;
  selectedValue?: string;
}

const UserDropdown: React.FC<Props> = ({ onSelect, selectedValue = "" }) => {
  const { users, loading, error, fetchUsers } = useUsers();
  const [selectedUser, setSelectedUser] = useState(selectedValue);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setSelectedUser(selectedValue);
  }, [selectedValue]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedUser(newValue);
    onSelect(newValue);
  };

  return (
    <div>
      <select
        value={selectedUser}
        onChange={handleSelect}
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

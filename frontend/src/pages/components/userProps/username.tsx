import { useCallback, useEffect, useState } from "react";
import { useUsers } from "../../../hooks/useUsers";
import { User } from "../../../features/userSlice";

const AssignedUser = ({ id }: { id: number }) => {
  const [user, setUser] = useState<User | null>(null);
  const { loading, handleAssignedUsers } = useUsers();

  const fetchAssignedUser = useCallback(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fetchedUser: any = await handleAssignedUsers(id);
      setUser(fetchedUser);
    } catch (error) {
      console.warn("Error fetching user:", error);
      setUser(null);
    }
  }, [handleAssignedUsers, id]);

  useEffect(() => {
    if (id) {
      fetchAssignedUser();
    }
  }, [fetchAssignedUser, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <p>{user ? `${user.username}` : ""}</p>;
};

export default AssignedUser;

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersDetails } from "../features/userSlice";
import { RootState, AppDispatch } from "../app/store";

export const useUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, current_page, pages } = useSelector(
    (state: RootState) => state.users
  );
  const [isOpen, setIsOpen] = useState(false);

  const fetchUsers = () => {
    if (!isOpen && users.length === 0) {
      dispatch(fetchUsersDetails());
    }
    setIsOpen(true);
  };

  return {
    users,
    loading,
    error,
    isOpen,
    fetchUsers,
    current_page,
    pages
  };
};

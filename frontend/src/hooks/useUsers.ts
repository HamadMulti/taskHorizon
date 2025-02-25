import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeUserPassword,
  createUser,
  deleteUser,
  fetchUsersDetails,
  updatesProfile
} from "../features/userSlice";
import { RootState, AppDispatch } from "../app/store";
import { useLocation } from "react-router-dom";

export const useUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, current_page, pages, total } = useSelector(
    (state: RootState) => state.users
  );
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const fetchUsers = () => {
    if (!isOpen && users.length === 0) {
      dispatch(fetchUsersDetails());
    }

    setIsOpen(true);
  };
  useEffect(() => {
    if (pathname === "/dashboard/users") {
      const fetchData = async () => {
        try {
          await dispatch(fetchUsersDetails()).unwrap();
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      fetchData();
    }
  }, [dispatch, pathname]);

  const handleCreate = async (data: { username: string; email: string }) => {
    return dispatch(createUser(data)).unwrap();
  };

  return {
    users,
    loading,
    error,
    isOpen,
    fetchUsers,
    handleCreate,
    handleUpdateUsers: async (id: number, username: string, email: string) => {
      try {
        await dispatch(updatesProfile({ id, username, email })).unwrap();
        await dispatch(fetchUsersDetails()).unwrap();
      } catch (error) {
        console.error("Error updating project:", error);
      }
    },
    handleDeleteUser: async (id: number) => {
      try {
        await dispatch(deleteUser(id)).unwrap();
        await dispatch(fetchUsersDetails()).unwrap();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    },
    handleChangeUserPassword: async (id: number) => {
      try {
        await dispatch(changeUserPassword(id)).unwrap();
        await dispatch(fetchUsersDetails()).unwrap();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    },
    current_page,
    pages,
    total
  };
};

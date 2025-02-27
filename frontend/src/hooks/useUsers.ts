import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeUserPassword,
  createUser,
  deleteUser,
  fetchAssignedDetails,
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
          console.warn("Error fetching users:", error);
        }
      };

      fetchData();
    }
  }, [dispatch, pathname]);

  return {
    users,
    loading,
    error,
    isOpen,
    fetchUsers,
    handleCreate: async (data: { username: string; email: string }) => {
      try {
        await dispatch(createUser(data)).unwrap();
        await dispatch(fetchUsersDetails()).unwrap();
      } catch (error) {
        console.warn("Error creating user:", error);
      }
    },  
    handleUpdateUsers: async (id: number, username: string, email: string) => {
      try {
        await dispatch(updatesProfile({ id, username, email })).unwrap();
        await dispatch(fetchUsersDetails()).unwrap();
      } catch (error) {
        console.warn("Error updating user:", error);
      }
    },
    handleDeleteUser: async (id: number) => {
      try {
        await dispatch(deleteUser(id)).unwrap();
        await dispatch(fetchUsersDetails()).unwrap();
      } catch (error) {
        console.warn("Error deleting user:", error);
      }
    },
    handleChangeUserPassword: async (id: number) => {
      try {
        await dispatch(changeUserPassword(id)).unwrap();
        await dispatch(fetchUsersDetails()).unwrap();
      } catch (error) {
        console.warn("Error changing user password:", error);
      }
    },
    handleAssignedUsers: async (id: number) => {
      try {
        await dispatch(fetchAssignedDetails(id)).unwrap();
      } catch (error) {
        console.warn("Error fetching user:", error);
      }
    },
    current_page,
    pages,
    total
  };
};

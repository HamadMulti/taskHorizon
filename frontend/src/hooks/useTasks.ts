import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import {
  fetchTasksDetails,
  fetchMyTasksDetails,
  fetchTeamTasksDetails,
  createTask,
  updateTask,
  assignTask,
  archiveTask
} from "../features/taskSlice";
import { useEffect } from "react";

export const useTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector(
    (state: RootState) => state.tasks
  );

  useEffect(() => {
      dispatch(fetchTasksDetails());
  }, [dispatch]);

  const getMyTasks = () => {
    dispatch(fetchMyTasksDetails());
  };

  const getTeamTasks = () => {
    dispatch(fetchTeamTasksDetails());
  };

  const addTask = (taskData: {
    title: string;
    description: string;
    projectId: number;
  }) => {
    dispatch(createTask(taskData));
  };

  const editTask = (taskData: {
    id: number;
    title: string;
    description: string;
    projectId: number;
  }) => {
    dispatch(updateTask(taskData));
  };

  const assignTaskToUser = (taskData: {
    id: number;
    title: string;
    description: string;
    projectId: number;
  }) => {
    dispatch(assignTask(taskData));
  };

  const archiveTaskById = (id: number) => {
    dispatch(archiveTask(id));
  };

  return {
    tasks,
    loading,
    error,
    getMyTasks,
    getTeamTasks,
    addTask,
    editTask,
    assignTaskToUser,
    archiveTaskById
  };
};

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import {
  fetchTasksDetails,
  fetchMyTasksDetails,
  fetchTeamTasksDetails,
  createTask,
  updateTask,
  assignTask,
  archiveTask,
} from "../features/taskSlice";
import { useEffect, useRef, useState } from "react";
import { selectFilteredMyTasks, selectFilteredTasks, selectFilteredTeamTasks } from "../utils/taskSelector";

export const useTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    totalTasks,
    totalMyTasks,
    totalTeamTasks,
    totalPages,
    totalMyPages,
    totalTeamPages,
    loading,
    error,
  } = useSelector((state: RootState) => state.tasks);
  const tasks = useSelector(selectFilteredTeamTasks);
  const my_tasks = useSelector(selectFilteredMyTasks);
  const team_tasks = useSelector(selectFilteredTasks);

  const [taskPage, setTaskPage] = useState(1);
  const [myTaskPage, setMyTaskPage] = useState(1);
  const [teamTaskPage, setTeamTaskPage] = useState(1);

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    dispatch(fetchTasksDetails({ page: taskPage }));
  }, [dispatch, taskPage]);
  
  useEffect(() => {
    if (!isMounted.current) {
      return;
    }
    dispatch(fetchMyTasksDetails({ page: myTaskPage }));
  }, [dispatch, myTaskPage]);
  
  useEffect(() => {
    if (!isMounted.current) {
      return;
    }
    dispatch(fetchTeamTasksDetails({ page: teamTaskPage }));
  }, [dispatch, teamTaskPage]);

  const getMyTasks = (page = 1) => {
    setMyTaskPage(page);
  };

  const getTeamTasks = (page = 1) => {
    setTeamTaskPage(page);
  };

  const addTask = (taskData: {
    title: string;
    status: string;
    description: string;
    project_id: number;
  }) => {
    dispatch(createTask(taskData));
  };

  const editTask = (taskData: {
    id: number;
    title: string;
    status: string;
    description: string;
    project_id: number;
  }) => {
    dispatch(updateTask(taskData));
  };

  const assignTaskToUser = (taskData: {
    id: number;
    title: string;
    status: string;
    description: string;
    project_id: number;
  }) => {
    dispatch(assignTask(taskData));
  };

  const archiveTaskById = (id: number) => {
    dispatch(archiveTask(id));
  };

  return {
    tasks,
    my_tasks,
    team_tasks,
    totalTasks,
    totalMyTasks,
    totalTeamTasks,
    totalPages,
    totalMyPages,
    totalTeamPages,
    taskPage,
    myTaskPage,
    teamTaskPage,
    loading,
    error,
    setTaskPage,
    getMyTasks,
    getTeamTasks,
    addTask,
    editTask,
    assignTaskToUser,
    archiveTaskById,
  };
};

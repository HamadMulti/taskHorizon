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
import {
  selectFilteredMyTasks,
  selectFilteredTasks,
  selectFilteredTeamTasks
} from "../utils/taskSelector";
import { useLocation } from "react-router-dom";

export const useTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pathname } = useLocation();

  const {
    currentPage,
    my_currentPage,
    team_currentPage,
    totalPages,
    my_totalPages,
    team_totalPages,
    totalTasks,
    my_totalTasks,
    team_totalTasks,
    loading,
    error
  } = useSelector((state: RootState) => state.tasks);

  const tasks = useSelector(selectFilteredTasks);
  const my_tasks = useSelector(selectFilteredMyTasks);
  const team_tasks = useSelector(selectFilteredTeamTasks);

  useEffect(() => {
    if (pathname === "/dashboard/tasks") {
      dispatch(fetchTasksDetails({ page: currentPage }));
    } else if (pathname === "/dashboard/my-tasks") {
      dispatch(fetchMyTasksDetails({ page: my_currentPage }));
    } else if (pathname === "/dashboard/team-tasks") {
      dispatch(fetchTeamTasksDetails({ page: team_currentPage }));
    }
  }, [dispatch, pathname, currentPage, my_currentPage, team_currentPage]);

  const nextPage = () => {
    if (pathname === "/dashboard/tasks" && currentPage < totalPages) {
      dispatch(fetchTasksDetails({ page: currentPage + 1 }));
    }
    if (pathname === "/dashboard/my-tasks" && my_currentPage < my_totalPages) {
      dispatch(fetchMyTasksDetails({ page: my_currentPage + 1 }));
    }
    if (pathname === "/dashboard/team-tasks" && team_currentPage < team_totalPages) {
      dispatch(fetchTeamTasksDetails({ page: team_currentPage + 1 }));
    }
  };

  const prevPage = () => {
    if (pathname === "/dashboard/tasks" && currentPage > 1) {
      dispatch(fetchTasksDetails({ page: currentPage - 1 }));
    }
    if (pathname === "/dashboard/my-tasks" && my_currentPage > 1) {
      dispatch(fetchMyTasksDetails({ page: my_currentPage - 1 }));
    }
    if (pathname === "/dashboard/team-tasks" && team_currentPage > 1) {
      dispatch(fetchTeamTasksDetails({ page: team_currentPage - 1 }));
    }
  };

  const setPage = (page: number) => {
    if (pathname === "/dashboard/tasks" && page >= 1 && page <= totalPages) {
      dispatch(fetchTasksDetails({ page }));
    }
    if (pathname === "/dashboard/my-tasks" && page >= 1 && page <= my_totalPages) {
      dispatch(fetchMyTasksDetails({ page }));
    }
    if (pathname === "/dashboard/team-tasks" && page >= 1 && page <= team_totalPages) {
      dispatch(fetchTeamTasksDetails({ page }));
    }
  };

  return {
    tasks,
    my_tasks,
    team_tasks,
    loading,
    error,
    totalTasks,
    my_totalTasks,
    team_totalTasks,
    currentPage,
    my_currentPage,
    team_currentPage,
    totalPages,
    my_totalPages,
    team_totalPages,
    addTask: async (taskData: { title: string; status: string; description: string; project_id: number }) => {
      try {
        await dispatch(createTask(taskData));
        dispatch(fetchTasksDetails({ page: currentPage }));
      } catch (error) {
        console.error("Error creating task:", error);
      }
    },
    editTask: async (taskData: { id: number; title: string; status: string; description: string; project_id: number }) => {
      try {
        await dispatch(updateTask(taskData));
        dispatch(fetchTasksDetails({ page: currentPage }));
      } catch (error) {
        console.error("Error updating task:", error);
      }
    },
    assignTaskToUser: async (taskData: { id: number; title: string; status: string; description: string; project_id: number }) => {
      try {
        await dispatch(assignTask(taskData));
        dispatch(fetchTasksDetails({ page: currentPage }));
      } catch (error) {
        console.error("Error assigning task:", error);
      }
    },
    archiveTaskById: async (id: number) => {
      try {
        await dispatch(archiveTask(id));
        dispatch(fetchTasksDetails({ page: currentPage }));
      } catch (error) {
        console.error("Error archiving task:", error);
      }
    },
    nextPage,
    prevPage,
    setPage
  };
};

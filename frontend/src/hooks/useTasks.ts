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
import { useEffect, useState } from "react";
import {
  selectFilteredMyTasks,
  selectFilteredTasks,
  selectFilteredTeamTasks
} from "../utils/taskSelector";
import { useLocation } from "react-router-dom";

export const useTasks = () => {
  const { loading, error } = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch<AppDispatch>();
  const { pathname } = useLocation();
  const tasks = useSelector(selectFilteredTasks);
  const my_tasks = useSelector(selectFilteredMyTasks);
  const team_tasks = useSelector(selectFilteredTeamTasks);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  const [my_currentPage, setMyCurrentPage] = useState(1);
  const [my_totalPages, setMyTotalPages] = useState(1);
  const [my_totalTasks, setMyTotalTasks] = useState(0);

  const [team_currentPage, setTeamCurrentPage] = useState(1);
  const [team_totalPages, setTeamTotalPages] = useState(1);
  const [team_totalTasks, setTeamTotalTasks] = useState(0);

  useEffect(() => {
    if (pathname === "/dashboard/tasks") {
      const fetchData = async () => {
        try {
          const taskData = await dispatch(
            fetchTasksDetails({ page: currentPage })
          ).unwrap();

          setTotalPages(taskData.pages);
          setTotalTasks(taskData.total);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      };

      fetchData();
    }
    if (pathname === "/dashboard/my-tasks") {
      const fetchMyData = async () => {
        try {
          const myTasksData = await dispatch(
            fetchMyTasksDetails({ page: my_currentPage })
          ).unwrap();

          setMyTotalPages(myTasksData.pages);
          setMyTotalTasks(myTasksData.total);
        } catch (error) {
          console.error("Error fetching users projects:", error);
        }
      };

      fetchMyData();
    }
    if (pathname === "/dashboard/team-tasks") {
      const fetchTeamData = async () => {
        try {
          const myTeamData = await dispatch(
            fetchTeamTasksDetails({ page: team_currentPage })
          ).unwrap();

          setTeamTotalPages(myTeamData.pages);
          setTeamTotalTasks(myTeamData.total);
        } catch (error) {
          console.error("Error fetching users projects:", error);
        }
      };

      fetchTeamData();
    }
  }, [currentPage, dispatch, my_currentPage, pathname, team_currentPage]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
    if (my_currentPage < my_totalPages) {
      setMyCurrentPage((prevPage) => prevPage + 1);
    }
    if (team_currentPage < team_totalPages) {
      setTeamCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
    if (my_currentPage > 1) {
      setMyCurrentPage((prevPage) => prevPage - 1);
    }
    if (team_currentPage > 0) {
      setTeamCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
    if (page >= 1 && page <= my_totalPages) {
      setMyCurrentPage(page);
    }
    if (page >= 1 && page <= team_totalPages) {
      setMyCurrentPage(page);
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
    addTask: async (taskData: {
      title: string;
      status: string;
      description: string;
      project_id: number;
    }) => {
      try {
        await dispatch(createTask(taskData)).unwrap();
        await dispatch(fetchTasksDetails({ page: currentPage })).unwrap();
        await dispatch(fetchMyTasksDetails({ page: my_currentPage })).unwrap();
        await dispatch(
          fetchTeamTasksDetails({ page: team_currentPage })
        ).unwrap();
      } catch (error) {
        console.error("Error creating task:", error);
      }
    },
    editTask: async (taskData: {
      id: number;
      title: string;
      status: string;
      description: string;
      project_id: number;
    }) => {
      try {
        await dispatch(updateTask(taskData));
        await dispatch(fetchTasksDetails({ page: currentPage })).unwrap();
        await dispatch(fetchMyTasksDetails({ page: my_currentPage })).unwrap();
        await dispatch(
          fetchTeamTasksDetails({ page: team_currentPage })
        ).unwrap();
      } catch (error) {
        console.error("Error updating task:", error);
      }
    },
    assignTaskToUser: async (taskData: {
      id: number;
      title: string;
      status: string;
      description: string;
      project_id: number;
    }) => {
      try {
        dispatch(assignTask(taskData));
        await dispatch(fetchTasksDetails({ page: currentPage })).unwrap();
        await dispatch(fetchMyTasksDetails({ page: my_currentPage })).unwrap();
        await dispatch(
          fetchTeamTasksDetails({ page: team_currentPage })
        ).unwrap();
      } catch (error) {
        console.error("Error assigning task:", error);
      }
    },
    archiveTaskById: async (id: number) => {
      try {
        await dispatch(archiveTask(id));
        await dispatch(fetchTasksDetails({ page: currentPage })).unwrap();
        await dispatch(fetchMyTasksDetails({ page: my_currentPage })).unwrap();
        await dispatch(
          fetchTeamTasksDetails({ page: team_currentPage })
        ).unwrap();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    },
    nextPage,
    prevPage,
    setPage
  };
};

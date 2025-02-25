/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useEffect, useRef } from "react";
import {
  selectFilteredMyTasks,
  selectFilteredTasks,
  selectFilteredTeamTasks
} from "../utils/taskSelector";
import { useLocation } from "react-router-dom";
import { debounce } from "lodash";
import {
  AsyncThunkAction,
  ThunkDispatch,
  UnknownAction
} from "@reduxjs/toolkit";

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
  const isFetching = useRef(false);
  const debouncedFetchTasks = debounce(
    (
      dispatch: (
        arg0: AsyncThunkAction<
          any,
          { page: number },
          {
            state?: unknown;
            dispatch?: ThunkDispatch<unknown, unknown, UnknownAction>;
            extra?: unknown;
            rejectValue?: unknown;
            serializedErrorType?: unknown;
            pendingMeta?: unknown;
            fulfilledMeta?: unknown;
            rejectedMeta?: unknown;
          }
        >
      ) => void,
      page: any
    ) => {
      dispatch(fetchTasksDetails({ page }));
    },
    300
  );
  const debouncedFetchMyTasks = debounce(
    (
      dispatch: (
        arg0: AsyncThunkAction<
          any,
          { page: number },
          {
            state?: unknown;
            dispatch?: ThunkDispatch<unknown, unknown, UnknownAction>;
            extra?: unknown;
            rejectValue?: unknown;
            serializedErrorType?: unknown;
            pendingMeta?: unknown;
            fulfilledMeta?: unknown;
            rejectedMeta?: unknown;
          }
        >
      ) => void,
      page: any
    ) => {
      dispatch(fetchMyTasksDetails({ page }));
    },
    300
  );
  const debouncedFetchTeamTasks = debounce(
    (
      dispatch: (
        arg0: AsyncThunkAction<
          any,
          { page: number },
          {
            state?: unknown;
            dispatch?: ThunkDispatch<unknown, unknown, UnknownAction>;
            extra?: unknown;
            rejectValue?: unknown;
            serializedErrorType?: unknown;
            pendingMeta?: unknown;
            fulfilledMeta?: unknown;
            rejectedMeta?: unknown;
          }
        >
      ) => void,
      page: any
    ) => {
      dispatch(fetchTeamTasksDetails({ page }));
    },
    300
  );

  useEffect(() => {
    if (isFetching.current) {
      return;
    }

    isFetching.current = true;

    if (pathname === "/dashboard/tasks" && tasks.length === 0) {
      dispatch(fetchTasksDetails({ page: currentPage })).finally(
        () => (isFetching.current = false)
      );
    } else if (pathname === "/dashboard/my-tasks" && my_tasks.length === 0) {
      dispatch(fetchMyTasksDetails({ page: my_currentPage })).finally(
        () => (isFetching.current = false)
      );
    } else if (
      pathname === "/dashboard/team-tasks" &&
      team_tasks.length === 0
    ) {
      dispatch(fetchTeamTasksDetails({ page: team_currentPage })).finally(
        () => (isFetching.current = false)
      );
    }
  }, [
    dispatch,
    pathname,
    tasks.length,
    my_tasks.length,
    team_tasks.length,
    currentPage,
    my_currentPage,
    team_currentPage
  ]);

  const nextPage = () => {
    if (pathname === "/dashboard/tasks" && currentPage < totalPages) {
      dispatch(fetchTasksDetails({ page: currentPage + 1 }));
    }
    if (pathname === "/dashboard/my-tasks" && my_currentPage < my_totalPages) {
      dispatch(fetchMyTasksDetails({ page: my_currentPage + 1 }));
    }
    if (
      pathname === "/dashboard/team-tasks" &&
      team_currentPage < team_totalPages
    ) {
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
      debouncedFetchTasks(dispatch, page);
    }
    if (
      pathname === "/dashboard/my-tasks" &&
      page >= 1 &&
      page <= my_totalPages
    ) {
      debouncedFetchMyTasks(dispatch, page);
    }
    if (
      pathname === "/dashboard/team-tasks" &&
      page >= 1 &&
      page <= team_totalPages
    ) {
      debouncedFetchTeamTasks(dispatch, page);
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
        await dispatch(createTask(taskData));
        dispatch(fetchTasksDetails({ page: currentPage }));
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
        dispatch(fetchTasksDetails({ page: currentPage }));
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

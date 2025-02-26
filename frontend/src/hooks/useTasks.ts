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
  archiveTask,
  restoreTask,
  fetchArchivedDetails,
} from "../features/taskSlice";
import { useEffect, useRef, useCallback } from "react";
import {
  selectFilteredMyTasks,
  selectFilteredTasks,
  selectFilteredTeamTasks,
  selectFilteredArchivedTasks,
} from "../utils/taskSelector";
import { useLocation } from "react-router-dom";
import { debounce } from "lodash";

export const useTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pathname } = useLocation();
  const isFetching = useRef(false);

  const {
    currentPage,
    my_currentPage,
    team_currentPage,
    archived_currentPage,
    totalPages,
    my_totalPages,
    team_totalPages,
    archived_totalPages,
    loading,
    error,
    archived_totalTasks,
    my_totalTasks,
    totalTasks,
    team_totalTasks,
  } = useSelector((state: RootState) => state.tasks);

  const tasks = useSelector(selectFilteredTasks);
  const my_tasks = useSelector(selectFilteredMyTasks);
  const team_tasks = useSelector(selectFilteredTeamTasks);
  const archived_tasks = useSelector(selectFilteredArchivedTasks);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useCallback(
    debounce((action, page) => dispatch(action({ page })), 300),
    [dispatch]
  );

  useEffect(() => {
    if (isFetching.current) {
      return;
    }
    isFetching.current = true;

    const fetchMapping: Record<string, () => Promise<any>> = {
      "/dashboard/tasks": () =>
        tasks.length === 0 ? dispatch(fetchTasksDetails({ page: currentPage })) : Promise.resolve(),
      "/dashboard/my-tasks": () =>
        my_tasks.length === 0 ? dispatch(fetchMyTasksDetails({ page: my_currentPage })) : Promise.resolve(),
      "/dashboard/team-tasks": () =>
        team_tasks.length === 0 ? dispatch(fetchTeamTasksDetails({ page: team_currentPage })) : Promise.resolve(),
      "/dashboard/archived-tasks": () =>
        archived_tasks.length === 0 ? dispatch(fetchArchivedDetails({ page: archived_currentPage })) : Promise.resolve(),
    };

    fetchMapping[pathname]?.().finally(() => (isFetching.current = false));
  }, [dispatch, pathname, tasks, my_tasks, team_tasks, archived_tasks, currentPage, my_currentPage, team_currentPage, archived_currentPage]);

  const changePage = (direction: "next" | "prev") => {
    const pageInfo = {
      "/dashboard/tasks": { page: currentPage, total: totalPages, fetch: fetchTasksDetails },
      "/dashboard/my-tasks": { page: my_currentPage, total: my_totalPages, fetch: fetchMyTasksDetails },
      "/dashboard/team-tasks": { page: team_currentPage, total: team_totalPages, fetch: fetchTeamTasksDetails },
      "/dashboard/archived-tasks": { page: archived_currentPage, total: archived_totalPages, fetch: fetchArchivedDetails },
    }[pathname];

    if (!pageInfo) {
      return;
    }

    const { page, total, fetch } = pageInfo;
    const newPage = direction === "next" ? page + 1 : page - 1;

    if (newPage >= 1 && newPage <= total) {
      dispatch(fetch({ page: newPage }));
    }
  };

  const handleTaskAction = async (action: any, taskData: any, affectedPages: string[]) => {
    try {
      await dispatch(action(taskData)).unwrap();
      affectedPages.forEach((path) => {
        const pageFetchMapping: Record<string, any> = {
          "/dashboard/tasks": fetchTasksDetails({ page: currentPage }),
          "/dashboard/my-tasks": fetchMyTasksDetails({ page: my_currentPage }),
          "/dashboard/team-tasks": fetchTeamTasksDetails({ page: team_currentPage }),
          "/dashboard/archived-tasks": fetchArchivedDetails({ page: archived_currentPage }),
        };
        if (pageFetchMapping[path]) {
          dispatch(pageFetchMapping[path]);
        }
      });
    } catch (error) {
      console.warn(`Error performing task action:`, error);
    }
  };

  return {
    tasks,
    my_tasks,
    team_tasks,
    archived_tasks,
    loading,
    error,
    currentPage,
    my_currentPage,
    team_currentPage,
    archived_currentPage,
    totalPages,
    my_totalPages,
    team_totalPages,
    archived_totalPages,
    archived_totalTasks,
    my_totalTasks,
    totalTasks,
    team_totalTasks,

    nextPage: () => changePage("next"),
    prevPage: () => changePage("prev"),
    setPage: (page: number) => debouncedFetch(fetchTasksDetails, page),

    addTask: (taskData: any) =>
      handleTaskAction(createTask, taskData, ["/dashboard/tasks", "/dashboard/my-tasks", "/dashboard/team-tasks"]),

    editTask: (taskData: any) =>
      handleTaskAction(updateTask, taskData, ["/dashboard/tasks", "/dashboard/my-tasks", "/dashboard/team-tasks"]),

    assignTaskToUser: (taskData: any) =>
      handleTaskAction(assignTask, taskData, ["/dashboard/tasks", "/dashboard/my-tasks", "/dashboard/team-tasks"]),

    archiveTaskById: (id: number) =>
      handleTaskAction(archiveTask, id, ["/dashboard/tasks", "/dashboard/archived-tasks"]),

    restoreTaskById: (id: number) =>
      handleTaskAction(restoreTask, id, ["/dashboard/archived-tasks", "/dashboard/tasks"]),
  };
};

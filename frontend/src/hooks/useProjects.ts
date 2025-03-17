import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  fetchMyProjects
} from "../features/projectSlice";
import { RootState, AppDispatch } from "../app/store";
import { useLocation } from "react-router-dom";
import { selectMyProjects, selectProjects } from "../utils/projectSelectors";

export const useProjects = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const { loading, error } = useSelector(
    (state: RootState) => state.projects
  );
  const my_projects = useSelector(selectMyProjects);
  const projects = useSelector(selectProjects);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);

  const [my_currentPage, setMyCurrentPage] = useState(1);
  const [my_totalPages, setMyTotalPages] = useState(1);
  const [my_totalProjects, setMyTotalProjects] = useState(0);

  const _fetchProjects = () => {
    if (!isOpen && !projects) {
      dispatch(fetchProjects({ page: currentPage })).unwrap();
    }
    setIsOpen(true);
  };

  const _fetchMyProjects = () => {
    if (!isOpen && !projects) {
      dispatch(fetchMyProjects({ page: currentPage })).unwrap();
    }
    setIsOpen(true);
  };

  useEffect(() => {
    if (pathname === "/dashboard/projects") {
      const fetchData = async () => {
        try {
          const projectData = await dispatch(fetchProjects({ page: currentPage })).unwrap();

          setTotalPages(projectData.pages);
          setTotalProjects(projectData.total);
        } catch (error) {
          console.warn("Error fetching projects:", error);
        }
      };

      fetchData();
    }
    if (pathname === "/dashboard/my-projects") {
      const fetchMyData = async () => {
        try {
          const myProjectData = await dispatch(fetchMyProjects({ page: my_currentPage })).unwrap();

          setMyTotalPages(myProjectData.pages);
          setMyTotalProjects(myProjectData.total);
        } catch (error) {
          console.warn("Error fetching users projects:", error);
        }
      };

      fetchMyData();
    }
  }, [dispatch, pathname, currentPage, my_currentPage]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
    if (my_currentPage < my_totalPages) {
      setMyCurrentPage(prevPage => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
    if (my_currentPage > 1) {
      setMyCurrentPage(prevPage => prevPage - 1);
    }
  };

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
    if (page >= 1 && page <= my_totalPages) {
      setMyCurrentPage(page);
    }
  };

  return {
    projects,
    my_projects,
    loading,
    error,
    currentPage,
    totalPages,
    totalProjects,
    my_currentPage,
    my_totalPages,
    my_totalProjects,
    pathname,
    _fetchProjects,
    _fetchMyProjects,
    fetchMyProjectSelector: async () => {
      if (!isOpen && my_projects.length === 0) {
        await dispatch(fetchMyProjects({ page: my_currentPage })).unwrap()
      }
      setIsOpen(true);
    },
    handleCreateProject: async (name: string, description: string, status: string, priority: string) => {
      try {
        await dispatch(createProject({ name, description, status, priority })).unwrap();
        await dispatch(fetchProjects({ page: currentPage })).unwrap();
        await dispatch(fetchMyProjects({ page: currentPage })).unwrap();
      } catch (error) {
        console.warn("Error creating project:", error);
      }
    },
    handleUpdateProject: async (id: number, name: string, description: string, status: string, priority: string) => {
      try {
        await dispatch(updateProject({ id, name, description, status, priority })).unwrap();
        await dispatch(fetchProjects({ page: currentPage })).unwrap();
        await dispatch(fetchMyProjects({ page: currentPage })).unwrap();
      } catch (error) {
        console.warn("Error updating project:", error);
      }
    },
    handleDeleteProject: async (id: number) => {
      try {
        await dispatch(deleteProject(id)).unwrap();
        await dispatch(fetchProjects({ page: currentPage })).unwrap();
        await dispatch(fetchMyProjects({ page: currentPage })).unwrap();
      } catch (error) {
        console.warn("Error deleting project:", error);
      }
    },
    nextPage,
    prevPage,
    setPage
  };
};

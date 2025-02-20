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

export const useProjects = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pathname } = useLocation();

  const { projects = [], my_projects = [], loading, error } = useSelector(
    (state: RootState) => state.projects
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);

  const [my_currentPage, setMyCurrentPage] = useState(1);
  const [my_totalPages, setMyTotalPages] = useState(1);
  const [my_totalProjects, setMyTotalProjects] = useState(0);

  useEffect(() => {
    if (pathname === "/dashboard/projects") {
      const fetchData = async () => {
        try {
          const projectData = await dispatch(fetchProjects({ page: currentPage })).unwrap();

          setTotalPages(projectData.pages);
          setTotalProjects(projectData.total);
        } catch (error) {
          console.error("Error fetching projects:", error);
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
          console.error("Error fetching users projects:", error);
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
    handleCreateProject: async (name: string, description: string) => {
      try {
        await dispatch(createProject({ name, description })).unwrap();
        await dispatch(fetchProjects({ page: currentPage })).unwrap();
        await dispatch(fetchMyProjects({ page: currentPage })).unwrap();
      } catch (error) {
        console.error("Error creating project:", error);
      }
    },
    handleUpdateProject: async (id: number, name: string, description: string) => {
      try {
        await dispatch(updateProject({ id, name, description })).unwrap();
        await dispatch(fetchProjects({ page: currentPage })).unwrap();
        await dispatch(fetchMyProjects({ page: currentPage })).unwrap();
      } catch (error) {
        console.error("Error updating project:", error);
      }
    },
    handleDeleteProject: async (id: number) => {
      try {
        await dispatch(deleteProject(id)).unwrap();
        await dispatch(fetchProjects({ page: currentPage })).unwrap();
        await dispatch(fetchMyProjects({ page: currentPage })).unwrap();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    },
    nextPage,
    prevPage,
    setPage
  };
};

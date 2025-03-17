import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { Project } from "../features/projectSlice";

export const selectMyProjects = (state: RootState): Project[] =>
  state.projects.my_projects;
export const selectProjects = (state: RootState): Project[] =>
  state.projects.projects;

export const selectFilteredMyProjects = createSelector(
  [selectMyProjects],
  (my_projects): Project[] => my_projects
);

export const selectFilteredProjects = createSelector(
  [selectProjects],
  (projects): Project[] => projects
);

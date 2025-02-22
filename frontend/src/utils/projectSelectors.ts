import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export const selectMyProjects = (state: RootState) => state.projects.my_projects;
export const selectProjects = (state: RootState) => state.projects.projects;

export const selectFilteredMyProjects = createSelector(
  [selectMyProjects],
  (my_projects) => my_projects
);

export const selectFilteredProjects = createSelector(
  [selectProjects],
  (projects) => projects
);

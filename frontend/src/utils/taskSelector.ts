import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export const selectMyTasks = (state: RootState) => state.tasks.my_tasks;
export const selectTasks = (state: RootState) => state.tasks.tasks;

export const selectTeamTasks = (state: RootState) => state.tasks.team_tasks;

export const selectArchivedTasks = (state: RootState) => state.tasks.archived_tasks;

export const selectFilteredMyTasks = createSelector(
  [selectMyTasks],
  (my_tasks) => my_tasks
);

export const selectFilteredTasks = createSelector(
  [selectTasks],
  (tasks) => tasks
);

export const selectFilteredTeamTasks = createSelector(
  [selectTeamTasks],
  (team_tasks) => team_tasks
);

export const selectFilteredArchivedTasks = createSelector(
  [selectArchivedTasks],
  (archived_tasks) => archived_tasks
);
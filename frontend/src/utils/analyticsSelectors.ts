import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { AnalyticsData } from "../features/analyticsSlice";

export const selectAnalytics = (state: RootState): AnalyticsData[] =>
  state.analytics.analytics;

export const selectAnalyticsData = createSelector(
  [selectAnalytics],
  (analytics): AnalyticsData[] => analytics
);

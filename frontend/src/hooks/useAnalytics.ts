import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalytics as fetchAnalyticsData } from "../features/analyticsSlice";
import { RootState, AppDispatch } from "../app/store";
import { useLocation } from "react-router-dom";
import { selectAnalyticsData } from "../utils/analyticsSelectors";

export const useAnalytics = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector(
    (state: RootState) => state.analytics
  );
  const analytics = useSelector(selectAnalyticsData);
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const fetchAnalytics = () => {
    if (!isOpen && !analytics) {
      dispatch(fetchAnalyticsData());
    }
    setIsOpen(true);
  };

  useEffect(() => {
    if (pathname === "/dashboard/home") {
      const fetchData = async () => {
        try {
          await dispatch(fetchAnalyticsData()).unwrap();
        } catch (error) {
          console.warn("Error fetching analytics:", error);
        }
      };

      fetchData();
    }
  }, [dispatch, pathname]);

  return {
    analytics,
    loading,
    error,
    isOpen,
    fetchAnalytics,
  };
};

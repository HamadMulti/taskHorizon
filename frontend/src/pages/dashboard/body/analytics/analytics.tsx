import { Card, CardContent } from "../../../components/cards/Card";
import { LineChart, PieChart } from "../../../components/charts/Charts";
import { useAnalytics } from "../../../../hooks/useAnalytics";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import capitalizeUsername from "../../../../utils/capitalize";
import LoaderDashboard from "../../../../utils/LoaderDashboard";

const Analytics = () => {
  const { analytics, loading, error, fetchAnalytics } = useAnalytics();
  const [userName, setUserName] = useState<string | null>(null);
  const { user: _user } = useAuth();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    if (_user && _user.username) {
      setUserName(_user.username);
    }
  }, [_user]);

  if (loading) {
    return (
        <LoaderDashboard />
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">Error: {error}</p>;
  }

  const taskCompletionData = analytics.map((user) => ({
    name: user.username || userName,
    total: user.total_tasks,
    completed: user.completed_tasks,
  }));

  const productivityData = analytics.map((user) => ({
    category: user.username || userName,
    value: user.productivity_percentage,
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome <span className="text-yellow-600">{capitalizeUsername(userName ?? "")}</span></h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Total Tasks</h2>
            <p className="text-4xl font-bold text-indigo-600">{analytics.reduce((acc, user) => acc + user.total_tasks, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Completed Tasks</h2>
            <p className="text-4xl font-bold text-green-600">{analytics.reduce((acc, user) => acc + user.completed_tasks, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Productivity Avg</h2>
            <p className="text-4xl font-bold text-blue-600">
              {(
                analytics.reduce((acc, user) => acc + user.productivity_percentage, 0) / analytics.length || 0
              ).toFixed(2)}
              %
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Task Completion</h2>
          <LineChart data={taskCompletionData} />
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Productivity Breakdown</h2>
          <PieChart data={productivityData} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;

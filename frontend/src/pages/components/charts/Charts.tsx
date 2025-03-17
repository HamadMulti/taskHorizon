import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { PieChart as RePieChart, Pie, Cell, Legend } from "recharts";

interface ChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
}

export const LineChart: React.FC<ChartProps> = ({ data }) => {
  if (!data || data.length === 0) return <p className="text-center text-gray-500">No data available</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReBarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Bar dataKey="total" fill="#4f46e5" />
        <Bar dataKey="completed" fill="#a5b4fc" />
      </ReBarChart>
    </ResponsiveContainer>
  );
};

const COLORS = ["#4f46e5", "#a5b4fc", "#3730a3"];

export const PieChart: React.FC<ChartProps> = ({ data }) => {
  if (!data || data.length === 0) return <p className="text-center text-gray-500">No data available</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RePieChart>
        <Pie data={data} dataKey="value" nameKey="category" cx="50%" cy="50%" outerRadius={100}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RePieChart>
    </ResponsiveContainer>
  );
};

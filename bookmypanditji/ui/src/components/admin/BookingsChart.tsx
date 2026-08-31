"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface BookingsChartProps {
  data: Array<{
    date: string;
    status: string;
    count: number;
  }>;
}

export function BookingsChart({ data }: BookingsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-96 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">No booking data available</p>
          <p className="text-sm text-gray-400 mt-1">Booking trends will appear here</p>
        </div>
      </div>
    );
  }

  // Group data by date and status
  const groupedData = data.reduce((acc: any, item) => {
    if (!acc[item.date]) {
      acc[item.date] = { date: item.date };
    }
    acc[item.date][item.status] = (acc[item.date][item.status] || 0) + item.count;
    return acc;
  }, {});

  const chartData = Object.values(acc);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Trends</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="PENDING" fill="#f59e0b" name="Pending" radius={[4, 4, 0, 0]} />
            <Bar dataKey="CONFIRMED" fill="#3b82f6" name="Confirmed" radius={[4, 4, 0, 0]} />
            <Bar dataKey="COMPLETED" fill="#10b981" name="Completed" radius={[4, 4, 0, 0]} />
            <Bar dataKey="CANCELLED" fill="#ef4444" name="Cancelled" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
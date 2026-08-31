"use client";

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: "blue" | "green" | "orange" | "purple" | "red" | "yellow";
  trend?: string;
  trendUp?: boolean;
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-600 border-blue-200",
  green: "bg-green-50 text-green-600 border-green-200",
  orange: "bg-orange-50 text-orange-600 border-orange-200",
  purple: "bg-purple-50 text-purple-600 border-purple-200",
  red: "bg-red-50 text-red-600 border-red-200",
  yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
};

const iconBgClasses = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  orange: "bg-orange-100 text-orange-600",
  purple: "bg-purple-100 text-purple-600",
  red: "bg-red-100 text-red-600",
  yellow: "bg-yellow-100 text-yellow-600",
};

export function StatCard({ title, value, icon, color, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${trendUp ? "text-green-600" : "text-red-600"}`}>
            {trendUp ? "↑" : "↓"} {trend} vs last month
          </span>
        </div>
      )}
    </div>
  );
}
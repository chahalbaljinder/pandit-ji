"use client";

import { useEffect, useState } from "react";
import { useAdminDashboard } from "@/hooks/useApi";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { BookingsChart } from "@/components/admin/BookingsChart";
import { UsersChart } from "@/components/admin/UsersChart";
import { StatCard } from "./StatCard";

export default function AdminDashboard() {
  const { data, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse h-96"></div>
          <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse h-96"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold">Failed to load dashboard</h3>
        <p className="text-red-600 mt-1">{error.message}</p>
      </div>
    );
  }

  const stats = data?.data || {
    totalUsers: 0,
    totalPandits: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingVerifications: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of platform metrics and performance</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon="👥"
          color="blue"
          trend="+12%"
          trendUp
        />
        <StatCard
          title="Verified Pandits"
          value={stats.totalPandits.toLocaleString()}
          icon="🕉️"
          color="orange"
          trend="+8%"
          trendUp
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings.toLocaleString()}
          icon="📋"
          color="green"
          trend="+15%"
          trendUp
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon="💰"
          color="purple"
          trend="+23%"
          trendUp
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={data?.revenueAnalytics || []} />
        <BookingsChart data={data?.bookingTrends || []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsersChart data={data?.userGrowth || []} />
        <BookingsChart data={data?.bookingTrends || []} />
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Pending Verifications"
          value={stats.pendingVerifications.toLocaleString()}
          icon="⏳"
          color="yellow"
        />
        <StatCard
          title="Pending Bookings"
          value={stats.pendingBookings.toLocaleString()}
          icon="📋"
          color="blue"
        />
        <StatCard
          title="Completed Bookings"
          value={stats.completedBookings.toLocaleString()}
          icon="✅"
          color="green"
        />
        <StatCard
          title="Cancelled Bookings"
          value={stats.cancelledBookings.toLocaleString()}
          icon="❌"
          color="red"
        />
      </div>

      {/* Top Performing Pandits */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Top Performing Pandits</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-3">Pandit</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Reviews</th>
                <th className="px-6 py-3">Bookings</th>
                <th className="px-6 py-3">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(data?.topPandits || []).slice(0, 5).map((pandit: any, index: number) => (
                <tr key={pandit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
                        {pandit.user?.name?.charAt(0) || "P"}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{pandit.user?.name || "Unknown"}</p>
                        <p className="text-xs text-gray-500">{pandit.specializations?.[0] || "General"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{pandit.rating?.toFixed(1) || "0.0"} ⭐</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{pandit.reviewCount || 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{pandit.totalBookings || 0}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{pandit.earnings?.toLocaleString() || "0"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
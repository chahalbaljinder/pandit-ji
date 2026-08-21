"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useProfile, useMyBookings, useUpcomingBookings, useAddresses, useVirtualUsers, useBookingStats } from '@/hooks/useApi';
import { UserRegistrationForm } from '@/components/user/UserRegistrationForm';
import { useAuth } from '@/providers/AuthProvider';

interface TabProps {
  user: any;
  isLoading: boolean;
}

function ProfileInfoTab({ user, isLoading }: TabProps) {
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Full Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{user?.name || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{user?.email || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Phone</dt>
            <dd className="mt-1 text-sm text-gray-900">{user?.phone || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Role</dt>
            <dd className="mt-1 text-sm text-gray-900 capitalize">{user?.role?.toLowerCase() || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Date of Birth</dt>
            <dd className="mt-1 text-sm text-gray-900">{user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '-'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Gender</dt>
            <dd className="mt-1 text-sm text-gray-900">{user?.gender || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Marital Status</dt>
            <dd className="mt-1 text-sm text-gray-900">{user?.maritalStatus || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Member Since</dt>
            <dd className="mt-1 text-sm text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function BookingsTab({ userId }: { userId: string }) {
  const { data: bookings, isLoading } = useMyBookings({ page: 1, limit: 10 });
  const { data: stats } = useBookingStats(userId);

  if (isLoading) return <div className="py-8 text-center">Loading bookings...</div>;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <dt className="text-sm text-gray-500">Total Bookings</dt>
          <dd className="mt-1 text-2xl font-bold text-gray-900">{stats?.total || 0}</dd>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <dt className="text-sm text-gray-500">Upcoming</dt>
          <dd className="mt-1 text-2xl font-bold text-orange-600">{stats?.upcoming || 0}</dd>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <dt className="text-sm text-gray-500">Completed</dt>
          <dd className="mt-1 text-2xl font-bold text-green-600">{stats?.completed || 0}</dd>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <dt className="text-sm text-gray-500">Cancelled</dt>
          <dd className="mt-1 text-2xl font-bold text-red-600">{stats?.cancelled || 0}</dd>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings?.data?.map((booking: any) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.bookingNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.service?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : '-'} at {booking.startTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{booking.totalAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href={`/booking/${booking.id}`} className="text-orange-600 hover:text-orange-900">View</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings?.meta?.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            {/* Pagination */}
          </div>
        )}
      </div>
    </div>
  );
}

function UpcomingTab({ userId }: { userId: string }) {
  const { data: bookings } = useUpcomingBookings(userId, 5);

  if (!bookings || bookings.length === 0) {
    return <div className="text-center py-8 text-gray-500">No upcoming bookings</div>;
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking: any) => (
        <div key={booking.id} className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{booking.service?.name}</h3>
              <p className="text-gray-600 text-sm">
                {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : ''} at {booking.startTime}
              </p>
              <p className="text-gray-500 text-sm">{booking.venueAddress}</p>
            </div>
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
              {booking.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function WalletTab({ userId }: { userId: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Wallet</h3>
      <div className="bg-orange-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600">Available Balance</p>
        <p className="text-3xl font-bold text-orange-600">₹0.00</p>
        <p className="text-sm text-gray-500 mt-1">Loyalty Points: 0</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700">Add Money</button>
        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">Transaction History</button>
      </div>
    </div>
  );
}

function AddressesTab({ userId }: { userId: string }) {
  const { data: addresses } = useAddresses(userId);
  const [showForm, setShowForm] = useState(false);

  if (!addresses) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Saved Addresses</h3>
        <button onClick={() => setShowForm(true)} className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700">
          Add New Address
        </button>
      </div>
      {addresses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No addresses saved yet.</div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address: any) => (
            <div key={address.id} className="bg-white rounded-lg shadow-sm p-4 border-l-4 {address.isDefault ? 'border-orange-500' : 'border-gray-300'}">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{address.name} {address.isDefault && <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded">Default</span>}</h4>
                  <p className="text-gray-600 text-sm">{address.line1} {address.line2 && ', ' + address.line2}</p>
                  <p className="text-gray-600 text-sm">{address.city}, {address.state} - {address.pincode}</p>
                </div>
                <div className="space-x-2">
                  {!address.isDefault && <button className="text-sm text-orange-600 hover:underline">Set as Default</button>}
                  <button className="text-sm text-gray-600 hover:underline">Edit</button>
                  <button className="text-sm text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No addresses saved yet.</div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: stats } = useBookingStats(user?.id || '');
  
  const [activeTab, setActiveTab] = useState<'info' | 'bookings' | 'upcoming' | 'wallet' | 'addresses'>('info');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const tabs = [
    { id: 'info', label: 'Profile', icon: '👤' },
    { id: 'bookings', label: 'My Bookings', icon: '📋' },
    { id: 'upcoming', label: 'Upcoming', icon: '🕐' },
    { id: 'wallet', label: 'Wallet', icon: '💰' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
  ];

  if (authLoading || profileLoading) {
    return <div className="flex justify-center py-12">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Complete Your Profile</h2>
            <p className="text-gray-600 mb-6">
              Please provide your information to complete your profile. This will help us provide you with personalized services
              and important festival reminders.
            </p>
            <UserRegistrationForm onRegistrationCompleteAction={async () => {}} />
          </div>
        </div>
      </div>
    );
  }

  const currentUser = profile?.data || user;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account, bookings, and preferences</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              currentUser?.role === 'PANDIT' ? 'bg-orange-100 text-orange-800' :
              currentUser?.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {currentUser?.role}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && <ProfileInfoTab user={currentUser} isLoading={profileLoading} />}
        {activeTab === 'bookings' && <BookingsTab userId={user.id} />}
        {activeTab === 'upcoming' && <UpcomingTab userId={user.id} />}
        {activeTab === 'wallet' && <WalletTab userId={user.id} />}
        {activeTab === 'addresses' && <AddressesTab userId={user.id} />}
      </div>
    </div>
  );
}

function useState<T>(initial: T): [T, (val: T | ((prev: T) => T)) => void] {
  // This is a placeholder - React's useState is imported
  return [initial, () => {}];
}
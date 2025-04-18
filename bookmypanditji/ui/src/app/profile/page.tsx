'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function UserProfilePage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Set active tab based on URL query parameter
  useEffect(() => {
    if (tabParam && ['dashboard', 'bookings', 'wallet', 'favorites', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-orange-600 h-32"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end -mt-16 mb-4 sm:space-x-5">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-orange-100 flex items-center justify-center overflow-hidden">
                <span className="text-4xl font-bold text-orange-600">RS</span>
              </div>
              <div className="mt-6 sm:mt-0">
                <h1 className="text-2xl font-bold">Rahul Sharma</h1>
                <p className="text-gray-600">rahul.sharma@example.com | +91 9876543210</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'bookings'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'wallet'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Wallet
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'favorites'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Favorites
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Quick Stats */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Upcoming</p>
                    <p className="text-2xl font-bold text-gray-900">2</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Wallet Balance</p>
                    <p className="text-2xl font-bold text-gray-900">₹3,500</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Saved Pandits</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                </div>
              </div>

              {/* Upcoming Booking */}
              <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Upcoming Booking</h3>
                  <a href="#" className="text-orange-600 text-sm hover:text-orange-700">
                    View All
                  </a>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold mr-3">
                        PS
                      </div>
                      <div>
                        <p className="font-medium">Satyanarayan Puja</p>
                        <p className="text-sm text-gray-500">with Pandit Suresh Mishra</p>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Confirmed
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>April 20, 2025 | 09:00 AM - 12:00 PM</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>123 Patel Nagar, New Delhi</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition text-sm">
                        Get Direction
                      </button>
                      <button className="flex-1 border border-orange-600 text-orange-600 py-2 rounded-md hover:bg-orange-50 transition text-sm">
                        Reschedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
                <a href="#" className="text-orange-600 text-sm hover:text-orange-700">
                  View All
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pandit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.service}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.pandit}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{booking.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">₹{booking.amount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a href="#" className="text-orange-600 hover:text-orange-700">
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Bookings</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                    <option>All Time</option>
                    <option>Last 30 Days</option>
                    <option>Last 3 Months</option>
                    <option>Last Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                    <option>All</option>
                    <option>Upcoming</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                  <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                    <option>All Services</option>
                    <option>Wedding Ceremony</option>
                    <option>Griha Pravesh</option>
                    <option>Satyanarayan Puja</option>
                    <option>Baby Naming Ceremony</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition">
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">All Bookings</h3>
                <p className="text-sm text-gray-500">You have made a total of 8 bookings</p>
              </div>

              <div className="space-y-6">
                {allBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-medium">{booking.service}</h4>
                        <p className="text-sm text-gray-500">Booking ID: #{booking.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : booking.status === 'Confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Pandit</p>
                        <p className="text-sm">{booking.pandit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                        <p className="text-sm">{booking.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Amount</p>
                        <p className="text-sm">₹{booking.amount}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                      <div className="flex space-x-2">
                        {booking.status === 'Confirmed' && (
                          <>
                            <button className="text-sm bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 transition">
                              View Details
                            </button>
                            <button className="text-sm border border-orange-600 text-orange-600 px-3 py-1 rounded hover:bg-orange-50 transition">
                              Reschedule
                            </button>
                          </>
                        )}
                        {booking.status === 'Completed' && (
                          <>
                            <button className="text-sm bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 transition">
                              View Details
                            </button>
                            <button className="text-sm border border-orange-600 text-orange-600 px-3 py-1 rounded hover:bg-orange-50 transition">
                              Write Review
                            </button>
                          </>
                        )}
                        {booking.status === 'Pending' && (
                          <>
                            <button className="text-sm bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 transition">
                              View Details
                            </button>
                            <button className="text-sm border border-orange-600 text-orange-600 px-3 py-1 rounded hover:bg-orange-50 transition">
                              Make Payment
                            </button>
                          </>
                        )}
                      </div>
                      {booking.status !== 'Completed' && booking.status !== 'Cancelled' && (
                        <button className="text-sm text-gray-500 hover:text-red-600 transition">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wallet Tab */}
        {activeTab === 'wallet' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Wallet Balance</h3>
                <div className="bg-orange-50 p-6 rounded-lg text-center mb-4">
                  <p className="text-gray-500 mb-1">Available Balance</p>
                  <p className="text-4xl font-bold text-gray-900">₹3,500</p>
                </div>
                <div className="space-y-3">
                  <button className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition">
                    Add Money
                  </button>
                  <button className="w-full border border-orange-600 text-orange-600 py-2 rounded-md hover:bg-orange-50 transition">
                    Withdraw
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
                  <select className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-sm">
                    <option>All Transactions</option>
                    <option>Deposits</option>
                    <option>Withdrawals</option>
                    <option>Bookings</option>
                    <option>Refunds</option>
                  </select>
                </div>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                          transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? 
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                           : 
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          }
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-xs text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <div className={`font-medium ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <button className="text-orange-600 hover:text-orange-700 text-sm">
                    View All Transactions
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritePandits.map((pandit) => (
                <div key={pandit.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="flex items-start">
                      <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-xl font-bold text-orange-600">{pandit.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{pandit.name}</h3>
                        <div className="flex items-center mt-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i}
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-4 w-4 ${i < pandit.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-gray-600 text-sm ml-2">({pandit.reviewCount} reviews)</span>
                        </div>
                        <div className="text-gray-600 text-sm mt-1">
                          {pandit.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Expertise</h4>
                      <div className="flex flex-wrap gap-1">
                        {pandit.expertise.map((skill, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <button className="bg-orange-600 text-white px-3 py-1.5 rounded text-sm hover:bg-orange-700 transition">
                        Book Now
                      </button>
                      <button className="text-gray-400 hover:text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Personal Information */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    defaultValue="Rahul Sharma"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    defaultValue="rahul.sharma@example.com"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    defaultValue="+91 9876543210"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dob"
                    defaultValue="1990-05-15"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    defaultValue="123 Patel Nagar, New Delhi, 110008"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="current-password"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="col-span-1"></div>
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition">
                    Update Password
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="email-notifications"
                      name="email-notifications"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="email-notifications" className="font-medium text-gray-700">
                      Email Notifications
                    </label>
                    <p className="text-gray-500">Receive booking confirmations, reminders, and updates via email.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="sms-notifications"
                      name="sms-notifications"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="sms-notifications" className="font-medium text-gray-700">
                      SMS Notifications
                    </label>
                    <p className="text-gray-500">Receive booking confirmations and reminders via SMS.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="promotional-emails"
                      name="promotional-emails"
                      type="checkbox"
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="promotional-emails" className="font-medium text-gray-700">
                      Promotional Emails
                    </label>
                    <p className="text-gray-500">Receive special offers, discounts, and promotional content.</p>
                  </div>
                </div>
                <div className="pt-4">
                  <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Mock data for the profile page
const recentBookings = [
  {
    id: 'BK1001',
    service: 'Satyanarayan Puja',
    pandit: 'Pandit Suresh Mishra',
    date: '20 Apr 2025',
    amount: 5000,
    status: 'Confirmed'
  },
  {
    id: 'BK1000',
    service: 'Griha Pravesh',
    pandit: 'Pandit Rajesh Sharma',
    date: '15 Apr 2025',
    amount: 8000,
    status: 'Completed'
  },
  {
    id: 'BK999',
    service: 'Baby Naming Ceremony',
    pandit: 'Pandit Krishna Pandey',
    date: '10 Apr 2025',
    amount: 6000,
    status: 'Completed'
  },
  {
    id: 'BK998',
    service: 'Car Puja',
    pandit: 'Pandit Vishal Shastri',
    date: '03 Apr 2025',
    amount: 2500,
    status: 'Completed'
  },
];

const allBookings = [
  {
    id: 'BK1002',
    service: 'Wedding Ceremony',
    pandit: 'Acharya Devendra Trivedi',
    date: '25 Apr 2025, 09:00 AM',
    amount: 15000,
    status: 'Pending'
  },
  {
    id: 'BK1001',
    service: 'Satyanarayan Puja',
    pandit: 'Pandit Suresh Mishra',
    date: '20 Apr 2025, 09:00 AM',
    amount: 5000,
    status: 'Confirmed'
  },
  {
    id: 'BK1000',
    service: 'Griha Pravesh',
    pandit: 'Pandit Rajesh Sharma',
    date: '15 Apr 2025, 10:00 AM',
    amount: 8000,
    status: 'Completed'
  },
  {
    id: 'BK999',
    service: 'Baby Naming Ceremony',
    pandit: 'Pandit Krishna Pandey',
    date: '10 Apr 2025, 11:00 AM',
    amount: 6000,
    status: 'Completed'
  },
  {
    id: 'BK998',
    service: 'Car Puja',
    pandit: 'Pandit Vishal Shastri',
    date: '03 Apr 2025, 03:00 PM',
    amount: 2500,
    status: 'Completed'
  },
  {
    id: 'BK997',
    service: 'Diwali Puja',
    pandit: 'Pandit Mukesh Joshi',
    date: '25 Mar 2025, 06:00 PM',
    amount: 4000,
    status: 'Completed'
  },
  {
    id: 'BK996',
    service: 'Vastu Shanti',
    pandit: 'Pandit Krishna Pandey',
    date: '15 Mar 2025, 10:00 AM',
    amount: 7000,
    status: 'Cancelled'
  },
];

const transactions = [
  {
    id: 'TXN1005',
    description: 'Added money to wallet',
    date: 'Apr 18, 2025',
    amount: 5000,
    type: 'credit'
  },
  {
    id: 'TXN1004',
    description: 'Paid for Satyanarayan Puja',
    date: 'Apr 15, 2025',
    amount: 5000,
    type: 'debit'
  },
  {
    id: 'TXN1003',
    description: 'Refund for cancelled booking',
    date: 'Apr 10, 2025',
    amount: 3500,
    type: 'credit'
  },
  {
    id: 'TXN1002',
    description: 'Paid for Griha Pravesh',
    date: 'Mar 30, 2025',
    amount: 8000,
    type: 'debit'
  },
  {
    id: 'TXN1001',
    description: 'Added money to wallet',
    date: 'Mar 25, 2025',
    amount: 10000,
    type: 'credit'
  },
];

const favoritePandits = [
  {
    id: 1,
    name: 'Pandit Rajesh Sharma',
    rating: 5,
    reviewCount: 124,
    location: 'Delhi, India',
    expertise: ['Wedding Ceremony', 'Griha Pravesh', 'Satyanarayan Puja'],
    price: 5000,
  },
  {
    id: 3,
    name: 'Acharya Devendra Trivedi',
    rating: 5,
    reviewCount: 156,
    location: 'Bangalore, India',
    expertise: ['Wedding Ceremony', 'Griha Pravesh', 'Yoga'],
    price: 6000,
  },
  {
    id: 5,
    name: 'Pandit Krishna Pandey',
    rating: 5,
    reviewCount: 112,
    location: 'Kolkata, India',
    expertise: ['Wedding Ceremony', 'Funeral Rites', 'Satyanarayan Puja'],
    price: 5500,
  },
];
"use client";

import Link from 'next/link';
import { useEffect } from 'react';

type UserRegistrationCompleteProps = {
  userData?: any;
};

export default function UserRegistrationComplete({ userData }: UserRegistrationCompleteProps) {
  // Scroll to the top when component is mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-green-100">
            <svg className="h-14 w-14 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Registration Successful!</h2>
          <p className="mt-2 text-gray-600">
            Thank you for completing your profile, {userData?.basicInfo?.name || 'valued user'}.
          </p>
        </div>
        
        <div className="rounded-md bg-blue-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-blue-800">What happens next?</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Your profile has been created and you can now use BookMyPanditJi services</li>
                  <li>You'll receive personalized festival reminders and auspicious dates</li>
                  <li>You can book priests for ceremonies and consultations</li>
                  <li>You can update your profile information anytime from your account</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {userData?.basicInfo?.dateOfBirth && (
          <div className="border-l-4 border-orange-400 bg-orange-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-orange-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-orange-700">
                  <strong>Reminder set!</strong> We'll send you notifications about upcoming important dates based on your birth details.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Link href="/services">
            <div className="bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow border border-gray-200 p-5 cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-800">Browse Services</h3>
              <p className="mt-1 text-gray-600">Explore our range of religious services and ceremonies available for booking</p>
            </div>
          </Link>
          
          <Link href="/pandits">
            <div className="bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow border border-gray-200 p-5 cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-800">Find Pandits</h3>
              <p className="mt-1 text-gray-600">Browse our directory of verified pandits and their services</p>
            </div>
          </Link>
          
          <Link href="/profile">
            <div className="bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow border border-gray-200 p-5 cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-800">View Profile</h3>
              <p className="mt-1 text-gray-600">Review and update your profile information</p>
            </div>
          </Link>
          
          <Link href="/">
            <div className="bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow border border-gray-200 p-5 cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-800">Return Home</h3>
              <p className="mt-1 text-gray-600">Back to BookMyPanditJi homepage</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
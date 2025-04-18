'use client';

import React from 'react';
import Link from 'next/link';

type BookingConfirmationProps = {
  isOpen: boolean;
  onClose: () => void;
  panditName: string;
};

export default function BookingConfirmation({ isOpen, onClose, panditName }: BookingConfirmationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Successful!</h3>
          <p className="text-gray-600 mb-4">
            Your booking with <span className="font-medium">{panditName}</span> has been confirmed.
            A confirmation email has been sent to your registered email address.
          </p>
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <h4 className="font-medium text-gray-800 mb-2">What happens next?</h4>
            <ol className="text-left text-gray-600 space-y-2 text-sm">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-orange-100 text-orange-600 text-xs font-medium mr-2 mt-0.5">1</span>
                <span>The Pandit will review your booking details and requirements.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-orange-100 text-orange-600 text-xs font-medium mr-2 mt-0.5">2</span>
                <span>Once confirmed, you'll receive a payment link to secure your booking.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-orange-100 text-orange-600 text-xs font-medium mr-2 mt-0.5">3</span>
                <span>After payment, your booking will be finalized and the Pandit will contact you directly.</span>
              </li>
            </ol>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              href="/profile?tab=bookings" 
              className="w-full sm:w-1/2 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition text-center"
            >
              View My Bookings
            </Link>
            <button 
              onClick={onClose} 
              className="w-full sm:w-1/2 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
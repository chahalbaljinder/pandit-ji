"use client";

import { useState } from 'react';
import Link from 'next/link';

type PanditRegistrationCompleteProps = {
  data: any;
};

export default function PanditRegistrationComplete({ data }: PanditRegistrationCompleteProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Generate booking link based on pandit name
  const bookingLink = `https://bookmypanditji.com/book/${data?.personalInfo?.name.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 8)}`;
  
  // Handle copy link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookingLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };
  
  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Registration Successful!</h2>
        <p className="mt-2 text-gray-600">
          Thank you for registering as a pandit on BookMyPanditJi. Your profile is now under review.
        </p>
      </div>
      
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">What happens next?</h3>
        <ol className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-200 text-orange-600 mr-2 flex-shrink-0">1</span>
            <span>Our team will review your profile within 24-48 hours.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-200 text-orange-600 mr-2 flex-shrink-0">2</span>
            <span>You'll receive a verification call from our team.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-200 text-orange-600 mr-2 flex-shrink-0">3</span>
            <span>Once verified, your profile will be live on our platform.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-200 text-orange-600 mr-2 flex-shrink-0">4</span>
            <span>You can start receiving booking requests from devotees.</span>
          </li>
        </ol>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Your Dedicated Booking Link</h3>
        <p className="text-sm text-gray-600 mb-4">
          Share this personalized link with your devotees to receive direct bookings:
        </p>
        
        <div className="flex items-center bg-gray-50 rounded-md border border-gray-300 p-2">
          <input
            type="text"
            readOnly
            value={bookingLink}
            className="block w-full bg-transparent border-0 focus:ring-0 text-sm text-gray-700"
          />
          <button
            onClick={handleCopyLink}
            className="ml-2 bg-orange-600 text-white p-2 rounded hover:bg-orange-700 flex-shrink-0"
          >
            {copiedLink ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            )}
          </button>
        </div>
        {copiedLink && (
          <p className="text-xs text-green-600 mt-1">Link copied to clipboard!</p>
        )}
      </div>
      
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Your Registration Details</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-600">Name</h4>
            <p className="text-gray-800">{data?.personalInfo?.name}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-600">Email</h4>
            <p className="text-gray-800">{data?.personalInfo?.email}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-600">Mobile</h4>
            <p className="text-gray-800">{data?.personalInfo?.mobile}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-600">Specializations</h4>
            <p className="text-gray-800">
              {data?.professionalInfo?.specializations.join(', ')}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-600">Base Service Fee</h4>
            <p className="text-gray-800">
              ₹{data?.serviceInfo?.baseFees?.regular} (Regular) / ₹{data?.serviceInfo?.baseFees?.premium} (Premium)
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
        <Link href="/dashboard" className="w-full md:w-auto px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-center">
          Go to Dashboard
        </Link>
        <Link href="/" className="w-full md:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-center">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
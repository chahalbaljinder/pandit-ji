"use client";

import { useState } from 'react';
import Link from 'next/link';
import PanditRegistrationForm from '@/components/pandit/PanditRegistrationForm';
import PanditRegistrationComplete from '@/components/pandit/PanditRegistrationComplete';

export default function RegisterPanditPage() {
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);

  const handleRegistrationComplete = (data: any) => {
    setRegistrationData(data);
    setRegistrationComplete(true);
    // In a real application, this is where you would make an API call to save the data
    console.log('Registration data:', data);
  };

  return (
    <main className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pandit Registration Portal</h1>
          <p className="mt-2 text-lg text-gray-600">
            Join our platform to connect with devotees and provide your services
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {!registrationComplete ? (
            <>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Register as a Pandit</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Please fill out the form below to register as a pandit on our platform. All fields marked with * are required.
                </p>
              </div>
              
              <div className="p-6">
                <PanditRegistrationForm onRegistrationComplete={handleRegistrationComplete} />
              </div>
            </>
          ) : (
            <PanditRegistrationComplete data={registrationData} />
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already registered? <Link href="/pandit-login" className="text-orange-600 hover:text-orange-800 font-medium">Login here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
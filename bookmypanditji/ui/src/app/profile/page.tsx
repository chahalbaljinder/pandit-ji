"use client";

import { useState } from 'react';
import UserRegistrationForm from '@/components/user/UserRegistrationForm';
import UserRegistrationComplete from '@/components/user/UserRegistrationComplete';

export default function ProfilePage() {
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // This function will be passed to the UserRegistrationForm component
  const handleRegistrationComplete = (data: any) => {
    setUserData(data);
    setIsRegistrationComplete(true);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">User Profile</h1>
        
        {!isRegistrationComplete ? (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Complete Your Profile</h2>
              <p className="text-gray-600 mb-6">
                Please provide your information to complete your profile. This will help us provide you with personalized services
                and important festival reminders.
              </p>
              
              <UserRegistrationForm onRegistrationComplete={handleRegistrationComplete} />
            </div>
          </div>
        ) : (
          <UserRegistrationComplete userData={userData} />
        )}
      </div>
    </div>
  );
}
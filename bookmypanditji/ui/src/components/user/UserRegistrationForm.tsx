"use client";

import { useState } from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';

// Types for the form data
type BasicInfo = {
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
};

type Address = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type FamilyDetails = {
  maritalStatus: string;
  spouseName?: string;
  anniversaryDate?: string;
  children?: number;
  familyMembers?: { name: string; relation: string; dateOfBirth?: string }[];
};

type ReligiousPreferences = {
  gotra?: string;
  nakshatra?: string;
  rashi?: string;
  kuldevi?: string;
  kuldevta?: string;
  favoriteFestivals?: string[];
  dietaryPreferences?: string[];
};

type NotificationPreferences = {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  reminderFrequency: string;
};

type FormData = {
  basicInfo: BasicInfo;
  address: Address;
  familyDetails: FamilyDetails;
  religiousPreferences: ReligiousPreferences;
  notificationPreferences: NotificationPreferences;
};

type FormStep = 'basicInfo' | 'address' | 'familyDetails' | 'religiousPreferences' | 'notificationPreferences';

type UserRegistrationFormProps = {
  onRegistrationComplete: (data: FormData) => void;
};

export default function UserRegistrationForm({ onRegistrationComplete }: UserRegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>('basicInfo');
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [familyMemberCount, setFamilyMemberCount] = useState(1);

  const methods = useForm<FormData>({
    defaultValues: {
      basicInfo: {
        gender: 'male',
      },
      familyDetails: {
        maritalStatus: 'single',
      },
      notificationPreferences: {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: false,
        reminderFrequency: 'weekly',
      },
    },
  });

  const { register, handleSubmit, formState: { errors }, watch, setValue } = methods;
  const maritalStatus = watch('familyDetails.maritalStatus');
  
  const handleStepSubmit: SubmitHandler<any> = (data) => {
    const updatedFormData = { ...formData, [currentStep]: data[currentStep] };
    setFormData(updatedFormData);

    // Move to the next step or submit the form
    switch (currentStep) {
      case 'basicInfo':
        setCurrentStep('address');
        break;
      case 'address':
        setCurrentStep('familyDetails');
        break;
      case 'familyDetails':
        setCurrentStep('religiousPreferences');
        break;
      case 'religiousPreferences':
        setCurrentStep('notificationPreferences');
        break;
      case 'notificationPreferences':
        onRegistrationComplete(updatedFormData as FormData);
        break;
    }
  };

  const goBack = () => {
    switch (currentStep) {
      case 'address':
        setCurrentStep('basicInfo');
        break;
      case 'familyDetails':
        setCurrentStep('address');
        break;
      case 'religiousPreferences':
        setCurrentStep('familyDetails');
        break;
      case 'notificationPreferences':
        setCurrentStep('religiousPreferences');
        break;
    }
  };

  const addFamilyMember = () => {
    setFamilyMemberCount(prev => prev + 1);
  };

  const removeFamilyMember = () => {
    if (familyMemberCount > 1) {
      setFamilyMemberCount(prev => prev - 1);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleStepSubmit)}>
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div 
              className="absolute h-2 bg-orange-500 rounded-full transition-all duration-300"
              style={{
                width: 
                  currentStep === 'basicInfo' ? '20%' :
                  currentStep === 'address' ? '40%' :
                  currentStep === 'familyDetails' ? '60%' :
                  currentStep === 'religiousPreferences' ? '80%' : '100%'
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span className={currentStep === 'basicInfo' ? 'text-orange-600 font-medium' : ''}>Personal Information</span>
            <span className={currentStep === 'address' ? 'text-orange-600 font-medium' : ''}>Address</span>
            <span className={currentStep === 'familyDetails' ? 'text-orange-600 font-medium' : ''}>Family Details</span>
            <span className={currentStep === 'religiousPreferences' ? 'text-orange-600 font-medium' : ''}>Religious Information</span>
            <span className={currentStep === 'notificationPreferences' ? 'text-orange-600 font-medium' : ''}>Notifications</span>
          </div>
        </div>

        {/* Basic Info */}
        {currentStep === 'basicInfo' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                <input
                  type="text"
                  {...register('basicInfo.name', { required: 'Name is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
                {errors.basicInfo?.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.basicInfo.name.message as string}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                <input
                  type="email"
                  {...register('basicInfo.email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
                {errors.basicInfo?.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.basicInfo.email.message as string}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                <input
                  type="tel"
                  {...register('basicInfo.phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
                {errors.basicInfo?.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.basicInfo.phone.message as string}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender *</label>
                <select
                  {...register('basicInfo.gender', { required: 'Gender is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
                <input
                  type="date"
                  {...register('basicInfo.dateOfBirth', { required: 'Date of birth is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
                {errors.basicInfo?.dateOfBirth && (
                  <p className="text-red-500 text-xs mt-1">{errors.basicInfo.dateOfBirth.message as string}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Time of Birth (if known)</label>
                <input
                  type="time"
                  {...register('basicInfo.timeOfBirth')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Place of Birth</label>
                <input
                  type="text"
                  {...register('basicInfo.placeOfBirth')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Address */}
        {currentStep === 'address' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address Line 1 *</label>
                <input
                  type="text"
                  {...register('address.addressLine1', { required: 'Address is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
                {errors.address?.addressLine1 && (
                  <p className="text-red-500 text-xs mt-1">{errors.address.addressLine1.message as string}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                <input
                  type="text"
                  {...register('address.addressLine2')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">City *</label>
                <input
                  type="text"
                  {...register('address.city', { required: 'City is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
                {errors.address?.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.address.city.message as string}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">State/Province *</label>
                <input
                  type="text"
                  {...register('address.state', { required: 'State is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
                {errors.address?.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.address.state.message as string}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Postal Code *</label>
                <input
                  type="text"
                  {...register('address.postalCode', { required: 'Postal code is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
                {errors.address?.postalCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.address.postalCode.message as string}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Country *</label>
                <select
                  {...register('address.country', { required: 'Country is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
                {errors.address?.country && (
                  <p className="text-red-500 text-xs mt-1">{errors.address.country.message as string}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Family Details */}
        {currentStep === 'familyDetails' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Family Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Marital Status *</label>
                <select
                  {...register('familyDetails.maritalStatus', { required: 'Marital status is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
              
              {maritalStatus === 'married' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Spouse Name</label>
                    <input
                      type="text"
                      {...register('familyDetails.spouseName')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Anniversary Date</label>
                    <input
                      type="date"
                      {...register('familyDetails.anniversaryDate')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Children</label>
                <input
                  type="number"
                  min="0"
                  {...register('familyDetails.children', { 
                    valueAsNumber: true,
                    min: { value: 0, message: 'Cannot be negative' }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Family Members</label>
                  <div>
                    <button
                      type="button"
                      onClick={addFamilyMember}
                      className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Add Member
                    </button>
                    {familyMemberCount > 1 && (
                      <button
                        type="button"
                        onClick={removeFamilyMember}
                        className="ml-2 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                
                {Array.from({ length: familyMemberCount }).map((_, index) => (
                  <div key={index} className="mb-4 p-3 border border-gray-200 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          {...register(`familyDetails.familyMembers.${index}.name` as const)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Relationship</label>
                        <select
                          {...register(`familyDetails.familyMembers.${index}.relation` as const)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        >
                          <option value="">Select Relation</option>
                          <option value="father">Father</option>
                          <option value="mother">Mother</option>
                          <option value="son">Son</option>
                          <option value="daughter">Daughter</option>
                          <option value="brother">Brother</option>
                          <option value="sister">Sister</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input
                          type="date"
                          {...register(`familyDetails.familyMembers.${index}.dateOfBirth` as const)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Religious Preferences */}
        {currentStep === 'religiousPreferences' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Religious Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Gotra</label>
                <input
                  type="text"
                  {...register('religiousPreferences.gotra')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Nakshatra/Birth Star</label>
                <select
                  {...register('religiousPreferences.nakshatra')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="">Select Nakshatra</option>
                  <option value="Ashwini">Ashwini</option>
                  <option value="Bharani">Bharani</option>
                  <option value="Krittika">Krittika</option>
                  <option value="Rohini">Rohini</option>
                  <option value="Mrigashira">Mrigashira</option>
                  <option value="Ardra">Ardra</option>
                  <option value="Punarvasu">Punarvasu</option>
                  <option value="Pushya">Pushya</option>
                  <option value="Ashlesha">Ashlesha</option>
                  <option value="Magha">Magha</option>
                  <option value="Purva Phalguni">Purva Phalguni</option>
                  <option value="Uttara Phalguni">Uttara Phalguni</option>
                  <option value="Hasta">Hasta</option>
                  <option value="Chitra">Chitra</option>
                  <option value="Swati">Swati</option>
                  <option value="Vishaka">Vishaka</option>
                  <option value="Anuradha">Anuradha</option>
                  <option value="Jyeshtha">Jyeshtha</option>
                  <option value="Mula">Mula</option>
                  <option value="Purva Ashadha">Purva Ashadha</option>
                  <option value="Uttara Ashadha">Uttara Ashadha</option>
                  <option value="Shravana">Shravana</option>
                  <option value="Dhanishta">Dhanishta</option>
                  <option value="Shatabhisha">Shatabhisha</option>
                  <option value="Purva Bhadrapada">Purva Bhadrapada</option>
                  <option value="Uttara Bhadrapada">Uttara Bhadrapada</option>
                  <option value="Revati">Revati</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Rashi/Zodiac</label>
                <select
                  {...register('religiousPreferences.rashi')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="">Select Rashi</option>
                  <option value="Mesh (Aries)">Mesh (Aries)</option>
                  <option value="Vrishabh (Taurus)">Vrishabh (Taurus)</option>
                  <option value="Mithun (Gemini)">Mithun (Gemini)</option>
                  <option value="Kark (Cancer)">Kark (Cancer)</option>
                  <option value="Simha (Leo)">Simha (Leo)</option>
                  <option value="Kanya (Virgo)">Kanya (Virgo)</option>
                  <option value="Tula (Libra)">Tula (Libra)</option>
                  <option value="Vrishchik (Scorpio)">Vrishchik (Scorpio)</option>
                  <option value="Dhanu (Sagittarius)">Dhanu (Sagittarius)</option>
                  <option value="Makar (Capricorn)">Makar (Capricorn)</option>
                  <option value="Kumbh (Aquarius)">Kumbh (Aquarius)</option>
                  <option value="Meen (Pisces)">Meen (Pisces)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Kuldevi (Family Goddess)</label>
                <input
                  type="text"
                  {...register('religiousPreferences.kuldevi')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Kuldevta (Family God)</label>
                <input
                  type="text"
                  {...register('religiousPreferences.kuldevta')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Dietary Preferences</label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="vegetarian"
                      value="vegetarian"
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      onChange={(e) => {
                        const currentPreferences = watch('religiousPreferences.dietaryPreferences') || [];
                        if (e.target.checked) {
                          setValue('religiousPreferences.dietaryPreferences', [...currentPreferences, 'vegetarian']);
                        } else {
                          setValue(
                            'religiousPreferences.dietaryPreferences',
                            currentPreferences.filter(pref => pref !== 'vegetarian')
                          );
                        }
                      }}
                    />
                    <label htmlFor="vegetarian" className="ml-2 block text-sm text-gray-700">Vegetarian</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="vegan"
                      value="vegan"
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      onChange={(e) => {
                        const currentPreferences = watch('religiousPreferences.dietaryPreferences') || [];
                        if (e.target.checked) {
                          setValue('religiousPreferences.dietaryPreferences', [...currentPreferences, 'vegan']);
                        } else {
                          setValue(
                            'religiousPreferences.dietaryPreferences',
                            currentPreferences.filter(pref => pref !== 'vegan')
                          );
                        }
                      }}
                    />
                    <label htmlFor="vegan" className="ml-2 block text-sm text-gray-700">Vegan</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="no_onion_garlic"
                      value="no_onion_garlic"
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      onChange={(e) => {
                        const currentPreferences = watch('religiousPreferences.dietaryPreferences') || [];
                        if (e.target.checked) {
                          setValue('religiousPreferences.dietaryPreferences', [...currentPreferences, 'no_onion_garlic']);
                        } else {
                          setValue(
                            'religiousPreferences.dietaryPreferences',
                            currentPreferences.filter(pref => pref !== 'no_onion_garlic')
                          );
                        }
                      }}
                    />
                    <label htmlFor="no_onion_garlic" className="ml-2 block text-sm text-gray-700">No Onion & Garlic (Sattvic)</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Preferences */}
        {currentStep === 'notificationPreferences' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">How would you like to receive notifications?</label>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    {...register('notificationPreferences.emailNotifications')}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">Email Notifications</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    {...register('notificationPreferences.smsNotifications')}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-700">SMS Notifications</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    {...register('notificationPreferences.pushNotifications')}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-700">Push Notifications</label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Reminder Frequency</label>
                <select
                  {...register('notificationPreferences.reminderFrequency')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="only_important">Only Important Events</option>
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  How often would you like to receive reminders about upcoming festivals and ceremonies?
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {currentStep !== 'basicInfo' ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Back
            </button>
          ) : (
            <div></div> // Empty div to maintain spacing
          )}
          
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            {currentStep === 'notificationPreferences' ? 'Complete Registration' : 'Continue'}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
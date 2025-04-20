"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Types for form data
type PanditRegistrationData = {
  personalInfo: {
    name: string;
    email: string;
    mobile: string;
    dob: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    profilePhoto: string; // This would be a file in a real app
  };
  professionalInfo: {
    qualification: string;
    experience: number;
    specializations: string[];
    languages: string[];
    certifications: string;
    aboutMe: string;
  };
  serviceInfo: {
    serviceArea: number; // radius in km
    availableDays: string[]; // days of the week
    availableTimeSlots: string[];
    canTravelOutstation: boolean;
    serviceLocations: string[]; // home, temple, etc.
    baseFees: {
      regular: number;
      premium: number;
    };
  };
  bankInfo: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branch: string;
    upiId: string;
  };
};

// Available specializations
const availableSpecializations = [
  'Griha Pravesh', 'Satyanarayan Puja', 'Wedding Ceremonies', 
  'Baby Naming', 'Ganesh Puja', 'Vastu Shanti', 
  'Funeral Rituals', 'Navgraha Shanti', 'Mata Ki Chowki'
];

// Available languages
const availableLanguages = [
  'Hindi', 'Sanskrit', 'English', 'Bengali', 'Marathi', 
  'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Gujarati'
];

// Service locations
const serviceLocations = [
  'Home', 'Temple', 'Event Venue', 'Office Space', 'Custom Location'
];

// Days of the week
const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
  'Friday', 'Saturday', 'Sunday'
];

// Time slots
const timeSlots = [
  'Early Morning (4AM-7AM)',
  'Morning (7AM-11AM)',
  'Afternoon (11AM-3PM)',
  'Evening (3PM-7PM)',
  'Night (7PM-10PM)'
];

// Props for the component
type PanditRegistrationFormProps = {
  onRegistrationComplete: (data: PanditRegistrationData) => void;
};

export default function PanditRegistrationForm({ onRegistrationComplete }: PanditRegistrationFormProps) {
  const router = useRouter();
  
  // Form step state
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState<PanditRegistrationData>({
    personalInfo: {
      name: '',
      email: '',
      mobile: '',
      dob: '',
      gender: 'male',
      address: '',
      city: '',
      state: '',
      pincode: '',
      profilePhoto: '',
    },
    professionalInfo: {
      qualification: '',
      experience: 0,
      specializations: [],
      languages: [],
      certifications: '',
      aboutMe: '',
    },
    serviceInfo: {
      serviceArea: 10,
      availableDays: [],
      availableTimeSlots: [],
      canTravelOutstation: false,
      serviceLocations: [],
      baseFees: {
        regular: 0,
        premium: 0,
      },
    },
    bankInfo: {
      accountName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      branch: '',
      upiId: '',
    },
  });
  
  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle input change for string fields
  const handleInputChange = (section: keyof PanditRegistrationData, field: string, value: string | number | boolean) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };
  
  // Handle nested input change
  const handleNestedInputChange = (section: keyof PanditRegistrationData, parentField: string, field: string, value: number) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [parentField]: {
          ...formData[section][parentField],
          [field]: value,
        },
      },
    });
  };
  
  // Handle checkbox arrays (specializations, languages, etc.)
  const handleCheckboxChange = (section: keyof PanditRegistrationData, field: string, value: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: [...formData[section][field], value],
        },
      });
    } else {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: formData[section][field].filter((item) => item !== value),
        },
      });
    }
  };
  
  // Validate step 1 (Personal Information)
  const validateStepOne = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.personalInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.personalInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.personalInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.personalInfo.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.personalInfo.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }
    
    if (!formData.personalInfo.dob) {
      newErrors.dob = 'Date of birth is required';
    }
    
    if (!formData.personalInfo.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.personalInfo.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.personalInfo.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.personalInfo.pincode.trim()) {
      newErrors.pincode = 'PIN code is required';
    } else if (!/^\d{6}$/.test(formData.personalInfo.pincode)) {
      newErrors.pincode = 'PIN code must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate step 2 (Professional Information)
  const validateStepTwo = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.professionalInfo.qualification.trim()) {
      newErrors.qualification = 'Qualification is required';
    }
    
    if (formData.professionalInfo.experience < 0) {
      newErrors.experience = 'Experience cannot be negative';
    }
    
    if (formData.professionalInfo.specializations.length === 0) {
      newErrors.specializations = 'Select at least one specialization';
    }
    
    if (formData.professionalInfo.languages.length === 0) {
      newErrors.languages = 'Select at least one language';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate step 3 (Service Information)
  const validateStepThree = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.serviceInfo.serviceArea <= 0) {
      newErrors.serviceArea = 'Service area must be positive';
    }
    
    if (formData.serviceInfo.availableDays.length === 0) {
      newErrors.availableDays = 'Select at least one day';
    }
    
    if (formData.serviceInfo.availableTimeSlots.length === 0) {
      newErrors.availableTimeSlots = 'Select at least one time slot';
    }
    
    if (formData.serviceInfo.serviceLocations.length === 0) {
      newErrors.serviceLocations = 'Select at least one service location';
    }
    
    if (formData.serviceInfo.baseFees.regular <= 0) {
      newErrors.regularFee = 'Regular fee must be positive';
    }
    
    if (formData.serviceInfo.baseFees.premium <= 0) {
      newErrors.premiumFee = 'Premium fee must be positive';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate step 4 (Bank Information)
  const validateStepFour = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.bankInfo.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }
    
    if (!formData.bankInfo.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    }
    
    if (!formData.bankInfo.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC code is required';
    } else if (!/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(formData.bankInfo.ifscCode)) {
      newErrors.ifscCode = 'IFSC code is invalid';
    }
    
    if (!formData.bankInfo.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }
    
    if (!formData.bankInfo.branch.trim()) {
      newErrors.branch = 'Branch is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle next step
  const handleNextStep = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStepOne();
        break;
      case 2:
        isValid = validateStepTwo();
        break;
      case 3:
        isValid = validateStepThree();
        break;
      default:
        isValid = false;
    }
    
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Handle previous step
  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStepFour()) {
      setIsLoading(true);
      
      try {
        // This is where you would normally make an API call to save the data
        // For now, we'll just simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // Pass the data back to the parent component
        onRegistrationComplete(formData);
      } catch (error) {
        console.error('Error registering pandit:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Generate a unique booking link
  const generateBookingLink = () => {
    const name = formData.personalInfo.name.toLowerCase().replace(/\s+/g, '-');
    const uniqueId = Math.random().toString(36).substring(2, 8);
    return `https://bookmypanditji.com/book/${name}-${uniqueId}`;
  };
  
  return (
    <div>
      {/* Form Steps Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {['Personal Info', 'Professional Info', 'Service Details', 'Payment Info'].map((step, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center ${index + 1 < currentStep ? 'text-orange-600' : index + 1 === currentStep ? 'text-orange-600' : 'text-gray-400'}`}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  index + 1 < currentStep
                    ? 'bg-orange-600 text-white'
                    : index + 1 === currentStep
                    ? 'border-2 border-orange-600 text-orange-600'
                    : 'border-2 border-gray-300 text-gray-400'
                }`}
              >
                {index + 1 < currentStep ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs sm:text-sm">{step}</span>
            </div>
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-orange-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.name}
                  onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.mobile}
                  onChange={(e) => handleInputChange('personalInfo', 'mobile', e.target.value)}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.mobile ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="10-digit mobile number"
                />
                {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={formData.personalInfo.dob}
                  onChange={(e) => handleInputChange('personalInfo', 'dob', e.target.value)}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.dob ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                />
                {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  value={formData.personalInfo.gender}
                  onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  value={formData.personalInfo.address}
                  onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                  rows={3}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.address ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="Enter your complete address"
                ></textarea>
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.city}
                  onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.city ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="Enter your city"
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.state}
                  onChange={(e) => handleInputChange('personalInfo', 'state', e.target.value)}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.state ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="Enter your state"
                />
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.pincode}
                  onChange={(e) => handleInputChange('personalInfo', 'pincode', e.target.value)}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.pincode ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="6-digit PIN code"
                />
                {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Photo
                </label>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
                />
                <p className="mt-1 text-xs text-gray-500">Upload a professional photo (Max size: 2MB)</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Professional Information */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualification *
                </label>
                <input
                  type="text"
                  value={formData.professionalInfo.qualification}
                  onChange={(e) => handleInputChange('professionalInfo', 'qualification', e.target.value)}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.qualification ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="Enter your highest qualification"
                />
                {errors.qualification && <p className="mt-1 text-sm text-red-600">{errors.qualification}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  value={formData.professionalInfo.experience}
                  onChange={(e) => handleInputChange('professionalInfo', 'experience', parseInt(e.target.value))}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.experience ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="Enter years of experience"
                  min="0"
                />
                {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specializations *
                </label>
                {errors.specializations && <p className="mt-1 text-sm text-red-600">{errors.specializations}</p>}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableSpecializations.map((specialization) => (
                    <div key={specialization} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`specialization-${specialization}`}
                        checked={formData.professionalInfo.specializations.includes(specialization)}
                        onChange={(e) => 
                          handleCheckboxChange('professionalInfo', 'specializations', specialization, e.target.checked)
                        }
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`specialization-${specialization}`} className="ml-2 text-sm text-gray-700">
                        {specialization}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages *
                </label>
                {errors.languages && <p className="mt-1 text-sm text-red-600">{errors.languages}</p>}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {availableLanguages.map((language) => (
                    <div key={language} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`language-${language}`}
                        checked={formData.professionalInfo.languages.includes(language)}
                        onChange={(e) => 
                          handleCheckboxChange('professionalInfo', 'languages', language, e.target.checked)
                        }
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`language-${language}`} className="ml-2 text-sm text-gray-700">
                        {language}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certifications or Awards
                </label>
                <textarea
                  value={formData.professionalInfo.certifications}
                  onChange={(e) => handleInputChange('professionalInfo', 'certifications', e.target.value)}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="Enter any certifications or awards (optional)"
                ></textarea>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  About Yourself
                </label>
                <textarea
                  value={formData.professionalInfo.aboutMe}
                  onChange={(e) => handleInputChange('professionalInfo', 'aboutMe', e.target.value)}
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="Describe your experience and background as a pandit"
                ></textarea>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Service Information */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Area (in km) *
                </label>
                <input
                  type="number"
                  value={formData.serviceInfo.serviceArea}
                  onChange={(e) => handleInputChange('serviceInfo', 'serviceArea', parseInt(e.target.value))}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.serviceArea ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="Service radius in kilometers"
                  min="1"
                />
                {errors.serviceArea && <p className="mt-1 text-sm text-red-600">{errors.serviceArea}</p>}
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="canTravelOutstation"
                  checked={formData.serviceInfo.canTravelOutstation}
                  onChange={(e) => handleInputChange('serviceInfo', 'canTravelOutstation', e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="canTravelOutstation" className="ml-2 text-sm text-gray-700">
                  Available for outstation ceremonies
                </label>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Days *
                </label>
                {errors.availableDays && <p className="mt-1 text-sm text-red-600">{errors.availableDays}</p>}
                <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`day-${day}`}
                        checked={formData.serviceInfo.availableDays.includes(day)}
                        onChange={(e) => 
                          handleCheckboxChange('serviceInfo', 'availableDays', day, e.target.checked)
                        }
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`day-${day}`} className="ml-2 text-sm text-gray-700">
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots *
                </label>
                {errors.availableTimeSlots && <p className="mt-1 text-sm text-red-600">{errors.availableTimeSlots}</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {timeSlots.map((timeSlot) => (
                    <div key={timeSlot} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`timeSlot-${timeSlot}`}
                        checked={formData.serviceInfo.availableTimeSlots.includes(timeSlot)}
                        onChange={(e) => 
                          handleCheckboxChange('serviceInfo', 'availableTimeSlots', timeSlot, e.target.checked)
                        }
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`timeSlot-${timeSlot}`} className="ml-2 text-sm text-gray-700">
                        {timeSlot}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Locations *
                </label>
                {errors.serviceLocations && <p className="mt-1 text-sm text-red-600">{errors.serviceLocations}</p>}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {serviceLocations.map((location) => (
                    <div key={location} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`location-${location}`}
                        checked={formData.serviceInfo.serviceLocations.includes(location)}
                        onChange={(e) => 
                          handleCheckboxChange('serviceInfo', 'serviceLocations', location, e.target.checked)
                        }
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`location-${location}`} className="ml-2 text-sm text-gray-700">
                        {location}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Regular Booking Fee (₹) *
                </label>
                <input
                  type="number"
                  value={formData.serviceInfo.baseFees.regular}
                  onChange={(e) => handleNestedInputChange('serviceInfo', 'baseFees', 'regular', parseInt(e.target.value))}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.regularFee ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="Your standard fee per service"
                  min="0"
                />
                {errors.regularFee && <p className="mt-1 text-sm text-red-600">{errors.regularFee}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Premium (Urgent) Booking Fee (₹) *
                </label>
                <input
                  type="number"
                  value={formData.serviceInfo.baseFees.premium}
                  onChange={(e) => handleNestedInputChange('serviceInfo', 'baseFees', 'premium', parseInt(e.target.value))}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.premiumFee ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="Your premium fee for urgent bookings"
                  min="0"
                />
                {errors.premiumFee && <p className="mt-1 text-sm text-red-600">{errors.premiumFee}</p>}
                <p className="mt-1 text-xs text-gray-500">Set this higher than your regular fee for urgent bookings (within 48 hours)</p>
              </div>
              
              <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-2">
                <h4 className="text-md font-medium text-gray-800 mb-2">Your Dedicated Booking Link</h4>
                <div className="flex items-center p-2 bg-gray-50 rounded-md border border-gray-200">
                  <input 
                    type="text" 
                    readOnly 
                    className="block w-full bg-transparent border-0 focus:ring-0 text-sm text-gray-700" 
                    value={generateBookingLink()}
                  />
                  <button
                    type="button"
                    className="ml-2 bg-gray-200 p-2 rounded hover:bg-gray-300"
                    onClick={() => {
                      navigator.clipboard.writeText(generateBookingLink());
                    }}
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Share this link with your devotees to book directly with you. Link will be activated after registration.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: Bank Information */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Secure Information</h4>
                  <p className="text-xs text-yellow-700 mt-1">
                    Your banking details are secure with us and will only be used for depositing your payments.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  value={formData.bankInfo.accountName}
                  onChange={(e) => handleInputChange('bankInfo', 'accountName', e.target.value)}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.accountName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="Enter account holder name"
                />
                {errors.accountName && <p className="mt-1 text-sm text-red-600">{errors.accountName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={formData.bankInfo.accountNumber}
                  onChange={(e) => handleInputChange('bankInfo', 'accountNumber', e.target.value)}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.accountNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="Enter bank account number"
                />
                {errors.accountNumber && <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  value={formData.bankInfo.ifscCode}
                  onChange={(e) => handleInputChange('bankInfo', 'ifscCode', e.target.value)}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.ifscCode ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="Enter IFSC code"
                />
                {errors.ifscCode && <p className="mt-1 text-sm text-red-600">{errors.ifscCode}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name *
                </label>
                <input
                  type="text"
                  value={formData.bankInfo.bankName}
                  onChange={(e) => handleInputChange('bankInfo', 'bankName', e.target.value)}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.bankName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="Enter bank name"
                />
                {errors.bankName && <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Name *
                </label>
                <input
                  type="text"
                  value={formData.bankInfo.branch}
                  onChange={(e) => handleInputChange('bankInfo', 'branch', e.target.value)}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.branch ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="Enter branch name"
                />
                {errors.branch && <p className="mt-1 text-sm text-red-600">{errors.branch}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UPI ID (Optional)
                </label>
                <input
                  type="text"
                  value={formData.bankInfo.upiId}
                  onChange={(e) => handleInputChange('bankInfo', 'upiId', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="Enter UPI ID (e.g., name@upi)"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center">
                <input
                  id="termsAndConditions"
                  name="termsAndConditions"
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="termsAndConditions" className="ml-2 block text-sm text-gray-700">
                  I agree to the <a href="#" className="text-orange-600 hover:text-orange-800">Terms and Conditions</a> and <a href="#" className="text-orange-600 hover:text-orange-800">Privacy Policy</a>
                </label>
              </div>
            </div>
          </div>
        )}
        
        {/* Form Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={handlePreviousStep}
            className={`${
              currentStep === 1 ? 'invisible' : ''
            } px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300`}
          >
            Previous
          </button>
          
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Complete Registration'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
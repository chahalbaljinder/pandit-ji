"use client";

import { useState } from 'react';
import { useRegister, useCreatePanditProfile } from '@/hooks/useApi';
import { RegisterDto, CreatePanditProfileDto } from '@/lib/api';

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
    profilePhoto: string;
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
    serviceArea: number;
    availableDays: string[];
    availableTimeSlots: string[];
    canTravelOutstation: boolean;
    serviceLocations: string[];
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

type ArrayFields = 'specializations' | 'languages' | 'availableDays' | 'availableTimeSlots' | 'serviceLocations';

const availableSpecializations = [
  'Griha Pravesh', 'Satyanarayan Puja', 'Wedding Ceremonies', 
  'Baby Naming', 'Ganesh Puja', 'Vastu Shanti', 
  'Funeral Rituals', 'Navgraha Shanti', 'Mata Ki Chowki'
];

const availableLanguages = [
  'Hindi', 'Sanskrit', 'English', 'Bengali', 'Marathi', 
  'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Gujarati'
];

const serviceLocations = [
  'Home', 'Temple', 'Event Venue', 'Office Space', 'Custom Location'
];

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
  'Friday', 'Saturday', 'Sunday'
];

const timeSlots = [
  'Early Morning (4AM-7AM)',
  'Morning (7AM-11AM)',
  'Afternoon (11AM-3PM)',
  'Evening (3PM-7PM)',
  'Night (7PM-10PM)'
];

type PanditRegistrationFormProps = {
  onRegistrationCompleteAction: (data: any) => void;
};

export default function PanditRegistrationForm({ onRegistrationCompleteAction }: PanditRegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerMutation = useRegister();
  const createPanditProfile = useCreatePanditProfile();

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

  const handleInputChange = (section: keyof PanditRegistrationData, field: string, value: string | number | boolean) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  const handleNestedInputChange = (
    section: 'serviceInfo',
    parentField: 'baseFees',
    field: 'regular' | 'premium',
    value: number
  ) => {
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

  const handleCheckboxChange = (
    section: 'professionalInfo' | 'serviceInfo',
    field: ArrayFields,
    value: string,
    checked: boolean
  ) => {
    const sectionData = formData[section];
    const currentValue = field in sectionData ? (sectionData as any)[field] as string[] : [];
    
    if (checked) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: [...currentValue, value],
        },
      });
    } else {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: currentValue.filter((item) => item !== value),
        },
      });
    }
  };

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

  const handleInputChange = (section: keyof PanditRegistrationData, field: string, value: string | number | boolean) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  const handleNestedInputChange = (
    section: 'serviceInfo',
    parentField: 'baseFees',
    field: 'regular' | 'premium',
    value: number
  ) => {
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

  const handleCheckboxChange = (
    section: 'professionalInfo' | 'serviceInfo',
    field: ArrayFields,
    value: string,
    checked: boolean
  ) => {
    const sectionData = formData[section];
    const currentValue = field in sectionData ? (sectionData as any)[field] as string[] : [];
    
    if (checked) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: [...currentValue, value],
        },
      });
    } else {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: currentValue.filter((item) => item !== value),
        },
      });
    }
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const registerMutation = useRegister();
  const createPanditProfileMutation = useCreatePanditProfile();

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

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStepFour()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      // Step 1: Register user
      const registerData: RegisterDto = {
        name: formData.personalInfo.name,
        email: formData.personalInfo.email,
        phone: formData.personalInfo.mobile,
        password: formData.personalInfo.password || 'TempPass123!', // User will set password later
        role: 'PANDIT',
        dateOfBirth: formData.personalInfo.dob,
        gender: formData.personalInfo.gender as any,
      };

      await registerMutation.mutateAsync(registerData);
      
      // Step 2: Create pandit profile
      const panditData: CreatePanditProfileDto = {
        title: '',
        bio: formData.professionalInfo.aboutMe,
        experienceYears: formData.professionalInfo.experience,
        education: formData.professionalInfo.qualification,
        specializations: formData.professionalInfo.specializations,
        languages: formData.professionalInfo.languages,
        serviceCities: [formData.personalInfo.city],
        serviceRadius: formData.serviceInfo.serviceArea,
        baseLatitude: 0, // Would need geocoding
        baseLongitude: 0,
        weeklySchedule: buildWeeklySchedule(),
        blockedDates: [],
        basePrice: formData.serviceInfo.baseFees.regular,
        pricingMode: 'FIXED',
        galleryImages: [],
        videoIntro: '',
        documents: [], // Profile photo, certificates
      };

      await createPanditProfileMutation.mutateAsync(panditData);
      
      // Registration successful
      onRegistrationCompleteAction({ ...formData, bookingLink: generateBookingLink() });
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const buildWeeklySchedule = () => {
    const schedule: Record<string, { start: string; end: string }[]> = {};
    daysOfWeek.forEach(day => {
      if (formData.serviceInfo.availableDays.includes(day)) {
        schedule[day] = timeSlots
          .filter(slot => formData.serviceInfo.availableTimeSlots.includes(slot))
          .map(slot => ({ start: slot.split('(')[1]?.split('-')[0]?.trim() || '09:00', end: slot.split('-')[1]?.split(')')[0]?.trim() || '17:00' }));
      }
    });
    return schedule;
  };

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

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const registerMutation = useRegister();
  const createPanditProfileMutation = useCreatePanditProfile();

  const handleInputChange = (section: keyof PanditRegistrationData, field: string, value: string | number | boolean) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  const handleNestedInputChange = (
    section: 'serviceInfo',
    parentField: 'baseFees',
    field: 'regular' | 'premium',
    value: number
  ) => {
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

  const handleCheckboxChange = (
    section: 'professionalInfo' | 'serviceInfo',
    field: ArrayFields,
    value: string,
    checked: boolean
  ) => {
    const sectionData = formData[section];
    const currentValue = field in sectionData ? (sectionData as any)[field] as string[] : [];
    
    if (checked) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: [...currentValue, value],
        },
      });
    } else {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: currentValue.filter((item) => item !== value),
        },
      });
    }
  };

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

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStepFour()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      // Step 1: Register user
      const registerData: RegisterDto = {
        name: formData.personalInfo.name,
        email: formData.personalInfo.email,
        phone: formData.personalInfo.mobile,
        password: formData.personalInfo.password || 'TempPass123!',
        role: 'PANDIT',
        dateOfBirth: formData.personalInfo.dob,
        gender: formData.personalInfo.gender as any,
      };

      await registerMutation.mutateAsync(registerData);
      
      // Step 2: Create pandit profile
      const panditData: CreatePanditProfileDto = {
        title: '',
        bio: formData.professionalInfo.aboutMe,
        experienceYears: formData.professionalInfo.experience,
        education: formData.professionalInfo.qualification,
        specializations: formData.professionalInfo.specializations,
        languages: formData.professionalInfo.languages,
        serviceCities: [formData.personalInfo.city],
        serviceRadius: formData.serviceInfo.serviceArea,
        baseLatitude: 0,
        baseLongitude: 0,
        weeklySchedule: buildWeeklySchedule(),
        blockedDates: [],
        basePrice: formData.serviceInfo.baseFees.regular,
        pricingMode: 'FIXED',
        galleryImages: [],
        videoIntro: '',
        documents: [],
      };

      await createPanditProfileMutation.mutateAsync(panditData);
      
      onRegistrationCompleteAction({ ...formData, bookingLink: generateBookingLink() });
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const buildWeeklySchedule = () => {
    const schedule: Record<string, { start: string; end: string }[]> = {};
    daysOfWeek.forEach(day => {
      if (formData.serviceInfo.availableDays.includes(day)) {
        schedule[day] = timeSlots
          .filter(slot => formData.serviceInfo.availableTimeSlots.includes(slot))
          .map(slot => ({ start: slot.split('(')[1]?.split('-')[0]?.trim() || '09:00', end: slot.split('-')[1]?.split(')')[0]?.trim() || '17:00' }));
      }
    });
    return schedule;
  };

  const generateBookingLink = () => {
    const name = formData.personalInfo.name.toLowerCase().replace(/\s+/g, '-');
    const uniqueId = Math.random().toString(36).substring(2, 8);
    return `https://bookmypanditji.com/book/${name}-${uniqueId}`;
  };

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
    return Object.keys(newErrors)..length === 0;
  };

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
      password: '',
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

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerMutation = useRegister();
  const createPanditProfileMutation = useCreatePanditProfile();

  const handleInputChange = (section: keyof PanditRegistrationData, field: string, value: string | number | boolean) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  const handleNestedInputChange = (
    section: 'serviceInfo',
    parentField: 'baseFees',
    field: 'regular' | 'premium',
    value: number
  ) => {
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

  const handleCheckboxChange = (
    section: 'professionalInfo' | 'serviceInfo',
    field: ArrayFields,
    value: string,
    checked: boolean
  ) => {
    const sectionData = formData[section];
    const currentValue = field in sectionData ? (sectionData as any)[field] as string[] : [];
    
    if (checked) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: [...currentValue, value],
        },
      });
    } else {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: currentValue.filter((item) => item !== value),
        },
      });
    }
  };

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

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStepFour()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      // Step 1: Register user
      const registerData: RegisterDto = {
        name: formData.personalInfo.name,
        email: formData.personalInfo.email,
        phone: formData.personalInfo.mobile,
        password: formData.personalInfo.password || 'TempPass123!',
        role: 'PANDIT',
        dateOfBirth: formData.personalInfo.dob,
        gender: formData.personalInfo.gender as any,
      };

      await registerMutation.mutateAsync(registerData);
      
      // Step 2: Create pandit profile
      const panditData: CreatePanditProfileDto = {
        title: '',
        bio: formData.professionalInfo.aboutMe,
        experienceYears: formData.professionalInfo.experience,
        education: formData.professionalInfo.qualification,
        specializations: formData.professionalInfo.specializations,
        languages: formData.professionalInfo.languages,
        serviceCities: [formData.personalInfo.city],
        serviceRadius: formData.serviceInfo.serviceArea,
        baseLatitude: 0,
        baseLongitude: 0,
        weeklySchedule: buildWeeklySchedule(),
        blockedDates: [],
        basePrice: formData.serviceInfo.baseFees.regular,
        pricingMode: 'FIXED',
        galleryImages: [],
        videoIntro: '',
        documents: [],
      };

      await createPanditProfileMutation.mutateAsync(panditData);
      
      onRegistrationCompleteAction({ ...formData, bookingLink: generateBookingLink() });
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const buildWeeklySchedule = () => {
    const schedule: Record<string, { start: string; end: string }[]> = {};
    daysOfWeek.forEach(day => {
      if (formData.serviceInfo.availableDays.includes(day)) {
        schedule[day] = timeSlots
          .filter(slot => formData.serviceInfo.availableTimeSlots.includes(slot))
          .map(slot => ({ start: slot.split('(')[1]?.split('-')[0]?.trim() || '09:00', end: slot.split('-')[1]?.split(')')[0]?.trim() || '17:00' }));
      }
    });
    return schedule;
  };

  const generateBookingLink = () => {
    const name = formData.personalInfo.name.toLowerCase().replace(/\s+/g, '-');
    const uniqueId = Math.random().toString(36).substring(2, 8);
    return `https://bookmypanditji.com/book/${name}-${uniqueId}`;
  };

  const availableSpecializations = [
    'Griha Pravesh', 'Satyanarayan Puja', 'Wedding Ceremonies', 
    'Baby Naming', 'Ganesh Puja', 'Vastu Shanti', 
    'Funeral Rituals', 'Navgraha Shanti', 'Mata Ki Chowki'
  ];

  const availableLanguages = [
    'Hindi', 'Sanskrit', 'English', 'Bengali', 'Marathi', 
    'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Gujarati'
  ];

  const serviceLocations = [
    'Home', 'Temple', 'Event Venue', 'Office Space', 'Custom Location'
  ];

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
    'Friday', 'Saturday', 'Sunday'
  ];

  const timeSlots = [
    'Early Morning (4AM-7AM)',
    'Morning (7AM-11AM)',
    'Afternoon (11AM-3PM)',
    'Evening (3PM-7PM)',
    'Night (7PM-10PM)'
  ];

  const handleInputChange = (section: keyof PanditRegistrationData, field: string, value: string | number | boolean) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  const handleNestedInputChange = (
    section: 'serviceInfo',
    parentField: 'baseFees',
    field: 'regular' | 'premium',
    value: number
  ) => {
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

  const handleCheckboxChange = (
    section: 'professionalInfo' | 'serviceInfo',
    field: ArrayFields,
    value: string,
    checked: boolean
  ) => {
    const sectionData = formData[section];
    const currentValue = field in sectionData ? (sectionData as any)[field] as string[] : [];
    
    if (checked) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: [...currentValue, value],
        },
      });
    } else {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: currentValue.filter((item) => item !== value),
        },
      });
    }
  };

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

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // ... rest of component (JSX) - same as before but with registerMutation.isPending and createPanditProfileMutation.isPending for loading states

  // ... (rest of the JSX remains the same, just use registerMutation.isPending and createPanditProfileMutation.isPending)
  
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
        {/* ... rest of JSX same as before but with:
          - registerMutation.isPending || createPanditProfileMutation.isPending for loading
          - registerMutation.isError || createPanditProfileMutation.isError for errors
          - registerMutation.isPending || createPanditProfileMutation.isPending for disabled
        */}
        
        {/* ... rest of JSX same as before */}
      </form>
    </div>
  );
}
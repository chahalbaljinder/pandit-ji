'use client';

import { useState } from 'react';

type Service = {
  name: string;
  description: string;
  price: number;
};

type BookingFormProps = {
  panditId: number;
  services: Service[];
  onBookingComplete: () => void;
};

export default function BookingForm({ panditId, services, onBookingComplete }: BookingFormProps) {
  const [selectedService, setSelectedService] = useState<string>(services[0]?.name || '');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [requirements, setRequirements] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookingType, setBookingType] = useState<'normal' | 'premium'>('normal');
  const [locationType, setLocationType] = useState<'home' | 'temple' | 'custom'>('home');
  const [includeSamagri, setIncludeSamagri] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  const maxDate = threeMonthsLater.toISOString().split('T')[0];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedService) newErrors.service = 'Please select a service';
    if (!selectedDate) newErrors.date = 'Please select a date';
    if (!selectedTime) newErrors.time = 'Please select a time';
    if (!address.trim()) newErrors.address = 'Please enter venue address';
    
    if (bookingType === 'premium') {
      const selectedDateTime = new Date(selectedDate);
      const now = new Date();
      const differenceInDays = (selectedDateTime.getTime() - now.getTime()) / (1000 * 3600 * 24);
      
      if (differenceInDays > 2) {
        newErrors.bookingType = 'Premium booking is only for ceremonies within 48 hours';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    setTimeout(() => {
      console.log({
        panditId,
        service: selectedService,
        bookingType,
        locationType,
        includeSamagri,
        date: selectedDate,
        time: selectedTime,
        address,
        requirements,
      });
      
      setLoading(false);
      onBookingComplete();
    }, 1500);
  };

  const getServicePrice = () => {
    const service = services.find(s => s.name === selectedService);
    const basePrice = service ? service.price : 0;
    
    const premiumMultiplier = bookingType === 'premium' ? 1.5 : 1;
    const samagriCost = includeSamagri ? basePrice * 0.2 : 0;
    
    return (basePrice * premiumMultiplier) + samagriCost;
  };

  const getPlatformFee = () => {
    return Math.round(getServicePrice() * 0.05);
  };

  const getTotalAmount = () => {
    return getServicePrice() + getPlatformFee();
  };

  const getTimeSlots = () => {
    if (bookingType === 'premium') {
      return (
        <>
          <option value="">Select time slot</option>
          <option value="early_morning">Early Morning (4:00 AM - 6:00 AM)</option>
          <option value="morning">Morning (6:00 AM - 10:00 AM)</option>
          <option value="afternoon">Afternoon (11:00 AM - 2:00 PM)</option>
          <option value="evening">Evening (4:00 PM - 8:00 PM)</option>
          <option value="night">Night (8:00 PM - 11:00 PM)</option>
        </>
      );
    } else {
      return (
        <>
          <option value="">Select time slot</option>
          <option value="morning">Morning (6:00 AM - 10:00 AM)</option>
          <option value="afternoon">Afternoon (11:00 AM - 2:00 PM)</option>
          <option value="evening">Evening (4:00 PM - 8:00 PM)</option>
        </>
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-6 border-b pb-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">Select Booking Type</label>
        <div className="flex items-center space-x-4">
          <div 
            onClick={() => setBookingType('normal')} 
            className={`flex-1 border rounded-lg p-4 cursor-pointer ${bookingType === 'normal' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-800">Normal Booking</h3>
              {bookingType === 'normal' && (
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-500">Book in advance (at least 2 days before)</p>
            <p className="text-sm text-green-600 mt-2">Standard pricing</p>
          </div>
          
          <div 
            onClick={() => setBookingType('premium')} 
            className={`flex-1 border rounded-lg p-4 cursor-pointer ${bookingType === 'premium' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-800">Premium Booking</h3>
              {bookingType === 'premium' && (
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-500">Urgent booking (within 48 hours)</p>
            <p className="text-sm text-orange-600 mt-2">+50% premium pricing</p>
          </div>
        </div>
        {errors.bookingType && <p className="mt-2 text-sm text-red-600">{errors.bookingType}</p>}
      </div>

      <div>
        <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
        <select 
          id="service" 
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className={`block w-full rounded-md border-${errors.service ? 'red-300' : 'gray-300'} shadow-sm focus:border-orange-500 focus:ring-orange-500`}
        >
          {services.map((service, index) => (
            <option key={index} value={service.name}>
              {service.name} - ₹{service.price}
            </option>
          ))}
        </select>
        {errors.service && <p className="mt-1 text-sm text-red-600">{errors.service}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ceremony Location</label>
        <div className="grid grid-cols-3 gap-2">
          <button 
            type="button"
            onClick={() => setLocationType('home')} 
            className={`py-2 px-3 text-sm rounded-md ${locationType === 'home' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Home
          </button>
          <button 
            type="button"
            onClick={() => setLocationType('temple')} 
            className={`py-2 px-3 text-sm rounded-md ${locationType === 'temple' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Temple
          </button>
          <button 
            type="button"
            onClick={() => setLocationType('custom')} 
            className={`py-2 px-3 text-sm rounded-md ${locationType === 'custom' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Custom
          </button>
        </div>
      </div>
      
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
        <input 
          type="date" 
          id="date" 
          min={bookingType === 'premium' ? new Date().toISOString().split('T')[0] : minDate}
          max={maxDate}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={`block w-full rounded-md border-${errors.date ? 'red-300' : 'gray-300'} shadow-sm focus:border-orange-500 focus:ring-orange-500`} 
        />
        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
      </div>
      
      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
        <select 
          id="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className={`block w-full rounded-md border-${errors.time ? 'red-300' : 'gray-300'} shadow-sm focus:border-orange-500 focus:ring-orange-500`}
        >
          {getTimeSlots()}
        </select>
        {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          {locationType === 'home' ? 'Home Address' : 
           locationType === 'temple' ? 'Temple Name & Address' : 
           'Venue Address'}
        </label>
        <textarea 
          id="address"
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={locationType === 'home' ? "Enter your home address" : 
                      locationType === 'temple' ? "Enter temple name and address" : 
                      "Enter venue address"}
          className={`block w-full rounded-md border-${errors.address ? 'red-300' : 'gray-300'} shadow-sm focus:border-orange-500 focus:ring-orange-500`}
        ></textarea>
        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
      </div>
      
      <div className="flex items-center space-x-3 py-3 border-y border-gray-200">
        <input
          id="includeSamagri"
          type="checkbox"
          checked={includeSamagri}
          onChange={() => setIncludeSamagri(!includeSamagri)}
          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
        />
        <label htmlFor="includeSamagri" className="block text-sm font-medium text-gray-700">
          Include Puja Samagri (+20% cost)
        </label>
      </div>
      
      <div>
        <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">Additional Requirements</label>
        <textarea 
          id="requirements"
          rows={2}
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="Any specific requirements (optional)"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        ></textarea>
      </div>
      
      <div className="pt-2">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Service Fee:</span>
          <span className="font-semibold">₹{getServicePrice().toFixed(2)}</span>
        </div>
        
        {bookingType === 'premium' && (
          <div className="flex justify-between mb-2 text-orange-600">
            <span>Premium Booking Fee (included):</span>
            <span>+50%</span>
          </div>
        )}
        
        {includeSamagri && (
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Samagri Cost (included):</span>
            <span className="font-semibold">+20%</span>
          </div>
        )}
        
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Platform Fee:</span>
          <span className="font-semibold">₹{getPlatformFee().toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between mb-4 pt-2 border-t border-gray-200">
          <span className="font-medium">Total Amount:</span>
          <span className="font-bold text-orange-600">₹{getTotalAmount().toFixed(2)}</span>
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition flex items-center justify-center"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : 'Proceed to Payment'}
      </button>
      
      <p className="text-xs text-gray-500 text-center mt-2">
        You won't be charged yet. Price will be confirmed after booking details are reviewed.
      </p>
    </form>
  );
}
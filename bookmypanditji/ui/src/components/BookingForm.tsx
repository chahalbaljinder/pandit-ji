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

  // Calculate tomorrow's date for min date in the date picker
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Calculate 3 months from now for max date
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  const maxDate = threeMonthsLater.toISOString().split('T')[0];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedService) newErrors.service = 'Please select a service';
    if (!selectedDate) newErrors.date = 'Please select a date';
    if (!selectedTime) newErrors.time = 'Please select a time';
    if (!address.trim()) newErrors.address = 'Please enter venue address';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // In a real app, this would be an API call to create the booking
    setTimeout(() => {
      console.log({
        panditId,
        service: selectedService,
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
    return service ? service.price : 0;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
        <input 
          type="date" 
          id="date" 
          min={minDate}
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
          <option value="">Select time slot</option>
          <option value="morning">Morning (6:00 AM - 10:00 AM)</option>
          <option value="afternoon">Afternoon (11:00 AM - 2:00 PM)</option>
          <option value="evening">Evening (4:00 PM - 8:00 PM)</option>
        </select>
        {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Venue Address</label>
        <textarea 
          id="address"
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter complete address"
          className={`block w-full rounded-md border-${errors.address ? 'red-300' : 'gray-300'} shadow-sm focus:border-orange-500 focus:ring-orange-500`}
        ></textarea>
        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
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
          <span className="font-semibold">₹{getServicePrice()}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Platform Fee:</span>
          <span className="font-semibold">₹{Math.round(getServicePrice() * 0.05)}</span>
        </div>
        <div className="flex justify-between mb-4 pt-2 border-t border-gray-200">
          <span className="font-medium">Total Amount:</span>
          <span className="font-bold text-orange-600">₹{getServicePrice() + Math.round(getServicePrice() * 0.05)}</span>
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
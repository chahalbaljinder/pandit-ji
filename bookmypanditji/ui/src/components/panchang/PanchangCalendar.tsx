"use client";

import { useState, useEffect } from 'react';

type PanchangDay = {
  date: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  isFestival: boolean;
  festivalName?: string;
  specialEvents?: string[];
  auspiciousTimings?: {
    start: string;
    end: string;
    activity: string;
  }[];
  inauspiciousTimings?: {
    start: string;
    end: string;
    description: string;
  }[];
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  rashi: string;
  isAuspicious: boolean;
};

// Simulated data for demo purposes
const generateMockPanchangData = (month: number, year: number): PanchangDay[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const result: PanchangDay[] = [];

  const tithis = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima', 
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
  ];
  
  const nakshatras = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
    'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
    'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
    'Vishaka', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
    'Uttara Bhadrapada', 'Revati'
  ];
  
  const rashis = [
    'Mesh (Aries)', 'Vrishabh (Taurus)', 'Mithun (Gemini)', 'Kark (Cancer)',
    'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchik (Scorpio)',
    'Dhanu (Sagittarius)', 'Makar (Capricorn)', 'Kumbh (Aquarius)', 'Meen (Pisces)'
  ];

  // Special festivals for demo
  const festivals = [
    { day: 5, name: 'Ganesh Chaturthi' },
    { day: 10, name: 'Anant Chaturdashi' },
    { day: 15, name: 'Purnima' },
    { day: 30, name: 'Amavasya' }
  ];

  for (let day = 1; day <= daysInMonth; day++) {
    const tithiIndex = (day - 1) % tithis.length;
    const nakshatraIndex = (day - 1) % nakshatras.length;
    const rashiIndex = Math.floor((day - 1) / 2.5) % rashis.length;
    
    const festival = festivals.find(f => f.day === day);
    const isFestival = !!festival;
    
    // Random auspicious/inauspicious periods for demo
    const auspiciousHour1 = Math.floor(Math.random() * 12) + 6; // Between 6am and 6pm
    const auspiciousHour2 = Math.floor(Math.random() * 12) + 6;
    const inauspiciousHour = Math.floor(Math.random() * 24); // Any hour of day
    
    result.push({
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      tithi: tithis[tithiIndex],
      nakshatra: nakshatras[nakshatraIndex],
      yoga: 'Shubha', // Simplified for demo
      karana: day % 2 === 0 ? 'Bava' : 'Balava', // Simplified for demo
      isFestival,
      festivalName: festival?.name,
      specialEvents: isFestival ? ['Puja', 'Fasting'] : undefined,
      auspiciousTimings: [
        {
          start: `${auspiciousHour1}:00`,
          end: `${auspiciousHour1 + 1}:30`,
          activity: 'General auspicious activities'
        },
        {
          start: `${auspiciousHour2}:00`,
          end: `${auspiciousHour2 + 1}:00`,
          activity: 'Travel, New ventures'
        }
      ],
      inauspiciousTimings: [
        {
          start: `${inauspiciousHour}:00`,
          end: `${inauspiciousHour + 1}:30`,
          description: 'Rahu Kalam'
        }
      ],
      sunrise: '06:15',
      sunset: '18:45',
      moonrise: '18:20',
      moonset: '05:40',
      rashi: rashis[rashiIndex],
      isAuspicious: [2, 5, 10, 15, 27].includes(day) // Some random auspicious days
    });
  }
  
  return result;
};

export default function PanchangCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<PanchangDay | null>(null);
  const [panchangData, setPanchangData] = useState<PanchangDay[]>([]);
  const [view, setView] = useState<'month' | 'day'>('month');
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  useEffect(() => {
    // In a real application, this would fetch from an API
    const data = generateMockPanchangData(currentMonth, currentYear);
    setPanchangData(data);
    
    // Set today as the selected date initially
    const today = new Date();
    if (today.getMonth() === currentMonth && today.getFullYear() === currentYear) {
      const todayData = data.find(day => day.date.endsWith(`-${String(today.getDate()).padStart(2, '0')}`));
      if (todayData) {
        setSelectedDate(todayData);
      }
    }
  }, [currentMonth, currentYear]);
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    setSelectedDate(null);
  };
  
  const handleDateClick = (day: PanchangDay) => {
    setSelectedDate(day);
    setView('day');
  };
  
  const today = new Date();
  const isToday = (dateStr: string) => {
    const day = new Date(dateStr);
    return day.getDate() === today.getDate() && 
           day.getMonth() === today.getMonth() && 
           day.getFullYear() === today.getFullYear();
  };
  
  const renderCalendarHeader = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
    
    return (
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigateMonth('prev')}
          className="text-gray-600 hover:text-orange-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-xl font-bold text-gray-800">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        
        <button 
          onClick={() => navigateMonth('next')}
          className="text-gray-600 hover:text-orange-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };
  
  const renderCalendarDays = () => {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Create array of empty days for padding
    const emptyCells = Array(firstDayOfMonth).fill(null);
    
    return (
      <>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map(day => (
            <div key={day} className="text-center py-2 text-sm font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {emptyCells.map((_, index) => (
            <div key={`empty-${index}`} className="h-24 p-1 bg-gray-50 rounded"></div>
          ))}
          
          {panchangData.map(day => {
            const dayOfMonth = new Date(day.date).getDate();
            return (
              <div 
                key={day.date} 
                onClick={() => handleDateClick(day)}
                className={`
                  h-24 p-2 relative border cursor-pointer transition-colors overflow-hidden
                  ${isToday(day.date) ? 'bg-orange-50 border-orange-300' : 'bg-white hover:bg-orange-50 border-gray-100'}
                  ${day.isFestival ? 'ring-1 ring-orange-300' : ''}
                  ${selectedDate?.date === day.date ? 'border-orange-500' : ''}
                  rounded
                `}
              >
                <div className="flex justify-between items-start">
                  <span 
                    className={`
                      inline-flex items-center justify-center rounded-full w-6 h-6 text-sm
                      ${isToday(day.date) ? 'bg-orange-500 text-white' : 'text-gray-700'}
                    `}
                  >
                    {dayOfMonth}
                  </span>
                  
                  {day.isAuspicious && (
                    <span className="text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
                
                <div className="mt-1 text-xs">
                  <div className="text-gray-500 truncate">{day.tithi}</div>
                  {day.isFestival && (
                    <div className="text-orange-600 font-semibold mt-1 truncate">
                      {day.festivalName}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };
  
  const renderDayView = () => {
    if (!selectedDate) return null;
    
    const date = new Date(selectedDate.date);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
    
    return (
      <div>
        <button 
          onClick={() => setView('month')}
          className="flex items-center text-orange-600 hover:text-orange-700 mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Calendar
        </button>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-orange-100 p-4 border-b border-orange-200">
            <h2 className="font-bold text-xl text-gray-800">
              {dayNames[date.getDay()]}, {monthNames[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
            </h2>
            
            {selectedDate.isFestival && (
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-200 text-orange-800">
                {selectedDate.festivalName}
              </div>
            )}
            
            {selectedDate.isAuspicious && (
              <div className="mt-2 inline-flex items-center ml-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Auspicious Day
              </div>
            )}
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Panchang Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tithi:</span>
                    <span className="font-medium">{selectedDate.tithi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nakshatra:</span>
                    <span className="font-medium">{selectedDate.nakshatra}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Yoga:</span>
                    <span className="font-medium">{selectedDate.yoga}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Karana:</span>
                    <span className="font-medium">{selectedDate.karana}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rashi:</span>
                    <span className="font-medium">{selectedDate.rashi}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-800 mt-6 mb-3">Timings</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunrise:</span>
                    <span className="font-medium">{selectedDate.sunrise}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunset:</span>
                    <span className="font-medium">{selectedDate.sunset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Moonrise:</span>
                    <span className="font-medium">{selectedDate.moonrise}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Moonset:</span>
                    <span className="font-medium">{selectedDate.moonset}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Auspicious Timings</h3>
                {selectedDate.auspiciousTimings && selectedDate.auspiciousTimings.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDate.auspiciousTimings.map((timing, index) => (
                      <div key={index} className="bg-green-50 border border-green-100 rounded p-3">
                        <div className="text-green-800 font-medium">
                          {timing.start} - {timing.end}
                        </div>
                        <div className="text-sm text-green-600 mt-1">{timing.activity}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">No auspicious timings available for this day.</div>
                )}
                
                <h3 className="font-semibold text-gray-800 mt-6 mb-3">Inauspicious Timings</h3>
                {selectedDate.inauspiciousTimings && selectedDate.inauspiciousTimings.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDate.inauspiciousTimings.map((timing, index) => (
                      <div key={index} className="bg-red-50 border border-red-100 rounded p-3">
                        <div className="text-red-800 font-medium">
                          {timing.start} - {timing.end}
                        </div>
                        <div className="text-sm text-red-600 mt-1">{timing.description}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">No inauspicious timings available for this day.</div>
                )}
                
                {selectedDate.specialEvents && selectedDate.specialEvents.length > 0 && (
                  <>
                    <h3 className="font-semibold text-gray-800 mt-6 mb-3">Special Activities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDate.specialEvents.map((event, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {event}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {selectedDate.isFestival && selectedDate.festivalName && (
              <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">{selectedDate.festivalName} Information</h3>
                <p className="text-sm text-orange-700">
                  This is a placeholder for detailed information about {selectedDate.festivalName}. 
                  In a production environment, this would contain specific details about the festival, 
                  its significance, rituals, and traditions.
                </p>
                <div className="mt-3">
                  <button className="text-sm bg-orange-600 text-white px-4 py-1 rounded hover:bg-orange-700">
                    Book a Pooja for {selectedDate.festivalName}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Panchang Calendar</h1>
      <p className="text-gray-600 mb-8">
        View auspicious dates, festivals, and detailed panchang information for planning your ceremonies and rituals.
      </p>
      
      {view === 'month' ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          {renderCalendarHeader()}
          {renderCalendarDays()}
          
          <div className="mt-6 text-center">
            <div className="inline-flex items-center text-sm text-gray-600 mr-4">
              <span className="inline-block w-3 h-3 rounded-full bg-green-600 mr-1"></span>
              <span>Auspicious Day</span>
            </div>
            
            <div className="inline-flex items-center text-sm text-gray-600">
              <span className="inline-block w-3 h-3 rounded ring-1 ring-orange-300 mr-1"></span>
              <span>Festival</span>
            </div>
          </div>
        </div>
      ) : (
        renderDayView()
      )}
      
      <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">About Panchang</h2>
        <div className="prose max-w-none text-gray-600">
          <p>
            Panchang is the Hindu calendar and almanac, which follows traditional units of Hindu timekeeping, 
            and presents important dates and their calculations in a tabulated form. It is sometimes spelled Panchanga, 
            Pancanga, or Panchānga.
          </p>
          <p className="mt-4">
            The Panchang consists of five elements:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><span className="font-medium">Tithi:</span> The lunar day</li>
            <li><span className="font-medium">Nakshatra:</span> The constellation or star of the day</li>
            <li><span className="font-medium">Yoga:</span> The angular relationship between the sun and moon</li>
            <li><span className="font-medium">Karana:</span> Half of a tithi</li>
            <li><span className="font-medium">Vara:</span> The day of the week</li>
          </ul>
          <p className="mt-4 text-orange-600 font-medium">
            Use our Panchang Calendar to find auspicious times for ceremonies, rituals, and important life events.
          </p>
        </div>
      </div>
    </div>
  );
}
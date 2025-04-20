"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

type Temple = {
  id: string;
  name: string;
  location: string;
  streamUrl: string;
  thumbnailUrl: string;
  description: string;
  isLive: boolean;
  viewerCount?: number;
  nextStreamTime?: string;
};

const temples: Temple[] = [
  {
    id: '1',
    name: 'Vaishno Devi',
    location: 'Jammu, India',
    streamUrl: 'https://example.com/vaishno-devi-stream',
    thumbnailUrl: '/temples/vaishno-devi.jpg',
    description: 'Live darshan from the holy shrine of Mata Vaishno Devi',
    isLive: true,
    viewerCount: 2541
  },
  {
    id: '2',
    name: 'Kedarnath',
    location: 'Uttarakhand, India',
    streamUrl: 'https://example.com/kedarnath-stream',
    thumbnailUrl: '/temples/kedarnath.jpg',
    description: 'Live darshan from Kedarnath Temple, one of the 12 Jyotirlingas',
    isLive: true,
    viewerCount: 1932
  },
  {
    id: '3',
    name: 'Tirupati Balaji',
    location: 'Andhra Pradesh, India',
    streamUrl: 'https://example.com/tirupati-stream',
    thumbnailUrl: '/temples/tirupati.jpg',
    description: 'Live darshan from Sri Venkateswara Temple',
    isLive: true,
    viewerCount: 4567
  },
  {
    id: '4',
    name: 'Badrinath',
    location: 'Uttarakhand, India',
    streamUrl: 'https://example.com/badrinath-stream',
    thumbnailUrl: '/temples/badrinath.jpg',
    description: 'Live darshan from Badrinath Temple',
    isLive: false,
    nextStreamTime: '2023-10-15T08:00:00'
  },
  {
    id: '5',
    name: 'Kashi Vishwanath',
    location: 'Varanasi, India',
    streamUrl: 'https://example.com/kashi-stream',
    thumbnailUrl: '/temples/kashi.jpg',
    description: 'Live darshan from the sacred Kashi Vishwanath Temple',
    isLive: true,
    viewerCount: 3289
  },
  {
    id: '6',
    name: 'Somnath Temple',
    location: 'Gujarat, India',
    streamUrl: 'https://example.com/somnath-stream',
    thumbnailUrl: '/temples/somnath.jpg',
    description: 'Live darshan from Somnath Temple, first among the 12 Jyotirlingas',
    isLive: false,
    nextStreamTime: '2023-10-14T18:30:00'
  }
];

export default function LiveDarshan() {
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'live', 'upcoming'

  useEffect(() => {
    // Set the first live temple as default when component mounts
    const firstLiveTemple = temples.find(temple => temple.isLive);
    if (firstLiveTemple) {
      setSelectedTemple(firstLiveTemple);
    }
  }, []);

  const handleTempleSelect = (temple: Temple) => {
    setIsLoading(true);
    setSelectedTemple(temple);
    
    // Simulate loading time for stream
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const filteredTemples = temples.filter(temple => {
    if (filter === 'live') return temple.isLive;
    if (filter === 'upcoming') return !temple.isLive;
    return true; // 'all'
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Live Temple Darshan</h1>
      
      <p className="text-gray-600 mb-8">
        Experience the divine darshan of major temples across India from the comfort of your home. 
        Connect spiritually with live streams of aartis, poojas, and temple activities.
      </p>
      
      <div className={`grid ${isFullscreen ? '' : 'lg:grid-cols-3'} gap-8`}>
        {/* Main video player */}
        <div className={`${isFullscreen ? 'col-span-3' : 'lg:col-span-2'} bg-black rounded-lg overflow-hidden`}>
          {selectedTemple && (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
                  <span className="text-white ml-3">Loading stream...</span>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${selectedTemple.thumbnailUrl})`, filter: 'blur(8px)' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {selectedTemple.isLive ? (
                      <div className="w-full h-full bg-black">
                        <iframe 
                          src={selectedTemple.streamUrl} 
                          className="w-full h-full" 
                          title={`Live darshan from ${selectedTemple.name}`}
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <div className="text-center p-6 bg-black bg-opacity-70 rounded-lg">
                        <div className="text-gray-400 mb-2">Stream currently offline</div>
                        <h3 className="text-xl text-white font-semibold mb-3">{selectedTemple.name}</h3>
                        <div className="text-orange-400 mb-4">
                          Next scheduled darshan: {new Date(selectedTemple.nextStreamTime || '').toLocaleString()}
                        </div>
                        <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                          Set Reminder
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Video controls */}
          <div className="bg-gray-900 text-white p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-lg">{selectedTemple?.name}</h2>
                <p className="text-sm text-gray-300">{selectedTemple?.location}</p>
              </div>
              <div className="flex items-center space-x-4">
                {selectedTemple?.isLive && (
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                    <span className="text-sm">LIVE</span>
                    <span className="text-xs text-gray-400 ml-2">{selectedTemple?.viewerCount} watching</span>
                  </div>
                )}
                <button 
                  onClick={toggleFullscreen}
                  className="bg-gray-700 p-2 rounded hover:bg-gray-600"
                >
                  {isFullscreen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4H4v5m0 6v5h5v-5m6 0v5h5v-5m0-6V4h-5v5" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-300">{selectedTemple?.description}</p>
          </div>
        </div>
        
        {/* Temple listings */}
        {!isFullscreen && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Available Darshans</h3>
                  <div className="flex rounded-md shadow-sm">
                    <button 
                      className={`px-3 py-1 text-sm ${filter === 'all' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => setFilter('all')}
                    >
                      All
                    </button>
                    <button 
                      className={`px-3 py-1 text-sm ${filter === 'live' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => setFilter('live')}
                    >
                      Live
                    </button>
                    <button 
                      className={`px-3 py-1 text-sm ${filter === 'upcoming' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => setFilter('upcoming')}
                    >
                      Upcoming
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
                {filteredTemples.map(temple => (
                  <div 
                    key={temple.id} 
                    className={`flex items-center p-3 cursor-pointer hover:bg-orange-50 transition-colors duration-200 ${selectedTemple?.id === temple.id ? 'bg-orange-100' : ''}`}
                    onClick={() => handleTempleSelect(temple)}
                  >
                    <div className="relative h-16 w-24 rounded overflow-hidden flex-shrink-0">
                      <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${temple.thumbnailUrl})` }}
                      ></div>
                      {temple.isLive && (
                        <div className="absolute bottom-0 left-0 bg-red-600 text-xs text-white px-1 py-0.5 rounded-tr">
                          LIVE
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-grow">
                      <h4 className="font-medium text-gray-800">{temple.name}</h4>
                      <p className="text-xs text-gray-500">{temple.location}</p>
                      {temple.isLive ? (
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-400">{temple.viewerCount} watching</span>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 mt-1">
                          Next: {new Date(temple.nextStreamTime || '').toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 bg-orange-50 p-4 rounded-lg border border-orange-100">
              <h3 className="font-semibold text-orange-800 mb-2">Want to host your temple's live darshan?</h3>
              <p className="text-sm text-orange-700 mb-3">
                If you're a temple management and would like to stream live darshan to devotees worldwide, contact us for partnership opportunities.
              </p>
              <button className="bg-orange-600 text-white text-sm px-4 py-2 rounded hover:bg-orange-700">
                Partner With Us
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">About Live Darshan</h2>
        <div className="prose max-w-none text-gray-600">
          <p>
            Our Live Darshan service connects devotees from around the world to the divine energy of India's most revered temples. 
            Whether you're unable to travel or simply wish to maintain a daily spiritual connection, these live streams bring the temple atmosphere directly to your home.
          </p>
          <p className="mt-4">
            All streams are provided in cooperation with the respective temple authorities. The schedule may vary based on temple timings and special festivals.
            For specific aarti or ceremony timings, please check the temple's official schedule.
          </p>
          <p className="mt-4 text-orange-600 font-medium">
            BookMyPanditJi is committed to making spiritual experiences accessible to everyone, everywhere.
          </p>
        </div>
      </div>
    </div>
  );
}
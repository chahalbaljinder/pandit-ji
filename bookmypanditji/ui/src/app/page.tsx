import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import ChatBot from '@/components/ChatBot';
import PanchangCalendar from '@/components/panchang/PanchangCalendar';

// Placeholder for framer-motion import
// In production, use actual framer-motion with proper imports
const motion = {
  div: (props: any) => <div {...props}>{props.children}</div>
};

// Mock data for featured services
const featuredServices = [
  {
    id: 1,
    title: 'Griha Pravesh',
    description: 'House warming ceremony for your new home',
    imageUrl: '/services/griha-pravesh.jpg',
    price: '₹5,000',
    duration: '3 hours'
  },
  {
    id: 2,
    title: 'Satyanarayan Puja',
    description: 'Sacred ritual dedicated to Lord Vishnu',
    imageUrl: '/services/satyanarayan.jpg',
    price: '₹3,500',
    duration: '2 hours'
  },
  {
    id: 3,
    title: 'Wedding Ceremony',
    description: 'Complete wedding rituals as per traditions',
    imageUrl: '/services/wedding.jpg',
    price: '₹25,000',
    duration: '6-8 hours'
  },
  {
    id: 4,
    title: 'Baby Naming Ceremony',
    description: 'Namkaran sanskar for your newborn',
    imageUrl: '/services/naming.jpg',
    price: '₹4,500',
    duration: '2 hours'
  }
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ChatBot floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Suspense fallback={<div className="w-12 h-12 rounded-full bg-orange-500"></div>}>
          <ChatBot />
        </Suspense>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-orange-400 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Book Verified Pandits for Your Sacred Ceremonies
              </h1>
              <p className="text-lg mb-8">
                Connect with experienced and verified pandits for all your religious ceremonies and pujas. Book with confidence.
              </p>
              <div className="space-x-4">
                <Link href="/services" className="bg-white text-orange-600 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition inline-block">
                  Book Now
                </Link>
                <Link href="/services" className="bg-orange-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-800 transition inline-block">
                  View Services
                </Link>
              </div>
            </div>
            <div className="hidden md:block animate-fade-in-right">
              {/* Placeholder for hero image */}
              <div className="bg-orange-300 h-64 rounded-lg flex items-center justify-center">
                <p className="text-white text-lg">Hero Image Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Panchang and Services Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Panchang Calendar */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Panchang Calendar</h2>
              <PanchangCalendar />
            </div>
            
            {/* Featured Services */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Popular Services</h2>
                <Link href="/services" className="text-orange-600 hover:text-orange-800">
                  View All
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {featuredServices.map(service => (
                  <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                    <div className="h-40 bg-gray-200 relative">
                      {/* Replace with actual images in production */}
                      <div className="absolute inset-0 bg-orange-100 flex items-center justify-center">
                        <p className="text-orange-600">{service.title} Image</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-800">{service.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-bold text-orange-600">{service.price}</span>
                        <span className="text-sm text-gray-500">{service.duration}</span>
                      </div>
                      <Link 
                        href={`/services#${service.id}`}
                        className="mt-4 block text-center bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Why Choose BookMyPanditJi</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
              We connect you with verified and experienced pandits for all your religious ceremonies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mt-4">Verified Pandits</h3>
              <p className="mt-2 text-gray-600">
                All our pandits are thoroughly verified and experienced in performing various religious ceremonies
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mt-4">On-Demand Booking</h3>
              <p className="mt-2 text-gray-600">
                Need a pandit urgently? Our premium service can arrange qualified pandits on short notice
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mt-4">Secure Payments</h3>
              <p className="mt-2 text-gray-600">
                Safe and secure payment options including digital wallet for faster transactions
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Live Darshan Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Live Temple Darshan</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
              Experience virtual darshan from major temples across India
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['Vaishno Devi', 'Tirupati Balaji', 'Kashi Vishwanath', 'Somnath Temple'].map((temple, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
                    <p className="text-blue-600">{temple} Image</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{temple}</h3>
                  <div className="mt-4 text-center">
                    <Link 
                      href="#"
                      className="inline-flex items-center text-orange-600 hover:text-orange-800"
                    >
                      <span>Watch Live</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

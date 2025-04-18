'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import BookingForm from '@/components/BookingForm';
import BookingConfirmation from '@/components/BookingConfirmation';

// Mock pandit data - in a real application, this would come from an API
const mockPandits = [
  {
    id: 1,
    name: "Pandit Ramesh Sharma",
    rating: 4.8,
    reviewCount: 124,
    location: "Delhi, India",
    experience: 15,
    languages: ["Hindi", "English", "Sanskrit"],
    price: 3500,
    availability: ["Weekdays", "Weekends"],
    about: "Pandit Ramesh Sharma is a highly experienced Vedic priest with over 15 years of experience performing various Hindu rituals and ceremonies. He specializes in Vastu consultations, marriage ceremonies, and house warming pujas. He has deep knowledge of traditional Sanskrit mantras and their significance in various rituals.",
    services: [
      {
        name: "Griha Pravesh Puja",
        description: "Traditional house warming ceremony",
        price: 5000
      },
      {
        name: "Vivah (Wedding) Ceremony",
        description: "Complete traditional Hindu wedding rituals",
        price: 15000
      },
      {
        name: "Satyanarayan Puja",
        description: "Ritual worship of Lord Vishnu",
        price: 3500
      },
      {
        name: "Vastu Consultation",
        description: "Analysis and remedies for home/office",
        price: 2500
      }
    ],
    qualifications: [
      "Masters in Sanskrit from Delhi University",
      "Certified Vastu Consultant",
      "Specialized training in Vedic rituals from Kashi Vishwanath Temple"
    ],
    reviews: [
      {
        name: "Suresh Kumar",
        rating: 5,
        comment: "Pandit ji conducted our house warming ceremony with great devotion. His knowledge of rituals is exceptional."
      },
      {
        name: "Priya Sharma",
        rating: 4,
        comment: "Very professional and punctual. Explained the significance of each ritual patiently."
      },
      {
        name: "Ankit Gupta",
        rating: 5,
        comment: "We had Pandit ji for our daughter's wedding. The ceremony was beautiful and authentic."
      }
    ],
    image: "/pandit1.jpg"
  },
  {
    id: 2,
    name: "Acharya Vinod Tiwari",
    rating: 4.9,
    reviewCount: 87,
    location: "Mumbai, India",
    experience: 20,
    languages: ["Hindi", "Marathi", "Sanskrit"],
    price: 4000,
    availability: ["Weekends", "Morning Hours"],
    about: "Acharya Vinod Tiwari is a renowned Vedic scholar with 20 years of experience in conducting various pujas and rituals. He is known for his in-depth knowledge of Vedic scriptures and precise execution of rituals. He specializes in astrological consultations and remedy rituals.",
    services: [
      {
        name: "Graha Shanti Puja",
        description: "Planetary peace ritual",
        price: 4500
      },
      {
        name: "Kaal Sarp Dosh Nivaran",
        description: "Remedy for Kaal Sarp yoga in horoscope",
        price: 6000
      },
      {
        name: "Navgraha Shanti",
        description: "Peace ritual for all nine planets",
        price: 5500
      },
      {
        name: "Rudrabhishek",
        description: "Special abhishekam to Lord Shiva",
        price: 3800
      }
    ],
    qualifications: [
      "Doctorate in Astrology from Mumbai University",
      "Jyotish Acharya certification",
      "10 years of training at Varanasi"
    ],
    reviews: [
      {
        name: "Rajiv Mehta",
        rating: 5,
        comment: "Acharya ji's Graha Shanti Puja was very effective. Noticed positive changes within weeks."
      },
      {
        name: "Meera Patel",
        rating: 5,
        comment: "His knowledge of astrology is incredible. The remedies he suggested worked wonders."
      },
      {
        name: "Sanjay Desai",
        rating: 4,
        comment: "Very authentic and traditional approach. Explains everything clearly."
      }
    ],
    image: "/pandit2.jpg"
  },
  {
    id: 3,
    name: "Pandit Krishna Pandey",
    rating: 4.7,
    reviewCount: 63,
    location: "Bangalore, India",
    experience: 12,
    languages: ["Hindi", "English", "Kannada", "Sanskrit"],
    price: 3000,
    availability: ["All Days"],
    about: "Pandit Krishna Pandey has been serving the community with his expertise in Vedic rituals for over 12 years. He is particularly known for his soothing chanting of mantras and thorough knowledge of Puja procedures. He specializes in child naming ceremonies and annual homams.",
    services: [
      {
        name: "Naamkaran Sanskar",
        description: "Child naming ceremony",
        price: 3500
      },
      {
        name: "Annual Homam",
        description: "Yearly ritual for family prosperity",
        price: 4000
      },
      {
        name: "Ganesh Puja",
        description: "Special puja to Lord Ganesha",
        price: 2500
      },
      {
        name: "Lakshmi Puja",
        description: "Prosperity ritual to Goddess Lakshmi",
        price: 3000
      }
    ],
    qualifications: [
      "Traditional Gurukul Education from Udupi",
      "Specialized in Kannada Vedic traditions",
      "Certificate in Sanskrit Chanting"
    ],
    reviews: [
      {
        name: "Kiran Rao",
        rating: 5,
        comment: "Pandit Krishna conducted our son's naming ceremony beautifully. Very knowledgeable about traditions."
      },
      {
        name: "Lakshmi Narayan",
        rating: 4,
        comment: "Our annual homam was conducted with great precision and devotion."
      },
      {
        name: "Shwetha Kumar",
        rating: 5,
        comment: "His Ganesh Puja was very authentic and energizing for our new business."
      }
    ],
    image: "/pandit3.jpg"
  }
];

export default function PanditProfile() {
  const { id } = useParams();
  const panditId = typeof id === 'string' ? parseInt(id) : 1;
  
  // In a real app, we'd fetch this data from an API based on the ID
  const pandit = mockPandits.find(p => p.id === panditId) || mockPandits[0];
  
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleBookingComplete = () => {
    setShowBookingForm(false);
    setShowConfirmation(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button onClick={() => window.history.back()} className="flex items-center text-orange-600 hover:text-orange-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to search results
          </button>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="h-24 w-24 bg-orange-100 rounded-full flex items-center justify-center mr-6 mb-4 md:mb-0">
                <span className="text-3xl font-bold text-orange-600">{pandit.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{pandit.name}</h1>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 ${i < pandit.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-gray-600 text-sm ml-2">({pandit.reviewCount} reviews)</span>
                  </div>
                  <span className="mx-2 text-gray-300">|</span>
                  <div className="text-green-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  <span className="inline-flex items-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {pandit.location}
                  </span>
                  <span className="inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {pandit.experience} years of experience
                  </span>
                </p>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <strong className="font-medium">Languages:</strong> {pandit.languages.join(', ')}
                  </p>
                  <p className="text-gray-600">
                    <strong className="font-medium">Price:</strong> <span className="text-orange-600 font-semibold">₹{pandit.price}</span> per ceremony
                  </p>
                  <p className="text-gray-600">
                    <strong className="font-medium">Availability:</strong> {pandit.availability.join(', ')}
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <button 
                  onClick={() => setShowBookingForm(true)}
                  className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-gray-600">
                {pandit.about}
              </p>
            </div>

            {/* Services Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Services Offered</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pandit.services.map((service, index) => (
                  <div key={index} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      <p className="text-sm text-orange-600 font-semibold mt-1">₹{service.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Qualification Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Qualifications</h2>
              <ul className="space-y-2">
                {pandit.qualifications.map((qualification, index) => (
                  <li key={index} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    {qualification}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Reviews</h2>
                <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {pandit.rating} / 5 ({pandit.reviewCount} reviews)
                </span>
              </div>
              <div className="space-y-6">
                {pandit.reviews.map((review, index) => (
                  <div key={index} className={index !== pandit.reviews.length - 1 ? "pb-6 border-b border-gray-200" : ""}>
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">{review.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{review.name}</h4>
                        <div className="flex items-center">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i}
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-1">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            {showBookingForm ? (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Book This Pandit</h2>
                  <button onClick={() => setShowBookingForm(false)} className="text-gray-400 hover:text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <BookingForm 
                  panditId={pandit.id} 
                  services={pandit.services}
                  onBookingComplete={handleBookingComplete}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-4">Why Choose {pandit.name.split(' ')[0]}?</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">{pandit.experience} years of experience performing rituals</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">In-depth knowledge of Vedic rituals and traditions</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Highly rated with {pandit.reviewCount} positive reviews</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Flexible schedule and availability</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Performs rituals in {pandit.languages.join(', ')}</span>
                  </li>
                </ul>
                
                <div className="mt-6 space-y-4">
                  <button 
                    onClick={() => setShowBookingForm(true)}
                    className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition"
                  >
                    Book Now
                  </button>
                  <a 
                    href={`tel:+919876543210`} 
                    className="w-full border border-orange-600 text-orange-600 px-4 py-2 rounded-md hover:bg-orange-50 transition flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Contact Pandit
                  </a>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-gray-800 mb-2">Upcoming Availability</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div 
                        key={index}
                        className={`text-center p-2 rounded ${pandit.availability.includes('Weekends') && (day === 'Sat' || day === 'Sun') ? 'bg-green-50 text-green-700' : pandit.availability.includes('Weekdays') && day !== 'Sat' && day !== 'Sun' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Green indicates availability. Book early to secure your preferred date and time.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <BookingConfirmation 
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        panditName={pandit.name}
      />
    </div>
  );
}
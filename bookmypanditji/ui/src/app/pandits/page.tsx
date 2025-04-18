'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PanditsSearch() {
  const [filters, setFilters] = useState({
    location: '',
    expertise: '',
    language: '',
    date: '',
    rating: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find a Pandit</h1>
          <p className="text-lg text-gray-600">
            Choose from our verified pandits for your religious ceremonies
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">All Locations</option>
                <option value="delhi">Delhi</option>
                <option value="mumbai">Mumbai</option>
                <option value="bangalore">Bangalore</option>
                <option value="kolkata">Kolkata</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expertise</label>
              <select
                name="expertise"
                value={filters.expertise}
                onChange={handleFilterChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">All Services</option>
                <option value="wedding">Wedding Ceremonies</option>
                <option value="grihaPravesh">Griha Pravesh</option>
                <option value="satyanarayan">Satyanarayan Puja</option>
                <option value="namkaran">Naming Ceremony</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                name="language"
                value={filters.language}
                onChange={handleFilterChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">All Languages</option>
                <option value="hindi">Hindi</option>
                <option value="sanskrit">Sanskrit</option>
                <option value="marathi">Marathi</option>
                <option value="gujarati">Gujarati</option>
                <option value="tamil">Tamil</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pandits.map((pandit) => (
            <div key={pandit.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="p-4 border-b">
                <div className="flex items-start">
                  <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-orange-600">{pandit.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{pandit.name}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i}
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-4 w-4 ${i < pandit.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-600 text-sm ml-2">({pandit.reviewCount} reviews)</span>
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      {pandit.location}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {pandit.expertise.map((skill, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Languages</h4>
                  <p className="text-gray-600 text-sm">{pandit.languages.join(', ')}</p>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Experience</h4>
                  <p className="text-gray-600 text-sm">{pandit.experience} years</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold text-orange-600">₹{pandit.price}/ceremony</div>
                  <Link href={`/pandits/${pandit.id}`} className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition">
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 rounded border border-gray-300 bg-orange-600 text-white hover:bg-orange-700">1</button>
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50">2</button>
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50">3</button>
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50">Next</button>
          </nav>
        </div>
      </div>
    </div>
  );
}

const pandits = [
  {
    id: 1,
    name: 'Pandit Rajesh Sharma',
    rating: 5,
    reviewCount: 124,
    location: 'Delhi, India',
    expertise: ['Wedding Ceremony', 'Griha Pravesh', 'Satyanarayan Puja'],
    languages: ['Hindi', 'Sanskrit', 'English'],
    experience: 15,
    price: 5000,
    availability: ['Morning', 'Evening']
  },
  {
    id: 2,
    name: 'Pandit Mukesh Joshi',
    rating: 4,
    reviewCount: 98,
    location: 'Mumbai, India',
    expertise: ['Baby Naming', 'Birthday Ceremony', 'Satyanarayan Puja'],
    languages: ['Hindi', 'Marathi', 'English'],
    experience: 12,
    price: 4500,
    availability: ['Morning', 'Afternoon', 'Evening']
  },
  {
    id: 3,
    name: 'Acharya Devendra Trivedi',
    rating: 5,
    reviewCount: 156,
    location: 'Bangalore, India',
    expertise: ['Wedding Ceremony', 'Griha Pravesh', 'Yoga'],
    languages: ['Hindi', 'Sanskrit', 'English', 'Kannada'],
    experience: 20,
    price: 6000,
    availability: ['Morning', 'Evening']
  },
  {
    id: 4,
    name: 'Pandit Srinivas Acharya',
    rating: 4,
    reviewCount: 87,
    location: 'Chennai, India',
    expertise: ['Baby Naming', 'Birthday Ceremony', 'House Warming'],
    languages: ['Tamil', 'Sanskrit', 'English'],
    experience: 10,
    price: 4000,
    availability: ['Morning', 'Afternoon']
  },
  {
    id: 5,
    name: 'Pandit Krishna Pandey',
    rating: 5,
    reviewCount: 112,
    location: 'Kolkata, India',
    expertise: ['Wedding Ceremony', 'Funeral Rites', 'Satyanarayan Puja'],
    languages: ['Bengali', 'Hindi', 'Sanskrit'],
    experience: 18,
    price: 5500,
    availability: ['Morning', 'Evening']
  },
  {
    id: 6,
    name: 'Acharya Vishal Shastri',
    rating: 4,
    reviewCount: 72,
    location: 'Pune, India',
    expertise: ['Griha Pravesh', 'Vastu Consultation', 'Car Puja'],
    languages: ['Marathi', 'Hindi', 'English'],
    experience: 8,
    price: 3500,
    availability: ['Morning', 'Afternoon', 'Evening']
  }
];
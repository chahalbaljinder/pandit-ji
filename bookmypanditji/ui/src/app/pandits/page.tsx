'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePandits, useServiceCategories } from '@/hooks/useApi';
import { PanditSearchParams } from '@/lib/api';

export default function PanditsSearch() {
  const [filters, setFilters] = useState<PanditSearchParams>({
    page: 1,
    limit: 12,
    city: '',
    specialization: '',
    language: '',
    minRating: undefined,
    maxPrice: undefined,
    sortBy: 'rating',
    sortOrder: 'desc',
  });

  const { data, isLoading, error, refetch } = usePandits(filters);

  const handleFilterChange = (name: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, refetch]);

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
                name="city"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">All Locations</option>
                <option value="delhi">Delhi</option>
                <option value="mumbai">Mumbai</option>
                <option value="bangalore">Bangalore</option>
                <option value="kolkata">Kolkata</option>
                <option value="chennai">Chennai</option>
                <option value="pune">Pune</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="ahmedabad">Ahmedabad</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expertise</label>
              <select
                name="specialization"
                value={filters.specialization}
                onChange={(e) => handleFilterChange('specialization', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">All Services</option>
                <option value="wedding">Wedding Ceremonies</option>
                <option value="grihaPravesh">Griha Pravesh</option>
                <option value="satyanarayan">Satyanarayan Puja</option>
                <option value="namkaran">Naming Ceremony</option>
                <option value="ganesh">Ganesh Puja</option>
                <option value="vastu">Vastu Shanti</option>
                <option value="funeral">Funeral Rituals</option>
                <option value="navgraha">Navgraha Shanti</option>
                <option value="mata">Mata Ki Chowki</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                name="language"
                value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">All Languages</option>
                <option value="hindi">Hindi</option>
                <option value="sanskrit">Sanskrit</option>
                <option value="english">English</option>
                <option value="marathi">Marathi</option>
                <option value="tamil">Tamil</option>
                <option value="telugu">Telugu</option>
                <option value="bengali">Bengali</option>
                <option value="gujarati">Gujarati</option>
                <option value="kannada">Kannada</option>
                <option value="malayalam">Malayalam</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
              <select
                name="minRating"
                value={filters.minRating || ''}
                onChange={(e) => handleFilterChange('minRating', e.target.value ? parseInt(e.target.value) : undefined)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">Any</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <select
                name="maxPrice"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">Any</option>
                <option value="10000">₹10,000</option>
                <option value="7500">₹7,500</option>
                <option value="5000">₹5,000</option>
                <option value="3000">₹3,000</option>
                <option value="2000">₹2,000</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={handleSearch}
              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Search Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        )} else if (error) {
          <div className="text-center py-12 text-red-600">
            Failed to load pandits. Please try again.
          </div>
        )} else if (data?.data?.length === 0) {
          <div className="text-center py-12 text-gray-500">
            No pandits found matching your criteria.
          </div>
        )} else {
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.data?.map((pandit) => (
                <div key={pandit.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="p-4 border-b">
                    <div className="flex items-start">
                      <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-xl font-bold text-orange-600">{pandit.user?.name?.charAt(0) || 'P'}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{pandit.user?.name || 'Pandit'}</h3>
                        <div className="flex items-center mt-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i}
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-4 w-4 ${i < Math.floor(pandit.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-gray-600 text-sm ml-2">({pandit.reviewCount || 0} reviews)</span>
                        </div>
                        <div className="text-gray-600 text-sm mt-1">
                          {pandit.serviceCities?.join(', ') || 'Location not specified'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {pandit.specializations?.map((skill: string, index: number) => (
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
                      <p className="text-gray-600 text-sm">{pandit.languages?.join(', ') || 'Not specified'}</p>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Experience</h4>
                      <p className="text-gray-600 text-sm">{pandit.experienceYears || 0} years</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-semibold text-orange-600">₹{pandit.basePrice}/ceremony</div>
                      <Link href={`/pandits/${pandit.id}`} className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition">
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button 
                onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1 )))}}
                disabled={(data?.meta?.page || 1) <= 1}
                className="px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: data?.meta?.totalPages || 1 }, (_, i) => i + 1).slice(0, 5).map((page) => (
                <button 
                  key={page}
                  onClick={() => setFilters(prev => ({ ...prev, page }))}
                  className={`px-3 py-1 rounded border border-gray-300 ${filters.page === page ? 'bg-orange-600 text-white hover:bg-orange-700' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 )))}
                disabled={(data?.meta?.page || 1) >= (data?.meta?.totalPages || 1)}
                className="px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useServices, useServiceCategories } from '@/hooks/useApi';
import { ServiceCategory } from '@/lib/api';

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const { data: servicesResponse, isLoading, refetch } = useServices({ limit: 50 });
  const { data: categoriesData } = useServiceCategories();

  const services = servicesResponse?.data || [];
  const categories = categoriesData || [];

  const handleCategoryClick = (cat: ServiceCategory | 'all') => {
    setSelectedCategory(cat);
  };

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-xl p-8 mb-10 text-white">
            <h1 className="text-3xl font-bold mb-4 text-center">Our Puja Services</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-orange-100" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const { data: servicesResponse, isLoading, refetch } = useServices({ limit: 50 });
  const { data: categoriesData } = useServiceCategories();

  const services = servicesResponse?.data || [];
  const categories = categoriesData || [];

  const handleCategoryClick = (cat: ServiceCategory | 'all') => {
    setSelectedCategory(cat);
  };

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-xl p-8 mb-10 text-white">
            <h1 className="text-3xl font-bold mb-4 text-center">Our Puja Services</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-orange-100" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const { data: servicesResponse, isLoading, refetch } = useServices({ limit: 50 });
  const { data: categoriesData } = useServiceCategories();

  const services = servicesResponse?.data || [];
  const categories = categoriesData || [];

  const handleCategoryClick = (cat: ServiceCategory | 'all') => {
    setSelectedCategory(cat);
  };

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-xl p-8 mb-10 text-white">
            <h1 className="text-3xl font-bold mb-4 text-center">Our Puja Services</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-orange-100" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const { data: servicesResponse, isLoading, refetch } = useServices({ limit: 50 });
  const { data: categoriesData } = useServiceCategories();

  const services = servicesResponse?.data || [];
  const categories = categoriesData || [];

  const handleCategoryClick = (cat: ServiceCategory | 'all') => {
    setSelectedCategory(cat);
  };

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-xl p-8 mb-10 text-white">
          <h1 className="text-3xl font-bold mb-4 text-center">Our Puja Services</h1>
          <p className="text-lg max-w-3xl mx-auto text-center">
            Explore our comprehensive range of traditional puja and ceremony services performed by our verified pandits with authentic rituals and traditions.
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-10">
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => handleCategoryClick('all')}
              className={`px-4 py-2 bg-white rounded-full shadow-sm ${selectedCategory === 'all' ? 'text-orange-600 bg-orange-50' : 'text-orange-600 hover:bg-orange-50'} transition`}
            >
              All Services
            </button>
            {categories.map((category: ServiceCategory) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 bg-white rounded-full shadow-sm ${selectedCategory === category ? 'text-orange-600 bg-orange-50' : 'text-orange-600 hover:bg-orange-50'} transition`}
              >
                {category.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Services by Category */}
        {categories.map((category) => (
          <div key={category} id={category} className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">{category.replace('_', ' ')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.filter(service => service.category === category).map((service) => (
                <Link key={service.id} href={`/products/${service.id}`} className="block">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                    <div className="h-48 bg-orange-100 flex items-center justify-center">
                      <div className="text-center px-4">
                        <div className="text-3xl text-orange-600 mb-2">
                          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 border-2 border-orange-200">
                            🕉️
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                      <p className="text-gray-600 mb-4">{service.shortDesc || service.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{service.durationMinutes} minutes</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Starting Price:</span>
                          <span className="font-medium text-orange-600">₹{Number(service.basePrice).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition">
                          Book Now
                        </button>
                        <Link href={`/products/${service.id}`} className="px-4 py-2 border border-orange-600 text-orange-600 rounded-md hover:bg-orange-50 transition">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
        <div className="bg-white rounded-lg shadow-md p-8 mb-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Need a Custom Puja?</h2>
            <p className="text-gray-600 mb-6">
              Don&apos;t see what you&apos;re looking for? We can arrange custom pujas and ceremonies tailored to your specific requirements.
            </p>
            <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition">
              Request Custom Service
            </button>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const faqs = [
  {
    question: "What preparations do I need to make before a puja?",
    answer: "For most pujas, we recommend cleaning the area where the ceremony will be performed. Our pandit will guide you about specific requirements for your chosen service. We can also arrange for the puja samagri (materials) to be delivered to you before the ceremony."
  },
  {
    question: "How far in advance should I book a service?",
    answer: "We recommend booking at least 7-10 days in advance for regular pujas and 15-30 days for wedding ceremonies and major life events to ensure availability of our experienced pandits."
  },
  {
    question: "Can I request a specific language for the ceremony?",
    answer: "Yes, you can specify your language preference during booking. Our pandits can perform ceremonies in various languages including Hindi, Sanskrit, Tamil, Telugu, Marathi, Gujarati, and English explanations."
  },
  {
    question: "Do you provide puja samagri (materials)?",
    answer: "Yes, we can arrange all necessary puja materials for an additional fee. You can select this option during the booking process."
  },
  {
    question: "Can I reschedule my booking?",
    answer: "Yes, bookings can be rescheduled up to 48 hours before the scheduled time without any additional charge. For any changes made within 48 hours, a rescheduling fee may apply."
  }
];
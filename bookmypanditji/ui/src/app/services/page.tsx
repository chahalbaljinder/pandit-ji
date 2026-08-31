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
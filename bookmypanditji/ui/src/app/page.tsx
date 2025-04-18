import Image from 'next/image';
import { Suspense } from 'react';

// Placeholder for framer-motion import
// In production, use actual framer-motion with proper imports
const motion = {
  div: (props: any) => <div {...props}>{props.children}</div>
};

export default function Home() {
  return (
    <div className="min-h-screen">
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
                <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition">
                  Book Now
                </button>
                <button className="bg-orange-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-800 transition">
                  View Services
                </button>
              </div>
            </div>
            <div className="hidden md:block animate-fade-in-right">
              <div className="relative w-full h-[400px] bg-orange-200 rounded-lg shadow-xl flex items-center justify-center">
                <div className="text-orange-800 text-2xl font-semibold">Temple Illustration</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-6 -mt-16 relative z-10 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Find a Pandit for your ceremony</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ceremony Type</label>
                <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                  <option>Select ceremony</option>
                  <option>Griha Pravesh</option>
                  <option>Satyanarayan Puja</option>
                  <option>Wedding Ceremony</option>
                  <option>Baby Naming</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                  <option>Select city</option>
                  <option>Delhi</option>
                  <option>Mumbai</option>
                  <option>Bangalore</option>
                  <option>Kolkata</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
              </div>
              <div className="flex items-end">
                <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose BookMyPanditJi?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Pandits</h3>
              <p className="text-gray-600">All our pandits are thoroughly verified and experienced in performing various religious ceremonies.</p>
            </motion.div>
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">Simple and hassle-free booking process with instant confirmation and reminders.</p>
            </motion.div>
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">Multiple payment options with secure transaction processing and booking guarantee.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {popularServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="relative h-48 bg-orange-100 flex items-center justify-center">
                  <div className="text-orange-800 font-medium">{service.name}</div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="inline-flex items-center px-6 py-3 border border-orange-600 text-orange-600 rounded-md hover:bg-orange-600 hover:text-white transition">
              View All Services
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-2xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Select Service</h3>
              <p className="text-gray-600">Choose from a wide range of religious ceremonies and pujas</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-2xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Choose Pandit</h3>
              <p className="text-gray-600">Select from verified pandits based on ratings and expertise</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-2xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Book & Pay</h3>
              <p className="text-gray-600">Schedule a date and time and make secure payment</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-2xl font-bold mb-4">4</div>
              <h3 className="text-xl font-semibold mb-2">Attend Ceremony</h3>
              <p className="text-gray-600">Experience a seamless and sacred ceremony</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.comment}</p>
                <p className="text-gray-500 text-sm mt-2">{testimonial.service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Download Our Mobile App</h2>
              <p className="text-lg text-gray-600 mb-6">Get the BookMyPanditJi app for a seamless booking experience. Book pandits, track ceremonies, and manage payments on the go.</p>
              <div className="flex space-x-4">
                <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  App Store
                </button>
                <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  Google Play
                </button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-[300px] h-[500px] bg-white rounded-3xl shadow-xl border-8 border-gray-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xl font-semibold text-gray-400">App Screenshot</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const popularServices = [
  {
    name: "Griha Pravesh",
    description: "House warming ceremony for your new home with proper rituals and traditions.",
    image: "/services/griha-pravesh.jpg"
  },
  {
    name: "Satyanarayan Puja",
    description: "Traditional worship of Lord Vishnu performed on special occasions.",
    image: "/services/satyanarayan.jpg"
  },
  {
    name: "Baby Naming Ceremony",
    description: "Namkaran ceremony to bless and name your little one with traditional rituals.",
    image: "/services/namkaran.jpg"
  },
  {
    name: "Wedding Ceremony",
    description: "Complete wedding rituals and ceremonies according to Hindu traditions.",
    image: "/services/wedding.jpg"
  }
];

const testimonials = [
  {
    name: "Rajesh Sharma",
    rating: 5,
    comment: "We booked a pandit for our house warming ceremony. The service was excellent and the pandit was very knowledgeable.",
    service: "Griha Pravesh"
  },
  {
    name: "Priya Patel",
    rating: 5,
    comment: "Very professional service. The pandit was punctual and performed all the rituals perfectly for our baby's naming ceremony.",
    service: "Baby Naming Ceremony"
  },
  {
    name: "Anil Reddy",
    rating: 4,
    comment: "Good service overall. The pandit was well-versed with all the rituals and guided us through the entire process.",
    service: "Satyanarayan Puja"
  }
];

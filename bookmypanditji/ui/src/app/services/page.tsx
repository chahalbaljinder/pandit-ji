export default function ServicesPage() {
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
            {serviceCategories.map((category) => (
              <a 
                key={category.id} 
                href={`#${category.id}`}
                className="px-4 py-2 bg-white rounded-full shadow-sm text-orange-600 hover:bg-orange-50 transition"
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>

        {/* Services by Category */}
        {serviceCategories.map((category) => (
          <div key={category.id} id={category.id} className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">{category.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.filter(service => service.categoryId === category.id).map((service) => (
                <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="h-48 bg-orange-100 flex items-center justify-center">
                    <div className="text-center px-4">
                      <div className="text-3xl text-orange-600 mb-2">
                        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 border-2 border-orange-200">
                          {service.icon}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{service.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Starting Price:</span>
                        <span className="font-medium text-orange-600">₹{service.price}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition">
                        Book Now
                      </button>
                      <button className="px-4 py-2 border border-orange-600 text-orange-600 rounded-md hover:bg-orange-50 transition">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Custom Request Section */}
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

        {/* FAQ Section */}
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

const serviceCategories = [
  { id: 'life-events', name: 'Life Events & Celebrations' },
  { id: 'home-pujas', name: 'Home & Property Pujas' },
  { id: 'festival', name: 'Festival & Seasonal Ceremonies' },
  { id: 'spiritual', name: 'Spiritual & Remedial Pujas' }
];

const services = [
  {
    id: 1,
    categoryId: 'life-events',
    name: 'Wedding Ceremony',
    icon: '💍',
    description: 'Complete traditional Hindu wedding ceremony including pre-wedding rituals following all customs and traditions.',
    duration: '4-6 hours',
    price: 15000,
    materialsList: ['Havan Samagri', 'Kalash', 'Flowers', 'Sindoor', 'Mangalsutra'],
  },
  {
    id: 2,
    categoryId: 'life-events',
    name: 'Baby Naming Ceremony (Namkaran)',
    icon: '👶',
    description: 'Traditional naming ceremony for newborns with rituals to bless the child with prosperity and happiness.',
    duration: '2-3 hours',
    price: 5000,
    materialsList: ['Puja Thali', 'Flowers', 'Fruits', 'Sweets'],
  },
  {
    id: 3,
    categoryId: 'life-events',
    name: 'Thread Ceremony (Janeu)',
    icon: '🧵',
    description: 'Sacred thread ceremony marking the beginning of formal education and spiritual journey.',
    duration: '3-4 hours',
    price: 8000,
    materialsList: ['Sacred Thread', 'Havan Samagri', 'New Clothes'],
  },
  {
    id: 4,
    categoryId: 'home-pujas',
    name: 'Griha Pravesh',
    icon: '🏠',
    description: 'House warming ceremony performed when entering a new home to invite positive energy and prosperity.',
    duration: '2-3 hours',
    price: 6000,
    materialsList: ['Kalash', 'Coconut', 'Rice', 'Flowers'],
  },
  {
    id: 5,
    categoryId: 'home-pujas',
    name: 'Vastu Shanti',
    icon: '🧭',
    description: 'Ceremony performed to neutralize negative energies and enhance positive vibrations in a property.',
    duration: '2-3 hours',
    price: 7000,
    materialsList: ['Havan Samagri', 'Copper Vessel', 'Various Herbs'],
  },
  {
    id: 6,
    categoryId: 'home-pujas',
    name: 'Car/Vehicle Puja',
    icon: '🚗',
    description: 'Blessing ceremony for new vehicles to ensure safety and protection during journeys.',
    duration: '30-60 minutes',
    price: 2500,
    materialsList: ['Flowers', 'Coconut', 'Red Cloth'],
  },
  {
    id: 7,
    categoryId: 'festival',
    name: 'Satyanarayan Puja',
    icon: '🙏',
    description: 'Traditional worship of Lord Vishnu performed on auspicious occasions and full moon days.',
    duration: '2-3 hours',
    price: 5000,
    materialsList: ['Banana Leaves', 'Flowers', 'Fruits', 'Sweets'],
  },
  {
    id: 8,
    categoryId: 'festival',
    name: 'Ganesh Chaturthi Puja',
    icon: '🐘',
    description: 'Special puja to celebrate the birth of Lord Ganesha, the remover of obstacles.',
    duration: '2-3 hours',
    price: 4500,
    materialsList: ['Modak', 'Durva Grass', 'Red Flowers'],
  },
  {
    id: 9,
    categoryId: 'festival',
    name: 'Diwali Puja',
    icon: '🪔',
    description: 'Festival of lights celebration with Lakshmi and Ganesh puja to invite prosperity and wealth.',
    duration: '1-2 hours',
    price: 4000,
    materialsList: ['Diyas', 'Sweets', 'Flowers', 'Coins'],
  },
  {
    id: 10,
    categoryId: 'spiritual',
    name: 'Rudra Abhishek',
    icon: '🕉️',
    description: 'Powerful ritual dedicated to Lord Shiva for blessing, purification and spiritual growth.',
    duration: '2-3 hours',
    price: 7500,
    materialsList: ['Milk', 'Honey', 'Yogurt', 'Bilva Leaves'],
  },
  {
    id: 11,
    categoryId: 'spiritual',
    name: 'Navagraha Shanti',
    icon: '✨',
    description: 'Ritual performed to appease the nine planets and alleviate their negative influences.',
    duration: '3-4 hours',
    price: 9000,
    materialsList: ['Nine Different Types of Grains', 'Colored Clothes'],
  },
  {
    id: 12,
    categoryId: 'spiritual',
    name: 'Mahamrityunjaya Jaap',
    icon: '🕯️',
    description: 'Sacred chanting ritual for health, longevity, and overcoming fears and obstacles.',
    duration: '1-2 hours',
    price: 5500,
    materialsList: ['Rudraksha Mala', 'Ghee', 'Sesame Seeds'],
  }
];

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
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-orange-600 to-orange-400 h-48 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">About BookMyPanditJi</h1>
          </div>
          <div className="p-8">
            <p className="text-lg text-gray-600 mb-6">
              BookMyPanditJi is India's leading online platform that connects individuals seeking religious and spiritual 
              services with verified and experienced pandits. Our mission is to preserve and promote Hindu traditions 
              while making it convenient for people to access authentic religious services in today's digital world.
            </p>
            <p className="text-lg text-gray-600">
              Founded in 2023, we have quickly grown to serve thousands of families across India, helping them celebrate 
              important life events, festivals, and spiritual ceremonies with ease and authenticity.
            </p>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  We are on a mission to bridge the traditional and digital worlds, ensuring that ancient rituals and practices 
                  remain accessible to everyone while maintaining their authenticity and significance.
                </p>
                <p className="text-gray-600">
                  By providing a platform that connects families with qualified pandits, we aim to ensure that religious 
                  ceremonies are performed with precision and respect for tradition, regardless of where you are located.
                </p>
              </div>
            </div>
            <div className="relative h-96 bg-orange-100 rounded-lg flex items-center justify-center">
              <div className="text-2xl text-orange-800 font-medium">Mission Image</div>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value) => (
              <div key={value.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-2xl mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <div className="text-xl text-gray-500">Photo</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-orange-600 mb-4">{member.role}</p>
                  <p className="text-gray-600 mb-4">{member.bio}</p>
                  <div className="flex space-x-3">
                    {member.socialLinks.map((social) => (
                      <a key={social.name} href={social.url} className="text-gray-400 hover:text-gray-600">
                        <span className="sr-only">{social.name}</span>
                        {social.name === 'LinkedIn' && (
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Pandits */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Our Verified Pandits</h2>
            <a href="/pandits" className="text-orange-600 hover:text-orange-700 flex items-center">
              View All Pandits
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold mb-4">What Sets Our Pandits Apart</h3>
              <p className="max-w-3xl mx-auto text-gray-600">
                We take pride in our rigorous selection and verification process to ensure that every pandit on our platform 
                is qualified, experienced, and committed to providing authentic religious services.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {panditFeatures.map((feature) => (
                <div key={feature.id} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-2xl mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
              <p className="text-gray-600 mb-6">
                Have questions or feedback? We'd love to hear from you. Reach out to us using any of the methods below.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">support@bookmypanditji.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">+91 1234567890</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">
                      BookMyPanditJi HQ<br />
                      Building 5, Sector 42<br />
                      Gurugram, Haryana 122001
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-orange-100 p-8 flex items-center justify-center">
              <div className="w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Send us a message</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea id="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const values = [
  {
    id: 1,
    icon: '🛡️',
    title: 'Authenticity',
    description: 'We ensure all rituals are performed according to authentic traditions and scriptures, preserving the true essence of Hindu ceremonies.'
  },
  {
    id: 2,
    icon: '✅',
    title: 'Quality',
    description: 'We maintain stringent verification processes for all pandits, ensuring only qualified and experienced professionals join our platform.'
  },
  {
    id: 3,
    icon: '⚡',
    title: 'Accessibility',
    description: 'We make traditional religious services accessible to everyone, regardless of their location, through our digital platform.'
  },
  {
    id: 4,
    icon: '🙏',
    title: 'Respect',
    description: 'We respect the diversity of traditions and customs across different regions and communities, ensuring inclusivity in our services.'
  },
  {
    id: 5,
    icon: '💬',
    title: 'Transparency',
    description: 'We maintain clear communication regarding pricing, services, and processes, ensuring a trustworthy experience for all users.'
  },
  {
    id: 6,
    icon: '🤝',
    title: 'Community',
    description: 'We aim to build a community that supports the preservation and celebration of Hindu traditions and spiritual practices.'
  }
];

const teamMembers = [
  {
    id: 1,
    name: 'Rajesh Agarwal',
    role: 'Founder & CEO',
    bio: 'With a background in technology and a deep respect for traditions, Rajesh founded BookMyPanditJi to bridge the gap between modern technology and traditional practices.',
    socialLinks: [
      { name: 'LinkedIn', url: '#' },
      { name: 'Twitter', url: '#' }
    ]
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Chief Operating Officer',
    bio: 'Priya brings 15 years of experience in operations management and a passion for cultural preservation to ensure smooth functioning of all services.',
    socialLinks: [
      { name: 'LinkedIn', url: '#' }
    ]
  },
  {
    id: 3,
    name: 'Dr. Anand Shastri',
    role: 'Chief Spiritual Advisor',
    bio: 'A respected scholar with a Ph.D. in Sanskrit and Vedic studies, Dr. Shastri oversees the authenticity of all ceremonies and pandit training programs.',
    socialLinks: [
      { name: 'LinkedIn', url: '#' }
    ]
  }
];

const panditFeatures = [
  {
    id: 1,
    icon: '🧪',
    title: 'Rigorous Verification',
    description: 'Every pandit undergoes a thorough background check and verification of their qualifications and experience.'
  },
  {
    id: 2,
    icon: '🎓',
    title: 'Qualified Experts',
    description: 'Our pandits are well-versed in Vedic scriptures and have formal training in performing various rituals.'
  },
  {
    id: 3,
    icon: '📝',
    title: 'Continuously Evaluated',
    description: 'We maintain quality through regular performance reviews based on customer feedback and ceremony standards.'
  }
];
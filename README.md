# BookMyPanditJi - Online Pandit Booking Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3.1-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
</div>

## 📖 Overview

BookMyPanditJi is a comprehensive online platform that connects users with verified Hindu priests (Pandits) for religious ceremonies, pujas, and spiritual services. The platform simplifies the process of finding, booking, and managing religious services while ensuring authenticity and quality.

## 🌟 Features

### For Users
- **🔍 Smart Search & Filtering**: Find pandits by location, expertise, language, and availability
- **📅 Easy Booking System**: Book services with preferred dates, times, and venue details
- **⭐ Rating & Reviews**: Read authentic reviews and rate your experience
- **💳 Secure Payments**: Multiple payment options with secure processing
- **📱 Live Darshan**: Access live temple streams for remote worship
- **🛒 Puja Products**: Browse and purchase authentic religious items
- **📊 Panchang Calendar**: View auspicious dates and religious information
- **💬 In-app Chat**: Communicate directly with pandits
- **📋 Booking Management**: Track current and past bookings

### For Pandits
- **👤 Professional Profiles**: Showcase qualifications, expertise, and services
- **📅 Calendar Management**: Set availability and manage bookings
- **💰 Earnings Dashboard**: Track income and payment history
- **📊 Performance Analytics**: View ratings, reviews, and booking statistics
- **🔔 Notifications**: Real-time updates on new bookings and messages

### For Administrators
- **🛡️ Pandit Verification**: Verify and approve pandit registrations
- **📈 Analytics Dashboard**: Monitor platform performance and user engagement
- **💼 Content Management**: Manage services, products, and platform content
- **🎫 Support System**: Handle customer support and disputes

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15.3.1 with React 19
- **Styling**: Tailwind CSS 4.0
- **Forms**: React Hook Form with validation
- **UI Components**: Headless UI, Heroicons
- **Animations**: Framer Motion
- **TypeScript**: Full type safety

### Development Tools
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **Turbopack**: Fast development builds

## 📁 Project Structure

```
bookmypanditji/
├── ui/                          # Frontend application
│   ├── src/
│   │   ├── app/                 # Next.js app directory
│   │   │   ├── about/           # About page
│   │   │   ├── live-darshan/    # Live temple streams
│   │   │   ├── pandits/         # Pandit search and profiles
│   │   │   ├── products/        # Puja products catalog
│   │   │   ├── profile/         # User profile management
│   │   │   ├── register-pandit/ # Pandit registration
│   │   │   └── services/        # Services overview
│   │   ├── components/          # Reusable components
│   │   │   ├── pandit/          # Pandit-specific components
│   │   │   ├── user/            # User-specific components
│   │   │   └── panchang/        # Calendar components
│   │   └── public/              # Static assets
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
├── mobile_web_ui/               # Mobile UI designs
├── docs/                        # Documentation files
│   ├── product-requirements-document.md
│   ├── tech-stack-and-best-practices.md
│   └── market-analysis.md
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Git

### Clone the Repository
```bash
git clone https://github.com/chahalbaljinder/pandit-ji.git
cd pandit-ji/bookmypanditji/ui
```

### Install Dependencies
```bash
npm install
# or
yarn install
```

### Environment Setup
Create a `.env.local` file in the `ui` directory:
```env
# Add your environment variables here
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_PAYMENT_KEY=your_payment_gateway_key
```

### Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages & Components

### Main Pages
- **Home (`/`)**: Landing page with featured services and testimonials
- **About (`/about`)**: Company information and mission
- **Pandits (`/pandits`)**: Search and browse verified pandits
- **Products (`/products`)**: Puja items and religious products
- **Live Darshan (`/live-darshan`)**: Live temple streaming
- **Services (`/services`)**: Available puja services
- **Profile (`/profile`)**: User account management

### Key Components
- **Navbar**: Responsive navigation with user authentication
- **BookingForm**: Multi-step booking process
- **PanditRegistrationForm**: Comprehensive pandit onboarding
- **PanchangCalendar**: Hindu calendar with auspicious dates
- **ChatBot**: Customer support integration
- **LiveDarshan**: Video streaming component

## 🎨 UI/UX Features

### Design System
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Color Scheme**: Orange primary (#EA580C) with warm, spiritual aesthetics
- **Typography**: Clean, readable fonts with proper hierarchy
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation
- **Dark Mode**: Support for light/dark theme switching

### User Experience
- **Progressive Enhancement**: Works without JavaScript for core features
- **Loading States**: Skeleton screens and loading indicators
- **Error Handling**: User-friendly error messages and recovery options
- **Offline Support**: Basic offline functionality for key features

## 🔧 Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 📊 Performance

- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Bundle Size**: Optimized with code splitting and tree shaking
- **SEO**: Server-side rendering for better search engine visibility
- **Caching**: Efficient caching strategies for static and dynamic content

## 🔒 Security Features

- **Data Validation**: Client and server-side validation
- **CSRF Protection**: Cross-site request forgery prevention
- **XSS Prevention**: Content sanitization and CSP headers
- **Authentication**: Secure user authentication and session management

## 🌐 Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Basic user interface and navigation
- ✅ Pandit search and booking
- ✅ User registration and profiles
- ✅ Products catalog
- ✅ Responsive design

### Phase 2 (Upcoming)
- 🔄 Payment gateway integration
- 🔄 Real-time chat system
- 🔄 Push notifications
- 🔄 Advanced search filters
- 🔄 Booking management dashboard

### Phase 3 (Future)
- 📋 Mobile app development
- 📋 AI-powered recommendations
- 📋 Multi-language support
- 📋 Video consultation features
- 📋 Advanced analytics

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: support@bookmypanditji.com
- **Documentation**: [docs.bookmypanditji.com](https://docs.bookmypanditji.com)
- **Issues**: [GitHub Issues](https://github.com/chahalbaljinder/pandit-ji/issues)

## 🙏 Acknowledgments

- Hindu religious community for guidance and feedback
- Open source contributors and maintainers
- Beta testers and early adopters
- UI/UX inspiration from modern booking platforms

---

<div align="center">
  <p>Made with ❤️ for the spiritual community</p>
  <p>🕉️ BookMyPanditJi - Bridging Tradition with Technology 🕉️</p>
</div>

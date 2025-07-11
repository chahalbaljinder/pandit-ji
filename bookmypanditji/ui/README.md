# BookMyPanditJi UI

This is the frontend application for BookMyPanditJi, built with Next.js 15 and React 19.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📱 Available Routes

- `/` - Home page with featured services
- `/about` - About the platform
- `/pandits` - Search and browse pandits
- `/pandits/[id]` - Individual pandit profile and booking
- `/products` - Puja products catalog
- `/products/[id]` - Product details
- `/services` - Available services
- `/live-darshan` - Live temple streams
- `/profile` - User profile and settings
- `/register-pandit` - Pandit registration form

## 🎨 Design System

### Colors
- Primary: Orange (#EA580C)
- Secondary: Gray (#6B7280)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)

### Typography
- Headings: Font weight 600-700
- Body: Font weight 400
- Small text: Font size 0.875rem

### Components
- Buttons with hover states and loading indicators
- Form inputs with validation styling
- Cards with subtle shadows and borders
- Navigation with active states

## 🔧 Technologies

- **Next.js 15.3.1** - React framework with App Router
- **React 19** - Component library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **React Hook Form** - Form management
- **Framer Motion** - Animations
- **Headless UI** - Accessible components

## 📁 Component Structure

```
src/components/
├── BookingConfirmation.tsx    # Booking success modal
├── BookingForm.tsx            # Multi-step booking form
├── ChatBot.tsx                # Customer support chat
├── LiveDarshan.tsx            # Live streaming component
├── Navbar.tsx                 # Main navigation
├── pandit/
│   ├── PanditRegistrationForm.tsx
│   └── PanditRegistrationComplete.tsx
├── user/
│   ├── UserRegistrationForm.tsx
│   └── UserRegistrationComplete.tsx
└── panchang/
    └── PanchangCalendar.tsx   # Hindu calendar
```

## 🛠️ Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow ESLint configuration
- Use Prettier for formatting
- Follow React best practices

### Component Guidelines
- Use functional components with hooks
- Implement proper error boundaries
- Add loading states for async operations
- Ensure accessibility compliance

### Performance
- Use React.memo for expensive components
- Implement proper code splitting
- Optimize images with Next.js Image component
- Use Suspense for data fetching

## 🔍 Key Features Implemented

### User Features
- ✅ Responsive navigation with mobile menu
- ✅ Multi-step registration forms
- ✅ Pandit search and filtering
- ✅ Product catalog with cart functionality
- ✅ Booking form with date/time selection
- ✅ Live temple streaming
- ✅ Hindu calendar (Panchang)

### Technical Features
- ✅ Server-side rendering
- ✅ Type-safe development
- ✅ Responsive design
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ SEO optimization

## 🐛 Known Issues

- Payment integration pending
- Real-time chat not implemented
- Push notifications not configured
- Advanced search filters partial

## 📈 Performance Metrics

Current performance scores:
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 3s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 4s

## 🔧 Configuration Files

- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration  
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.json` - ESLint rules
- `postcss.config.mjs` - PostCSS configuration

## 🚀 Deployment

The application is configured for deployment on:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Custom server with PM2

Build command: `npm run build`
Start command: `npm start`

## 📞 Support

For development issues:
1. Check existing GitHub issues
2. Review the documentation
3. Contact the development team

---

Built with ❤️ using Next.js and React

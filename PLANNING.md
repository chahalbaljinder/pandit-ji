# BookMyPanditJi - Implementation Planning & Roadmap

> **Internal Planning Document** — Not for public README. Tracks detailed tasks, priorities, and technical decisions.

---

## ✅ Phase 1: Backend Core - **COMPLETED**

### 1.1 Project Setup & Infrastructure
- [x] Initialize NestJS project in `bookmypanditji/api`
- [x] Configure TypeScript, ESLint, Prettier, Husky
- [x] Set up Docker Compose (PostgreSQL, Redis, pgAdmin)
- [x] Configure Prisma with PostgreSQL
- [x] Set up environment configuration (@nestjs/config)

### 1.2 Database Schema (Prisma)
- [x] User model (profile, kundali, family, virtual users)
- [x] Pandit model (qualifications, services, availability, gallery, verification)
- [x] Service model (categories, pricing, duration, materials)
- [x] Booking model (status flow, pricing, venue, samagri)
- [x] Product model (samagri, inventory, categories)
- [x] Temple model (live streams, schedule, location)
- [x] Panchang model (tithi, festivals, muhurat, regional variations)
- [x] Review/Rating model
- [x] Notification model (multi-channel)
- [x] Wallet/Transaction model
- [x] Admin/Audit log models
- [x] ChatRoom/ChatMessage models

### 1.3 Authentication Module
- [x] NextAuth.js compatible JWT strategy
- [x] Register/Login (email/phone + password)
- [x] Password reset flow
- [x] Role-based access (USER, PANDIT, ADMIN, SUPER_ADMIN)
- [x] Session management with Redis
- [x] Refresh token rotation
- [ ] MFA support (TOTP) - **PENDING**

### 1.4 Core API Modules
- [x] **Users**: Profile CRUD, family management, kundali data, addresses
- [x] **Pandits**: Registration, verification workflow, profile management, availability, earnings
- [x] **Services**: CRUD, categories, search, filtering, pandit assignments
- [x] **Bookings**: Create, confirm, cancel, reschedule, status transitions, timeline
- [x] **Payments**: Razorpay integration, webhooks, refunds
- [x] **Products**: Catalog, cart, inventory, stock management
- [x] **Temples**: Live darshan streams, schedules, city/state search
- [x] **Panchang**: Calendar API, festivals, muhurat calculations, monthly views
- [x] **Notifications**: Multi-channel, templates, bulk, event handlers
- [x] **Chat**: WebSocket gateway (Socket.io), rooms, real-time messaging
- [x] **Admin**: Dashboard stats, analytics, audit logs, user/pandit management

---

## ✅ Phase 2: Real-time & Notifications - **COMPLETED**

### 2.1 WebSocket Gateway
- [x] Socket.io / NestJS Gateway setup
- [x] Authentication via JWT handshake
- [x] Room-based channels (booking, chat, notifications)
- [x] Connection lifecycle management

### 2.2 Chat System
- [x] User-Pandit messaging
- [x] Message persistence
- [x] Read receipts, typing indicators
- [ ] File/image sharing - **PENDING**

### 2.3 Notification Engine
- [x] Email (Nodemailer - structure ready)
- [x] SMS (Twilio - structure ready)
- [x] WhatsApp (Twilio/Gupshup - structure ready)
- [x] Push (Firebase/OneSignal - structure ready)
- [x] In-app notification center
- [x] Template system with i18n
- [x] Scheduled/recurring notifications
- [ ] Actual provider integrations - **NEEDS CONFIG**

---

## ✅ Phase 3: Frontend Integration Layer - **COMPLETED**

### 3.1 Frontend API Layer
- [x] Create API client (`lib/api.ts`) with axios/fetch wrapper
- [x] Add React Query / TanStack Query for data fetching
- [x] Create authentication context (`AuthProvider`)
- [x] Add JWT token management (storage, refresh, interceptors)
- [x] Create TypeScript types matching backend DTOs
- [x] Add environment configuration (`.env.local`)

### 3.2 Authentication Integration
- [x] Auth context with login/register/logout
- [x] Protected routes / route guards (via `useAuth` hook)
- [x] User profile page with real data
- [x] Pandit registration flow with real API
- [x] Token refresh handling (auto-interceptor)

### 3.3 Data Fetching Hooks (`src/hooks/useApi.ts`)
- [x] `usePandits` - search, filters, pagination
- [x] `useServices` - categories, featured, search
- [x] `useBookings` - user bookings, pandit bookings, create/update
- [x] `useProducts` - catalog, cart, search
- [x] `useTemples` - live darshan, city search
- [x] `usePanchang` - today, range, festivals
- [x] `useNotifications` - list, unread count, mark read
- [x] `useChatRooms` / `useChatMessages` - real-time chat
- [x] `useLogin` / `useRegister` - auth mutations

### 3.4 Component Updates
- [x] `Navbar` - auth state, user menu, logout, role-based links
- [x] `BookingForm` - real API, pandit availability check
- [x] `UserRegistrationForm` - real API, OTP verification
- [x] `PanditRegistrationForm` - real API, document upload
- [x] `LiveDarshan` - real stream URLs, schedule

### 3.5 Pages Updates
- [x] `/pandits` - real search with filters
- [x] `/pandits/[id]` - real profile, reviews, booking
- [x] `/services` - real categories, services
- [x] `/products` - real catalog, cart
- [x] `/live-darshan` - real temple streams
- [x] `/profile` - real user data, bookings, wallet
- [x] `/booking/[id]` - real booking flow

---

## 📦 Phase 4: Admin Dashboard (Frontend) - **NEXT**
- [ ] Admin layout with sidebar navigation
- [ ] Dashboard with charts (revenue, bookings, users)
- [ ] User management table (search, filter, actions)
- [ ] Pandit verification queue
- [ ] Booking management
- [ ] Content management (services, products, temples)
- [ ] Analytics pages

---

## 📦 Phase 5: Mobile Apps & Polish
- [ ] React Native (Expo) user app
- [ ] React Native pandit app
- [ ] Shared component library
- [ ] Offline-first architecture
- [ ] App Store / Play Store deployment

---

## 📦 Phase 6: Advanced Features (Future)
- [ ] Search with Elasticsearch
- [ ] AI Pandit matching algorithm
- [ ] Recommendation engine
- [ ] Fraud detection rules
- [ ] Automated scheduling optimizer
- [ ] Multi-language support (Hindi, Tamil, Telugu, etc.)
- [ ] Subscription & loyalty programs

---

## 🔧 What Needs From You (Configuration)

### Required Environment Variables (Backend)
```env
# Database (already in docker-compose)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bookmypanditji

# Redis (already in docker-compose)
REDIS_URL=redis://localhost:6379

# JWT - GENERATE THESE
JWT_SECRET=<generate with: openssl rand -base64 32>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Razorpay (FREE TIER) - Sign up at https://razorpay.com
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx

# Email (Gmail FREE) - Enable App Password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@bookmypanditji.com

# SMS/WhatsApp (Twilio FREE TRIAL) - Sign up at https://twilio.com
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1xxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Push (Firebase FREE) - https://firebase.google.com
FIREBASE_PROJECT_ID=xxx
FIREBASE_CLIENT_EMAIL=xxx
FIREBASE_PRIVATE_KEY=xxx

# Sentry (FREE) - https://sentry.io
SENTRY_DSN=xxx
```

### Required Environment Variables (Frontend)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_URL=ws://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
```

### Commands to Run
```bash
# Backend
cd bookmypanditji/api
docker-compose up -d          # Start PostgreSQL + Redis
npx prisma migrate dev        # Run migrations
npx prisma db seed            # Seed data (when created)
npm run start:dev             # Start dev server (port 4000)

# Frontend (separate terminal)
cd bookmypanditji/ui
npm run dev                   # Start dev server (port 3001)
```

---

## 📊 Current Status Summary

| Component | Status |
|-----------|--------|
| Backend API | ✅ Complete & Building |
| Database Schema | ✅ Complete |
| Auth System | ✅ Complete |
| Core Modules | ✅ Complete (12 modules) |
| Real-time/Chat | ✅ Complete |
| Notifications | ✅ Structure Ready |
| Admin API | ✅ Complete |
| Frontend API Layer | ✅ Complete |
| Frontend Auth | ✅ Complete |
| Frontend Data Hooks | ✅ Complete (50+ hooks) |
| Navbar Integration | ✅ Complete |
| Component Integration | ✅ Complete |
| Admin Dashboard UI | ❌ Not Started |

---

## 🎯 Next Steps (Priority Order)

1. **Admin Dashboard UI** - Build admin frontend
2. **Mobile Apps** - React Native apps
3. **Advanced Features** - Elasticsearch, AI matching, recommendations

---

*Last Updated: August 2025*  
*Current Focus: Admin Dashboard UI*
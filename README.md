# BookMyPanditJi - Online Pandit Booking Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3.1-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/NestJS-10+-red?style=for-the-badge&logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/PostgreSQL-15+-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-7+-red?style=for-the-badge&logo=redis" alt="Redis" />
  <img src="https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License" />
</div>

## Overview

**BookMyPanditJi** connects devotees with verified Hindu priests (Pandits) for religious ceremonies, pujas, and spiritual services. The platform provides a complete ecosystem: pandit discovery & booking, live temple streaming (darshan), puja samagri marketplace, Hindu calendar (Panchang), and astrological services.

**Current Stage**: **Production Ready** - Full-stack application with frontend & backend

- ✅ **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 4
- ✅ **Backend**: NestJS 10, Node.js 20, PostgreSQL 15, Prisma ORM, Redis 7
- ✅ **Real-time**: Socket.io for chat & notifications
- ✅ **Auth**: JWT with refresh tokens, role-based access
- ✅ **API Docs**: Swagger at `/docs`

---

## Features

### For Users
- **Smart Search**: Filter pandits by location, expertise, language, availability
- **Multi-Type Booking**: Advance booking, Premium/Urgent (on-demand), Temple booking
- **Samagri Marketplace**: Browse & purchase puja items, bundle with bookings
- **Live Darshan**: Stream major temples via utsav.gov.in integration
- **Panchang Calendar**: Tithi, festivals, vrats, muhurat, choghadiya
- **Profile & Kundali**: Birth details, family members, virtual users
- **Notifications**: WhatsApp, SMS, Email, Push, In-app (structure ready)

### For Pandits
- **Professional Profiles**: Qualifications, specializations, gallery, testimonials
- **Dedicated Booking Links**: Shareable links for direct yajman booking
- **Calendar Management**: Availability slots, blocking, service areas
- **Earnings Dashboard**: Revenue tracking, payment history, analytics (structure ready)

### For Administrators
- **Content Management**: Services, Samagri, Temples, Categories, Articles
- **Pandit Verification**: KYC, background checks, certification workflow
- **Analytics Dashboard**: Revenue, bookings, user engagement, conversions
- **Campaign Management**: Festival promotions, bulk messaging

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React 19, TypeScript 5, Tailwind CSS 4 |
| **UI Components** | shadcn/ui, Headless UI, Heroicons, Framer Motion |
| **Forms** | React Hook Form + Zod |
| **State Management** | TanStack Query (React Query) |
| **Backend** | NestJS 10, Node.js 20 LTS, TypeScript |
| **Database** | PostgreSQL 15 + Prisma ORM |
| **Cache/Queue** | Redis 7 (ioredis, BullMQ) |
| **Auth** | JWT + NextAuth.js compatible |
| **Real-time** | Socket.io |
| **Payments** | Razorpay (India) + Stripe (International) |
| **Storage** | AWS S3 + CloudFront |
| **Search** | Elasticsearch |
| **Monitoring** | Sentry, Prometheus, Grafana |
| **Deployment** | Docker, Kubernetes, GitHub Actions |

---

## Quick Start

### Prerequisites
- Node.js 20+, npm 10+
- Docker & Docker Compose (for database/Redis)
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)

### Full Stack (with Docker)
```bash
# From project root
git clone https://github.com/chahalbaljinder/pandit-ji.git
cd pandit-ji

# Start databases
cd bookmypanditji/api
docker-compose up -d

# Setup database
npx prisma migrate dev
npx prisma db seed

# Start backend (port 4000)
npm run start:dev

# Frontend (separate terminal, port 3000)
cd ../ui
npm run dev
```

### Environment Variables
```env
# Backend (.env)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bookmypanditji
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-key-min-32-chars
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_URL=ws://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
```

---

## Project Structure

```
pandit-ji/
├── bookmypanditji/
│   ├── ui/                    # Next.js Frontend (Complete)
│   │   ├── src/app/           # App Router pages (15+)
│   │   ├── src/components/    # 20+ reusable components
│   │   ├── src/hooks/         # 50+ API hooks
│   │   ├── src/lib/           # API client, utilities
│   │   ├── src/providers/     # Query & Auth providers
│   │   └── package.json
│   ├── api/                   # NestJS Backend (Complete)
│   │   ├── src/modules/       # 12 feature modules
│   │   ├── prisma/            # Database schema
│   │   └── package.json
│   ├── admin/                 # Admin Dashboard (Planned)
│   └── mobile/                # React Native Apps (Planned)
├── infrastructure/            # Docker, K8s, Terraform
├── docs/                      # Architecture, API docs
├── PLANNING.md                # Detailed internal roadmap
└── README.md
```

---

## Available Scripts (Frontend)

```bash
npm run dev          # Development server (Turbopack)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run test         # Unit tests
npm run test:e2e     # E2E tests (Playwright)
```

---

## API Endpoints (Selected)

| Module | Endpoints |
|--------|-----------|
| **Auth** | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh` |
| **Users** | `GET /api/users/me`, `PUT /api/users/me`, `GET /api/users/me/bookings` |
| **Pandits** | `GET /api/pandits/search`, `GET /api/pandits/:id`, `POST /api/pandits/profile` |
| **Services** | `GET /api/services`, `GET /api/services/:id`, `GET /api/services/categories` |
| **Bookings** | `POST /api/bookings`, `GET /api/bookings/me`, `POST /api/bookings/:id/confirm` |
| **Payments** | `POST /api/payments/create`, `POST /api/payments/razorpay/order/:bookingId` |
| **Products** | `GET /api/products`, `GET /api/products/:id`, `GET /api/products/categories` |
| **Temples** | `GET /api/temples`, `GET /api/temples/live-darshan`, `GET /api/temples/cities` |
| **Panchang** | `GET /api/panchang/today`, `GET /api/panchang/month/:year/:month`, `GET /api/panchang/festivals/upcoming` |
| **Notifications** | `GET /api/notifications`, `GET /api/notifications/unread-count`, `PUT /api/notifications/:id/read` |
| **Chat** | `GET /api/chat/rooms`, `GET /api/chat/rooms/:roomId/messages` |
| **Admin** | `GET /api/admin/dashboard`, `GET /api/admin/analytics/revenue`, `GET /api/admin/audit-logs` |

---

## Current Implementation Status

| Component | Status |
|-----------|--------|
| Backend API | ✅ Complete (12 modules, Swagger docs at `/docs`) |
| Database Schema | ✅ Complete (Prisma, 25+ models) |
| Auth System | ✅ Complete (JWT, refresh tokens, roles) |
| Core Modules | ✅ Complete (Users, Pandits, Services, Bookings, Payments, Products, Temples, Panchang, Notifications, Chat, Admin, Health) |
| Real-time/Chat | ✅ Complete (Socket.io gateway) |
| Notifications | ✅ Structure Ready (multi-channel) |
| Admin API | ✅ Complete |
| Frontend API Layer | ✅ Complete (axios, React Query, AuthProvider, 50+ hooks) |
| Frontend Auth | ✅ Complete (AuthProvider, login/register) |
| Frontend Data Hooks | ✅ Complete (50+ hooks) |
| Navbar Integration | ✅ Complete (auth-aware, role-based) |
| Component Integration | ✅ Complete (BookingForm, RegistrationForms, LiveDarshan, etc.) |
| Admin Dashboard UI | 🔄 Planned |
| Mobile Apps | 🔄 Planned |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create feature branch: `git checkout -b feat/amazing-feature`
3. Follow code style (TypeScript, ESLint, Prettier)
4. Write tests for new features
5. Submit Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Support

- **Issues**: [GitHub Issues](https://github.com/chahalbaljinder/pandit-ji/issues)
- **Discussions**: [GitHub Discussions](https://github.com/chahalbaljinder/pandit-ji/discussions)
- **Email**: support@bookmypanditji.com

---

<div align="center">
  <p>🕉️ <strong>BookMyPanditJi</strong> - Bridging Tradition with Technology 🕉️</p>
</div>
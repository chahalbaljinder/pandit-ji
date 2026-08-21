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

**Current Stage**: Frontend MVP Complete | Backend in Active Development

- ✅ **Frontend**: Production-ready (Next.js 15, React 19, TypeScript, Tailwind CSS 4)
- ✅ **UI/UX**: 15+ pages, 20+ components, responsive design system, dark mode
- 🔄 **Backend**: NestJS + PostgreSQL + Prisma + Redis (in progress)
- 📋 **Planning**: See [PLANNING.md](PLANNING.md) for detailed roadmap

---

## Features

### For Users
- **Smart Search**: Filter pandits by location, expertise, language, availability
- **Multi-Type Booking**: Advance booking, Premium/Urgent (on-demand), Temple booking
- **Samagri Marketplace**: Browse & purchase puja items, bundle with bookings
- **Live Darshan**: Stream major temples via utsav.gov.in integration
- **Panchang Calendar**: Tithi, festivals, vrats, muhurat, choghadiya
- **Profile & Kundali**: Birth details, family members, virtual users
- **Notifications**: WhatsApp, SMS, Email, Push, In-app (planned)

### For Pandits
- **Professional Profiles**: Qualifications, specializations, gallery, testimonials
- **Dedicated Booking Links**: Shareable links for direct yajman booking
- **Calendar Management**: Availability slots, blocking, service areas
- **Earnings Dashboard**: Revenue tracking, payment history, analytics (planned)

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

### Frontend Only
```bash
cd bookmypanditji/ui
npm install
cp .env.example .env.local
npm run dev
```
Open http://localhost:3000

### Full Stack (with Docker)
```bash
# From project root
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# Backend (when ready)
cd bookmypanditji/api
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

### Environment Variables
```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_URL=ws://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/bookmypanditji
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

---

## Project Structure

```
pandit-ji/
├── bookmypanditji/
│   ├── ui/                    # Next.js Frontend (Complete)
│   │   ├── src/app/           # App Router pages (15+)
│   │   ├── src/components/    # 20+ reusable components
│   │   └── package.json
│   ├── api/                   # NestJS Backend (In Progress)
│   │   ├── src/modules/       # Feature modules
│   │   ├── prisma/            # Database schema
│   │   └── package.json
│   ├── admin/                 # Admin Dashboard (Planned)
│   └── mobile/                # React Native Apps (Planned)
├── infrastructure/            # Docker, K8s, Terraform
├── docs/                      # Architecture, API docs
├── PLANNING.md                # Detailed implementation roadmap
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
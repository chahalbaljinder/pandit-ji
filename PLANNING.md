# BookMyPanditJi - Implementation Planning & Roadmap

> **Internal Planning Document** — Not for public README. Tracks detailed tasks, priorities, and technical decisions.

---

## 🎯 Current Sprint: Backend Foundation (Tonight's Goal)

**Objective**: Ship a working NestJS backend with PostgreSQL, Prisma, Auth, and core APIs by end of night.

---

## 📦 Phase 1: Backend Core (NOW - Tonight)

### 1.1 Project Setup & Infrastructure
- [ ] Initialize NestJS project in `bookmypanditji/api`
- [ ] Configure TypeScript, ESLint, Prettier, Husky
- [ ] Set up Docker Compose (PostgreSQL, Redis, pgAdmin)
- [ ] Configure Prisma with PostgreSQL
- [ ] Set up environment configuration (@nestjs/config)

### 1.2 Database Schema (Prisma)
- [ ] User model (profile, kundali, family, virtual users)
- [ ] Pandit model (qualifications, services, availability, gallery, verification)
- [ ] Service model (categories, pricing, duration, materials)
- [ ] Booking model (status flow, pricing, venue, samagri)
- [ ] Product model (samagri, inventory, categories)
- [ ] Temple model (live streams, schedule, location)
- [ ] Panchang model (tithi, festivals, muhurat, regional variations)
- [ ] Review/Rating model
- [ ] Notification model (multi-channel)
- [ ] Wallet/Transaction model
- [ ] Admin/Audit log models

### 1.3 Authentication Module
- [ ] NextAuth.js compatible JWT strategy
- [ ] Register/Login (email/phone + OTP)
- [ ] Password reset flow
- [ ] Role-based access (USER, PANDIT, ADMIN)
- [ ] Session management with Redis
- [ ] MFA support (TOTP)

### 1.4 Core API Modules
- [ ] **Users**: Profile CRUD, family management, kundali data
- [ ] **Pandits**: Registration, verification workflow, profile management
- [ ] **Services**: CRUD, categories, search, filtering
- [ ] **Bookings**: Create, confirm, cancel, reschedule, status transitions
- [ ] **Payments**: Razorpay integration, webhooks, refunds
- [ ] **Products**: Catalog, cart, inventory
- [ ] **Temples**: Live darshan streams, schedules
- [ ] **Panchang**: Calendar API, festivals, muhurat calculations

---

## 📦 Phase 2: Real-time & Notifications (Next 2-3 hours)

### 2.1 WebSocket Gateway
- [ ] Socket.io / NestJS Gateway setup
- [ ] Authentication via JWT handshake
- [ ] Room-based channels (booking, chat, notifications)
- [ ] Connection lifecycle management

### 2.2 Chat System
- [ ] User-Pandit messaging
- [ ] Message persistence
- [ ] Read receipts, typing indicators
- [ ] File/image sharing

### 2.3 Notification Engine
- [ ] Email (Nodemailer/SendGrid)
- [ ] SMS (Twilio/Msg91)
- [ ] WhatsApp (Twilio/Gupshup)
- [ ] Push (Firebase/OneSignal)
- [ ] In-app notification center
- [ ] Template system with i18n
- [ ] Scheduled/recurring notifications

---

## 📦 Phase 3: Admin Dashboard & Advanced Features

### 3.1 Admin API
- [ ] User management (search, suspend, verify)
- [ ] Pandit verification workflow
- [ ] Booking oversight & dispute resolution
- [ ] Content management (services, products, temples, articles)
- [ ] Analytics endpoints (revenue, bookings, users, pandits)
- [ ] Campaign management
- [ ] System settings

### 3.2 Advanced Features
- [ ] Search with Elasticsearch
- [ ] AI Pandit matching algorithm
- [ ] Recommendation engine
- [ ] Fraud detection rules
- [ ] Automated scheduling optimizer

---

## 📦 Phase 4: Mobile Apps & Polish

- [ ] React Native (Expo) user app
- [ ] React Native pandit app
- [ ] Shared component library
- [ ] Offline-first architecture
- [ ] App Store / Play Store deployment

---

## 🗄️ Database Schema Design (Prisma)

```prisma
// Core models - to be implemented in schema.prisma

model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  phone         String?   @unique
  passwordHash  String?
  name          String
  avatar        String?
  role          Role      @default(USER)
  status        UserStatus @default(ACTIVE)
  emailVerified DateTime?
  phoneVerified DateTime?
  lastLoginAt   DateTime?
  
  // Kundali / Profile
  dateOfBirth   DateTime?
  timeOfBirth   String?
  birthPlace    String?
  gender        Gender?
  maritalStatus MaritalStatus?
  anniversaryDate DateTime?
  spouseName    String?
  spousePhone   String?
  spouseDob     DateTime?
  spouseTob     String?
  children      Json?     // Array of child objects
  
  // Social
  facebookId    String?
  facebookToken String?
  canPostToFb   Boolean   @default(false)
  
  // Relations
  bookings      Booking[]
  reviews       Review[]
  notifications Notification[]
  wallet        Wallet?
  addresses     Address[]
  virtualUsers  VirtualUser[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([email])
  @@index([phone])
  @@index([role])
}

model Pandit {
  id              String      @id @default(cuid())
  userId          String      @unique
  user            User        @relation(fields: [userId], references: [id])
  
  // Verification
  verificationStatus VerificationStatus @default(PENDING)
  verifiedAt      DateTime?
  verifiedBy      String?
  rejectionReason String?
  
  // Profile
  title           String?     // Shastri, Acharya, etc.
  bio             String?
  experienceYears Int         @default(0)
  education       String?
  specializations String[]    // Array of expertise
  languages       String[]    @default(["Hindi", "English"])
  
  // Service Area
  serviceCities   String[]
  serviceRadius   Int?        // km from base location
  baseLatitude    Float?
  baseLongitude   Float?
  
  // Availability
  timezone        String      @default("Asia/Kolkata")
  weeklySchedule  Json        // Day -> time slots
  blockedDates    DateTime[]  // Specific unavailable dates
  
  // Pricing
  basePrice       Decimal     @db.Decimal(10, 2)
  pricingMode     PricingMode @default(FIXED)
  customPricing   Json?       // Service -> price overrides
  
  // Media
  galleryImages   String[]
  videoIntro      String?
  documents       String[]    // Certificates, ID proofs
  
  // Stats
  rating          Float       @default(0)
  reviewCount     Int         @default(0)
  totalBookings   Int         @default(0)
  completedBookings Int       @default(0)
  earnings        Decimal     @default(0) @db.Decimal(12, 2)
  
  // Relations
  services        PanditService[]
  bookings        Booking[]
  availability    Availability[]
  reviews         Review[]
  payouts         Payout[]
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@index([verificationStatus])
  @@index([serviceCities])
  @@index([rating])
}

model Service {
  id              String      @id @default(cuid())
  name            String
  slug            String      @unique
  description     String
  shortDesc       String?
  category        ServiceCategory
  subCategory     String?
  
  // Details
  durationMinutes Int         @default(60)
  minPandits      Int         @default(1)
  maxPandits      Int         @default(3)
  requiredSamagri Json?       // Array of required items
  optionalSamagri Json?       // Array of optional items
  
  // Pricing
  basePrice       Decimal     @db.Decimal(10, 2)
  priceType       PriceType   @default(FIXED) // FIXED, RANGE, PER_PANDIT
  priceRangeMin   Decimal?    @db.Decimal(10, 2)
  priceRangeMax   Decimal?    @db.Decimal(10, 2)
  
  // Media
  images          String[]
  videoUrl        String?
  
  // Booking
  advanceBookingDays Int      @default(30)
  allowUrgentBooking Boolean   @default(true)
  urgentSurcharge  Decimal?    @db.Decimal(5, 2)
  
  // SEO
  metaTitle       String?
  metaDescription String?
  keywords        String[]
  
  // Relations
  panditServices  PanditService[]
  bookings        Booking[]
  products        Product[]   // Related samagri
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@index([category])
  @@index([slug])
}

model Booking {
  id              String        @id @default(cuid())
  bookingNumber   String        @unique @default(cuid())
  
  // Participants
  userId          String
  user            User          @relation(fields: [userId], references: [id])
  panditId        String?
  pandit          Pandit?       @relation(fields: [panditId], references: [id])
  serviceId       String
  service         Service       @relation(fields: [serviceId], references: [id])
  
  // Schedule
  bookingDate     DateTime
  startTime       String        // HH:mm
  endTime         String        // HH:mm
  timezone        String        @default("Asia/Kolkata")
  
  // Venue
  venueType       VenueType     @default(HOME)
  venueAddress    String
  venueLatitude   Float?
  venueLongitude  Float?
  templeId        String?
  landmark        String?
  
  // Participants
  participants    Int           @default(1)
  specialRequests String?
  
  // Pricing
  servicePrice    Decimal       @db.Decimal(10, 2)
  samagriPrice    Decimal       @default(0) @db.Decimal(10, 2)
  travelCharges   Decimal       @default(0) @db.Decimal(10, 2)
  platformFee     Decimal       @default(0) @db.Decimal(10, 2)
  discount        Decimal       @default(0) @db.Decimal(10, 2)
  taxAmount       Decimal       @default(0) @db.Decimal(10, 2)
  totalAmount     Decimal       @db.Decimal(10, 2)
  currency        String        @default("INR")
  
  // Status Flow: PENDING -> CONFIRMED -> IN_PROGRESS -> COMPLETED
  //                -> CANCELLED / DISPUTED / REFUNDED
  status          BookingStatus @default(PENDING)
  paymentStatus   PaymentStatus @default(PENDING)
  
  // Timestamps
  confirmedAt     DateTime?
  startedAt       DateTime?
  completedAt     DateTime?
  cancelledAt     DateTime?
  cancellationReason String?
  
  // Relations
  samagriItems    BookingSamagri[]
  payments        Payment[]
  reviews         Review[]
  chatRoom        ChatRoom?
  notifications   Notification[]
  timeline        BookingTimeline[]
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([userId, status])
  @@index([panditId, status])
  @@index([bookingDate])
  @@index([bookingNumber])
}

model Product {
  id              String        @id @default(cuid())
  sku             String        @unique
  name            String
  slug            String        @unique
  description     String
  shortDesc       String?
  category        ProductCategory
  
  // Pricing
  price           Decimal       @db.Decimal(10, 2)
  compareAtPrice  Decimal?      @db.Decimal(10, 2)
  costPrice       Decimal?      @db.Decimal(10, 2)
  
  // Inventory
  stockQuantity   Int           @default(0)
  lowStockThreshold Int         @default(10)
  trackInventory  Boolean       @default(true)
  allowBackorder  Boolean       @default(false)
  
  // Physical
  weight          Float?        // grams
  dimensions      Json?         // {l, w, h} in cm
  
  // Media
  images          String[]
  videoUrl        String?
  
  // Relations
  services        Service[]     @relation("ServiceProducts")
  cartItems       CartItem[]
  orderItems      OrderItem[]
  reviews         Review[]
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([category])
  @@index([slug])
  @@index([stockQuantity])
}

model Temple {
  id              String        @id @default(cuid())
  name            String
  slug            String        @unique
  description     String
  deity           String
  address         String
  city            String
  state           String
  country         String        @default("India")
  pincode         String?
  latitude        Float
  longitude       Float
  
  // Live Darshan
  hasLiveDarshan  Boolean       @default(false)
  streamUrl       String?
  streamSchedule  Json?         // Day -> time slots
  streamProvider  String?       // utsav.gov.in, custom, etc.
  
  // Contact
  phone           String?
  email           String?
  website         String?
  
  // Media
  images          String[]
  virtualTourUrl  String?
  
  // Timings
  openingTime     String?
  closingTime     String?
  aartiTimings    Json?
  
  // Features
  facilities      String[]
  festivals       String[]
  
  // Relations
  bookings        Booking[]
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([city, state])
  @@index([hasLiveDarshan])
  @@index([slug])
}

model PanchangEntry {
  id              String        @id @default(cuid())
  date            DateTime      @db.Date
  tithi           String
  paksha          String        // Shukla/Krishna
  nakshatra       String
  yoga            String
  karana          String
  sunrise         String        // HH:mm
  sunset          String        // HH:mm
  moonrise        String?
  moonset         String?
  festivals       String[]      // Festival names
  vrats           String[]      // Vrat names
  muhurat         Json?         // Auspicious timings
  choghadiya      Json?         // Day/night choghadiya
  rahukalam       String?       // HH:mm-HH:mm
  yamagandam      String?
  gulikai         String?
  regionalVariations Json?      // Region-specific data
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@unique([date])
  @@index([date])
  @@index([festivals])
}

model Review {
  id              String        @id @default(cuid())
  userId          String
  user            User          @relation(fields: [userId], references: [id])
  panditId        String?
  pandit          Pandit?       @relation(fields: [panditId], references: [id])
  serviceId       String?
  service         Service?      @relation(fields: [serviceId], references: [id])
  productId       String?
  product         Product?      @relation(fields: [productId], references: [id])
  bookingId       String?
  booking         Booking?      @relation(fields: [bookingId], references: [id])
  
  rating          Int           // 1-5
  title           String?
  content         String
  images          String[]
  isVerified      Boolean       @default(false)
  status          ReviewStatus  @default(PUBLISHED)
  panditResponse  String?
  respondedAt     DateTime?
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([panditId, status])
  @@index([serviceId, status])
  @@index([productId, status])
  @@index([userId])
}

model Notification {
  id              String            @id @default(cuid())
  userId          String
  user            User              @relation(fields: [userId], references: [id])
  type            NotificationType
  channel         NotificationChannel[]
  title           String
  message         String
  data            Json?
  priority        NotificationPriority @default(NORMAL)
  status          NotificationStatus @default(PENDING)
  scheduledAt     DateTime?
  sentAt          DateTime?
  readAt          DateTime?
  error           String?
  
  createdAt       DateTime          @default(now())
  
  @@index([userId, status])
  @@index([scheduledAt])
  @@index([type])
}

model Wallet {
  id              String        @id @default(cuid())
  userId          String        @unique
  user            User          @relation(fields: [userId], references: [id])
  balance         Decimal       @default(0) @db.Decimal(12, 2)
  loyaltyPoints   Int           @default(0)
  currency        String        @default("INR")
  isActive        Boolean       @default(true)
  
  transactions    Transaction[]
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

model Transaction {
  id              String            @id @default(cuid())
  walletId        String
  wallet          Wallet            @relation(fields: [walletId], references: [id])
  type            TransactionType   // CREDIT, DEBIT, REFUND, REWARD
  amount          Decimal           @db.Decimal(12, 2)
  balanceAfter    Decimal           @db.Decimal(12, 2)
  description     String
  referenceId     String?           // Booking ID, Order ID, etc.
  referenceType   String?           // BOOKING, ORDER, REWARD, REFUND
  status          TransactionStatus @default(COMPLETED)
  metadata        Json?
  
  createdAt       DateTime          @default(now())
  
  @@index([walletId, createdAt])
  @@index([referenceId, referenceType])
}

// Enums
enum Role { USER, PANDIT, ADMIN, SUPER_ADMIN }
enum UserStatus { ACTIVE, INACTIVE, SUSPENDED, DELETED }
enum Gender { MALE, FEMALE, OTHER }
enum MaritalStatus { SINGLE, MARRIED, DIVORCED, WIDOWED }
enum VerificationStatus { PENDING, VERIFIED, REJECTED, UNDER_REVIEW }
enum PricingMode { FIXED, HOURLY, PER_RITUAL, CUSTOM }
enum PriceType { FIXED, RANGE, PER_PANDIT, NEGOTIABLE }
enum ServiceCategory { PUJA, HAVAN, SANSKAR, ASTROLOGY, CONSULTATION, TEMPLE_SERVICE, OTHER }
enum ProductCategory { SAMAGRI, IDOL, BOOK, CLOTHING, JEWELRY, DECOR, FOOD, OTHER }
enum VenueType { HOME, TEMPLE, HALL, OUTDOOR, VIRTUAL, CUSTOM }
enum BookingStatus { PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, DISPUTED, REFUNDED, NO_SHOW }
enum PaymentStatus { PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED, PARTIAL_REFUND }
enum ReviewStatus { PUBLISHED, HIDDEN, FLAGGED, PENDING_MODERATION }
enum NotificationType { BOOKING_CONFIRMED, BOOKING_REMINDER, PAYMENT_SUCCESS, PAYMENT_FAILED, PANDAIT_ASSIGNED, REVIEW_RECEIVED, FESTIVAL_ALERT, PROMOTIONAL, SYSTEM }
enum NotificationChannel { EMAIL, SMS, WHATSAPP, PUSH, IN_APP }
enum NotificationPriority { LOW, NORMAL, HIGH, URGENT }
enum NotificationStatus { PENDING, SENT, DELIVERED, READ, FAILED }
enum TransactionType { CREDIT, DEBIT, REFUND, REWARD, BONUS }
enum TransactionStatus { PENDING, COMPLETED, FAILED, REVERSED }
```

---

## 🔧 Technical Decisions (ADRs)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Backend Framework** | NestJS | Modular, DI, Enterprise patterns, TypeScript native |
| **Database** | PostgreSQL + Prisma | ACID, JSONB, Type-safe ORM, Migrations |
| **Cache** | Redis (ioredis) | Sub-ms, Pub/Sub, Streams, Sessions |
| **Auth** | JWT + NextAuth compatible | Stateless, Scalable, Works with frontend |
| **Real-time** | Socket.io | Auto-reconnection, Rooms, Fallback transports |
| **Payments** | Razorpay (India) + Stripe (Intl) | Local + Global coverage |
| **File Storage** | S3 (AWS) + CloudFront | Scalable, CDN, Signed URLs |
| **Search** | Elasticsearch | Full-text, Filters, Analytics |
| **Message Queue** | BullMQ (Redis) | Job queues, Retries, Scheduling |
| **Logging** | Pino + Loki | Structured, Fast, Grafana integration |
| **Monitoring** | Sentry + Prometheus + Grafana | Full observability |
| **API Docs** | Swagger/OpenAPI | Auto-generated, Testable |
| **Testing** | Jest + Supertest + Playwright | Unit, Integration, E2E |

---

## 🚀 Implementation Order (Tonight)

```
1. bookmypanditji/api/           ← START HERE
   ├── package.json
   ├── tsconfig.json
   ├── nest-cli.json
   ├── .env.example
   ├── docker-compose.yml
   ├── prisma/
   │   └── schema.prisma
   └── src/
       ├── main.ts
       ├── app.module.ts
       ├── config/
       ├── common/
       │   ├── guards/
       │   ├── interceptors/
       │   ├── pipes/
       │   └── decorators/
       ├── modules/
       │   ├── auth/
       │   ├── users/
       │   ├── pandits/
       │   ├── services/
       │   ├── bookings/
       │   ├── payments/
       │   ├── products/
       │   ├── temples/
       │   ├── panchang/
       │   └── notifications/
       └── shared/
           ├── prisma/
           ├── redis/
           └── utils/

2. Update frontend to consume real APIs
3. Integration testing
4. Deploy to staging
```

---

## ✅ Definition of Done (Per Feature)

- [ ] TypeScript strict mode passes
- [ ] Unit tests > 80% coverage
- [ ] Integration tests for API endpoints
- [ ] OpenAPI/Swagger documentation
- [ ] Error handling with proper HTTP codes
- [ ] Input validation (DTO + Zod)
- [ ] Rate limiting applied
- [ ] Logging for audit trail
- [ ] Feature flagged (if experimental)
- [ ] Deployed to staging & smoke tested

---

## 📝 Notes for Tonight

**Priority Order**:
1. `prisma/schema.prisma` - Get DB models right first
2. `AuthModule` - Everything depends on auth
3. `UsersModule` + `PanditsModule` - Core entities
4. `ServicesModule` + `BookingsModule` - Business logic
5. `PaymentsModule` - Revenue critical
6. `WebSocket Gateway` - Real-time features
7. `NotificationsModule` - Engagement

**Quick Wins**:
- Use Prisma Client extensions for soft deletes
- NestJS `ConfigModule` for env validation
- `class-validator` + `class-transformer` for DTOs
- Swagger decorators on controllers for auto-docs

---

*Last Updated: August 2025*  
*Sprint: Backend Foundation - Night Build*
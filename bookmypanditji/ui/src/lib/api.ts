import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class ApiClient {
  private client: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('accessToken');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            this.clearAuth();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    this.refreshTokenPromise = (async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        return accessToken;
      } finally {
        this.refreshTokenPromise = null;
      }
    })();

    return this.refreshTokenPromise;
  }

  private clearAuth() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  // Auth
  async register(data: RegisterDto) {
    const response = await this.client.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/register', data);
    return response.data;
  }

  async login(data: LoginDto) {
    const response = await this.client.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/login', data);
    return response.data;
  }

  async refreshTokens(refreshToken: string) {
    const response = await this.client.post<ApiResponse<AuthTokens>>('/auth/refresh', { refreshToken });
    return response.data;
  }

  async logout(refreshToken?: string) {
    const response = await this.client.post('/auth/logout', { refreshToken });
    return response.data;
  }

  async changePassword(data: { oldPassword: string; newPassword: string }) {
    const response = await this.client.post('/auth/change-password', data);
    return response.data;
  }

  async forgotPassword(identifier: string) {
    const response = await this.client.post('/auth/forgot-password', { identifier });
    return response.data;
  }

  async resetPassword(token: string, newPassword: string) {
    const response = await this.client.post('/auth/reset-password', { token, newPassword });
    return response.data;
  }

  async verifyEmail(token: string) {
    const response = await this.client.post('/auth/verify-email', { token });
    return response.data;
  }

  async resendVerification() {
    const response = await this.client.post('/auth/resend-verification');
    return response.data;
  }

  async getMe() {
    const response = await this.client.get<ApiResponse<User>>('/auth/me');
    return response.data;
  }

  // Users
  async getProfile() {
    const response = await this.client.get<ApiResponse<User>>('/users/me');
    return response.data;
  }

  async updateProfile(data: Partial<User>) {
    const response = await this.client.put<ApiResponse<User>>('/users/me', data);
    return response.data;
  }

  async deactivateAccount() {
    const response = await this.client.delete('/users/me');
    return response.data;
  }

  // Virtual Users
  async getVirtualUsers() {
    const response = await this.client.get<ApiResponse<VirtualUser[]>>('/users/me/virtual-users');
    return response.data;
  }

  async addVirtualUser(data: AddVirtualUserDto) {
    const response = await this.client.post<ApiResponse<VirtualUser>>('/users/me/virtual-users', data);
    return response.data;
  }

  async updateVirtualUser(id: string, data: UpdateVirtualUserDto) {
    const response = await this.client.put<ApiResponse<VirtualUser>>(`/users/me/virtual-users/${id}`, data);
    return response.data;
  }

  async deleteVirtualUser(id: string) {
    const response = await this.client.delete(`/users/me/virtual-users/${id}`);
    return response.data;
  }

  // Addresses
  async getAddresses() {
    const response = await this.client.get<ApiResponse<Address[]>>('/users/me/addresses');
    return response.data;
  }

  async getDefaultAddress() {
    const response = await this.client.get<ApiResponse<Address>>('/users/me/addresses/default');
    return response.data;
  }

  async addAddress(data: AddAddressDto) {
    const response = await this.client.post<ApiResponse<Address>>('/users/me/addresses', data);
    return response.data;
  }

  async updateAddress(id: string, data: Partial<AddAddressDto>) {
    const response = await this.client.put<ApiResponse<Address>>(`/users/me/addresses/${id}`, data);
    return response.data;
  }

  async deleteAddress(id: string) {
    const response = await this.client.delete(`/users/me/addresses/${id}`);
    return response.data;
  }

  // Pandits
  async searchPandits(params: PanditSearchParams) {
    const response = await this.client.get<ApiResponse<PaginatedResponse<Pandit>>>('/pandits/search', { params });
    return response.data;
  }

  async getFeaturedPandits(limit = 6) {
    const response = await this.client.get<ApiResponse<Pandit[]>>('/pandits/featured', { params: { limit } });
    return response.data;
  }

  async getPanditProfile(id: string) {
    const response = await this.client.get<ApiResponse<Pandit>>(`/pandits/${id}`);
    return response.data;
  }

  async createPanditProfile(data: CreatePanditProfileDto) {
    const response = await this.client.post<ApiResponse<Pandit>>('/pandits/profile', data);
    return response.data;
  }

  async getMyPanditProfile() {
    const response = await this.client.get<ApiResponse<Pandit>>('/pandits/me/profile');
    return response.data;
  }

  async updateMyPanditProfile(data: UpdatePanditProfileDto) {
    const response = await this.client.put<ApiResponse<Pandit>>('/pandits/me/profile', data);
    return response.data;
  }

  async updateAvailability(data: UpdateAvailabilityDto) {
    const response = await this.client.put<ApiResponse<Pandit>>('/pandits/me/availability', data);
    return response.data;
  }

  async getPanditStats() {
    const response = await this.client.get<ApiResponse<PanditStats>>('/pandits/me/stats');
    return response.data;
  }

  async getEarnings(period: 'week' | 'month' | 'year' = 'month') {
    const response = await this.client.get<ApiResponse<EarningsData>>('/pandits/me/earnings', { params: { period } });
    return response.data;
  }

  // Services
  async searchServices(params: ServiceSearchParams) {
    const response = await this.client.get<ApiResponse<PaginatedResponse<Service>>>('/services', { params });
    return response.data;
  }

  async getServiceCategories() {
    const response = await this.client.get<ApiResponse<ServiceCategory[]>>('/services/categories');
    return response.data;
  }

  async getFeaturedServices(limit = 8) {
    const response = await this.client.get<ApiResponse<Service[]>>('/services/featured', { params: { limit } });
    return response.data;
  }

  async getServiceById(id: string) {
    const response = await this.client.get<ApiResponse<Service>>(`/services/${id}`);
    return response.data;
  }

  async getServiceBySlug(slug: string) {
    const response = await this.client.get<ApiResponse<Service>>(`/services/slug/${slug}`);
    return response.data;
  }

  // Bookings
  async createBooking(data: CreateBookingDto) {
    const response = await this.client.post<ApiResponse<Booking>>('/bookings', data);
    return response.data;
  }

  async getMyBookings(params: BookingSearchParams) {
    const response = await this.client.get<ApiResponse<PaginatedResponse<Booking>>>('/bookings/me', { params });
    return response.data;
  }

  async getUpcomingBookings(limit = 5) {
    const response = await this.client.get<ApiResponse<Booking[]>>('/bookings/me/upcoming', { params: { limit } });
    return response.data;
  }

  async getBookingStats() {
    const response = await this.client.get<ApiResponse<BookingStats>>('/bookings/me/stats');
    return response.data;
  }

  async getBookingById(id: string) {
    const response = await this.client.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data;
  }

  async getBookingByNumber(bookingNumber: string) {
    const response = await this.client.get<ApiResponse<Booking>>(`/bookings/number/${bookingNumber}`);
    return response.data;
  }

  async updateBooking(id: string, data: UpdateBookingDto) {
    const response = await this.client.put<ApiResponse<Booking>>(`/bookings/${id}`, data);
    return response.data;
  }

  async cancelBooking(id: string, reason: string) {
    const response = await this.client.post<ApiResponse<Booking>>(`/bookings/${id}/cancel`, { reason });
    return response.data;
  }

  // Pandit booking actions
  async confirmBooking(id: string) {
    const response = await this.client.post<ApiResponse<Booking>>(`/bookings/${id}/confirm`);
    return response.data;
  }

  async startBooking(id: string) {
    const response = await this.client.post<ApiResponse<Booking>>(`/bookings/${id}/start`);
    return response.data;
  }

  async completeBooking(id: string) {
    const response = await this.client.post<ApiResponse<Booking>>(`/bookings/${id}/complete`);
    return response.data;
  }

  async getPanditBookings(params: BookingSearchParams) {
    const response = await this.client.get<ApiResponse<PaginatedResponse<Booking>>>('/bookings/pandit/me', { params });
    return response.data;
  }

  // Products
  async searchProducts(params: ProductSearchParams) {
    const response = await this.client.get<ApiResponse<PaginatedResponse<Product>>>('/products', { params });
    return response.data;
  }

  async getProductCategories() {
    const response = await this.client.get<ApiResponse<ProductCategory[]>>('/products/categories');
    return response.data;
  }

  async getFeaturedProducts(limit = 8) {
    const response = await this.client.get<ApiResponse<Product[]>>('/products/featured', { params: { limit } });
    return response.data;
  }

  async getProductById(id: string) {
    const response = await this.client.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  }

  async getProductBySlug(slug: string) {
    const response = await this.client.get<ApiResponse<Product>>(`/products/slug/${slug}`);
    return response.data;
  }

  // Temples
  async searchTemples(params: TempleSearchParams) {
    const response = await this.client.get<ApiResponse<PaginatedResponse<Temple>>>('/temples', { params });
    return response.data;
  }

  async getLiveDarshanTemples() {
    const response = await this.client.get<ApiResponse<Temple[]>>('/temples/live-darshan');
    return response.data;
  }

  async getTempleCities() {
    const response = await this.client.get<ApiResponse<{ city: string; state: string }[]>>('/temples/cities');
    return response.data;
  }

  async getTempleById(id: string) {
    const response = await this.client.get<ApiResponse<Temple>>(`/temples/${id}`);
    return response.data;
  }

  async getTempleBySlug(slug: string) {
    const response = await this.client.get<ApiResponse<Temple>>(`/temples/slug/${slug}`);
    return response.data;
  }

  // Panchang
  async getTodaysPanchang() {
    const response = await this.client.get<ApiResponse<PanchangEntry>>('/panchang/today');
    return response.data;
  }

  async getPanchangByDate(date: string) {
    const response = await this.client.get<ApiResponse<PanchangEntry>>(`/panchang/date/${date}`);
    return response.data;
  }

  async getPanchangRange(fromDate: string, toDate: string) {
    const response = await this.client.get<ApiResponse<PanchangEntry[]>>('/panchang/range', { params: { fromDate, toDate } });
    return response.data;
  }

  async getMonthlyPanchang(year: number, month: number) {
    const response = await this.client.get<ApiResponse<PanchangEntry[]>>(`/panchang/month/${year}/${month}`);
    return response.data;
  }

  async getUpcomingFestivals(days = 30) {
    const response = await this.client.get<ApiResponse<{ date: string; festivals: string[]; vrats: string[] }[]>>('/panchang/festivals/upcoming', { params: { days } });
    return response.data;
  }

  // Payments
  async createPayment(data: CreatePaymentDto) {
    const response = await this.client.post<ApiResponse<Payment>>('/payments/create', data);
    return response.data;
  }

  async createRazorpayOrder(bookingId: string) {
    const response = await this.client.post<ApiResponse<{ orderId: string; amount: number; currency: string; keyId: string }>>(`/payments/razorpay/order/${bookingId}`);
    return response.data;
  }

  async getPaymentsByBooking(bookingId: string) {
    const response = await this.client.get<ApiResponse<Payment[]>>(`/payments/booking/${bookingId}`);
    return response.data;
  }

  // Notifications
  async getNotifications(params: { page?: number; limit?: number; status?: string }) {
    const response = await this.client.get<ApiResponse<PaginatedResponse<Notification>>>('/notifications', { params });
    return response.data;
  }

  async getUnreadCount() {
    const response = await this.client.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
    return response.data;
  }

  async markAsRead(id: string) {
    const response = await this.client.put<ApiResponse<Notification>>(`/notifications/${id}/read`);
    return response.data;
  }

  async markAllAsRead() {
    const response = await this.client.put<ApiResponse<{ count: number }>>('/notifications/read-all');
    return response.data;
  }

  async deleteNotification(id: string) {
    const response = await this.client.delete(`/notifications/${id}`);
    return response.data;
  }

  // Chat
  async getChatRooms() {
    const response = await this.client.get<ApiResponse<ChatRoom[]>>('/chat/rooms');
    return response.data;
  }

  async getChatMessages(roomId: string, page = 1, limit = 50) {
    const response = await this.client.get<ApiResponse<PaginatedResponse<ChatMessage>>>(`/chat/rooms/${roomId}/messages`, { params: { page, limit } });
    return response.data;
  }

  // Health
  async healthCheck() {
    const response = await this.client.get('/health');
    return response.data;
  }
}

// Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  avatar: string | null;
  role: 'USER' | 'PANDIT' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';
  emailVerified: string | null;
  phoneVerified: string | null;
  lastLoginAt: string | null;
  dateOfBirth: string | null;
  timeOfBirth: string | null;
  birthPlace: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | null;
  anniversaryDate: string | null;
  spouseName: string | null;
  spousePhone: string | null;
  spouseDob: string | null;
  spouseTob: string | null;
  children: any;
  facebookId: string | null;
  facebookToken: string | null;
  canPostToFb: boolean;
  wallet?: Wallet;
  addresses?: Address[];
  virtualUsers?: VirtualUser[];
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: string;
  loyaltyPoints: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  type: string;
  name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VirtualUser {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  dateOfBirth: string | null;
  timeOfBirth: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
  phone: string | null;
  email: string | null;
  facebookId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pandit {
  id: string;
  userId: string;
  user: Pick<User, 'id' | 'name' | 'avatar' | 'phone' | 'email'>;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'UNDER_REVIEW';
  verifiedAt: string | null;
  verifiedBy: string | null;
  rejectionReason: string | null;
  documents: string[];
  title: string | null;
  bio: string | null;
  experienceYears: number;
  education: string | null;
  specializations: string[];
  languages: string[];
  serviceCities: string[];
  serviceRadius: number | null;
  baseLatitude: number | null;
  baseLongitude: number | null;
  addressId: string | null;
  address: Address | null;
  weeklySchedule: Record<string, { start: string; end: string }[]>;
  blockedDates: string[];
  basePrice: string;
  pricingMode: 'FIXED' | 'HOURLY' | 'PER_RITUAL' | 'CUSTOM';
  customPricing: Record<string, number> | null;
  galleryImages: string[];
  videoIntro: string | null;
  rating: number;
  reviewCount: number;
  totalBookings: number;
  completedBookings: number;
  earnings: string;
  services: PanditService[];
  availability: Availability[];
  createdAt: string;
  updatedAt: string;
}

export interface PanditService {
  id: string;
  panditId: string;
  serviceId: string;
  service: Service;
  price: string;
  isActive: boolean;
}

export interface Availability {
  id: string;
  panditId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  category: ServiceCategory;
  subCategory: string | null;
  durationMinutes: number;
  minPandits: number;
  maxPandits: number;
  requiredSamagri: any[];
  optionalSamagri: any[];
  basePrice: string;
  priceType: 'FIXED' | 'RANGE' | 'PER_PANDIT' | 'NEGOTIABLE';
  priceRangeMin: string | null;
  priceRangeMax: string | null;
  images: string[];
  videoUrl: string | null;
  advanceBookingDays: number;
  allowUrgentBooking: boolean;
  urgentSurcharge: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[];
  panditServices: PanditService[];
  bookings: Booking[];
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory = 'PUJA' | 'HAVAN' | 'SANSKAR' | 'ASTROLOGY' | 'CONSULTATION' | 'TEMPLE_SERVICE' | 'OTHER';

export interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;
  user: Pick<User, 'id' | 'name' | 'avatar' | 'email' | 'phone'>;
  panditId: string | null;
  pandit: Pandit | null;
  serviceId: string;
  service: Service;
  bookingDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  venueType: 'HOME' | 'TEMPLE' | 'HALL' | 'OUTDOOR' | 'VIRTUAL' | 'CUSTOM';
  venueAddress: string;
  venueLatitude: number | null;
  venueLongitude: number | null;
  templeId: string | null;
  temple: Temple | null;
  landmark: string | null;
  participants: number;
  specialRequests: string | null;
  servicePrice: string;
  samagriPrice: string;
  travelCharges: string;
  platformFee: string;
  discount: string;
  taxAmount: string;
  totalAmount: string;
  currency: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED' | 'REFUNDED' | 'NO_SHOW';
  paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIAL_REFUND';
  confirmedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  samagriItems: BookingSamagri[];
  payments: Payment[];
  reviews: Review[];
  timeline: BookingTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface BookingSamagri {
  id: string;
  bookingId: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

export interface BookingTimeline {
  id: string;
  bookingId: string;
  status: string;
  note: string | null;
  createdBy: string | null;
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  category: ProductCategory;
  price: string;
  compareAtPrice: string | null;
  costPrice: string | null;
  stockQuantity: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  weight: number | null;
  dimensions: { l: number; w: number; h: number } | null;
  images: string[];
  videoUrl: string | null;
  services: Service[];
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory = 'SAMAGRI' | 'IDOL' | 'BOOK' | 'CLOTHING' | 'JEWELRY' | 'DECOR' | 'FOOD' | 'OTHER';

export interface Temple {
  id: string;
  name: string;
  slug: string;
  description: string;
  deity: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string | null;
  latitude: number;
  longitude: number;
  hasLiveDarshan: boolean;
  streamUrl: string | null;
  streamSchedule: Record<string, { start: string; end: string }[]> | null;
  streamProvider: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  images: string[];
  virtualTourUrl: string | null;
  openingTime: string | null;
  closingTime: string | null;
  aartiTimings: any | null;
  facilities: string[];
  festivals: string[];
  bookings: Booking[];
  createdAt: string;
  updatedAt: string;
}

export interface PanchangEntry {
  id: string;
  date: string;
  tithi: string;
  paksha: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  moonrise: string | null;
  moonset: string | null;
  festivals: string[];
  vrats: string[];
  muhurat: any | null;
  choghadiya: any | null;
  rahukalam: string | null;
  yamagandam: string | null;
  gulikai: string | null;
  regionalVariations: any | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: string;
  currency: string;
  method: string;
  providerId: string | null;
  providerOrderId: string | null;
  providerPaymentId: string | null;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIAL_REFUND';
  errorMessage: string | null;
  paidAt: string | null;
  refundedAt: string | null;
  refundReason: string | null;
  metadata: any | null;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  channel: string[];
  title: string;
  message: string;
  data: any | null;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  scheduledAt: string | null;
  sentAt: string | null;
  readAt: string | null;
  error: string | null;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  bookingId: string | null;
  booking: Booking | null;
  userId: string;
  user: Pick<User, 'id' | 'name' | 'avatar'>;
  panditId: string;
  pandit: Pick<Pandit, 'id'> & { user: Pick<User, 'id' | 'name' | 'avatar'> };
  isActive: boolean;
  lastMessage: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  metadata: any | null;
  readAt: string | null;
  createdAt: string;
}

export interface PanditStats {
  rating: number;
  reviewCount: number;
  totalBookings: number;
  completedBookings: number;
  earnings: string;
  upcomingBookings: number;
  thisMonthEarnings: string;
}

export interface EarningsData {
  total: string;
  platformFees: string;
  netEarnings: string;
  count: number;
  period: string;
}

export interface BookingStats {
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  totalSpent: string;
}

// DTOs
export interface RegisterDto {
  email?: string;
  phone?: string;
  password: string;
  name: string;
  role?: 'USER' | 'PANDIT' | 'ADMIN' | 'SUPER_ADMIN';
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface LoginDto {
  identifier: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface CreatePanditProfileDto {
  title?: string;
  bio?: string;
  experienceYears?: number;
  education?: string;
  specializations?: string[];
  languages?: string[];
  serviceCities: string[];
  serviceRadius?: number;
  baseLatitude?: number;
  baseLongitude?: number;
  addressId?: string;
  weeklySchedule?: Record<string, { start: string; end: string }[]>;
  blockedDates?: string[];
  basePrice: number;
  pricingMode?: 'FIXED' | 'HOURLY' | 'PER_RITUAL' | 'CUSTOM';
  customPricing?: Record<string, number>;
  galleryImages?: string[];
  videoIntro?: string;
  documents?: string[];
}

export interface UpdatePanditProfileDto {
  title?: string;
  bio?: string;
  experienceYears?: number;
  education?: string;
  specializations?: string[];
  languages?: string[];
  serviceCities?: string[];
  serviceRadius?: number;
  baseLatitude?: number;
  baseLongitude?: number;
  addressId?: string;
  weeklySchedule?: Record<string, { start: string; end: string }[]>;
  blockedDates?: string[];
  basePrice?: number;
  pricingMode?: 'FIXED' | 'HOURLY' | 'PER_RITUAL' | 'CUSTOM';
  customPricing?: Record<string, number>;
  galleryImages?: string[];
  videoIntro?: string;
}

export interface UpdateAvailabilityDto {
  weeklySchedule?: Record<string, { start: string; end: string }[]>;
  blockedDates?: string[];
}

export interface PanditSearchParams {
  page?: number;
  limit?: number;
  city?: string;
  specialization?: string;
  language?: string;
  minRating?: number;
  maxPrice?: number;
  lat?: number;
  lng?: number;
  radius?: number;
  sortBy?: 'rating' | 'price' | 'experience' | 'bookings';
  sortOrder?: 'asc' | 'desc';
}

export interface ServiceSearchParams {
  page?: number;
  limit?: number;
  category?: ServiceCategory;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'basePrice' | 'category' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface BookingSearchParams {
  page?: number;
  limit?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: 'bookingDate' | 'createdAt' | 'totalAmount';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateBookingDto {
  serviceId: string;
  panditId?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  timezone?: string;
  venueType?: 'HOME' | 'TEMPLE' | 'HALL' | 'OUTDOOR' | 'VIRTUAL' | 'CUSTOM';
  venueAddress: string;
  venueLatitude?: number;
  venueLongitude?: number;
  templeId?: string;
  landmark?: string;
  participants?: number;
  specialRequests?: string;
  samagriItems?: { productId: string; quantity: number }[];
  travelCharges?: number;
}

export interface UpdateBookingDto {
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  venueAddress?: string;
  venueLatitude?: number;
  venueLongitude?: number;
  landmark?: string;
  specialRequests?: string;
}

export interface ProductSearchParams {
  page?: number;
  limit?: number;
  category?: ProductCategory;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'category' | 'createdAt' | 'stockQuantity';
  sortOrder?: 'asc' | 'desc';
}

export interface TempleSearchParams {
  page?: number;
  limit?: number;
  city?: string;
  state?: string;
  hasLiveDarshan?: boolean;
  search?: string;
  sortBy?: 'name' | 'city' | 'state' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreatePaymentDto {
  bookingId: string;
  amount: number;
  currency?: string;
  method: 'RAZORPAY' | 'STRIPE' | 'WALLET' | 'UPI' | 'CARD' | 'NET_BANKING';
  metadata?: any;
}

export interface AddVirtualUserDto {
  name: string;
  relationship: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  email?: string;
  facebookId?: string;
}

export interface UpdateVirtualUserDto {
  name?: string;
  relationship?: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  email?: string;
  facebookId?: string;
  isActive?: boolean;
}

export interface AddAddressDto {
  type: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  panditId: string | null;
  serviceId: string | null;
  productId: string | null;
  bookingId: string | null;
  rating: number;
  title: string | null;
  content: string;
  images: string[];
  isVerified: boolean;
  status: 'PUBLISHED' | 'HIDDEN' | 'FLAGGED' | 'PENDING_MODERATION';
  panditResponse: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Export singleton instance
export const api = new ApiClient();
export default api;
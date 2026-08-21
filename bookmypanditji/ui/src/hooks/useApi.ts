import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type {
  PaginatedResponse,
  Pandit,
  PanditSearchParams,
  Service,
  ServiceSearchParams,
  Booking,
  BookingSearchParams,
  CreateBookingDto,
  UpdateBookingDto,
  Product,
  ProductSearchParams,
  Temple,
  TempleSearchParams,
  PanchangEntry,
  Notification,
  ChatRoom,
  ChatMessage,
  User,
  Address,
  VirtualUser,
  AddVirtualUserDto,
  UpdateVirtualUserDto,
  AddAddressDto,
  PanditStats,
  EarningsData,
  BookingStats,
  Payment,
  CreatePaymentDto,
  RegisterDto,
  LoginDto,
  CreatePanditProfileDto,
  UpdatePanditProfileDto,
  UpdateAvailabilityDto,
  PanditService,
  Review,
} from '@/lib/api';

// Query Keys
export const queryKeys = {
  // Auth
  me: ['auth', 'me'] as const,
  
  // Users
  profile: ['users', 'profile'] as const,
  virtualUsers: ['users', 'virtual-users'] as const,
  addresses: ['users', 'addresses'] as const,
  defaultAddress: ['users', 'addresses', 'default'] as const,
  
  // Pandits
  pandits: (params: PanditSearchParams) => ['pandits', 'search', params] as const,
  featuredPandits: (limit: number) => ['pandits', 'featured', limit] as const,
  panditProfile: (id: string) => ['pandits', 'profile', id] as const,
  myPanditProfile: ['pandits', 'me', 'profile'] as const,
  panditAvailability: ['pandits', 'me', 'availability'] as const,
  panditStats: ['pandits', 'me', 'stats'] as const,
  panditEarnings: (period: string) => ['pandits', 'me', 'earnings', period] as const,
  
  // Services
  services: (params: ServiceSearchParams) => ['services', 'search', params] as const,
  serviceCategories: ['services', 'categories'] as const,
  featuredServices: (limit: number) => ['services', 'featured', limit] as const,
  service: (id: string) => ['services', id] as const,
  serviceBySlug: (slug: string) => ['services', 'slug', slug] as const,
  
  // Bookings
  myBookings: (params: BookingSearchParams) => ['bookings', 'me', params] as const,
  upcomingBookings: (limit: number) => ['bookings', 'me', 'upcoming', limit] as const,
  bookingStats: ['bookings', 'me', 'stats'] as const,
  booking: (id: string) => ['bookings', id] as const,
  bookingByNumber: (bookingNumber: string) => ['bookings', 'number', bookingNumber] as const,
  panditBookings: (params: BookingSearchParams) => ['bookings', 'pandit', 'me', params] as const,
  
  // Products
  products: (params: ProductSearchParams) => ['products', 'search', params] as const,
  productCategories: ['products', 'categories'] as const,
  featuredProducts: (limit: number) => ['products', 'featured', limit] as const,
  product: (id: string) => ['products', id] as const,
  productBySlug: (slug: string) => ['products', 'slug', slug] as const,
  
  // Temples
  temples: (params: TempleSearchParams) => ['temples', 'search', params] as const,
  liveDarshanTemples: ['temples', 'live-darshan'] as const,
  templeCities: ['temples', 'cities'] as const,
  temple: (id: string) => ['temples', id] as const,
  templeBySlug: (slug: string) => ['temples', 'slug', slug] as const,
  
  // Panchang
  todaysPanchang: ['panchang', 'today'] as const,
  panchangByDate: (date: string) => ['panchang', 'date', date] as const,
  panchangRange: (fromDate: string, toDate: string) => ['panchang', 'range', fromDate, toDate] as const,
  monthlyPanchang: (year: number, month: number) => ['panchang', 'month', year, month] as const,
  upcomingFestivals: (days: number) => ['panchang', 'festivals', days] as const,
  
  // Payments
  paymentsByBooking: (bookingId: string) => ['payments', 'booking', bookingId] as const,
  
  // Notifications
  notifications: (params: { page?: number; limit?: number; status?: string }) => ['notifications', params] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
  
  // Chat
  chatRooms: ['chat', 'rooms'] as const,
  chatMessages: (roomId: string, page: number, limit: number) => ['chat', 'messages', roomId, page, limit] as const,
};

// User hooks
export function useProfile(options?: UseQueryOptions<User>) {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => api.getProfile().then(res => res.data),
    ...options,
  });
}

export function useVirtualUsers(options?: UseQueryOptions<VirtualUser[]>) {
  return useQuery({
    queryKey: queryKeys.virtualUsers,
    queryFn: () => api.getVirtualUsers().then(res => res.data),
    ...options,
  });
}

export function useAddresses(options?: UseQueryOptions<Address[]>) {
  return useQuery({
    queryKey: queryKeys.addresses,
    queryFn: () => api.getAddresses().then(res => res.data),
    ...options,
  });
}

export function useDefaultAddress(options?: UseQueryOptions<Address>) {
  return useQuery({
    queryKey: queryKeys.defaultAddress,
    queryFn: () => api.getDefaultAddress().then(res => res.data),
    ...options,
  });
}

export function useAddVirtualUser(options?: UseMutationOptions<VirtualUser, Error, AddVirtualUserDto>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddVirtualUserDto) => api.addVirtualUser(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.virtualUsers });
    },
    ...options,
  });
}

export function useUpdateVirtualUser(options?: UseMutationOptions<VirtualUser, Error, { id: string; data: UpdateVirtualUserDto }>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.updateVirtualUser(id, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.virtualUsers });
    },
    ...options,
  });
}

export function useDeleteVirtualUser(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteVirtualUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.virtualUsers });
    },
    ...options,
  });
}

export function useAddAddress(options?: UseMutationOptions<Address, Error, AddAddressDto>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddAddressDto) => api.addAddress(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses });
      queryClient.invalidateQueries({ queryKey: queryKeys.defaultAddress });
    },
    ...options,
  });
}

export function useUpdateAddress(options?: UseMutationOptions<Address, Error, { id: string; data: Partial<AddAddressDto> }>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.updateAddress(id, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses });
      queryClient.invalidateQueries({ queryKey: queryKeys.defaultAddress });
    },
    ...options,
  });
}

export function useDeleteAddress(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses });
      queryClient.invalidateQueries({ queryKey: queryKeys.defaultAddress });
    },
    ...options,
  });
}

// Pandit hooks
export function usePandits(params: PanditSearchParams, options?: UseQueryOptions<PaginatedResponse<Pandit>>) {
  return useQuery({
    queryKey: queryKeys.pandits(params),
    queryFn: () => api.searchPandits(params).then(res => res.data),
    ...options,
  });
}

export function useFeaturedPandits(limit = 6, options?: UseQueryOptions<Pandit[]>) {
  return useQuery({
    queryKey: queryKeys.featuredPandits(limit),
    queryFn: () => api.getFeaturedPandits(limit).then(res => res.data),
    ...options,
  });
}

export function usePanditProfile(id: string, options?: UseQueryOptions<Pandit>) {
  return useQuery({
    queryKey: queryKeys.panditProfile(id),
    queryFn: () => api.getPanditProfile(id).then(res => res.data),
    enabled: !!id,
    ...options,
  });
}

export function useMyPanditProfile(options?: UseQueryOptions<Pandit>) {
  return useQuery({
    queryKey: queryKeys.myPanditProfile,
    queryFn: () => api.getMyPanditProfile().then(res => res.data),
    ...options,
  });
}

export function useCreatePanditProfile(options?: UseMutationOptions<Pandit, Error, CreatePanditProfileDto>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePanditProfileDto) => api.createPanditProfile(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myPanditProfile });
    },
    ...options,
  });
}

export function useUpdateMyPanditProfile(options?: UseMutationOptions<Pandit, Error, UpdatePanditProfileDto>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePanditProfileDto) => api.updateMyPanditProfile(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myPanditProfile });
      queryClient.invalidateQueries({ queryKey: queryKeys.panditAvailability });
    },
    ...options,
  });
}

export function useUpdateAvailability(options?: UseMutationOptions<Pandit, Error, UpdateAvailabilityDto>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateAvailabilityDto) => api.updateAvailability(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myPanditProfile });
      queryClient.invalidateQueries({ queryKey: queryKeys.panditAvailability });
    },
    ...options,
  });
}

export function usePanditStats(options?: UseQueryOptions<PanditStats>) {
  return useQuery({
    queryKey: queryKeys.panditStats,
    queryFn: () => api.getPanditStats().then(res => res.data),
    ...options,
  });
}

export function useEarnings(period: 'week' | 'month' | 'year' = 'month', options?: UseQueryOptions<EarningsData>) {
  return useQuery({
    queryKey: queryKeys.panditEarnings(period),
    queryFn: () => api.getEarnings(period).then(res => res.data),
    ...options,
  });
}

// Service hooks
export function useServices(params: ServiceSearchParams, options?: UseQueryOptions<PaginatedResponse<Service>>) {
  return useQuery({
    queryKey: queryKeys.services(params),
    queryFn: () => api.searchServices(params).then(res => res.data),
    ...options,
  });
}

export function useServiceCategories(options?: UseQueryOptions<string[]>) {
  return useQuery({
    queryKey: queryKeys.serviceCategories,
    queryFn: () => api.getServiceCategories().then(res => res.data),
    ...options,
  });
}

export function useFeaturedServices(limit = 8, options?: UseQueryOptions<Service[]>) {
  return useQuery({
    queryKey: queryKeys.featuredServices(limit),
    queryFn: () => api.getFeaturedServices(limit).then(res => res.data),
    ...options,
  });
}

export function useService(id: string, options?: UseQueryOptions<Service>) {
  return useQuery({
    queryKey: queryKeys.service(id),
    queryFn: () => api.getServiceById(id).then(res => res.data),
    enabled: !!id,
    ...options,
  });
}

export function useServiceBySlug(slug: string, options?: UseQueryOptions<Service>) {
  return useQuery({
    queryKey: queryKeys.serviceBySlug(slug),
    queryFn: () => api.getServiceBySlug(slug).then(res => res.data),
    enabled: !!slug,
    ...options,
  });
}

// Booking hooks
export function useMyBookings(params: BookingSearchParams, options?: UseQueryOptions<PaginatedResponse<Booking>>) {
  return useQuery({
    queryKey: queryKeys.myBookings(params),
    queryFn: () => api.getMyBookings(params).then(res => res.data),
    ...options,
  });
}

export function useUpcomingBookings(limit = 5, options?: UseQueryOptions<Booking[]>) {
  return useQuery({
    queryKey: queryKeys.upcomingBookings(limit),
    queryFn: () => api.getUpcomingBookings(limit).then(res => res.data),
    ...options,
  });
}

export function useBookingStats(options?: UseQueryOptions<BookingStats>) {
  return useQuery({
    queryKey: queryKeys.bookingStats,
    queryFn: () => api.getBookingStats().then(res => res.data),
    ...options,
  });
}

export function useBooking(id: string, options?: UseQueryOptions<Booking>) {
  return useQuery({
    queryKey: queryKeys.booking(id),
    queryFn: () => api.getBookingById(id).then(res => res.data),
    enabled: !!id,
    ...options,
  });
}

export function useBookingByNumber(bookingNumber: string, options?: UseQueryOptions<Booking>) {
  return useQuery({
    queryKey: queryKeys.bookingByNumber(bookingNumber),
    queryFn: () => api.getBookingByNumber(bookingNumber).then(res => res.data),
    enabled: !!bookingNumber,
    ...options,
  });
}

export function useCreateBooking(options?: UseMutationOptions<Booking, Error, CreateBookingDto>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookingDto) => api.createBooking(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myBookings });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookingStats });
      queryClient.invalidateQueries({ queryKey: queryKeys.upcomingBookings });
    },
    ...options,
  });
}

export function useUpdateBooking(options?: UseMutationOptions<Booking, Error, { id: string; data: UpdateBookingDto }>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.updateBooking(id, data).then(res => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.booking(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.myBookings });
    },
    ...options,
  });
}

export function useCancelBooking(options?: UseMutationOptions<Booking, Error, { id: string; reason: string }>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => api.cancelBooking(id, reason).then(res => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.booking(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.myBookings });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookingStats });
    },
    ...options,
  });
}

export function useConfirmBooking(options?: UseMutationOptions<Booking, Error, string>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.confirmBooking(id).then(res => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.booking(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.panditBookings });
    },
    ...options,
  });
}

export function useStartBooking(options?: UseMutationOptions<Booking, Error, string>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.startBooking(id).then(res => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.booking(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.panditBookings });
    },
    ...options,
  });
}

export function useCompleteBooking(options?: UseMutationOptions<Booking, Error, string>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.completeBooking(id).then(res => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.booking(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.panditBookings });
      queryClient.invalidateQueries({ queryKey: queryKeys.panditStats });
    },
    ...options,
  });
}

export function usePanditBookings(params: BookingSearchParams, options?: UseQueryOptions<PaginatedResponse<Booking>>) {
  return useQuery({
    queryKey: queryKeys.panditBookings(params),
    queryFn: () => api.getPanditBookings(params).then(res => res.data),
    ...options,
  });
}

// Product hooks
export function useProducts(params: ProductSearchParams, options?: UseQueryOptions<PaginatedResponse<Product>>) {
  return useQuery({
    queryKey: queryKeys.products(params),
    queryFn: () => api.searchProducts(params).then(res => res.data),
    ...options,
  });
}

export function useProductCategories(options?: UseQueryOptions<string[]>) {
  return useQuery({
    queryKey: queryKeys.productCategories,
    queryFn: () => api.getProductCategories().then(res => res.data),
    ...options,
  });
}

export function useFeaturedProducts(limit = 8, options?: UseQueryOptions<Product[]>) {
  return useQuery({
    queryKey: queryKeys.featuredProducts(limit),
    queryFn: () => api.getFeaturedProducts(limit).then(res => res.data),
    ...options,
  });
}

export function useProduct(id: string, options?: UseQueryOptions<Product>) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => api.getProductById(id).then(res => res.data),
    enabled: !!id,
    ...options,
  });
}

export function useProductBySlug(slug: string, options?: UseQueryOptions<Product>) {
  return useQuery({
    queryKey: queryKeys.productBySlug(slug),
    queryFn: () => api.getProductBySlug(slug).then(res => res.data),
    enabled: !!slug,
    ...options,
  });
}

// Temple hooks
export function useTemples(params: TempleSearchParams, options?: UseQueryOptions<PaginatedResponse<Temple>>) {
  return useQuery({
    queryKey: queryKeys.temples(params),
    queryFn: () => api.searchTemples(params).then(res => res.data),
    ...options,
  });
}

export function useLiveDarshanTemples(options?: UseQueryOptions<Temple[]>) {
  return useQuery({
    queryKey: queryKeys.liveDarshanTemples,
    queryFn: () => api.getLiveDarshanTemples().then(res => res.data),
    ...options,
  });
}

export function useTempleCities(options?: UseQueryOptions<{ city: string; state: string }[]>) {
  return useQuery({
    queryKey: queryKeys.templeCities,
    queryFn: () => api.getTempleCities().then(res => res.data),
    ...options,
  });
}

export function useTemple(id: string, options?: UseQueryOptions<Temple>) {
  return useQuery({
    queryKey: queryKeys.temple(id),
    queryFn: () => api.getTempleById(id).then(res => res.data),
    enabled: !!id,
    ...options,
  });
}

export function useTempleBySlug(slug: string, options?: UseQueryOptions<Temple>) {
  return useQuery({
    queryKey: queryKeys.templeBySlug(slug),
    queryFn: () => api.getTempleBySlug(slug).then(res => res.data),
    enabled: !!slug,
    ...options,
  });
}

// Panchang hooks
export function useTodaysPanchang(options?: UseQueryOptions<PanchangEntry>) {
  return useQuery({
    queryKey: queryKeys.todaysPanchang,
    queryFn: () => api.getTodaysPanchang().then(res => res.data),
    ...options,
  });
}

export function usePanchangByDate(date: string, options?: UseQueryOptions<PanchangEntry>) {
  return useQuery({
    queryKey: queryKeys.panchangByDate(date),
    queryFn: () => api.getPanchangByDate(date).then(res => res.data),
    enabled: !!date,
    ...options,
  });
}

export function usePanchangRange(fromDate: string, toDate: string, options?: UseQueryOptions<PanchangEntry[]>) {
  return useQuery({
    queryKey: queryKeys.panchangRange(fromDate, toDate),
    queryFn: () => api.getPanchangRange(fromDate, toDate).then(res => res.data),
    enabled: !!fromDate && !!toDate,
    ...options,
  });
}

export function useMonthlyPanchang(year: number, month: number, options?: UseQueryOptions<PanchangEntry[]>) {
  return useQuery({
    queryKey: queryKeys.monthlyPanchang(year, month),
    queryFn: () => api.getMonthlyPanchang(year, month).then(res => res.data),
    enabled: !!year && !!month,
    ...options,
  });
}

export function useUpcomingFestivals(days = 30, options?: UseQueryOptions<{ date: string; festivals: string[]; vrats: string[] }[]>) {
  return useQuery({
    queryKey: queryKeys.upcomingFestivals(days),
    queryFn: () => api.getUpcomingFestivals(days).then(res => res.data),
    ...options,
  });
}

// Payment hooks
export function useCreatePayment(options?: UseMutationOptions<Payment, Error, CreatePaymentDto>) {
  return useMutation({
    mutationFn: (data: CreatePaymentDto) => api.createPayment(data).then(res => res.data),
    ...options,
  });
}

export function useCreateRazorpayOrder(options?: UseMutationOptions<{ orderId: string; amount: number; currency: string; keyId: string }, Error, string>) {
  return useMutation({
    mutationFn: (bookingId: string) => api.createRazorpayOrder(bookingId).then(res => res.data),
    ...options,
  });
}

export function usePaymentsByBooking(bookingId: string, options?: UseQueryOptions<Payment[]>) {
  return useQuery({
    queryKey: queryKeys.paymentsByBooking(bookingId),
    queryFn: () => api.getPaymentsByBooking(bookingId).then(res => res.data),
    enabled: !!bookingId,
    ...options,
  });
}

// Notification hooks
export function useNotifications(params: { page?: number; limit?: number; status?: string }, options?: UseQueryOptions<PaginatedResponse<Notification>>) {
  return useQuery({
    queryKey: queryKeys.notifications(params),
    queryFn: () => api.getNotifications(params).then(res => res.data),
    ...options,
  });
}

export function useUnreadCount(options?: UseQueryOptions<{ count: number }>) {
  return useQuery({
    queryKey: queryKeys.unreadCount,
    queryFn: () => api.getUnreadCount().then(res => res.data),
    refetchInterval: 30000, // Refetch every 30 seconds
    ...options,
  });
}

export function useMarkAsRead(options?: UseMutationOptions<Notification, Error, string>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.markAsRead(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
    },
    ...options,
  });
}

export function useMarkAllAsRead(options?: UseMutationOptions<{ count: number }, Error>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.markAllAsRead().then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
    },
    ...options,
  });
}

export function useDeleteNotification(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
    },
    ...options,
  });
}

// Chat hooks
export function useChatRooms(options?: UseQueryOptions<ChatRoom[]>) {
  return useQuery({
    queryKey: queryKeys.chatRooms,
    queryFn: () => api.getChatRooms().then(res => res.data),
    ...options,
  });
}

export function useChatMessages(roomId: string, page = 1, limit = 50, options?: UseQueryOptions<PaginatedResponse<ChatMessage>>) {
  return useQuery({
    queryKey: queryKeys.chatMessages(roomId, page, limit),
    queryFn: () => api.getChatMessages(roomId, page, limit).then(res => res.data),
    enabled: !!roomId,
    ...options,
  });
}

// Auth mutations
export function useLogin(options?: UseMutationOptions<{ user: User; tokens: AuthTokens }, Error, LoginDto>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginDto) => api.login(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
    ...options,
  });
}

export function useRegister(options?: UseMutationOptions<{ user: User; tokens: AuthTokens }, Error, RegisterDto>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterDto) => api.register(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
    ...options,
  });
}
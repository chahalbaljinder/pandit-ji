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
  AuthTokens,
} from '@/lib/api';

export const queryKeys = {
  me: ['auth', 'me'] as const,
  profile: ['users', 'profile'] as const,
  virtualUsers: ['users', 'virtual-users'] as const,
  addresses: ['users', 'addresses'] as const,
  defaultAddress: ['users', 'addresses', 'default'] as const,
  pandits: (params: PanditSearchParams) => ['pandits', 'search', params] as const,
  featuredPandits: (limit: number) => ['pandits', 'featured', limit] as const,
  panditProfile: (id: string) => ['pandits', 'profile', id] as const,
  myPanditProfile: ['pandits', 'me', 'profile'] as const,
  panditAvailability: ['pandits', 'me', 'availability'] as const,
  panditStats: ['pandits', 'me', 'stats'] as const,
  panditEarnings: (period: string) => ['pandits', 'me', 'earnings', period] as const,
  services: (params: ServiceSearchParams) => ['services', 'search', params] as const,
  serviceCategories: ['services', 'categories'] as const,
  featuredServices: (limit: number) => ['services', 'featured', limit] as const,
  service: (id: string) => ['services', id] as const,
  serviceBySlug: (slug: string) => ['services', 'slug', slug] as const,
  myBookings: (params: BookingSearchParams) => ['bookings', 'me', params] as const,
  upcomingBookings: (limit: number) => ['bookings', 'me', 'upcoming', limit] as const,
  bookingStats: ['bookings', 'me', 'stats'] as const,
  booking: (id: string) => ['bookings', id] as const,
  bookingByNumber: (bookingNumber: string) => ['bookings', 'number', bookingNumber] as const,
  panditBookings: (params: BookingSearchParams) => ['bookings', 'pandit', 'me', params] as const,
  products: (params: ProductSearchParams) => ['products', 'search', params] as const,
  productCategories: ['products', 'categories'] as const,
  featuredProducts: (limit: number) => ['products', 'featured', limit] as const,
  product: (id: string) => ['products', id] as const,
  productBySlug: (slug: string) => ['products', 'slug', slug] as const,
  temples: (params: TempleSearchParams) => ['temples', 'search', params] as const,
  liveDarshanTemples: ['temples', 'live-darshan'] as const,
  templeCities: ['temples', 'cities'] as const,
  temple: (id: string) => ['temples', id] as const,
  templeBySlug: (slug: string) => ['temples', 'slug', slug] as const,
  todaysPanchang: ['panchang', 'today'] as const,
  panchangByDate: (date: string) => ['panchang', 'date', date] as const,
  panchangRange: (fromDate: string, toDate: string) => ['panchang', 'range', fromDate, toDate] as const,
  monthlyPanchang: (year: number, month: number) => ['panchang', 'month', year, month] as const,
  upcomingFestivals: (days: number) => ['panchang', 'festivals', days] as const,
  paymentsByBooking: (bookingId: string) => ['payments', 'booking', bookingId] as const,
  notifications: (params: { page?: number; limit?: number; status?: string }) => ['notifications', params] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
  chatRooms: ['chat', 'rooms'] as const,
  chatMessages: (roomId: string, page: number, limit: number) => ['chat', 'messages', roomId, page, limit] as const,
  me: ['auth', 'me'] as const,
};

export function useLogin(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.login(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
    ...options,
  });
}

export function useRegister(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.register(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
    ...options,
  });
}

export function useAddresses(userId: string, options?: any) {
  return useQuery({
    queryKey: ['users', 'addresses'],
    queryFn: () => api.getAddresses(userId).then(res => res.data),
    enabled: !!userId,
  });
}

export function useDefaultAddress(userId: string, options?: any) {
  return useQuery({
    queryKey: ['users', 'addresses', 'default'],
    queryFn: () => api.getDefaultAddress(userId).then(res => res.data),
    enabled: !!userId,
  });
}

export function useAddAddress(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.addAddress(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses', 'default'] });
    },
  });
}

export function useUpdateAddress(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateAddress(id, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses', 'default'] });
    },
  });
}

export function useDeleteAddress(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses', 'default'] });
    },
  });
}

export function useVirtualUsers(userId: string, options?: any) {
  return useQuery({
    queryKey: ['users', 'virtual-users'],
    queryFn: () => api.getVirtualUsers(userId).then(res => res.data),
    enabled: !!userId,
  });
}

export function useAddVirtualUser(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.addVirtualUser(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'virtual-users'] });
    },
  });
}

export function useUpdateVirtualUser(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateVirtualUser(id, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'virtual-users'] });
    },
  });
}

export function useDeleteVirtualUser(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteVirtualUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'virtual-users'] });
    },
  });
}

export function useAdminDashboard(options?: any) {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => api.get('/admin/dashboard').then(res => res.data),
    ...options,
  });
}

export function usePandits(params: any, options?: any) {
  return useQuery({
    queryKey: ['pandits', 'search', params],
    queryFn: () => api.searchPandits(params).then(res => res.data),
    ...options,
  });
}

export function useFeaturedPandits(limit = 6, options?: any) {
  return useQuery({
    queryKey: ['pandits', 'featured', limit],
    queryFn: () => api.getFeaturedPandits(limit).then(res => res.data),
    ...options,
  });
}

export function usePanditProfile(id: string, options?: any) {
  return useQuery({
    queryKey: ['pandits', 'profile', id],
    queryFn: () => api.getPanditProfile(id).then(res => res.data),
    enabled: !!id,
    ...options,
  });
}

export function useMyPanditProfile(options?: any) {
  return useQuery({
    queryKey: ['pandits', 'me', 'profile'],
    queryFn: () => api.getMyPanditProfile().then(res => res.data),
    ...options,
  });
}

export function useCreatePanditProfile(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.createPanditProfile(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pandits', 'me', 'profile'] });
    },
  });
}

export function useUpdateMyPanditProfile(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.updateMyPanditProfile(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pandits', 'me', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['pandits', 'me', 'availability'] });
    },
  });
}

export function useUpdateAvailability(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.updateAvailability(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pandits', 'me', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['pandits', 'me', 'availability'] });
    },
  });
}

export function usePanditStats(options?: any) {
  return useQuery({
    queryKey: ['pandits', 'me', 'stats'],
    queryFn: () => api.getPanditStats().then(res => res.data),
    ...options,
  });
}

export function useEarnings(period: 'week' | 'month' | 'year' = 'month', options?: any) {
  return useQuery({
    queryKey: ['pandits', 'me', 'earnings', period],
    queryFn: () => api.getEarnings(period).then(res => res.data),
    ...options,
  });
}

export function useServices(params: any, options?: any) {
  return useQuery({
    queryKey: ['services', 'search', params],
    queryFn: () => api.searchServices(params).then(res => res.data),
    ...options,
  });
}

export function useServiceCategories(options?: any) {
  return useQuery({
    queryKey: ['services', 'categories'],
    queryFn: () => api.getServiceCategories().then(res => res.data),
    ...options,
  });
}

export function useFeaturedServices(limit = 8, options?: any) {
  return useQuery({
    queryKey: ['services', 'featured', limit],
    queryFn: () => api.getFeaturedServices(limit).then(res => res.data),
    ...options,
  });
}

export function useService(id: string, options?: any) {
  return useQuery({
    queryKey: ['services', id],
    queryFn: () => api.getServiceById(id).then(res => res.data),
    enabled: !!id,
    ...options,
  });
}

export function useServiceBySlug(slug: string, options?: any) {
  return useQuery({
    queryKey: ['services', 'slug', slug],
    queryFn: () => api.getServiceBySlug(slug).then(res => res.data),
    enabled: !!slug,
    ...options,
  });
}

export function useMyBookings(params: any, options?: any) {
  return useQuery({
    queryKey: ['bookings', 'me', params],
    queryFn: () => api.getMyBookings(params).then(res => res.data),
    ...options,
  });
}

export function useUpcomingBookings(limit = 5, options?: any) {
  return useQuery({
    queryKey: ['bookings', 'me', 'upcoming', limit],
    queryFn: () => api.getUpcomingBookings(limit).then(res => res.data),
    ...options,
  });
}

export function useBookingStats(options?: any) {
  return useQuery({
    queryKey: ['bookings', 'me', 'stats'],
    queryFn: () => api.getBookingStats().then(res => res.data),
    ...options,
  });
}

export function useBooking(id: string, options?: any) {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => api.getBookingById(id).then(res => res.data),
    enabled: !!id,
    ...options,
  });
}

export function useBookingByNumber(bookingNumber: string, options?: any) {
  return useQuery({
    queryKey: ['bookings', 'number', bookingNumber],
    queryFn: () => api.getBookingByNumber(bookingNumber).then(res => res.data),
    enabled: !!bookingNumber,
    ...options,
  });
}

export function useCreateBooking(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.createBooking(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'me', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'me', 'upcoming'] });
    },
  });
}

export function useUpdateBooking(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateBooking(id, data).then(res => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', id] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'me'] });
    },
  });
}

export function useCancelBooking(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => api.cancelBooking(id, reason).then(res => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', id] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'me', 'stats'] });
    },
  });
}

export function useConfirmBooking(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.confirmBooking(id).then(res => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', id] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'pandit', 'me'] });
    },
  });
}

export function useStartBooking(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.startBooking(id).then(res => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', id] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'pandit', 'me'] });
    },
  });
}

export function useCompleteBooking(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.completeBooking(id).then(res => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', id] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'pandit', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['pandits', 'me', 'stats'] });
    },
  });
}

export function usePanditBookings(params: any, options?: any) {
  return useQuery({
    queryKey: ['bookings', 'pandit', 'me', params],
    queryFn: () => api.getPanditBookings(params).then(res => res.data),
    ...options,
  });
}

export function useProducts(params: any, options?: any) {
  return useQuery({
    queryKey: ['products', 'search', params],
    queryFn: () => api.searchProducts(params).then(res => res.data),
    ...options,
  });
}

export function useProductCategories(options?: any) {
  return useQuery({
    queryKey: ['products', 'categories'],
    queryFn: () => api.getProductCategories().then(res => res.data),
    ...options,
  });
}

export function useFeaturedProducts(limit = 8, options?: any) {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: () => api.getFeaturedProducts(limit).then(res => res.data),
    ...options,
  });
}

export function useProduct(id: string, options?: any) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => api.getProductById(id).then(res => res.data),
    enabled: !!id,
    ...options,
  });
}

export function useProductBySlug(slug: string, options?: any) {
  return useQuery({
    queryKey: ['products', 'slug', slug],
    queryFn: () => api.getProductBySlug(slug).then(res => res.data),
    enabled: !!slug,
    ...options,
  });
}

export function useTemples(params: any, options?: any) {
  return useQuery({
    queryKey: ['temples', 'search', params],
    queryFn: () => api.searchTemples(params).then(res => res.data),
    ...options,
  });
}

export function useLiveDarshanTemples(options?: any) {
  return useQuery({
    queryKey: ['temples', 'live-darshan'],
    queryFn: () => api.getLiveDarshanTemples().then(res => res.data),
    ...options,
  });
}

export function useTempleCities(options?: any) {
  return useQuery({
    queryKey: ['temples', 'cities'],
    queryFn: () => api.getTempleCities().then(res => res.data),
    ...options,
  });
}

export function useTemple(id: string, options?: any) {
  return useQuery({
    queryKey: ['temples', id],
    queryFn: () => api.getTempleById(id).then(res => res.data),
    enabled: !!id,
    ...options,
  });
}

export function useTempleBySlug(slug: string, options?: any) {
  return useQuery({
    queryKey: ['temples', 'slug', slug],
    queryFn: () => api.getTempleBySlug(slug).then(res => res.data),
    enabled: !!slug,
    ...options,
  });
}

export function useTodaysPanchang(options?: any) {
  return useQuery({
    queryKey: ['panchang', 'today'],
    queryFn: () => api.getTodaysPanchang().then(res => res.data),
    ...options,
  });
}

export function usePanchangByDate(date: string, options?: any) {
  return useQuery({
    queryKey: ['panchang', 'date', date],
    queryFn: () => api.getPanchangByDate(date).then(res => res.data),
    enabled: !!date,
    ...options,
  });
}

export function usePanchangRange(fromDate: string, toDate: string, options?: any) {
  return useQuery({
    queryKey: ['panchang', 'range', fromDate, toDate],
    queryFn: () => api.getPanchangRange(fromDate, toDate).then(res => res.data),
    enabled: !!fromDate && !!toDate,
    ...options,
  });
}

export function useMonthlyPanchang(year: number, month: number, options?: any) {
  return useQuery({
    queryKey: ['panchang', 'month', year, month],
    queryFn: () => api.getMonthlyPanchang(year, month).then(res => res.data),
    enabled: !!year && !!month,
    ...options,
  });
}

export function useUpcomingFestivals(days = 30, options?: any) {
  return useQuery({
    queryKey: ['panchang', 'festivals', days],
    queryFn: () => api.getUpcomingFestivals(days).then(res => res.data),
    ...options,
  });
}

export function useCreatePayment(options?: any) {
  return useMutation({
    mutationFn: (data: any) => api.createPayment(data).then(res => res.data),
    ...options,
  });
}

export function useCreateRazorpayOrder(options?: any) {
  return useMutation({
    mutationFn: (bookingId: string) => api.createRazorpayOrder(bookingId).then(res => res.data),
    ...options,
  });
}

export function usePaymentsByBooking(bookingId: string, options?: any) {
  return useQuery({
    queryKey: ['payments', 'booking', bookingId],
    queryFn: () => api.getPaymentsByBooking(bookingId).then(res => res.data),
    enabled: !!bookingId,
    ...options,
  });
}

export function useNotifications(params: any, options?: any) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => api.getNotifications(params).then(res => res.data),
    ...options,
  });
}

export function useUnreadCount(options?: any) {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => api.getUnreadCount().then(res => res.data),
    refetchInterval: 30000,
    ...options,
  });
}

export function useMarkAsRead(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.markAsRead(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
}

export function useMarkAllAsRead(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.markAllAsRead().then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
}

export function useDeleteNotification(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
}

export function useChatRooms(options?: any) {
  return useQuery({
    queryKey: ['chat', 'rooms'],
    queryFn: () => api.getChatRooms().then(res => res.data),
    ...options,
  });
}

export function useChatMessages(roomId: string, page = 1, limit = 50, options?: any) {
  return useQuery({
    queryKey: ['chat', 'messages', roomId, page, limit],
    queryFn: () => api.getChatMessages(roomId, page, limit).then(res => res.data),
    enabled: !!roomId,
    ...options,
  });
}

export function useLogin(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.login(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
    },
  });
}

export function useRegister(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.register(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
    },
  });
}

export function useAddresses(userId: string, options?: any) {
  return useQuery({
    queryKey: ['users', 'addresses'],
    queryFn: () => api.getAddresses(userId).then(res => res.data),
    enabled: !!userId,
  });
}

export function useDefaultAddress(userId: string, options?: any) {
  return useQuery({
    queryKey: ['users', 'addresses', 'default'],
    queryFn: () => api.getDefaultAddress(userId).then(res => res.data),
    enabled: !!userId,
  });
}

export function useAddAddress(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.addAddress(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses', 'default'] });
    },
  });
}

export function useUpdateAddress(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateAddress(id, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses', 'default'] });
    },
  });
}

export function useDeleteAddress(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses', 'default'] });
    },
  });
}

export function useVirtualUsers(userId: string, options?: any) {
  return useQuery({
    queryKey: ['users', 'virtual-users'],
    queryFn: () => api.getVirtualUsers(userId).then(res => res.data),
    enabled: !!userId,
  });
}

export function useAddVirtualUser(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.addVirtualUser(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'virtual-users'] }),
    },
  });
}

export function useUpdateVirtualUser(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateVirtualUser(id, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'virtual-users'] }),
    },
  });
}

export function useDeleteVirtualUser(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteVirtualUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'virtual-users'] }),
    },
  });
}

export function usePandits(params: any, options?: any) {
  return useQuery({
    queryKey: ['pandits', 'search', params],
    queryFn: () => api.searchPandits(params).then(res => res.data),
    ...options,
  });
}

export function useFeaturedPandits(limit = 6, options?: any) {
  return useQuery({
    queryKey: ['pandits', 'featured', limit],
    queryFn: () => api.getFeaturedPandits(limit).then(res => res.data),
    ...options,
  });
}

export function usePanditProfile(id: string, options?: any) {
  return useQuery({
    queryKey: ['pandits', 'profile', id],
    queryFn: () => api.getPanditProfile(id).then(res => res.data),
    enabled: !!id,
    ...options,
  });
}

export function useMyPanditProfile(options?: any) {
  return useQuery({
    queryKey: ['pandits', 'me', 'profile'],
    queryFn: () => api.getMyPanditProfile().then(res => res.data),
    ...options,
  });
}

export function useCreatePanditProfile(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.createPanditProfile(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pandits', 'me', 'profile'] }),
    },
  });
}

export function useUpdateMyPanditProfile(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.updateMyPanditProfile(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pandits', 'me', 'profile'] }),
      queryClient.invalidateQueries({ queryKey: ['pandits', 'me', 'availability'] }),
    },
  });
}

export function useUpdateAvailability(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.updateAvailability(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pandits', 'me', 'profile'] }),
      queryClient.invalidateQueries({ queryKey: ['pandits', 'me', 'availability'] }),
    },
  );
}

export function usePanditStats(options?: any) {
  return useQuery({
    queryKey: ['pandits', 'me', 'stats'],
    queryFn: () => api.getPanditStats().then(res => res.data),
    ...options,
  });
}

export function useEarnings(period: 'week' | 'month' | 'year' = 'month', options?: any) {
  return useQuery({
    queryKey: ['pandits', 'me', 'earnings', period],
    queryFn: () => api.getEarnings(period).then(res => res.data),
    ...options,
  });
}

export function useServices(params: any, options?: any) {
  return useQuery({
    queryKey: ['services', 'search', params],
    queryFn: () => api.searchServices(params).then(res => res.data),
    ...options,
  });
}

export function useServiceCategories(options?: any) {
  return useQuery({
    queryKey: ['services', 'categories'],
    queryFn: () => api.getServiceCategories().then(res => res.data),
    ...options,
  });
}

export function useFeaturedServices(limit = 8, options?: any) {
  return useQuery({
    queryKey: ['services', 'featured', limit],
    queryFn: () => api.getFeaturedServices(limit).then(res => res.data),
    ...options,
  });
}

export function useService(id: string, options?: any) {
  return useQuery({
    queryKey: ['services', id],
    queryFn: () => api.getServiceById(id).then(res => res.data),
    enabled: !!id,
    ...options,
  });
}

export function useServiceBySlug(slug: string, options?: any) {
  return useQuery({
    queryKey: ['services', 'slug', slug],
    queryFn: () => api.getServiceBySlug(slug).then(res => res.data),
    enabled: !!slug,
    ...options,
  });
}

export function useMyBookings(params: any, options?: any) {
  return useQuery({
    queryKey: ['bookings', 'me', params],
    queryFn: () => api.getMyBookings(params).then(res => res.data),
    ...options,
  });
}

export function useUpcomingBookings(limit = 5, options?: any) {
  return useQuery({
    queryKey: ['bookings', 'me', 'upcoming', limit],
    queryFn: () => api.getUpcomingBookings(limit).then(res => res.data),
    ...options,
  });
}

export function useBookingStats(options?: any) {
  return useQuery({
    queryKey: ['bookings', 'me', 'stats'],
    queryFn: () => api.getBookingStats().then(res => res.data),
    ...options,
  });
}

export function useBooking(id: string, options?: any) {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => api.getBookingById(id).then(res => res.data),
    enabled: !!id,
    ...options,
  });
}

export function useBookingByNumber(bookingNumber: string, options?: any) {
  return useQuery({
    queryKey: ['bookings', 'number', bookingNumber],
    queryFn: () => api.getBookingByNumber(bookingNumber).then(res => res.data),
    enabled: !!bookingNumber,
    ...options,
  });
}

export function useCreateBooking(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.createBooking(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'me'] }),
      queryClient.invalidateQueries({ queryKey: ['bookings', 'me', 'stats'] }),
      queryClient.invalidateQueries({ queryKey: ['bookings', 'me', 'upcoming'] }),
    },
  });
}

export function useUpdateBooking(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateBooking(id, data).then(res => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', id] }),
      queryClient.invalidateQueries({ queryKey: ['bookings', 'me'] }),
    },
  });
}

export function useCancelBooking(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => api.cancelBooking(id, reason).then(res => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', id] }),
      queryClient.invalidateQueries({ queryKey: ['bookings', 'me'] }),
      queryClient.invalidateQueries({ queryKey: ['bookings', 'me', 'stats'] }),
    },
  });
}

export function useConfirmBooking(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.confirmBooking(id).then(res => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', id] }),
      queryClient.invalidateQueries({ queryKey: ['bookings', 'pandit', 'me'] }),
    },
  });
}

export function useStartBooking(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.startBooking(id).then(res => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', id] }),
      queryClient.invalidateQueries({ queryKey: ['bookings', 'pandit', 'me'] }),
    },
  });
}

export function useCompleteBooking(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.completeBooking(id).then(res => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', id] }),
      queryClient.invalidateQueries({ queryKey: ['bookings', 'pandit', 'me'] }),
      queryClient.invalidateQueries({ queryKey: ['pandits', 'me', 'stats'] }),
    },
  });
}

export function usePanditBookings(params: any, options?: any) {
  return useQuery({
    queryKey: ['bookings', 'pandit', 'me', params],
    queryFn: () => api.getPanditBookings(params).then(res => res.data),
    ...options,
  });
}

export function useProducts(params: any, options?: any) {
  return useQuery({
    queryKey: ['products', 'search', params],
    queryFn: () => api.searchProducts(params).then(res => res.data),
    ...options,
  });
}

export function useProductCategories(options?: any) {
  return useQuery({
    queryKey: ['products', 'categories'],
    queryFn: () => api.getProductCategories().then(res => res.data),
    ...options,
  });
}

export function useFeaturedProducts(limit = 8, options?: any) {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: () => api.getFeaturedProducts(limit).then(res => res.data),
    ...options,
  });
}

export function useProduct(id: string, options?: any) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => api.getProductById(id).then(res => res.data),
    enabled: !!id,
    ...options,
  });
}

export function useProductBySlug(slug: string, options?: any) {
  return useQuery({
    queryKey: ['products', 'slug', slug],
    queryFn: () => api.getProductBySlug(slug).then(res => res.data),
    enabled: !!slug,
    ...options,
  });
}

export function useTemples(params: any, options?: any) {
  return useQuery({
    queryKey: ['temples', 'search', params],
    queryFn: () => api.searchTemples(params).then(res => res.data),
    ...options,
  });
}

export function useLiveDarshanTemples(options?: any) {
  return useQuery({
    queryKey: ['temples', 'live-darshan'],
    queryFn: () => api.getLiveDarshanTemples().then(res => res.data),
    ...options,
  });
}

export function useTempleCities(options?: any) {
  return useQuery({
    queryKey: ['temples', 'cities'],
    queryFn: () => api.getTempleCities().then(res => res.data),
    ...options,
  });
}

export function useTemple(id: string, options?: any) {
  return useQuery({
    queryKey: ['temples', id],
    queryFn: () => api.getTempleById(id).then(res => res.data),
    enabled: !!id,
    ...options,
  });
}

export function useTempleBySlug(slug: string, options?: any) {
  return useQuery({
    queryKey: ['temples', 'slug', slug],
    queryFn: () => api.getTempleBySlug(slug).then(res => res.data),
    enabled: !!slug,
    ...options,
  });
}

export function useTodaysPanchang(options?: any) {
  return useQuery({
    queryKey: ['panchang', 'today'],
    queryFn: () => api.getTodaysPanchang().then(res => res.data),
    ...options,
  });
}

export function usePanchangByDate(date: string, options?: any) {
  return useQuery({
    queryKey: ['panchang', 'date', date],
    queryFn: () => api.getPanchangByDate(date).then(res => res.data),
    enabled: !!date,
    ...options,
  });
}

export function usePanchangRange(fromDate: string, toDate: string, options?: any) {
  return useQuery({
    queryKey: ['panchang', 'range', fromDate, toDate],
    queryFn: () => api.getPanchangRange(fromDate, toDate).then(res => res.data),
    enabled: !!fromDate && !!toDate,
    ...options,
  });
}

export function useMonthlyPanchang(year: number, month: number, options?: any) {
  return useQuery({
    queryKey: ['panchang', 'month', year, month],
    queryFn: () => api.getMonthlyPanchang(year, month).then(res => res.data),
    enabled: !!year && !!month,
    ...options,
  });
}

export function useUpcomingFestivals(days = 30, options?: any) {
  return useQuery({
    queryKey: ['panchang', 'festivals', days],
    queryFn: () => api.getUpcomingFestivals(days).then(res => res.data),
    ...options,
  });
}

export function useCreatePayment(options?: any) {
  return useMutation({
    mutationFn: (data: any) => api.createPayment(data).then(res => res.data),
    ...options,
  });
}

export function useCreateRazorpayOrder(options?: any) {
  return useMutation({
    mutationFn: (bookingId: string) => api.createRazorpayOrder(bookingId).then(res => res.data),
    ...options,
  });
}

export function usePaymentsByBooking(bookingId: string, options?: any) {
  return useQuery({
    queryKey: ['payments', 'booking', bookingId],
    queryFn: () => api.getPaymentsByBooking(bookingId).then(res => res.data),
    enabled: !!bookingId,
    ...options,
  });
}

export function useNotifications(params: any, options?: any) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => api.getNotifications(params).then(res => res.data),
    ...options,
  });
}

export function useUnreadCount(options?: any) {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => api.getUnreadCount().then(res => res.data),
    refetchInterval: 30000,
    ...options,
  });
}

export function useMarkAsRead(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.markAsRead(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] }),
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] }),
    },
  });
}

export function useMarkAllAsRead(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.markAllAsRead().then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] }),
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] }),
    },
  });
}

export function useDeleteNotification(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] }),
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] }),
    },
  });
}

export function useChatRooms(options?: any) {
  return useQuery({
    queryKey: ['chat', 'rooms'],
    queryFn: () => api.getChatRooms().then(res => res.data),
    ...options,
  });
}

export function useChatMessages(roomId: string, page = 1, limit = 50, options?: any) {
  return useQuery({
    queryKey: ['chat', 'messages', roomId, page, limit],
    queryFn: () => api.getChatMessages(roomId, page, limit).then(res => res.data),
    enabled: !!roomId,
    ...options,
  });
}

export function useLogin(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.login(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] }),
    },
  });
}

export function useRegister(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.register(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] }),
    },
  });
}

export function useAddresses(userId: string, options?: any) {
  return useQuery({
    queryKey: ['users', 'addresses'],
    queryFn: () => api.getAddresses(userId).then(res => res.data),
    enabled: !!userId,
  });
}

export function useDefaultAddress(userId: string, options?: any) {
  return useQuery({
    queryKey: ['users', 'addresses', 'default'],
    queryFn: () => api.getDefaultAddress(userId).then(res => res.data),
    enabled: !!userId,
  });
}

export function useAddAddress(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.addAddress(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses', 'default'] }),
    },
  });
}

export function useUpdateAddress(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateAddress(id, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses', 'default'] }),
    },
  });
}

export function useDeleteAddress(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses', 'default'] }),
    },
  });
}

export function useVirtualUsers(userId: string, options?: any) {
  return useQuery({
    queryKey: ['users', 'virtual-users'],
    queryFn: () => api.getVirtualUsers(userId).then(res => res.data),
    enabled: !!userId,
  });
}

export function useAddVirtualUser(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.addVirtualUser(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'virtual-users'] }),
    },
  });
}

export function useUpdateVirtualUser(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateVirtualUser(id, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'virtual-users'] }),
    },
  });
}

export function useDeleteVirtualUser(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteVirtualUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'virtual-users'] }),
    },
  });
}

export function useLogin(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.login(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] }),
    },
  });
}

export function useRegister(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.register(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] }),
    },
  );
}

export function useAddresses(userId: string, options?: any) {
  return useQuery({
    queryKey: ['users', 'addresses'],
    queryFn: () => api.getAddresses(userId).then(res => res.data),
    enabled: !!userId,
  });
}

export function useDefaultAddress(userId: string, options?: any) {
  return useQuery({
    queryKey: ['users', 'addresses', 'default'],
    queryFn: () => api.getDefaultAddress(userId).then(res => res.data),
    enabled: !!userId,
  });
}

export function useAddAddress(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.addAddress(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses', 'default'] }),
    },
  });
}

export function useUpdateAddress(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateAddress(id, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses', 'default'] }),
    },
  });
}

export function useDeleteAddress(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses', 'default'] }),
    },
  });
}

export function useVirtualUsers(userId: string, options?: any) {
  return useQuery({
    queryKey: ['users', 'virtual-users'],
    queryFn: () => api.getVirtualUsers(userId).then(res => res.data),
    enabled: !!userId,
  });
}

export function useAddVirtualUser(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.addVirtualUser(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'virtual-users'] }),
    },
  });
}

export function useUpdateVirtualUser(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateVirtualUser(id, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'virtual-users'] }),
    },
  });
}

export function useDeleteVirtualUser(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteVirtualUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'virtual-users'] }),
    },
  );
}

export function useLogin(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.login(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] }),
    },
  });
}

export function useRegister(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.register(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] }),
    },
  );
}

export const queryKeys = {
  me: ['auth', 'me'] as const,
  profile: ['users', 'profile'] as const,
  virtualUsers: ['users', 'virtual-users'] as const,
  addresses: ['users', 'addresses'] as const,
  defaultAddress: ['users', 'addresses', 'default'] as const,
  pandits: (params: any) => ['pandits', 'search', params] as const,
  featuredPandits: (limit: number) => ['pandits', 'featured', limit] as const,
  panditProfile: (id: string) => ['pandits', 'profile', id] as const,
  myPanditProfile: ['pandits', 'me', 'profile'] as const,
  panditAvailability: ['pandits', 'me', 'availability'] as const,
  panditStats: ['pandits', 'me', 'stats'] as const,
  panditEarnings: (period: string) => ['pandits', 'me', 'earnings', period] as const,
  services: (params: any) => ['services', 'search', params] as const,
  serviceCategories: ['services', 'categories'] as const,
  featuredServices: (limit: number) => ['services', 'featured', limit] as const,
  service: (id: string) => ['services', id] as const,
  serviceBySlug: (slug: string) => ['services', 'slug', slug] as const,
  myBookings: (params: any) => ['bookings', 'me', params] as const,
  upcomingBookings: (limit: number) => ['bookings', 'me', 'upcoming', limit] as const,
  bookingStats: ['bookings', 'me', 'stats'] as const,
  booking: (id: string) => ['bookings', id] as const,
  bookingByNumber: (bookingNumber: string) => ['bookings', 'number', bookingNumber] as const,
  panditBookings: (params: any) => ['bookings', 'pandit', 'me', params] as const,
  products: (params: any) => ['products', 'search', params] as const,
  productCategories: ['products', 'categories'] as const,
  featuredProducts: (limit: number) => ['products', 'featured', limit] as const,
  product: (id: string) => ['products', id] as const,
  productBySlug: (slug: string) => ['products', 'slug', slug] as const,
  temples: (params: any) => ['temples', 'search', params] as const,
  liveDarshanTemples: ['temples', 'live-darshan'] as const,
  templeCities: ['temples', 'cities'] as const,
  temple: (id: string) => ['temples', id] as const,
  templeBySlug: (slug: string) => ['temples', 'slug', slug] as const,
  todaysPanchang: ['panchang', 'today'] as const,
  panchangByDate: (date: string) => ['panchang', 'date', date] as const,
  panchangRange: (fromDate: string, toDate: string) => ['panchang', 'range', fromDate, toDate] as const,
  monthlyPanchang: (year: number, month: number) => ['panchang', 'month', year, month] as const,
  upcomingFestivals: (days: number) => ['panchang', 'festivals', days] as const,
  paymentsByBooking: (bookingId: string) => ['payments', 'booking', bookingId] as const,
  notifications: (params: any) => ['notifications', params] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
  chatRooms: ['chat', 'rooms'] as const,
  chatMessages: (roomId: string, page: number, limit: number) => ['chat', 'messages', roomId, page, limit] as const,
  me: ['auth', 'me'] as const,
};

export function useLogin(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.login(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] }),
    },
  });
}

export function useRegister(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.register(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] }),
    },
  );
}

export function useAddresses(userId: string, options?: any) {
  return useQuery({
    queryKey: ['users', 'addresses'],
    queryFn: () => api.getAddresses(userId).then(res => res.data),
    enabled: !!userId,
  });
}

export function useDefaultAddress(userId: string, options?: any) {
  return useQuery({
    queryKey: ['users', 'addresses', 'default'],
    queryFn: () => api.getDefaultAddress(userId).then(res => res.data),
    enabled: !!userId,
  });
}

export function useAddAddress(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.addAddress(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses', 'default'] }),
    },
  });
}

export function useUpdateAddress(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateAddress(id, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses', 'default'] }),
    },
  });
}

export function useDeleteAddress(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses'] }),
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses', 'default'] }),
    },
  });
}

export function useVirtualUsers(userId: string, options?: any) {
  return useQuery({
    queryKey: ['users', 'virtual-users'],
    queryFn: () => api.getVirtualUsers(userId).then(res => res.data),
    enabled: !!userId,
  });
}

export function useAddVirtualUser(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.addVirtualUser(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'virtual-users'] }),
    },
  });
}

export function useUpdateVirtualUser(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateVirtualUser(id, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'virtual-users'] }),
    },
  });
}

export function useDeleteVirtualUser(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteVirtualUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'virtual-users'] }),
    },
  });
}
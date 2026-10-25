/**
 * USAMA TRADERS API Client
 * Seamlessly interfaces public visitor actions and authenticated admin operations
 */

export interface PublicProfile {
  name: string;
  tagline: string;
  about: string;
  address: string;
  city: string;
  district: string;
  region: string;
  country: string;
  postalCode: string;
  phoneNumbers: string[];
  whatsappNumber: string;
  email: string;
  businessHours: string;
  serviceAreas: string[];
  logoUrl: string;
  socialLinks: Record<string, string>;
  owners: Array<{
    name: string;
    role: string;
    phone: string;
    email: string;
  }>;
  updatedAt: string;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  description: string;
  specifications: string;
  unit: string;
  price: number | null;
  priceDisplay: string;
  inStock: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  imageUrl: string;
  imageAlt: string;
  strengthGrade: string;
  recommendedUse: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlockItem {
  id: string;
  name: string;
  dimensions: string;
  compressiveStrength: string;
  application: string;
  weight: string;
  materialMix: string;
  productionCapacity: string;
  priceEstimate: string;
  inStock: boolean;
  isPublished: boolean;
  imageUrl: string;
  imageAlt: string;
  createdAt: string;
  updatedAt: string;
}

export interface FleetItem {
  id: string;
  identifier: string;
  name: string;
  type: string;
  capacity: string;
  services: string[];
  serviceAreas: string[];
  inService: boolean;
  isFeatured: boolean;
  count: number;
  description: string;
  imageUrl: string;
  imageAlt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  location: string;
  category: 'infrastructure' | 'commercial' | 'residential' | 'public';
  scope: string;
  materialsSupplied: string;
  year: string;
  status: 'Completed' | 'In Progress' | 'Planned';
  isFeatured: boolean;
  isPublished: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'cement' | 'block_factory' | 'trucks' | 'construction_projects' | 'general';
  imageUrl: string;
  imageAlt: string;
  description: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryItem {
  id: string;
  referenceId: string;
  name: string;
  phone: string;
  email?: string;
  siteLocation: string;
  requestedItem: string;
  quantity: string;
  deliveryDate?: string;
  message: string;
  status: 'New' | 'Contacted' | 'Quoted' | 'Closed';
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  active: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

export interface DashboardStats {
  totalProducts: number;
  publishedProducts: number;
  totalBlocks: number;
  totalFleet: number;
  activeFleet: number;
  totalProjects: number;
  totalGallery: number;
  totalInquiries: number;
  newInquiries: number;
  contactedInquiries: number;
  quotedInquiries: number;
  closedInquiries: number;
}

const TOKEN_KEY = 'ut_admin_token';
const USER_KEY = 'ut_admin_user';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthSession(token: string, user: AdminUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): AdminUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAuthToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      if (endpoint.startsWith('/api/admin') || endpoint === '/api/auth/me') {
        clearAuthSession();
      }
    }
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

/* Public API */
export const api = {
  // Public Data
  getPublicProfile: () => request<{ success: boolean; profile: PublicProfile }>('/api/public/profile'),
  getPublicCategories: () => request<{ success: boolean; categories: CategoryItem[] }>('/api/public/categories'),
  getPublicProducts: (category?: string) => 
    request<{ success: boolean; products: ProductItem[] }>(`/api/public/products${category && category !== 'all' ? `?category=${category}` : ''}`),
  getPublicBlocks: () => request<{ success: boolean; blocks: BlockItem[] }>('/api/public/blocks'),
  getPublicFleet: () => request<{ success: boolean; fleet: FleetItem[] }>('/api/public/fleet'),
  getPublicProjects: (category?: string) => 
    request<{ success: boolean; projects: ProjectItem[] }>(`/api/public/projects${category && category !== 'all' ? `?category=${category}` : ''}`),
  getPublicGallery: (category?: string) => 
    request<{ success: boolean; items: GalleryItem[] }>(`/api/public/gallery${category && category !== 'all' ? `?category=${category}` : ''}`),
  submitInquiry: (data: Partial<InquiryItem>) => 
    request<{ success: boolean; referenceId: string; message: string; inquiry: Partial<InquiryItem> }>('/api/public/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  trackInquiry: (ref: string) => 
    request<{ success: boolean; tracking: any }>(`/api/public/inquiries/track/${encodeURIComponent(ref)}`),

  // Auth
  checkSetupStatus: () => request<{ needsSetup: boolean; totalAdmins: number }>('/api/auth/setup-status'),
  setupAdmin: (data: { email: string; password: string; name: string }) => 
    request<{ success: boolean; token: string; user: AdminUser }>('/api/auth/setup-admin', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  loginAdmin: (data: { email: string; password: string }) => 
    request<{ success: boolean; token: string; user: AdminUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getAdminMe: () => request<{ success: boolean; user: AdminUser }>('/api/auth/me'),

  // Upload
  uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    const token = getAuthToken();
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return { url: data.url, filename: data.filename };
  },

  // Admin Stats
  getAdminStats: () => request<{ success: boolean; stats: DashboardStats; recentInquiries: InquiryItem[] }>('/api/admin/stats'),

  // Admin Products
  getAdminProducts: () => request<{ success: boolean; products: ProductItem[] }>('/api/admin/products'),
  createProduct: (data: Partial<ProductItem>) => request<{ success: boolean; product: ProductItem }>('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateProduct: (id: string, data: Partial<ProductItem>) => request<{ success: boolean; product: ProductItem }>(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteProduct: (id: string) => request<{ success: boolean; message: string }>(`/api/admin/products/${id}`, {
    method: 'DELETE',
  }),
  toggleProductPublish: (id: string) => request<{ success: boolean; product: ProductItem }>(`/api/admin/products/${id}/publish`, {
    method: 'PATCH',
  }),

  // Admin Categories
  getAdminCategories: () => request<{ success: boolean; categories: CategoryItem[] }>('/api/admin/categories'),
  createCategory: (data: Partial<CategoryItem>) => request<{ success: boolean; category: CategoryItem }>('/api/admin/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateCategory: (id: string, data: Partial<CategoryItem>) => request<{ success: boolean; category: CategoryItem }>(`/api/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteCategory: (id: string) => request<{ success: boolean; message: string }>(`/api/admin/categories/${id}`, {
    method: 'DELETE',
  }),

  // Admin Blocks
  getAdminBlocks: () => request<{ success: boolean; blocks: BlockItem[] }>('/api/admin/blocks'),
  createBlock: (data: Partial<BlockItem>) => request<{ success: boolean; block: BlockItem }>('/api/admin/blocks', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateBlock: (id: string, data: Partial<BlockItem>) => request<{ success: boolean; block: BlockItem }>(`/api/admin/blocks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteBlock: (id: string) => request<{ success: boolean; message: string }>(`/api/admin/blocks/${id}`, {
    method: 'DELETE',
  }),
  toggleBlockPublish: (id: string) => request<{ success: boolean; block: BlockItem }>(`/api/admin/blocks/${id}/publish`, {
    method: 'PATCH',
  }),

  // Admin Fleet
  getAdminFleet: () => request<{ success: boolean; fleet: FleetItem[] }>('/api/admin/fleet'),
  createFleet: (data: Partial<FleetItem>) => request<{ success: boolean; vehicle: FleetItem }>('/api/admin/fleet', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateFleet: (id: string, data: Partial<FleetItem>) => request<{ success: boolean; vehicle: FleetItem }>(`/api/admin/fleet/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteFleet: (id: string) => request<{ success: boolean; message: string }>(`/api/admin/fleet/${id}`, {
    method: 'DELETE',
  }),

  // Admin Projects
  getAdminProjects: () => request<{ success: boolean; projects: ProjectItem[] }>('/api/admin/projects'),
  createProject: (data: Partial<ProjectItem>) => request<{ success: boolean; project: ProjectItem }>('/api/admin/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateProject: (id: string, data: Partial<ProjectItem>) => request<{ success: boolean; project: ProjectItem }>(`/api/admin/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteProject: (id: string) => request<{ success: boolean; message: string }>(`/api/admin/projects/${id}`, {
    method: 'DELETE',
  }),
  toggleProjectPublish: (id: string) => request<{ success: boolean; project: ProjectItem }>(`/api/admin/projects/${id}/publish`, {
    method: 'PATCH',
  }),

  // Admin Gallery
  getAdminGallery: () => request<{ success: boolean; gallery: GalleryItem[] }>('/api/admin/gallery'),
  createGalleryItem: (data: Partial<GalleryItem>) => request<{ success: boolean; item: GalleryItem }>('/api/admin/gallery', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateGalleryItem: (id: string, data: Partial<GalleryItem>) => request<{ success: boolean; item: GalleryItem }>(`/api/admin/gallery/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteGalleryItem: (id: string) => request<{ success: boolean; message: string }>(`/api/admin/gallery/${id}`, {
    method: 'DELETE',
  }),

  // Admin Inquiries
  getAdminInquiries: () => request<{ success: boolean; inquiries: InquiryItem[] }>('/api/admin/inquiries'),
  updateInquiryStatus: (id: string, status: InquiryItem['status']) => 
    request<{ success: boolean; inquiry: InquiryItem }>(`/api/admin/inquiries/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  updateInquiryNotes: (id: string, internalNotes: string) => 
    request<{ success: boolean; inquiry: InquiryItem }>(`/api/admin/inquiries/${id}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ internalNotes }),
    }),
  deleteInquiry: (id: string) => request<{ success: boolean; message: string }>(`/api/admin/inquiries/${id}`, {
    method: 'DELETE',
  }),

  // Admin Business Profile
  getAdminProfile: () => request<{ success: boolean; profile: PublicProfile }>('/api/admin/business-profile'),
  updateAdminProfile: (data: Partial<PublicProfile>) => request<{ success: boolean; profile: PublicProfile }>('/api/admin/business-profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Admin Settings
  updatePassword: (currentPassword: string, newPassword: string) => 
    request<{ success: boolean; message: string }>('/api/admin/settings/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  getAuditLogs: () => request<{ success: boolean; logs: any[] }>('/api/admin/audit-logs'),
};

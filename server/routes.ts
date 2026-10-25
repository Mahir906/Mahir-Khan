import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { 
  getDatabase, 
  saveDatabase, 
  recordAuditLog,
  Product,
  BlockProduct,
  FleetVehicle,
  Project,
  Inquiry,
  Category,
  GalleryItem,
  ConstructionService,
  BusinessProfile
} from './db.ts';
import { 
  requireAdminAuth, 
  generateToken, 
  AuthenticatedRequest 
} from './auth.ts';
import { uploadMiddleware, deleteUploadedFile, validateImageMagicBytes } from './upload.ts';

const router = express.Router();

// In-memory rate limiters to protect against brute-force and public form abuse
interface RateLimitBucket {
  count: number;
  resetAt: number;
}
const loginRateLimitMap = new Map<string, RateLimitBucket>();
const inquiryRateLimitMap = new Map<string, RateLimitBucket>();

function checkRateLimit(
  map: Map<string, RateLimitBucket>,
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const bucket = map.get(key);

  if (!bucket || now > bucket.resetAt) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= maxRequests) {
    return false;
  }

  bucket.count++;
  return true;
}

// Helper to sanitize strings and strip HTML/script tags to prevent stored XSS
function cleanString(val: any): string {
  if (typeof val !== 'string') return '';
  return val.replace(/<[^>]*>?/gm, '').trim();
}

/* ==========================================================================
   PUBLIC API ROUTES (Read-only, published items only, customer quote requests)
   ========================================================================== */

router.get('/public/profile', (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, profile: db.businessProfile });
});

router.get('/public/categories', (_req: Request, res: Response) => {
  const db = getDatabase();
  const activeCategories = db.categories.filter(c => c.active);
  res.json({ success: true, categories: activeCategories });
});

router.get('/public/products', (req: Request, res: Response) => {
  const db = getDatabase();
  const category = req.query.category as string | undefined;
  let products = db.products.filter(p => p.isPublished);

  if (category && category !== 'all') {
    products = products.filter(p => p.categoryId === category);
  }

  res.json({ success: true, products });
});

router.get('/public/blocks', (_req: Request, res: Response) => {
  const db = getDatabase();
  const blocks = db.blockProducts.filter(b => b.isPublished);
  res.json({ success: true, blocks });
});

router.get('/public/fleet', (_req: Request, res: Response) => {
  const db = getDatabase();
  const fleet = db.fleetVehicles.filter(f => f.inService);
  res.json({ success: true, fleet });
});

router.get('/public/projects', (req: Request, res: Response) => {
  const db = getDatabase();
  const category = req.query.category as string | undefined;
  let projects = db.projects.filter(p => p.isPublished);

  if (category && category !== 'all') {
    projects = projects.filter(p => p.category === category);
  }

  res.json({ success: true, projects });
});

router.get('/public/services', (_req: Request, res: Response) => {
  const db = getDatabase();
  const services = db.services
    .filter(s => s.isPublished)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  res.json({ success: true, services });
});

router.get('/public/gallery', (req: Request, res: Response) => {
  const db = getDatabase();
  const category = req.query.category as string | undefined;
  let items = db.galleryItems.filter(g => g.isPublished);

  if (category && category !== 'all') {
    items = items.filter(g => g.category === category);
  }

  res.json({ success: true, items });
});

// Public customer quote inquiry submission (Rate-limited, sanitized)
router.post('/public/inquiries', async (req: Request, res: Response) => {
  try {
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(inquiryRateLimitMap, clientIp, 5, 10 * 60 * 1000)) {
      res.status(429).json({ error: 'Too many quote requests submitted from this network. Please wait a few minutes or call Usama Traders directly at 0316-9080566 / 0309-5090651.' });
      return;
    }

    const { name, phone, email, siteLocation, requestedItem, quantity, deliveryDate, message } = req.body;

    const cleanName = cleanString(name);
    const cleanPhone = cleanString(phone);
    const cleanLocation = cleanString(siteLocation);
    const cleanItem = cleanString(requestedItem);
    const cleanQuantity = cleanString(quantity);

    if (!cleanName || cleanName.length < 2) {
      res.status(400).json({ error: 'Please provide a valid contact name.' });
      return;
    }
    if (!cleanPhone || cleanPhone.length < 7) {
      res.status(400).json({ error: 'Please provide a valid phone or WhatsApp number.' });
      return;
    }
    if (!cleanItem) {
      res.status(400).json({ error: 'Please select or enter the required material.' });
      return;
    }

    const db = getDatabase();
    const referenceId = `UT-AJK-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      referenceId,
      name: cleanName,
      phone: cleanPhone,
      email: cleanString(email),
      siteLocation: cleanLocation || 'Pallandri / Sudhnoti',
      requestedItem: cleanItem,
      quantity: cleanQuantity || 'Bulk Consignment',
      deliveryDate: cleanString(deliveryDate),
      message: cleanString(message),
      status: 'New',
      createdAt: now,
      updatedAt: now,
    };

    db.inquiries.unshift(newInquiry);
    await saveDatabase(db);

    res.status(201).json({
      success: true,
      referenceId,
      message: 'Your inquiry has been successfully received by USAMA TRADERS Pallandri desk.',
      inquiry: {
        referenceId: newInquiry.referenceId,
        name: newInquiry.name,
        requestedItem: newInquiry.requestedItem,
        status: newInquiry.status,
      },
    });
  } catch (error) {
    console.error('Error creating public inquiry:', error);
    res.status(500).json({ error: 'Failed to process inquiry. Please call directly at 0316-9080566 / 0309-5090651.' });
  }
});

// Tracking endpoint for customers to check order/inquiry status
router.get('/public/inquiries/track/:ref', (req: Request, res: Response) => {
  const ref = req.params.ref.toUpperCase().trim();
  const db = getDatabase();
  const found = db.inquiries.find(i => i.referenceId === ref || i.id === ref);

  if (!found) {
    res.status(404).json({ error: 'No order or inquiry found with this reference code.' });
    return;
  }

  // Return public-safe tracking details
  res.json({
    success: true,
    tracking: {
      referenceId: found.referenceId,
      customerName: found.name,
      destination: found.siteLocation,
      items: found.requestedItem,
      quantity: found.quantity,
      status: found.status,
      submittedDate: found.createdAt,
    },
  });
});

/* ==========================================================================
   AUTHENTICATION ROUTES
   ========================================================================== */

router.get('/auth/setup-status', (_req: Request, res: Response) => {
  const db = getDatabase();
  const hasAdmin = db.users && db.users.length > 0;
  res.json({
    needsSetup: !hasAdmin,
    totalAdmins: db.users ? db.users.length : 0,
  });
});

router.post('/auth/setup-admin', async (req: Request, res: Response) => {
  const db = getDatabase();
  if (db.users && db.users.length > 0) {
    res.status(403).json({ error: 'Initial administrator already exists. Setup is closed.' });
    return;
  }

  const { email, password, name } = req.body;
  const cleanEmail = cleanString(email).toLowerCase();
  const cleanPass = cleanString(password);
  const cleanName = cleanString(name);

  if (!cleanEmail || !cleanEmail.includes('@')) {
    res.status(400).json({ error: 'Please provide a valid administrator email.' });
    return;
  }
  if (!cleanPass || cleanPass.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    return;
  }

  const passwordHash = await bcrypt.hash(cleanPass, 10);
  const newAdmin = {
    id: `usr-${Date.now()}`,
    email: cleanEmail,
    name: cleanName || 'Administrator',
    passwordHash,
    role: 'admin' as const,
    createdAt: new Date().toISOString(),
  };

  db.users = [newAdmin];
  await saveDatabase(db);
  await recordAuditLog(cleanEmail, 'SETUP_INITIAL_ADMIN', 'User', 'Initial administrator account created', newAdmin.id);

  const token = generateToken(newAdmin);
  res.status(201).json({
    success: true,
    token,
    user: { id: newAdmin.id, email: newAdmin.email, name: newAdmin.name, role: newAdmin.role },
  });
});

router.post('/auth/login', async (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(loginRateLimitMap, clientIp, 8, 15 * 60 * 1000)) {
    res.status(429).json({ error: 'Too many login attempts. For security reasons, please wait 15 minutes before retrying.' });
    return;
  }

  const { email, password } = req.body;
  const cleanEmail = cleanString(email).toLowerCase();
  const cleanPass = cleanString(password);

  if (!cleanEmail || !cleanPass) {
    res.status(400).json({ error: 'Please enter both email and password.' });
    return;
  }

  const db = getDatabase();
  const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    res.status(401).json({ error: 'Invalid administrator email or password.' });
    return;
  }

  const match = await bcrypt.compare(cleanPass, user.passwordHash);
  if (!match) {
    res.status(401).json({ error: 'Invalid administrator email or password.' });
    return;
  }

  user.lastLoginAt = new Date().toISOString();
  await saveDatabase(db);
  await recordAuditLog(user.email, 'LOGIN', 'Auth', 'Administrator logged into dashboard', user.id);

  const token = generateToken(user);
  res.json({
    success: true,
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

router.get('/auth/me', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, user: req.user });
});

/* ==========================================================================
   IMAGE UPLOAD ROUTE (Admin Protected)
   ========================================================================== */

router.post('/upload', requireAdminAuth, uploadMiddleware.single('image'), async (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No image file was uploaded.' });
    return;
  }

  // Verify binary magic bytes to prevent masqueraded files
  const isValidMagicBytes = await validateImageMagicBytes(req.file.path);
  if (!isValidMagicBytes) {
    deleteUploadedFile(req.file.filename);
    res.status(400).json({ error: 'Uploaded file signature is invalid. Only genuine JPEG, PNG, or WebP images are permitted.' });
    return;
  }

  const url = `/uploads/${req.file.filename}`;
  await recordAuditLog(req.user?.email || 'admin', 'UPLOAD_IMAGE', 'Media', `Uploaded image ${req.file.filename}`, req.file.filename);

  res.json({
    success: true,
    url,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

/* ==========================================================================
   ADMIN PROTECTED ROUTES
   ========================================================================== */

// Dashboard Stats Overview
router.get('/admin/stats', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();

  const totalProducts = db.products.length;
  const publishedProducts = db.products.filter(p => p.isPublished).length;
  const totalBlocks = db.blockProducts.length;
  const totalFleet = db.fleetVehicles.length;
  const activeFleet = db.fleetVehicles.filter(f => f.inService).length;
  const totalProjects = db.projects.length;
  const totalGallery = db.galleryItems.length;

  const totalInquiries = db.inquiries.length;
  const newInquiries = db.inquiries.filter(i => i.status === 'New').length;
  const contactedInquiries = db.inquiries.filter(i => i.status === 'Contacted').length;
  const quotedInquiries = db.inquiries.filter(i => i.status === 'Quoted').length;
  const closedInquiries = db.inquiries.filter(i => i.status === 'Closed').length;

  const recentInquiries = db.inquiries.slice(0, 5);

  res.json({
    success: true,
    stats: {
      totalProducts,
      publishedProducts,
      totalBlocks,
      totalFleet,
      activeFleet,
      totalProjects,
      totalGallery,
      totalInquiries,
      newInquiries,
      contactedInquiries,
      quotedInquiries,
      closedInquiries,
    },
    recentInquiries,
  });
});

/* --- PRODUCTS CRUD --- */

router.get('/admin/products', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, products: db.products });
});

router.post('/admin/products', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, brand, categoryId, description, specifications, unit, price, priceDisplay, inStock, isFeatured, isPublished, imageUrl, imageAlt, strengthGrade, recommendedUse } = req.body;

    if (!name || !brand || !categoryId) {
      res.status(400).json({ error: 'Product name, brand, and category are required.' });
      return;
    }

    const db = getDatabase();
    const now = new Date().toISOString();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: cleanString(name),
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      brand: cleanString(brand),
      categoryId: cleanString(categoryId),
      description: cleanString(description),
      specifications: cleanString(specifications),
      unit: cleanString(unit) || '50kg Bag',
      price: price ? Number(price) : null,
      priceDisplay: cleanString(priceDisplay) || 'Daily Mill Rate',
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      isFeatured: Boolean(isFeatured),
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      imageUrl: cleanString(imageUrl),
      imageAlt: cleanString(imageAlt) || cleanString(name),
      strengthGrade: cleanString(strengthGrade),
      recommendedUse: cleanString(recommendedUse),
      createdAt: now,
      updatedAt: now,
    };

    db.products.unshift(newProduct);
    await saveDatabase(db);
    await recordAuditLog(req.user!.email, 'CREATE_PRODUCT', 'Product', `Created product ${newProduct.name}`, newProduct.id);

    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product.' });
  }
});

router.put('/admin/products/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = db.products.findIndex(p => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Product not found.' });
    return;
  }

  const existing = db.products[index];
  const updated: Product = {
    ...existing,
    ...req.body,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  };

  db.products[index] = updated;
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'UPDATE_PRODUCT', 'Product', `Updated product ${updated.name}`, updated.id);

  res.json({ success: true, product: updated });
});

router.delete('/admin/products/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = db.products.findIndex(p => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Product not found.' });
    return;
  }

  const deleted = db.products.splice(index, 1)[0];
  if (deleted.imageUrl && deleted.imageUrl.startsWith('/uploads/')) {
    deleteUploadedFile(deleted.imageUrl);
  }

  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'DELETE_PRODUCT', 'Product', `Deleted product ${deleted.name}`, id);

  res.json({ success: true, message: 'Product deleted successfully.' });
});

router.patch('/admin/products/:id/publish', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const product = db.products.find(p => p.id === id);

  if (!product) {
    res.status(404).json({ error: 'Product not found.' });
    return;
  }

  product.isPublished = !product.isPublished;
  product.updatedAt = new Date().toISOString();

  await saveDatabase(db);
  await recordAuditLog(req.user!.email, product.isPublished ? 'PUBLISH_PRODUCT' : 'UNPUBLISH_PRODUCT', 'Product', `Changed status to ${product.isPublished ? 'published' : 'draft'}`, id);

  res.json({ success: true, product });
});

/* --- CATEGORIES CRUD --- */

router.get('/admin/categories', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, categories: db.categories });
});

router.post('/admin/categories', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { name, description, displayOrder } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Category name is required.' });
    return;
  }

  const db = getDatabase();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name: cleanString(name),
    slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
    description: cleanString(description),
    displayOrder: displayOrder ? Number(displayOrder) : db.categories.length + 1,
    active: true,
  };

  db.categories.push(newCat);
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'CREATE_CATEGORY', 'Category', `Created category ${newCat.name}`, newCat.id);

  res.status(201).json({ success: true, category: newCat });
});

router.put('/admin/categories/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = db.categories.findIndex(c => c.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Category not found.' });
    return;
  }

  db.categories[index] = { ...db.categories[index], ...req.body, id };
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'UPDATE_CATEGORY', 'Category', `Updated category ${db.categories[index].name}`, id);

  res.json({ success: true, category: db.categories[index] });
});

router.delete('/admin/categories/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  
  // Prevent deleting if products are assigned
  const productsUsing = db.products.filter(p => p.categoryId === id);
  if (productsUsing.length > 0) {
    res.status(400).json({ error: `Cannot delete category. There are ${productsUsing.length} product(s) currently assigned to it.` });
    return;
  }

  const index = db.categories.findIndex(c => c.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Category not found.' });
    return;
  }

  const deleted = db.categories.splice(index, 1)[0];
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'DELETE_CATEGORY', 'Category', `Deleted category ${deleted.name}`, id);

  res.json({ success: true, message: 'Category deleted.' });
});

/* --- BLOCK PRODUCTS CRUD --- */

router.get('/admin/blocks', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, blocks: db.blockProducts });
});

router.post('/admin/blocks', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { name, dimensions, compressiveStrength, application, weight, materialMix, productionCapacity, priceEstimate, inStock, isPublished, imageUrl, imageAlt } = req.body;

  if (!name || !dimensions) {
    res.status(400).json({ error: 'Block product name and dimensions are required.' });
    return;
  }

  const db = getDatabase();
  const now = new Date().toISOString();
  const newBlock: BlockProduct = {
    id: `blk-${Date.now()}`,
    name: cleanString(name),
    dimensions: cleanString(dimensions),
    compressiveStrength: cleanString(compressiveStrength) || '1,800 - 2,200 PSI',
    application: cleanString(application),
    weight: cleanString(weight),
    materialMix: cleanString(materialMix),
    productionCapacity: cleanString(productionCapacity) || '8,000 units / day',
    priceEstimate: cleanString(priceEstimate) || 'Direct Plant Rate',
    inStock: inStock !== undefined ? Boolean(inStock) : true,
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    imageUrl: cleanString(imageUrl),
    imageAlt: cleanString(imageAlt) || cleanString(name),
    createdAt: now,
    updatedAt: now,
  };

  db.blockProducts.unshift(newBlock);
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'CREATE_BLOCK', 'BlockProduct', `Created block product ${newBlock.name}`, newBlock.id);

  res.status(201).json({ success: true, block: newBlock });
});

router.put('/admin/blocks/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = db.blockProducts.findIndex(b => b.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Block product not found.' });
    return;
  }

  const updated: BlockProduct = {
    ...db.blockProducts[index],
    ...req.body,
    id,
    updatedAt: new Date().toISOString(),
  };

  db.blockProducts[index] = updated;
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'UPDATE_BLOCK', 'BlockProduct', `Updated block product ${updated.name}`, id);

  res.json({ success: true, block: updated });
});

router.delete('/admin/blocks/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = db.blockProducts.findIndex(b => b.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Block product not found.' });
    return;
  }

  const deleted = db.blockProducts.splice(index, 1)[0];
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'DELETE_BLOCK', 'BlockProduct', `Deleted block product ${deleted.name}`, id);

  res.json({ success: true, message: 'Block product deleted.' });
});

router.patch('/admin/blocks/:id/publish', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const block = db.blockProducts.find(b => b.id === id);

  if (!block) {
    res.status(404).json({ error: 'Block product not found.' });
    return;
  }

  block.isPublished = !block.isPublished;
  block.updatedAt = new Date().toISOString();
  await saveDatabase(db);

  res.json({ success: true, block });
});

/* --- FLEET MANAGEMENT CRUD --- */

router.get('/admin/fleet', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, fleet: db.fleetVehicles });
});

router.post('/admin/fleet', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { name, identifier, type, capacity, services, serviceAreas, inService, isFeatured, count, description, imageUrl, imageAlt } = req.body;

  if (!name || !type) {
    res.status(400).json({ error: 'Vehicle name and type are required.' });
    return;
  }

  const db = getDatabase();
  const now = new Date().toISOString();
  const newVehicle: FleetVehicle = {
    id: `flt-${Date.now()}`,
    identifier: cleanString(identifier) || `UT-FLEET-${db.fleetVehicles.length + 1}`,
    name: cleanString(name),
    type: cleanString(type),
    capacity: cleanString(capacity),
    services: Array.isArray(services) ? services : [cleanString(services)],
    serviceAreas: Array.isArray(serviceAreas) ? serviceAreas : [cleanString(serviceAreas)],
    inService: inService !== undefined ? Boolean(inService) : true,
    isFeatured: Boolean(isFeatured),
    count: count ? Number(count) : 1,
    description: cleanString(description),
    imageUrl: cleanString(imageUrl),
    imageAlt: cleanString(imageAlt) || cleanString(name),
    createdAt: now,
    updatedAt: now,
  };

  db.fleetVehicles.push(newVehicle);
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'CREATE_FLEET', 'FleetVehicle', `Created vehicle ${newVehicle.name}`, newVehicle.id);

  res.status(201).json({ success: true, vehicle: newVehicle });
});

router.put('/admin/fleet/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = db.fleetVehicles.findIndex(f => f.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Vehicle not found.' });
    return;
  }

  const updated: FleetVehicle = {
    ...db.fleetVehicles[index],
    ...req.body,
    id,
    updatedAt: new Date().toISOString(),
  };

  db.fleetVehicles[index] = updated;
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'UPDATE_FLEET', 'FleetVehicle', `Updated vehicle ${updated.name}`, id);

  res.json({ success: true, vehicle: updated });
});

router.delete('/admin/fleet/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = db.fleetVehicles.findIndex(f => f.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Vehicle not found.' });
    return;
  }

  const deleted = db.fleetVehicles.splice(index, 1)[0];
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'DELETE_FLEET', 'FleetVehicle', `Deleted vehicle ${deleted.name}`, id);

  res.json({ success: true, message: 'Vehicle removed.' });
});

/* --- PROJECTS CRUD --- */

router.get('/admin/projects', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, projects: db.projects });
});

router.post('/admin/projects', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { title, location, category, scope, materialsSupplied, year, status, isFeatured, isPublished, images } = req.body;

  if (!title || !location) {
    res.status(400).json({ error: 'Project title and location are required.' });
    return;
  }

  const db = getDatabase();
  const now = new Date().toISOString();
  const newProject: Project = {
    id: `prj-${Date.now()}`,
    title: cleanString(title),
    location: cleanString(location),
    category: category || 'infrastructure',
    scope: cleanString(scope),
    materialsSupplied: cleanString(materialsSupplied),
    year: cleanString(year) || new Date().getFullYear().toString(),
    status: status || 'Completed',
    isFeatured: Boolean(isFeatured),
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    images: Array.isArray(images) ? images : [],
    createdAt: now,
    updatedAt: now,
  };

  db.projects.unshift(newProject);
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'CREATE_PROJECT', 'Project', `Created project ${newProject.title}`, newProject.id);

  res.status(201).json({ success: true, project: newProject });
});

router.put('/admin/projects/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = db.projects.findIndex(p => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }

  const updated: Project = {
    ...db.projects[index],
    ...req.body,
    id,
    updatedAt: new Date().toISOString(),
  };

  db.projects[index] = updated;
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'UPDATE_PROJECT', 'Project', `Updated project ${updated.title}`, id);

  res.json({ success: true, project: updated });
});

router.delete('/admin/projects/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = db.projects.findIndex(p => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }

  const deleted = db.projects.splice(index, 1)[0];
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'DELETE_PROJECT', 'Project', `Deleted project ${deleted.title}`, id);

  res.json({ success: true, message: 'Project removed.' });
});

router.patch('/admin/projects/:id/publish', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const project = db.projects.find(p => p.id === id);

  if (!project) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }

  project.isPublished = !project.isPublished;
  project.updatedAt = new Date().toISOString();
  await saveDatabase(db);

  res.json({ success: true, project });
});

/* --- SERVICES CRUD --- */

router.get('/admin/services', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, services: db.services });
});

router.post('/admin/services', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { title, icon, description, features, isPublished, displayOrder } = req.body;
  if (!title) {
    res.status(400).json({ error: 'Service title is required.' });
    return;
  }

  const db = getDatabase();
  const now = new Date().toISOString();
  const newService: ConstructionService = {
    id: `srv-${Date.now()}`,
    title: cleanString(title),
    icon: cleanString(icon) || 'HardHat',
    description: cleanString(description),
    features: Array.isArray(features) ? features : [],
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    displayOrder: displayOrder ? Number(displayOrder) : db.services.length + 1,
    createdAt: now,
    updatedAt: now,
  };

  db.services.push(newService);
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'CREATE_SERVICE', 'Service', `Created service ${newService.title}`, newService.id);

  res.status(201).json({ success: true, service: newService });
});

router.put('/admin/services/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = db.services.findIndex(s => s.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Service not found.' });
    return;
  }

  db.services[index] = { ...db.services[index], ...req.body, id, updatedAt: new Date().toISOString() };
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'UPDATE_SERVICE', 'Service', `Updated service ${db.services[index].title}`, id);

  res.json({ success: true, service: db.services[index] });
});

router.delete('/admin/services/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = db.services.findIndex(s => s.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Service not found.' });
    return;
  }

  const deleted = db.services.splice(index, 1)[0];
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'DELETE_SERVICE', 'Service', `Deleted service ${deleted.title}`, id);

  res.json({ success: true, message: 'Service removed.' });
});

/* --- GALLERY CRUD --- */

router.get('/admin/gallery', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, gallery: db.galleryItems });
});

router.post('/admin/gallery', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { title, category, imageUrl, imageAlt, description, isPublished } = req.body;
  if (!imageUrl) {
    res.status(400).json({ error: 'Image URL is required for gallery items.' });
    return;
  }

  const db = getDatabase();
  const now = new Date().toISOString();
  const newItem: GalleryItem = {
    id: `gal-${Date.now()}`,
    title: cleanString(title) || 'Business Photo',
    category: category || 'general',
    imageUrl: cleanString(imageUrl),
    imageAlt: cleanString(imageAlt) || cleanString(title) || 'USAMA TRADERS photo',
    description: cleanString(description),
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    createdAt: now,
    updatedAt: now,
  };

  db.galleryItems.unshift(newItem);
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'CREATE_GALLERY_ITEM', 'Gallery', `Added gallery photo ${newItem.title}`, newItem.id);

  res.status(201).json({ success: true, item: newItem });
});

router.put('/admin/gallery/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = db.galleryItems.findIndex(g => g.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Gallery item not found.' });
    return;
  }

  db.galleryItems[index] = { ...db.galleryItems[index], ...req.body, id, updatedAt: new Date().toISOString() };
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'UPDATE_GALLERY_ITEM', 'Gallery', `Updated photo ${db.galleryItems[index].title}`, id);

  res.json({ success: true, item: db.galleryItems[index] });
});

router.delete('/admin/gallery/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = db.galleryItems.findIndex(g => g.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Gallery item not found.' });
    return;
  }

  const deleted = db.galleryItems.splice(index, 1)[0];
  if (deleted.imageUrl && deleted.imageUrl.startsWith('/uploads/')) {
    deleteUploadedFile(deleted.imageUrl);
  }

  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'DELETE_GALLERY_ITEM', 'Gallery', `Deleted photo ${deleted.title}`, id);

  res.json({ success: true, message: 'Gallery item removed.' });
});

/* --- INQUIRIES MANAGEMENT --- */

router.get('/admin/inquiries', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, inquiries: db.inquiries });
});

router.put('/admin/inquiries/:id/status', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['New', 'Contacted', 'Quoted', 'Closed'].includes(status)) {
    res.status(400).json({ error: 'Invalid status. Must be New, Contacted, Quoted, or Closed.' });
    return;
  }

  const db = getDatabase();
  const inquiry = db.inquiries.find(i => i.id === id);

  if (!inquiry) {
    res.status(404).json({ error: 'Inquiry not found.' });
    return;
  }

  inquiry.status = status;
  inquiry.updatedAt = new Date().toISOString();
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'UPDATE_INQUIRY_STATUS', 'Inquiry', `Changed status to ${status} for ${inquiry.referenceId}`, id);

  res.json({ success: true, inquiry });
});

router.put('/admin/inquiries/:id/notes', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { internalNotes } = req.body;

  const db = getDatabase();
  const inquiry = db.inquiries.find(i => i.id === id);

  if (!inquiry) {
    res.status(404).json({ error: 'Inquiry not found.' });
    return;
  }

  inquiry.internalNotes = cleanString(internalNotes);
  inquiry.updatedAt = new Date().toISOString();
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'UPDATE_INQUIRY_NOTES', 'Inquiry', `Updated internal notes on ${inquiry.referenceId}`, id);

  res.json({ success: true, inquiry });
});

router.delete('/admin/inquiries/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = db.inquiries.findIndex(i => i.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Inquiry not found.' });
    return;
  }

  const deleted = db.inquiries.splice(index, 1)[0];
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'DELETE_INQUIRY', 'Inquiry', `Deleted inquiry ${deleted.referenceId}`, id);

  res.json({ success: true, message: 'Inquiry removed.' });
});

/* --- BUSINESS PROFILE & 3 OWNERS --- */

router.get('/admin/business-profile', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, profile: db.businessProfile });
});

router.put('/admin/business-profile', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const updatedProfile: BusinessProfile = {
    ...db.businessProfile,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  db.businessProfile = updatedProfile;
  await saveDatabase(db);
  await recordAuditLog(req.user!.email, 'UPDATE_BUSINESS_PROFILE', 'BusinessProfile', 'Updated business profile and contact details');

  res.json({ success: true, profile: updatedProfile });
});

/* --- SECURITY & AUDIT LOGS --- */

router.put('/admin/settings/password', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    return;
  }

  const db = getDatabase();
  const user = db.users.find(u => u.id === req.user!.userId);

  if (!user) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }

  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match) {
    res.status(400).json({ error: 'Current password does not match.' });
    return;
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await saveDatabase(db);
  await recordAuditLog(user.email, 'CHANGE_PASSWORD', 'User', 'Administrator changed account password', user.id);

  res.json({ success: true, message: 'Password updated successfully.' });
});

router.get('/admin/audit-logs', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, logs: db.auditLogs.slice(0, 100) });
});

export default router;

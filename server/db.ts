import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'admin';
  createdAt: string;
  lastLoginAt?: string;
}

export interface BusinessOwner {
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface BusinessProfile {
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
  socialLinks: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    linkedin?: string;
  };
  owners: BusinessOwner[];
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  active: boolean;
}

export interface Product {
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

export interface BlockProduct {
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

export interface FleetVehicle {
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

export interface Project {
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

export interface ConstructionService {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  isPublished: boolean;
  displayOrder: number;
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

export interface Inquiry {
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

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  entity: string;
  entityId?: string;
  details: string;
  timestamp: string;
}

export interface DatabaseSchema {
  users: User[];
  businessProfile: BusinessProfile;
  categories: Category[];
  products: Product[];
  blockProducts: BlockProduct[];
  fleetVehicles: FleetVehicle[];
  projects: Project[];
  services: ConstructionService[];
  galleryItems: GalleryItem[];
  inquiries: Inquiry[];
  auditLogs: AuditLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

// In-memory cache with write queue to ensure atomicity and prevent race conditions
let memoryDb: DatabaseSchema | null = null;
let isWriting = false;
let pendingWrite = false;

// Initial Seed Data matching Pallandri Azad Kashmir Business
function getInitialSeedData(): DatabaseSchema {
  const now = new Date().toISOString();
  // Default password hash for initial admin: admin@usamatraders.com / UsamaTraders2026!
  // Salt rounds: 10
  const initialPasswordHash = bcrypt.hashSync('UsamaTraders2026!', 10);

  return {
    users: [
      {
        id: 'usr-admin-1',
        email: 'admin@usamatraders.com',
        name: 'Usama Sardar',
        passwordHash: initialPasswordHash,
        role: 'admin',
        createdAt: now,
      },
    ],
    businessProfile: {
      name: 'USAMA TRADERS',
      tagline: 'Building Trust, Delivering Quality',
      about: 'Premier cement supplier, automated hydraulic concrete block manufacturer, and heavy mountain transportation logistics provider in Pallandri, Sudhnoti, Azad Kashmir. Serving residential, commercial, and governmental infrastructure projects across Azad Jammu & Kashmir.',
      address: 'Main By-Pass Road',
      city: 'Pallandri',
      district: 'District Sudhnoti',
      region: 'Azad Kashmir',
      country: 'Pakistan',
      postalCode: '12010',
      phoneNumbers: ['0316-9080566', '0309-5090651', '0343-8590951'],
      whatsappNumber: '+923169080566',
      email: 'sardarmahirkhan0601@gmail.com',
      businessHours: 'Saturday - Thursday: 07:00 AM - 08:00 PM | Friday: 07:00 AM - 12:30 PM & 03:00 PM - 08:00 PM',
      serviceAreas: [
        'Pallandri City & By-Pass',
        'Trarkhal Tehsil',
        'Baloch Tehsil & Forward Areas',
        'Gorah & Degree College Road',
        'Mong & Surrounding Villages',
        'Thorar Tehsil',
        'Rawalakot & Poonch Basin',
      ],
      logoUrl: '',
      socialLinks: {
        facebook: 'https://facebook.com',
        whatsapp: 'https://wa.me/923169080566',
      },
      owners: [
        {
          name: 'Sardar Mahir Khan',
          role: 'Director & Supply Operations',
          phone: '0316-9080566',
          email: 'sardarmahirkhan0601@gmail.com',
        },
        {
          name: 'Sardar Usama Khan',
          role: 'Executive Director & Commercial Lead',
          phone: '0309-5090651',
          email: 'usamaikhlaq677@gmail.com',
        },
        {
          name: 'Sardar Ali Sudozai',
          role: 'Director Sales & Logistics',
          phone: '0343-8590951',
          email: 'sales.ajk@usamatraders.com',
        },
      ],
      updatedAt: now,
    },
    categories: [
      { id: 'cat-cement', name: 'Portland & Structural Cement', slug: 'cement', description: 'Certified 53 Grade OPC and specialized cements', displayOrder: 1, active: true },
      { id: 'cat-blocks', name: 'Hydraulic Concrete Blocks', slug: 'concrete-blocks', description: 'Solid, hollow, and partition masonry units', displayOrder: 2, active: true },
      { id: 'cat-steel', name: 'Steel & Rebar Reinforcement', slug: 'steel-rebar', description: 'Grade 60 earthquake-resistant TMT rebar', displayOrder: 3, active: true },
      { id: 'cat-aggregates', name: 'Crushed Bajri & Sand', slug: 'aggregates', description: 'Washed Margalla stone and river sand', displayOrder: 4, active: true },
      { id: 'cat-pavers', name: 'Tuff Tiles & Kerb Stones', slug: 'pavers', description: 'Heavy-duty interlocking pavers and drainage profiles', displayOrder: 5, active: true },
    ],
    products: [
      {
        id: 'prod-bestway-opc',
        name: 'Bestway Cement (OPC 53 Grade)',
        slug: 'bestway-cement-opc-53',
        brand: 'Bestway Cement',
        categoryId: 'cat-cement',
        description: 'Pakistan’s top choice for structural durability in mountain terrain. Fresh factory lift with guaranteed chemical composition.',
        specifications: 'ASTM C150 Type I / PS:232-2008, 28-day strength > 58 MPa',
        unit: '50kg Bag',
        price: null,
        priceDisplay: 'Call for Daily Mill Rate',
        inStock: true,
        isFeatured: true,
        isPublished: true,
        imageUrl: '',
        imageAlt: 'Bestway Cement 50kg bag',
        strengthGrade: 'Grade 53 High Strength',
        recommendedUse: 'High-altitude retaining walls, RCC roofs, bridges, columns & beams in Azad Kashmir',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'prod-fauji-opc',
        name: 'Fauji Cement (High-Early Strength)',
        slug: 'fauji-cement-high-early-strength',
        brand: 'Fauji Cement',
        categoryId: 'cat-cement',
        description: 'Superior setting time designed for cold-weather mountain concreting and rapid strength gain.',
        specifications: 'Conforms to BS 12 & EN 197-1 CEM I 42.5R',
        unit: '50kg Bag',
        price: null,
        priceDisplay: 'Official Direct Dealer Wholesale Price',
        inStock: true,
        isFeatured: true,
        isPublished: true,
        imageUrl: '',
        imageAlt: 'Fauji Cement 50kg bag',
        strengthGrade: 'CEM I 42.5R Fast Cure',
        recommendedUse: 'Cold-weather foundations, slab casting, and rapid cure concrete work',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'prod-askari-src',
        name: 'Askari Cement (Sulphate Resistant)',
        slug: 'askari-cement-sulphate-resistant',
        brand: 'Askari Cement',
        categoryId: 'cat-cement',
        description: 'Engineered for tough soil chemistry, ground moisture exposure, and underground water reservoirs.',
        specifications: 'ASTM C150 Type V / Type I, High fineness & low heat hydration',
        unit: '50kg Bag',
        price: null,
        priceDisplay: 'Wholesale Mill Rate',
        inStock: true,
        isFeatured: false,
        isPublished: true,
        imageUrl: '',
        imageAlt: 'Askari Cement 50kg bag',
        strengthGrade: 'Specialized OPC Type V',
        recommendedUse: 'Ground retainers, basement drainage walls, underground water tanks in Sudhnoti',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'prod-cherat-opc',
        name: 'Cherat Cement (Pure Portland)',
        slug: 'cherat-cement-pure-portland',
        brand: 'Cherat Cement',
        categoryId: 'cat-cement',
        description: 'Smooth workability and consistent slump quality for plastering, brick masonry, and general slabs.',
        specifications: 'Low alkali formula, compressive strength 52 MPa at 28 days',
        unit: '50kg Bag',
        price: null,
        priceDisplay: 'Competitive Retail & Bulk Rate',
        inStock: true,
        isFeatured: false,
        isPublished: true,
        imageUrl: '',
        imageAlt: 'Cherat Cement 50kg bag',
        strengthGrade: 'Standard OPC 42.5N',
        recommendedUse: 'General masonry, plastering, slab casting, and boundary wall works',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'prod-steel-rebar',
        name: 'Deformed Steel Rebar (Grade 60)',
        slug: 'deformed-steel-rebar-grade-60',
        brand: 'Mill Certified Prime Rebar',
        categoryId: 'cat-steel',
        description: 'Seismic-resistant reinforcement conforming to Azad Kashmir building codes. Guaranteed bendability and yield point.',
        specifications: 'ASTM A615 Grade 60, Yield Strength ≥ 60,000 PSI (420 MPa)',
        unit: 'Per Metric Ton / Bundle',
        price: null,
        priceDisplay: 'Daily Mill Rate with Crane Offloading',
        inStock: true,
        isFeatured: true,
        isPublished: true,
        imageUrl: '',
        imageAlt: 'Grade 60 steel rebar bundles',
        strengthGrade: 'Grade 60 TMT Seismic Safe',
        recommendedUse: 'Earthquake-safe RCC structures, hillside cantilever slabs & columns',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'prod-margalla-bajri',
        name: 'Margalla Hill Crushed Bajri & Chenab Sand',
        slug: 'margalla-hill-crushed-bajri-chenab-sand',
        brand: 'Direct Taxila / Margalla Quarry',
        categoryId: 'cat-aggregates',
        description: 'Clean, silt-free crushed rock aggregate quarried for maximum bond strength in concrete mixes.',
        specifications: '1/2" Down, 3/4" Down Aggregate & Coarse River Sand (< 3% silt)',
        unit: 'Per Cubic Feet (Cft) / Truckload',
        price: null,
        priceDisplay: 'Delivered at Pallandri & Surroundings',
        inStock: true,
        isFeatured: true,
        isPublished: true,
        imageUrl: '',
        imageAlt: 'Margalla crushed bajri and river sand',
        strengthGrade: 'Tested Silt-Free Natural Quarry',
        recommendedUse: 'RCC roof casting, lintels, concrete block manufacturing & plaster',
        createdAt: now,
        updatedAt: now,
      },
    ],
    blockProducts: [
      {
        id: 'blk-8-solid',
        name: '8" Solid Mountain-Grade Heavy Concrete Block',
        dimensions: '8" x 8" x 16" (Standard)',
        compressiveStrength: '1,800 - 2,200 PSI',
        application: 'Hill retaining walls, foundation basements, load-bearing mountain walls',
        weight: 'Approx. 22 - 24 kg',
        materialMix: 'High-ratio Portland cement, fine aggregate & washed quarry dust',
        productionCapacity: '10,000 units / day from automated hydraulic press',
        priceEstimate: 'Direct Plant Rate with Delivery',
        inStock: true,
        isPublished: true,
        imageUrl: '',
        imageAlt: '8 inch solid concrete block',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'blk-6-solid-hollow',
        name: '6" Solid & Hollow Load-Bearing Masonry Block',
        dimensions: '6" x 8" x 16"',
        compressiveStrength: '1,400 - 1,800 PSI',
        application: 'Exterior building walls, commercial plazas, boundary walls',
        weight: 'Approx. 16 - 18 kg',
        materialMix: 'Hydraulically vibrated high-density concrete slurry',
        productionCapacity: '8,000 units / day',
        priceEstimate: 'Direct Plant Rate',
        inStock: true,
        isPublished: true,
        imageUrl: '',
        imageAlt: '6 inch hollow masonry block',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'blk-4-partition',
        name: '4" Precision Partition Concrete Block',
        dimensions: '4" x 8" x 16"',
        compressiveStrength: '1,200 - 1,500 PSI',
        application: 'Interior partition walls, multi-storey room division, sound insulation',
        weight: 'Approx. 11 - 13 kg',
        materialMix: 'Vibrated cement-aggregate matrix',
        productionCapacity: '6,000 units / day',
        priceEstimate: 'Factory Wholesale Price',
        inStock: true,
        isPublished: true,
        imageUrl: '',
        imageAlt: '4 inch partition concrete block',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'blk-tuff-tiles',
        name: 'Heavy-Duty Interlocking Tuff Tiles & Pavers',
        dimensions: '60mm & 80mm Thickness (Zig-Zag / I-Shape)',
        compressiveStrength: '4,500 - 5,000 PSI',
        application: 'Driveways, filling station aprons, courtyard paving, commercial footpaths',
        weight: 'High-density abrasion resistant',
        materialMix: 'Dual-layer hydraulic pressing with UV-stable mineral pigments',
        productionCapacity: '15,000 sq ft / week',
        priceEstimate: 'Per Sq Ft Delivered',
        inStock: true,
        isPublished: true,
        imageUrl: '',
        imageAlt: 'Interlocking tuff tiles and pavers',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'blk-kerb-stone',
        name: 'Engineered Concrete Kerb Stones & Drainage Channels',
        dimensions: '12" x 18" x 6" / Custom Road Profiles',
        compressiveStrength: '3,500 PSI',
        application: 'Hill road verge protection, drainage gutters, footpath edging in AJK',
        weight: 'Solid precast unit',
        materialMix: 'Precast steel reinforced concrete',
        productionCapacity: '500 linear meters / week',
        priceEstimate: 'Contractor Price',
        inStock: true,
        isPublished: true,
        imageUrl: '',
        imageAlt: 'Concrete kerb stones',
        createdAt: now,
        updatedAt: now,
      },
    ],
    fleetVehicles: [
      {
        id: 'flt-mazda-titan',
        identifier: 'UT-FLEET-01',
        name: 'Mazda Titan & T3500 (6-Wheeler Hill Trucks)',
        type: 'Narrow Hill Access Tipper / Cargo',
        capacity: '200 - 350 Cement Bags / 600 - 900 Blocks / 200 Cft Aggregate',
        services: ['Hillside site delivery', 'Narrow village road access', 'On-site tipper offload'],
        serviceAreas: ['Pallandri', 'Trarkhal', 'Mong', 'Gorah', 'Baloch', 'Thorar'],
        inService: true,
        isFeatured: true,
        count: 8,
        description: 'Our most agile mountain delivery vehicles. Capable of climbing steep incline village roads and delivering right to your construction site gate.',
        imageUrl: '',
        imageAlt: 'Mazda 6-wheeler hill truck',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'flt-10-wheeler-dumper',
        identifier: 'UT-FLEET-02',
        name: 'Heavy 10-Wheeler Dumpers (Hino / Isuzu)',
        type: 'Long-Haul Bulk Aggregate Hauler',
        capacity: '700 - 900 Cubic Feet (Cft) / 30-35 Tons',
        services: ['Bulk quarry aggregate haul', 'River sand supply', 'Major infrastructure delivery'],
        serviceAreas: ['Taxila to Pallandri Corridor', 'Sudhnoti By-Pass Depot'],
        inService: true,
        isFeatured: true,
        count: 5,
        description: 'Heavy capacity dumpers that bring prime crushed Bajri and river sand directly from original Punjab quarries to our Sudhnoti distribution yards.',
        imageUrl: '',
        imageAlt: '10 wheeler aggregate dumper',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'flt-flatbed-trailer',
        identifier: 'UT-FLEET-03',
        name: 'Flatbed Multi-Axle Trailers',
        type: 'Factory-Direct Cement Transport',
        capacity: '1,000 to 1,500 Bags per trip (50 to 75 Tons)',
        services: ['Direct factory cement lifting', 'Bulk steel rebar transport'],
        serviceAreas: ['Hattar/Chakwal to Pallandri', 'Rawalpindi Depot'],
        inService: true,
        isFeatured: true,
        count: 4,
        description: 'Direct factory lifted cement haulers running daily from Bestway and Fauji mills directly to our Pallandri warehouses.',
        imageUrl: '',
        imageAlt: 'Flatbed multi-axle trailer',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'flt-mobile-crane',
        identifier: 'UT-FLEET-04',
        name: 'Mobile Mechanical Crane & Offloading Rigs',
        type: 'Hydraulic Unloading Assist',
        capacity: 'Palletized Block & Rebar Crane Offloading',
        services: ['Zero-breakage block offloading', 'Heavy steel rebar placement'],
        serviceAreas: ['Pallandri City Sites', 'Commercial Projects in Sudhnoti'],
        inService: true,
        isFeatured: false,
        count: 2,
        description: 'Guarantees zero breakage during offloading of precision concrete blocks and heavy Grade 60 steel rebar bundles.',
        imageUrl: '',
        imageAlt: 'Mobile mechanical crane',
        createdAt: now,
        updatedAt: now,
      },
    ],
    projects: [
      {
        id: 'prj-pallandri-bypass',
        title: 'Pallandri By-Pass Hill Retaining & Drainage Works',
        location: 'Sudhnoti District By-Pass, Azad Kashmir',
        category: 'infrastructure',
        scope: 'Supply of 12,000+ Bags Bestway OPC and 45,000 High-Density 8" Solid Blocks for hill stabilization and culvert works.',
        materialsSupplied: 'OPC Cement, 8" Solid Blocks, 1/2" Crushed Bajri',
        year: '2025 - 2026',
        status: 'Completed',
        isFeatured: true,
        isPublished: true,
        images: [],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'prj-judicial-plaza',
        title: 'Sudhnoti District Judicial & Commercial Plaza',
        location: 'Main Bazar / Court Road, Pallandri',
        category: 'commercial',
        scope: 'Exclusive supply of Grade 60 Steel Rebar, 8,500 Bags Fauji Cement, and 6" Partition Blocks for multi-storey frame.',
        materialsSupplied: 'Fauji Cement, Grade 60 Rebar, 6" Partition Blocks',
        year: '2024 - 2025',
        status: 'Completed',
        isFeatured: true,
        isPublished: true,
        images: [],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'prj-community-mosque',
        title: 'Hillside Community Mosque & Educational Complex',
        location: 'Gorah / Trarkhal Highway, Sudhnoti',
        category: 'public',
        scope: 'Complete structural concrete materials, foundation stones, Bajri dumpers, and Tuff Tile courtyards.',
        materialsSupplied: 'Cement, Sand, Crushed Rock, Interlocking Pavers',
        year: '2024',
        status: 'Completed',
        isFeatured: false,
        isPublished: true,
        images: [],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'prj-residential-villas',
        title: 'Luxury Hillside Residential Villas & Retaining Terraces',
        location: 'VIP Colony & Kotli Road, Pallandri',
        category: 'residential',
        scope: 'Premium Askari Sulphate-Resistant cement for basement retaining walls, 8" solid blocks, and steel rebar.',
        materialsSupplied: 'Askari & Bestway Cement, 8" Blocks, Grade 60 Rebar',
        year: '2025 - Present',
        status: 'In Progress',
        isFeatured: true,
        isPublished: true,
        images: [],
        createdAt: now,
        updatedAt: now,
      },
    ],
    services: [
      {
        id: 'srv-cement-distribution',
        title: 'Wholesale Mill-Direct Cement Supply',
        icon: 'Package',
        description: 'Direct factory lifted Bestway, Fauji, and Askari cement in fresh, unadulterated moisture-proof packaging.',
        features: ['Guaranteed mill-fresh stock', 'Direct trailer delivery', 'Computerized weighbridge verification'],
        isPublished: true,
        displayOrder: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'srv-block-manufacturing',
        title: 'Hydraulic Machine-Pressed Concrete Blocks',
        icon: 'Boxes',
        description: 'Precision manufactured concrete masonry units with 14-day water pond curing for high mountain durability.',
        features: ['10,000 blocks daily capacity', 'Moisture and frost resistant', 'Uniform dimensions with zero breakage'],
        isPublished: true,
        displayOrder: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'srv-mountain-fleet',
        title: 'Specialized Mountain Fleet Transportation',
        icon: 'Truck',
        description: 'Dedicated 6-wheeler Mazdas and heavy dumpers navigating steep gradient village routes across Sudhnoti.',
        features: ['Doorstep site unloading', 'Experienced mountain drivers', 'GPS-assisted dispatch'],
        isPublished: true,
        displayOrder: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'srv-structural-materials',
        title: 'Steel Rebar & Washed Quarry Aggregates',
        icon: 'HardHat',
        description: 'Seismic Grade 60 steel rebar and silt-free Margalla crushed stone delivered directly to your job site.',
        features: ['ASTM A615 Grade 60 certification', 'Washed 1/2" down aggregate', 'Crane offloading assistance'],
        isPublished: true,
        displayOrder: 4,
        createdAt: now,
        updatedAt: now,
      },
    ],
    galleryItems: [
      {
        id: 'gal-cement-stock',
        title: 'Palletized Bestway Cement at Pallandri Depot',
        category: 'cement',
        imageUrl: '',
        imageAlt: 'Bestway cement warehouse in Pallandri',
        description: 'Moisture-controlled central storage facility with fresh factory consignments.',
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'gal-block-curing',
        title: 'Hydraulic Block Machine & Curing Ponds',
        category: 'block_factory',
        imageUrl: '',
        imageAlt: 'Concrete block factory plant in Sudhnoti',
        description: 'Continuous immersion water curing ensuring high compressive bond.',
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'gal-mazda-fleet',
        title: 'Mazda 6-Wheeler Mountain Truck Dispatch',
        category: 'trucks',
        imageUrl: '',
        imageAlt: 'Delivery truck loaded with blocks on mountain road',
        description: 'Early morning dispatch heading towards Trarkhal and Baloch.',
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'gal-retaining-wall',
        title: 'Sudhnoti Hill Retaining Wall Project',
        category: 'construction_projects',
        imageUrl: '',
        imageAlt: 'Hill road retaining wall construction in Azad Kashmir',
        description: 'Built with 8" solid heavy concrete blocks and Bestway OPC cement.',
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
    ],
    inquiries: [
      {
        id: 'inq-sample-1',
        referenceId: 'UT-PLD-4091',
        name: 'Chaudhry Waheed & Sons',
        phone: '+92 301 5529012',
        email: 'waheed.builders@gmail.com',
        siteLocation: 'Trarkhal Main Road, Sudhnoti, Azad Kashmir',
        requestedItem: 'Bestway Cement & 8" Solid Blocks',
        quantity: '450 Bags Bestway OPC + 1,200 Solid Blocks',
        deliveryDate: '2026-10-25',
        message: 'Need early morning delivery on site with crane offloading assist.',
        status: 'Contacted',
        internalNotes: 'Dispatched via Mazda Titan AJK-7821. Driver Rashid assigned.',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        updatedAt: now,
      },
      {
        id: 'inq-sample-2',
        referenceId: 'UT-SDK-8820',
        name: 'Kashmir Engineering & Builders',
        phone: '+92 345 8891234',
        email: 'kashmir.eng@gmail.com',
        siteLocation: 'Baloch Bazaar Chowk, Sudhnoti, AJK',
        requestedItem: 'Margalla Bajri & Grade 60 Rebar',
        quantity: '800 Cft Margalla Bajri + 10 Tons Rebar',
        deliveryDate: '2026-10-26',
        message: 'Need dumper tipping directly at commercial plaza excavation.',
        status: 'Quoted',
        internalNotes: 'Quoted daily rate including highway toll and hill freight.',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        updatedAt: now,
      },
      {
        id: 'inq-sample-3',
        referenceId: 'UT-PLD-1025',
        name: 'Malik Builders (Private Residence)',
        phone: '+92 300 7123344',
        siteLocation: 'Gorah Road, Near Boys College, Pallandri',
        requestedItem: 'Fauji Cement & 6" Hollow Blocks',
        quantity: '200 Bags Fauji + 800 Units 6" Hollow Blocks',
        deliveryDate: '2026-10-25',
        message: 'Road is narrow incline; please send 6-wheeler Mazda only.',
        status: 'Closed',
        internalNotes: 'Delivery completed and signed on site by client supervisor.',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        updatedAt: now,
      },
    ],
    auditLogs: [
      {
        id: 'log-init',
        adminEmail: 'system',
        action: 'INITIALIZE_DATABASE',
        entity: 'System',
        details: 'Initial database schema and business profile seeded for Pallandri, Sudhnoti enterprise.',
        timestamp: now,
      },
    ],
  };
}

export function initDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData = getInitialSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    memoryDb = initialData;
    return initialData;
  }

  try {
    const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
    memoryDb = JSON.parse(fileContent);
    return memoryDb!;
  } catch (err) {
    console.error('Failed to read database file, restoring backup or initial seed:', err);
    const initialData = getInitialSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    memoryDb = initialData;
    return initialData;
  }
}

export function getDatabase(): DatabaseSchema {
  if (!memoryDb) {
    return initDatabase();
  }
  return memoryDb;
}

export async function saveDatabase(data: DatabaseSchema): Promise<void> {
  memoryDb = data;
  if (isWriting) {
    pendingWrite = true;
    return;
  }

  isWriting = true;
  try {
    const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
    await fs.promises.writeFile(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    await fs.promises.rename(tmpFile, DB_FILE);
  } catch (error) {
    console.error('Error saving database file:', error);
    throw error;
  } finally {
    isWriting = false;
    if (pendingWrite) {
      pendingWrite = false;
      await saveDatabase(memoryDb);
    }
  }
}

export async function recordAuditLog(
  adminEmail: string,
  action: string,
  entity: string,
  details: string,
  entityId?: string
) {
  const db = getDatabase();
  const newLog: AuditLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    adminEmail,
    action,
    entity,
    entityId,
    details,
    timestamp: new Date().toISOString(),
  };
  db.auditLogs.unshift(newLog);
  // Keep last 500 audit logs to prevent infinite file expansion
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500);
  }
  await saveDatabase(db);
}

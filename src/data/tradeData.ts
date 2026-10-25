export interface CementProduct {
  id: string;
  brand: string;
  type: string;
  category: 'cement' | 'steel' | 'aggregates';
  tagline: string;
  specs: string;
  packaging: string;
  recommendedUse: string;
  popularInAJK: boolean;
  rateEstimate: string;
  strengthGrade: string;
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
}

export interface FleetVehicle {
  id: string;
  name: string;
  type: string;
  capacity: string;
  terrainSuitability: string;
  count: number;
  description: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  location: string;
  scope: string;
  year: string;
  materialsSupplied: string;
  category: 'infrastructure' | 'commercial' | 'residential' | 'public';
}

export const CEMENT_PRODUCTS: CementProduct[] = [
  {
    id: 'cem-1',
    brand: 'Bestway Cement',
    type: 'Ordinary Portland Cement (OPC 53 Grade)',
    category: 'cement',
    tagline: 'Pakistan’s top choice for structural durability in hill terrain',
    specs: 'ASTM C150 Type I / PS:232-2008, 28-day strength > 58 MPa',
    packaging: '50kg Moisture-Resistant Polypropylene Bag',
    recommendedUse: 'High-altitude retaining walls, RCC roofs, bridges, columns & beams in Azad Kashmir',
    popularInAJK: true,
    rateEstimate: 'Call for Daily Mill Rate (Free Delivery in Sudhnoti on bulk orders)',
    strengthGrade: 'Grade 53 High Strength',
  },
  {
    id: 'cem-2',
    brand: 'Fauji Cement',
    type: 'High-Early Strength Portland Cement',
    category: 'cement',
    tagline: 'Superior setting time for cold weather mountain concreting',
    specs: 'Conforms to BS 12 & EN 197-1 CEM I 42.5R',
    packaging: '50kg Multi-layer Kraft Paper / Woven Bag',
    recommendedUse: 'Cold-weather mountain foundations, slab casting, and rapid cure concrete work',
    popularInAJK: true,
    rateEstimate: 'Official Direct Dealer Wholesale Price',
    strengthGrade: 'CEM I 42.5R Fast Cure',
  },
  {
    id: 'cem-3',
    brand: 'Askari Cement',
    type: 'Sulphate Resistant & Premium OPC',
    category: 'cement',
    tagline: 'Engineered for tough soil chemistry and moisture exposure',
    specs: 'ASTM C150 Type V / Type I, High fineness & low heat hydration',
    packaging: '50kg Sealed Export-grade Bag',
    recommendedUse: 'Ground retainers, basement drainage walls, underground water tanks in Sudhnoti',
    popularInAJK: false,
    rateEstimate: 'Wholesale Mill Rate',
    strengthGrade: 'Specialized OPC',
  },
  {
    id: 'cem-4',
    brand: 'Cherat Cement',
    type: 'Pure Ordinary Portland Cement',
    category: 'cement',
    tagline: 'Smooth workability and consistent slump quality',
    specs: 'Low alkali formula, compressive strength 52 MPa at 28 days',
    packaging: '50kg Bag',
    recommendedUse: 'General masonry, plastering, slab casting, and boundary wall works',
    popularInAJK: false,
    rateEstimate: 'Competitive Retail & Bulk Rate',
    strengthGrade: 'Standard OPC 42.5N',
  },
  {
    id: 'cem-5',
    brand: 'Deformed Steel Rebar (Grade 60)',
    type: 'Thermo-Mechanically Treated (TMT) High-Yield Rebar',
    category: 'steel',
    tagline: 'Seismic-resistant reinforcement for Azad Kashmir building codes',
    specs: 'ASTM A615 Grade 60, Yield Strength ≥ 60,000 PSI (420 MPa)',
    packaging: 'Full Mill Bundles (Sizes: 3/8", 1/2", 5/8", 3/4", 1")',
    recommendedUse: 'Earthquake-safe RCC structures, hillside cantilever slabs & columns',
    popularInAJK: true,
    rateEstimate: 'Per Ton Mill Rate with Crane Offloading',
    strengthGrade: 'Grade 60 TMT Seismic Safe',
  },
  {
    id: 'cem-6',
    brand: 'Margalla Hill Crushed Bajri & Chenab Sand',
    type: 'Washed Concrete Aggregates & Fine River Sand',
    category: 'aggregates',
    tagline: 'Clean, silt-free aggregate quarried for maximum bond strength',
    specs: '1/2" Down, 3/4" Down Aggregate & Coarse River Sand (< 3% silt)',
    packaging: 'Full Dumper / Mazda Truck Loads directly to your site',
    recommendedUse: 'RCC roof casting, lintels, concrete block manufacturing & plaster',
    popularInAJK: true,
    rateEstimate: 'Per Cubic Feet (Cft) Delivered at Pallandri & Surroundings',
    strengthGrade: 'Tested Silt-Free Natural Quarry',
  },
];

export const BLOCK_PRODUCTS: BlockProduct[] = [
  {
    id: 'blk-1',
    name: '8" Solid Mountain-Grade Heavy Concrete Block',
    dimensions: '8" x 8" x 16" (Standard)',
    compressiveStrength: '1,800 - 2,200 PSI',
    application: 'Hill retaining walls, foundation basements, load-bearing mountain walls',
    weight: 'Approx. 22 - 24 kg',
    materialMix: 'High-ratio Portland cement, fine aggregate & washed quarry dust',
    productionCapacity: '10,000 units / day from automated hydraulic press',
  },
  {
    id: 'blk-2',
    name: '6" Solid & Hollow Load-Bearing Masonry Block',
    dimensions: '6" x 8" x 16"',
    compressiveStrength: '1,400 - 1,800 PSI',
    application: 'Exterior building walls, commercial plazas, boundary walls',
    weight: 'Approx. 16 - 18 kg',
    materialMix: 'Hydraulically vibrated high-density concrete slurry',
    productionCapacity: '8,000 units / day',
  },
  {
    id: 'blk-3',
    name: '4" Precision Partition Concrete Block',
    dimensions: '4" x 8" x 16"',
    compressiveStrength: '1,200 - 1,500 PSI',
    application: 'Interior partition walls, multi-storey room division, sound insulation',
    weight: 'Approx. 11 - 13 kg',
    materialMix: 'Vibrated cement-aggregate matrix',
    productionCapacity: '6,000 units / day',
  },
  {
    id: 'blk-4',
    name: 'Heavy-Duty Interlocking Tuff Tiles & Pavers',
    dimensions: '60mm & 80mm Thickness (Zig-Zag / I-Shape)',
    compressiveStrength: '4,500 - 5,000 PSI',
    application: 'Driveways, filling station aprons, courtyard paving, commercial footpaths',
    weight: 'High-density abrasion resistant',
    materialMix: 'Dual-layer hydraulic pressing with UV-stable mineral pigments',
    productionCapacity: '15,000 sq ft / week',
  },
  {
    id: 'blk-5',
    name: 'Engineered Concrete Kerb Stones & Drainage Channels',
    dimensions: '12" x 18" x 6" / Custom Road Profiles',
    compressiveStrength: '3,500 PSI',
    application: 'Hill road verge protection, drainage gutters, footpath edging in AJK',
    weight: 'Solid precast unit',
    materialMix: 'Precast steel reinforced concrete',
    productionCapacity: '500 linear meters / week',
  },
];

export const FLEET_VEHICLES: FleetVehicle[] = [
  {
    id: 'flt-1',
    name: 'Mazda Titan & T3500 (6-Wheeler Hill Trucks)',
    type: 'Narrow Hill Access Tipper / Cargo',
    capacity: '200 - 350 Cement Bags / 600 - 900 Blocks / 200 Cft Aggregate',
    terrainSuitability: 'Engineered specifically for steep, narrow roads of Pallandri, Trarkhal, Mong, Gorah & Baloch',
    count: 8,
    description: 'Our most agile mountain delivery vehicles. Capable of climbing steep incline village roads and delivering right to your construction site gate.',
  },
  {
    id: 'flt-2',
    name: 'Heavy 10-Wheeler Dumpers (Hino / Isuzu)',
    type: 'Long-Haul Bulk Aggregate Hauler',
    capacity: '700 - 900 Cubic Feet (Cft) / 30-35 Tons',
    terrainSuitability: 'Highway & bypass corridors from Margalla / Taxila quarries to Pallandri Depot',
    count: 5,
    description: 'Heavy capacity dumpers that bring prime crushed Bajri and river sand directly from original Punjab quarries to our Sudhnoti distribution yards.',
  },
  {
    id: 'flt-3',
    name: 'Flatbed Multi-Axle Trailers',
    type: 'Factory-Direct Cement Transport',
    capacity: '1,000 to 1,500 Bags per trip (50 to 75 Tons)',
    terrainSuitability: 'National Highway to Azad Kashmir By-Pass Depot',
    count: 4,
    description: 'Direct factory lifted cement haulers running daily from Bestway (Chakwal/Hattar) and Fauji (Fateh Jang) mills directly to our Pallandri warehouses.',
  },
  {
    id: 'flt-4',
    name: 'Mobile Mechanical Crane & Offloading Rigs',
    type: 'Hydraulic Unloading Assist',
    capacity: 'Palletized Block & Rebar Crane Offloading',
    terrainSuitability: 'Commercial construction sites and hill road unloading points',
    count: 2,
    description: 'Guarantees zero breakage during offloading of precision concrete blocks and heavy Grade 60 steel rebar bundles.',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'prj-1',
    title: 'Pallandri By-Pass Hill Retaining & Drainage Works',
    location: 'Sudhnoti District By-Pass, Azad Kashmir',
    scope: 'Supply of 12,000+ Bags Bestway OPC and 45,000 High-Density 8" Solid Blocks for hill stabilization',
    year: '2025 - 2026',
    materialsSupplied: 'OPC Cement, 8" Solid Blocks, 1/2" Crushed Bajri',
    category: 'infrastructure',
  },
  {
    id: 'prj-2',
    title: 'Sudhnoti District Judicial & Commercial Plaza',
    location: 'Main Bazar / Court Road, Pallandri',
    scope: 'Exclusive supply of Grade 60 Steel Rebar, 8,500 Bags Fauji Cement, and 6" Partition Blocks',
    year: '2024 - 2025',
    materialsSupplied: 'Fauji Cement, Grade 60 Rebar, 6" Partition Blocks',
    category: 'commercial',
  },
  {
    id: 'prj-3',
    title: 'Hillside Community Mosque & Educational Complex',
    location: 'Gorah / Trarkhal Highway, Sudhnoti',
    scope: 'Complete structural concrete materials, foundation stones, Bajri dumpers, and Tuff Tile courtyards',
    year: '2024',
    materialsSupplied: 'Cement, Sand, Crushed Rock, Interlocking Pavers',
    category: 'public',
  },
  {
    id: 'prj-4',
    title: 'Luxury Hillside Residential Villas & Retaining Terraces',
    location: 'VIP Colony & Kotli Road, Pallandri',
    scope: 'Premium Askari Sulphate-Resistant cement for basement retaining walls, 8" solid blocks, and steel rebar',
    year: '2025 - Present',
    materialsSupplied: 'Askari & Bestway Cement, 8" Blocks, Grade 60 Rebar',
    category: 'residential',
  },
];

export interface DeliveryShipment {
  orderId: string;
  customerName: string;
  destination: string;
  items: string;
  vehicleAssigned: string;
  driverName: string;
  driverContact: string;
  status: 'Dispatched & On Route' | 'Loading at Pallandri Yard' | 'Delivered & Offloaded' | 'Scheduled';
  estimatedArrival: string;
  milestones: {
    time: string;
    title: string;
    description: string;
    completed: boolean;
  }[];
}

export const SAMPLE_DELIVERIES: Record<string, DeliveryShipment> = {
  'UT-PLD-4091': {
    orderId: 'UT-PLD-4091',
    customerName: 'Chaudhry Waheed & Sons Construction',
    destination: 'Trarkhal Main Road, Sudhnoti, Azad Kashmir',
    items: '450 Bags Bestway OPC + 1,200 Units 8" Solid Blocks',
    vehicleAssigned: 'Mazda Titan 6-Wheeler (Reg: AJK-7821)',
    driverName: 'Muhammad Rashid (Hill Route Specialist)',
    driverContact: '+92 301 552 9012',
    status: 'Dispatched & On Route',
    estimatedArrival: 'Today within 45 mins (Around 11:30 AM)',
    milestones: [
      { time: '08:15 AM', title: 'Order Confirmed & Gate Pass Issued', description: 'Stock reserved at USAMA TRADERS Central Warehouse, By-Pass Road Pallandri.', completed: true },
      { time: '09:20 AM', title: 'Quality Check & Truck Loaded', description: '450 fresh factory-sealed Bestway bags and 1,200 cured solid blocks loaded.', completed: true },
      { time: '10:05 AM', title: 'Dispatched from Pallandri Depot', description: 'Vehicle departed depot via Pallandri-Trarkhal hill artery.', completed: true },
      { time: '11:15 AM', title: 'Site Offloading & Consignment Verification', description: 'Assisted crane offloading and delivery slip countersigning.', completed: false },
    ],
  },
  'UT-SDK-8820': {
    orderId: 'UT-SDK-8820',
    customerName: 'Kashmir Engineering & Builders',
    destination: 'Baloch Bazaar Chowk, Sudhnoti, AJK',
    items: '800 Cft Margalla Crushed Bajri (1/2" Down) + 10 Tons Grade 60 Rebar',
    vehicleAssigned: 'Hino 10-Wheeler Heavy Dumper + Steel Bed Trailer',
    driverName: 'Sardar Farooq Khan',
    driverContact: '+92 345 889 1234',
    status: 'Dispatched & On Route',
    estimatedArrival: 'Today at 02:00 PM',
    milestones: [
      { time: '06:00 AM', title: 'Weighed & Dispatched from Quarry', description: 'Direct aggregate lifted from Margalla quarry with computerized weighbridge slip.', completed: true },
      { time: '09:30 AM', title: 'Crossed Azad Pattan Bridge', description: 'Entry into Azad Kashmir territory verified with toll clearance.', completed: true },
      { time: '11:45 AM', title: 'Arrived at Pallandri Staging Yard', description: 'Safety inspection and hill gear engagement prior to final climb.', completed: true },
      { time: '02:00 PM', title: 'Destination Tipping at Baloch Site', description: 'Hydraulic bed tipping and steel bundle unloading.', completed: false },
    ],
  },
  'UT-PLD-1025': {
    orderId: 'UT-PLD-1025',
    customerName: 'Malik Builders (Private Residence)',
    destination: 'Gorah Road, Near Boys Degree College, Pallandri',
    items: '200 Bags Fauji Cement + 800 Units 6" Hollow Masonry Blocks',
    vehicleAssigned: 'Mazda T3500 (Reg: AJK-4419)',
    driverName: 'Arshad Mehmood',
    driverContact: '+92 300 712 3344',
    status: 'Delivered & Offloaded',
    estimatedArrival: 'Completed this morning',
    milestones: [
      { time: '07:30 AM', title: 'Loaded at Pallandri Block Plant', description: 'Machine-cured blocks stacked with protective corner padding.', completed: true },
      { time: '08:15 AM', title: 'Dispatched from Yard', description: 'En route to Gorah residential road.', completed: true },
      { time: '09:00 AM', title: 'Delivered & Stacked On Site', description: 'Signed and approved by site supervisor.', completed: true },
    ],
  },
};

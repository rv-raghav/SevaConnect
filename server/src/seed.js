/**
 * Database Seed Script for SevaConnect
 *
 * Populates the database with rich, realistic sample data.
 * All user passwords: 123456
 *
 * Primary demo accounts:
 *   Admin:    admin@sevaconnect.com   / 123456
 *   Customer: customer@sevaconnect.com / 123456
 *   Provider: provider@sevaconnect.com / 123456
 *
 * Usage: node src/seed.js
 */

require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/User");
const ServiceCategory = require("./models/ServiceCategory");
const ProviderProfile = require("./models/ProviderProfile");
const Booking = require("./models/Booking");
const Review = require("./models/Review");

const MONGO_URI = process.env.MONGO_URI;

// ── Helpers ───────────────────────────────────────────────
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const PASSWORD = "123456";

// ── Addresses ─────────────────────────────────────────────
const STREETS = [
  "12, MG Road", "45, Nehru Nagar", "7, Gandhi Chowk", "88, Lake View Colony",
  "3, Sector 21", "56, Rajiv Nagar", "22, Shanti Colony", "110, Koramangala",
  "9, Banjara Hills", "67, Andheri West", "34, Salt Lake City", "5, Connaught Place",
  "78, Anna Nagar", "21, Civil Lines", "14, Vasant Kunj", "93, JP Nagar",
  "41, Malviya Nagar", "62, Indiranagar", "18, Powai", "55, Kothrud",
];

// ── Service Categories ────────────────────────────────────
const CATEGORIES = [
  { name: "Plumbing",            description: "Pipe repair, leak fixing, bathroom fitting, drainage and water purifier installation services", basePrice: 299, icon: "plumbing" },
  { name: "Electrical Repair",   description: "Certified electricians for wiring, switchboard, fan installation, inverter setup and safety inspections", basePrice: 349, icon: "electrical_services" },
  { name: "House Cleaning",      description: "Deep cleaning, regular home cleaning, kitchen, bathroom sanitization and post-construction cleanup", basePrice: 499, icon: "cleaning_services" },
  { name: "Painting",            description: "Interior and exterior wall painting, texture painting, waterproofing and wood polishing", basePrice: 999, icon: "format_paint" },
  { name: "AC Repair & Service", description: "AC installation, gas refilling, deep cleaning, annual maintenance and compressor repair", basePrice: 599, icon: "ac_unit" },
  { name: "Carpentry",           description: "Custom furniture, door and window repair, modular kitchen and wardrobe installation", basePrice: 449, icon: "carpenter" },
  { name: "Pest Control",        description: "Cockroach, termite, bed bug, mosquito and rodent control for homes and offices", basePrice: 699, icon: "pest_control" },
  { name: "Gardening & Landscaping", description: "Garden maintenance, lawn mowing, plant care, landscape design and terrace garden setup", basePrice: 399, icon: "yard" },
  { name: "Appliance Repair",    description: "Washing machine, refrigerator, microwave, geyser repair by certified technicians", basePrice: 399, icon: "home_repair_service" },
  { name: "Interior Design",     description: "Space planning, furniture selection, colour consultation, 3D walkthrough and turnkey execution", basePrice: 4999, icon: "design_services" },
];

// ── Before / After image sets by category index ───────────
// Using Unsplash topic URLs that are reliably available
const BEFORE_AFTER = {
  0: { // Plumbing
    before: [
      { publicId: "plumbing_before_1", url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop" },
    ],
    after: [
      { publicId: "plumbing_after_1",  url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop" },
    ],
  },
  1: { // Electrical
    before: [
      { publicId: "elec_before_1", url: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=400&fit=crop" },
    ],
    after: [
      { publicId: "elec_after_1",  url: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=600&h=400&fit=crop" },
    ],
  },
  2: { // Cleaning
    before: [
      { publicId: "clean_before_1", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop" },
    ],
    after: [
      { publicId: "clean_after_1",  url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop" },
    ],
  },
  3: { // Painting
    before: [
      { publicId: "paint_before_1", url: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&h=400&fit=crop" },
    ],
    after: [
      { publicId: "paint_after_1",  url: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&h=400&fit=crop" },
    ],
  },
  4: { // AC
    before: [
      { publicId: "ac_before_1", url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop" },
    ],
    after: [
      { publicId: "ac_after_1",  url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop" },
    ],
  },
  5: { // Carpentry
    before: [
      { publicId: "carp_before_1", url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop" },
    ],
    after: [
      { publicId: "carp_after_1",  url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop" },
    ],
  },
  6: { // Pest
    before: [
      { publicId: "pest_before_1", url: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop" },
    ],
    after: [
      { publicId: "pest_after_1",  url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop" },
    ],
  },
  7: { // Gardening
    before: [
      { publicId: "garden_before_1", url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop" },
    ],
    after: [
      { publicId: "garden_after_1",  url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&h=400&fit=crop" },
    ],
  },
  8: { // Appliance
    before: [
      { publicId: "appl_before_1", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop" },
    ],
    after: [
      { publicId: "appl_after_1",  url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop" },
    ],
  },
  9: { // Interior
    before: [
      { publicId: "int_before_1", url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop" },
    ],
    after: [
      { publicId: "int_after_1",  url: "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=600&h=400&fit=crop" },
    ],
  },
};

// ── PRIMARY DEMO ACCOUNTS ─────────────────────────────────
const ADMIN_USER = {
  name: "Raghav Kumar",
  email: "admin@sevaconnect.com",
  role: "admin",
  city: "Delhi",
  isApproved: true,
  approvalStatus: "approved",
};

const PRIMARY_CUSTOMER = {
  name: "Arjun Sharma",
  email: "customer@sevaconnect.com",
  city: "Bangalore",
  role: "customer",
};

// Primary provider — multi-category expert (Electrical + AC)
const PRIMARY_PROVIDER = {
  name: "Vikram Rajan",
  email: "provider@sevaconnect.com",
  city: "Bangalore",
  role: "provider",
  isApproved: true,
  approvalStatus: "approved",
  bio: "10+ years of hands-on experience in electrical installation and AC repair across Bangalore. ISI-certified electrician and authorized service partner for Daikin & Voltas. Known for punctuality, transparent pricing, and clean workmanship. Over 400 five-star reviews.",
  experienceYears: 10,
  categoryIndexes: [1, 4], // Electrical + AC
};

// ── SUPPORTING CUSTOMERS ──────────────────────────────────
const EXTRA_CUSTOMERS = [
  { name: "Priya Sharma",   email: "priya.sharma@gmail.com",   city: "Mumbai" },
  { name: "Amit Patel",     email: "amit.patel@gmail.com",     city: "Ahmedabad" },
  { name: "Sneha Reddy",    email: "sneha.reddy@gmail.com",    city: "Hyderabad" },
  { name: "Rajesh Gupta",   email: "rajesh.gupta@gmail.com",   city: "Delhi" },
  { name: "Ananya Iyer",    email: "ananya.iyer@gmail.com",    city: "Chennai" },
  { name: "Meera Nair",     email: "meera.nair@gmail.com",     city: "Bangalore" },
  { name: "Karan Malhotra", email: "karan.malhotra@gmail.com", city: "Pune" },
  { name: "Deepa Krishnan", email: "deepa.krishnan@gmail.com", city: "Chennai" },
  { name: "Rohan Verma",    email: "rohan.verma@gmail.com",    city: "Delhi" },
  { name: "Sonal Joshi",    email: "sonal.joshi@gmail.com",    city: "Ahmedabad" },
  { name: "Tarun Kapoor",   email: "tarun.kapoor@gmail.com",   city: "Mumbai" },
];

// ── SUPPORTING PROVIDERS ──────────────────────────────────
const EXTRA_PROVIDERS = [
  {
    name: "Ramesh Kumar",    email: "ramesh.kumar@gmail.com",     city: "Mumbai",
    bio: "15 years of residential & commercial electrical work. Smart home, full house wiring, industrial setups. ISI certified.",
    experienceYears: 15, categoryIndexes: [1],
  },
  {
    name: "Lakshmi Devi",   email: "lakshmi.devi@gmail.com",     city: "Hyderabad",
    bio: "Team of 12 trained cleaning professionals. Eco-friendly products, modern equipment. Spotless results every time.",
    experienceYears: 8,  categoryIndexes: [2],
  },
  {
    name: "Manoj Tiwari",   email: "manoj.plumber@gmail.com",    city: "Delhi",
    bio: "Master plumber — concealed piping, modern bathroom fittings, water purifier, emergency leak repair. Available 24/7.",
    experienceYears: 12, categoryIndexes: [0],
  },
  {
    name: "Arun Nair",      email: "arun.painter@gmail.com",     city: "Bangalore",
    bio: "Royale & Dulux premium finishes, texture walls, waterproofing. 500+ residential projects across Bangalore.",
    experienceYears: 10, categoryIndexes: [3],
  },
  {
    name: "Dinesh Yadav",   email: "dinesh.acrepair@gmail.com",  city: "Mumbai",
    bio: "Authorized partner for Daikin, Voltas, Blue Star. Split, window and central AC. 2-hour response time.",
    experienceYears: 9,  categoryIndexes: [4],
  },
  {
    name: "Santosh Patil",  email: "santosh.patil@gmail.com",    city: "Pune",
    bio: "Landscape architect — terrace gardens, vertical gardens, low-maintenance designs for apartments and villas.",
    experienceYears: 7,  categoryIndexes: [7],
  },
  {
    name: "Abdul Rahman",   email: "abdul.rahman@gmail.com",     city: "Chennai",
    bio: "Government-licensed pest control. WHO-approved odorless chemicals safe for children and pets. AMC available.",
    experienceYears: 11, categoryIndexes: [6],
  },
  {
    name: "Govind Mishra",  email: "govind.carpenter@gmail.com", city: "Jaipur",
    bio: "Third-generation carpenter. Modular kitchens, wardrobes, TV units, traditional Rajasthani woodcraft.",
    experienceYears: 14, categoryIndexes: [5],
  },
  {
    name: "Pradeep Shetty", email: "pradeep.shetty@gmail.com",  city: "Bangalore",
    bio: "Certified refrigerator and washing machine repair technician. Authorized for Samsung, LG, Whirlpool. Same-day service.",
    experienceYears: 6,  categoryIndexes: [8],
  },
  {
    name: "Kavitha Rao",    email: "kavitha.interior@gmail.com", city: "Mumbai",
    bio: "Senior interior designer with 12 years of experience. Specializes in contemporary Indian homes, 3D walkthroughs, and turnkey projects across Mumbai.",
    experienceYears: 12, categoryIndexes: [9],
  },
];

// ── BOOKING TEMPLATES ─────────────────────────────────────
// [custIdx, provIdx, catIdx, daysAgoNum, status, price, notes, address, workNotes]
// custIdx 0 = primaryCustomer; 1-11 = extraCustomers[0..10]
// provIdx 0 = primaryProvider; 1-10 = extraProviders[0..9]
const BOOKING_TEMPLATES = [
  // ─── Completed (spread across 6 months for chart data) ───
  // Primary customer has 6 completed bookings
  [0, 1, 1, 165, "completed", 1400, "Complete rewiring for 2BHK flat, include 6 new sockets",     "14, Indiranagar, Bangalore", "Rewiring completed across all 4 rooms. New MCB panel installed. 6 power points added in kitchen and study."],
  [0, 2, 2, 140, "completed", 1800, "Full house deep cleaning before Diwali",                      "14, Indiranagar, Bangalore", "5-room deep clean completed. Kitchen chimney degreased, bathroom tiles acid-washed. Took 6 hours."],
  [0, 0, 1, 120, "completed", 950,  "Smart switch board installation for living room and bedroom",  "14, Indiranagar, Bangalore", "Installed 4 smart switches (Havells). Alexa integration tested and working."],
  [0, 4, 4, 95,  "completed", 2200, "Deep cleaning and gas refill for 2 split AC units",            "14, Indiranagar, Bangalore", "Both 1.5-ton Daikin units cleaned and R-22 gas topped. Cooling improved from 26°C to 20°C in 8 min."],
  [0, 3, 3, 70,  "completed", 9500, "Full 2BHK interior painting — Royale Shyne with one feature wall", "14, Indiranagar, Bangalore", "Applied 2 coats primer + 2 coats Royale Shyne. Accent wall in living room done in Venetian plaster."],
  [0, 5, 7, 45,  "completed", 1700, "Terrace garden setup with raised beds and drip irrigation",   "14, Indiranagar, Bangalore", "8 raised beds installed, drip system laid, 22 plant varieties selected for Bangalore weather."],

  // Extra customers completed
  [1, 1, 1, 170, "completed", 1200, "Ceiling fan installation (3 fans) and switchboard repair",    "45, Andheri West, Mumbai",   "Crompton fans installed with remote module. Switchboard rewired, 2 breakers replaced."],
  [2, 2, 2, 155, "completed", 999,  "Bathroom and kitchen deep clean",                              "9, Banjara Hills, Hyderabad","Bathroom grout whitened, mold removed. Kitchen chimney filter replaced and degreased."],
  [3, 3, 0, 150, "completed", 600,  "Kitchen sink leaking, pipe replacement",                       "62, Civil Lines, Delhi",     "Replaced corroded P-trap and supply line. New quarter-turn tap installed. Leak tested."],
  [4, 7, 6, 130, "completed", 2200, "Full home pest treatment — cockroach and termite",             "78, Anna Nagar, Chennai",    "Pre-drill termite treatment done. Cockroach gel bait placed in all kitchen cabinets."],
  [5, 8, 5, 125, "completed", 4200, "Custom bookshelf and study table for kids' room",              "22, Malviya Nagar, Jaipur",  "Sheesham wood bookshelf (6 shelves) and matching study table delivered and installed."],
  [6, 4, 3, 110, "completed", 8800, "2BHK complete painting — texture accent walls",               "62, Indiranagar, Bangalore", "Living room accent wall in textured sand finish. Rest of flat in Birla White +2 coats."],
  [7, 6, 7, 100, "completed", 1500, "Terrace garden with drip irrigation",                          "18, Powai, Pune",            "Terrace revamped with 15 plants, drip system, and decorative pebbles."],
  [1, 5, 4, 90,  "completed", 1900, "AC installation for new 1.5-ton Hitachi split unit",           "45, Andheri West, Mumbai",   "Wall bracket and piping run 8 ft. Gas charged, thermostat calibrated. Cooling verified."],
  [8, 2, 2, 85,  "completed", 1100, "Post-renovation deep clean for new flat",                      "21, Salt Lake City, Kolkata","Cement dust, paint splatters cleared from all surfaces. Windows and sills polished."],
  [2, 3, 0, 80,  "completed", 850,  "Bathroom pipe replacement and tap fitting",                    "9, Banjara Hills, Hyderabad","Replaced GI pipes with CPVC in bathroom. Installed new Jaquar pillar tap set."],
  [9, 9, 8, 75,  "completed", 1200, "Washing machine not spinning — LG front load repair",          "34, Sector 21, Ahmedabad",   "Drive belt and door latch replaced. Full spin test completed. Machine working normally."],
  [3, 1, 1, 72,  "completed", 700,  "Geyser wiring fault — no hot water",                          "62, Civil Lines, Delhi",     "Thermostat replaced, element tested. Earthing checked and corrected. Geyser working."],
  [10, 8, 5, 65, "completed", 6500, "Modular kitchen sliding door replacement",                     "67, Kothrud, Pune",          "4 kitchen shutters replaced in marine-ply with matte finish laminate. Soft-close hinges installed."],
  [4, 7, 6, 60,  "completed", 1500, "Mosquito and bed bug treatment — 3BHK",                       "78, Anna Nagar, Chennai",    "Space fumigation completed. Bed bug treatment on mattresses with DE powder and heat."],
  [5, 4, 4, 55,  "completed", 599,  "Annual AC servicing — Daikin split",                          "22, Malviya Nagar, Jaipur",  "Filters cleaned, coil washed, drain pipe cleared. Gas level OK. Cooling efficiency restored."],
  [11, 10,9, 50, "completed", 18000,"2BHK interior design consultation and execution",               "5, Vasant Kunj, Mumbai",     "Furniture layout done, colour palette selected (muted warm tones). Feature wall, curtains and lighting installed."],
  [6, 6, 7, 48,  "completed", 1600, "Monthly garden maintenance — quarterly package visit 1",       "62, Indiranagar, Bangalore", "Trimmed hedges, fertilized 24 plants, cleared debris. Replaced 3 dead plants."],
  [7, 3, 0, 40,  "completed", 500,  "Leaking flush tank repair",                                   "18, Powai, Pune",            "Ballcock and fill valve replaced. Flush mechanism rebalanced. No leakage after 24h test."],
  [0, 9, 8, 35,  "completed", 800,  "Refrigerator not cooling — Samsung double door",               "14, Indiranagar, Bangalore", "Capacitor replaced in compressor. Refrigerant level topped. Temperature reaching 4°C in 20 min."],

  // ─── In-Progress ──────────────────────────────────────
  [0, 4, 3, 4,  "in-progress", 14000, "Full villa exterior painting — 4 coats waterproof",         "14, Indiranagar, Bangalore", null],
  [2, 1, 1, 3,  "in-progress", 980,   "MCB panel upgrade and new earthing",                        "9, Banjara Hills, Hyderabad",null],
  [3, 2, 2, 2,  "in-progress", 2600,  "Full house deep clean — post Holi",                         "62, Civil Lines, Delhi",     null],
  [9, 8, 5, 1,  "in-progress", 8500,  "Wardrobe with sliding mirror for master bedroom",           "34, Sector 21, Ahmedabad",   null],

  // ─── Confirmed (upcoming) ─────────────────────────────
  [0, 5, 7, -1, "confirmed", 900,   "Monthly garden maintenance visit",                             "14, Indiranagar, Bangalore", null],
  [1, 0, 4, -2, "confirmed", 650,   "Annual AC service — Voltas 2 ton",                            "45, Andheri West, Mumbai",   null],
  [4, 3, 0, -3, "confirmed", 480,   "Water purifier installation — Kent RO",                       "78, Anna Nagar, Chennai",    null],
  [7, 1, 1, -2, "confirmed", 1200,  "Smart home switch installation — 4 rooms",                    "18, Powai, Pune",            null],
  [11, 6, 7,-4, "confirmed", 1800,  "Terrace garden quarterly maintenance",                        "5, Vasant Kunj, Mumbai",     null],
  [10, 9, 8, -1,"confirmed", 650,   "Microwave not heating — Samsung repair",                      "67, Kothrud, Pune",          null],

  // ─── Requested (new, unassigned or pending) ───────────
  [0, 3, 3, -5, "requested", 6500,  "Exterior wall waterproofing before monsoon",                  "14, Indiranagar, Bangalore", null],
  [5, 8, 5, -3, "requested", 4800,  "Custom TV unit with backlit panel",                           "22, Malviya Nagar, Jaipur",  null],
  [8, 7, 6, -2, "requested", 1900,  "Termite treatment for wooden loft",                           "21, Salt Lake City, Kolkata",null],
  [6, 2, 2, -1, "requested", 1350,  "Office cleaning — 1800 sq ft",                               "62, Indiranagar, Bangalore", null],
  [3, 10,9, -6, "requested", 22000, "Interior design for new 3BHK flat",                          "62, Civil Lines, Delhi",     null],
  [9, 4, 4, -2, "requested", 650,   "AC filter cleaning — 3 units",                               "34, Sector 21, Ahmedabad",   null],

  // ─── Cancelled ────────────────────────────────────────
  [1, 1, 1, 28, "cancelled", 800,   "Geyser installation — bought instant geyser instead",         "45, Andheri West, Mumbai",   null],
  [6, 6, 7, 42, "cancelled", 650,   "Garden cleanup — postponed due to rain",                      "62, Indiranagar, Bangalore", null],
  [3, 7, 6, 18, "cancelled", 1500,  "Pest control — rescheduled to next month",                   "62, Civil Lines, Delhi",     null],
  [2, 5, 4, 30, "cancelled", 700,   "AC installation — owner moved to different flat",             "9, Banjara Hills, Hyderabad",null],
];

// ── REVIEW TEMPLATES ──────────────────────────────────────
// [bookingTemplateIdx, rating, comment]
const REVIEW_TEMPLATES = [
  [0,  5, "Ramesh did an absolutely brilliant job with the rewiring. All wires are neatly concealed and the new MCB panel looks great. Very professional team!"],
  [1,  5, "Lakshmi's team deep cleaned every corner of the house before Diwali. They even cleaned inside the oven and behind appliances. Worth every paisa."],
  [2,  4, "Vikram installed the smart switches flawlessly. Only minor delay in arrival but the work was impeccable. Alexa integration works perfectly."],
  [3,  5, "Dinesh's team handled the AC cleaning and gas top-up for both units superbly. Cooling is back to factory levels. Very transparent on pricing."],
  [4,  4, "Arun's painting team delivered excellent results. Venetian plaster accent wall looks stunning. Minor touch-up needed but fixed promptly with no fuss."],
  [5,  5, "My terrace garden is unrecognisable! Santosh chose the perfect plants for Bangalore weather. The drip system saves so much time. Highly recommend!"],
  [6,  5, "Ramesh installed the 3 fans quickly and neatly. MCB board is professionally done. Highly recommend for any electrical work in Mumbai!"],
  [7,  5, "Best cleaning service in Hyderabad! Bathroom tiles are sparkling and the kitchen chimney is like new. Lakshmi's team is thorough and punctual."],
  [8,  4, "Manoj fixed the kitchen leak quickly. Pipe quality is good. Slight delay in arrival but otherwise solid work. Will use again."],
  [9,  5, "Abdul bhai's team is the best pest control in Chennai. Odorless chemicals, safe for kids. Zero cockroach sightings 3 months later!"],
  [10, 5, "Govind ji crafted the most beautiful sheesham bookshelf I've ever seen. Craftsmanship is top class. True artisan from Jaipur!"],
  [11, 4, "Arun's team did a great job on the full 2BHK. Texture wall is the star of the flat now. Had to remind them about a small patch but they fixed it."],
  [12, 5, "My terrace in Pune now looks like a magazine shoot! Santosh has a great eye for plant selection. Drip irrigation is super convenient."],
  [13, 5, "Dinesh's team installed my new Hitachi AC perfectly. Cleaned up all the drilling mess after. Very professional from start to finish."],
  [14, 5, "Lakshmi's team transformed our post-renovation flat. It was covered in cement dust and they returned it sparkling clean. Outstanding service!"],
  [15, 4, "Manoj replaced the bathroom pipes neatly. New Jaquar taps look elegant. Minor wait for materials but completed same day. Recommended!"],
  [16, 5, "Pradeep fixed my LG washing machine in under an hour. He clearly knows his appliances. Very reasonable pricing for same-day service!"],
  [17, 5, "Ramesh diagnosed and fixed the geyser issue correctly on first visit. No unnecessary part replacements. Honest and skilled."],
  [18, 5, "Govind's kitchen shutter replacement is fabulous. Soft-close hinges are a game changer. Cabinet looks brand new. Will commission wardrobes next."],
  [19, 5, "Abdul's pest control for the 3BHK was thorough. Bed bug treatment was especially effective — no signs after 2 months. Peace of mind restored!"],
  [20, 4, "Dinesh serviced my Daikin AC efficiently. Cleaning was thorough. Would appreciate a call 30 min before arriving next time."],
  [21, 5, "Kavitha transformed our 2BHK completely! The warm colour palette and curated furniture make it feel like a completely new home. Exceptional work!"],
  [22, 5, "Santosh's team maintained our garden beautifully. Plants are thriving and hedges are perfectly shaped. Looking forward to the next visit."],
  [23, 4, "Manoj fixed the flush tank quickly and cheaply. Parts are branded. No leaks after a week. Solid value for money."],
  [24, 5, "Pradeep fixed my Samsung fridge in one visit. He was upfront about the issue (capacitor) and showed me the defective part. Trustworthy technician!"],
];

// ── MAIN SEED FUNCTION ────────────────────────────────────
async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("Connected.\n");

  // Clear
  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    ServiceCategory.deleteMany({}),
    ProviderProfile.deleteMany({}),
    Booking.deleteMany({}),
    Review.deleteMany({}),
  ]);
  console.log("Cleared.\n");

  // ── 1. Categories ────────────────────────────────────
  console.log("Creating categories...");
  const categories = await ServiceCategory.insertMany(CATEGORIES);
  console.log(`  ✓ ${categories.length} categories`);

  // ── 2. Admin ─────────────────────────────────────────
  console.log("Creating admin...");
  const admin = await User.create({ ...ADMIN_USER, password: PASSWORD });
  console.log(`  ✓ admin: ${admin.email}`);

  // ── 3. Primary Customer ───────────────────────────────
  console.log("Creating primary customer...");
  const primaryCustomer = await User.create({ ...PRIMARY_CUSTOMER, password: PASSWORD, isApproved: true, approvalStatus: "approved" });
  console.log(`  ✓ customer: ${primaryCustomer.email}`);

  // ── 4. Primary Provider ───────────────────────────────
  console.log("Creating primary provider...");
  const primaryProviderUser = await User.create({
    name: PRIMARY_PROVIDER.name,
    email: PRIMARY_PROVIDER.email,
    city: PRIMARY_PROVIDER.city,
    role: "provider",
    isApproved: true,
    approvalStatus: "approved",
    password: PASSWORD,
  });
  await ProviderProfile.create({
    userId: primaryProviderUser._id,
    categories: PRIMARY_PROVIDER.categoryIndexes.map((i) => categories[i]._id),
    bio: PRIMARY_PROVIDER.bio,
    experienceYears: PRIMARY_PROVIDER.experienceYears,
    availabilityStatus: "available",
    ratingAverage: 0,
    totalReviews: 0,
  });
  console.log(`  ✓ provider: ${primaryProviderUser.email}`);

  // ── 5. Extra Customers ────────────────────────────────
  console.log("Creating extra customers...");
  const extraCustomers = [];
  for (const c of EXTRA_CUSTOMERS) {
    const u = await User.create({ ...c, role: "customer", password: PASSWORD, isApproved: true, approvalStatus: "approved" });
    extraCustomers.push(u);
  }
  console.log(`  ✓ ${extraCustomers.length} extra customers`);

  // ── 6. Extra Providers + Profiles ────────────────────
  console.log("Creating extra providers...");
  const extraProviderUsers = [];
  for (const p of EXTRA_PROVIDERS) {
    const u = await User.create({
      name: p.name, email: p.email, city: p.city,
      role: "provider", password: PASSWORD,
      isApproved: true, approvalStatus: "approved",
    });
    await ProviderProfile.create({
      userId: u._id,
      categories: p.categoryIndexes.map((i) => categories[i]._id),
      bio: p.bio,
      experienceYears: p.experienceYears,
      availabilityStatus: "available",
      ratingAverage: 0,
      totalReviews: 0,
    });
    extraProviderUsers.push(u);
  }
  console.log(`  ✓ ${extraProviderUsers.length} extra providers`);

  // Build lookup arrays used by BOOKING_TEMPLATES
  // custIdx 0 = primaryCustomer; 1..N = extraCustomers
  const allCustomers = [primaryCustomer, ...extraCustomers];
  // provIdx 0 = primaryProvider; 1..N = extraProviders
  const allProviders = [primaryProviderUser, ...extraProviderUsers];

  // ── 7. Bookings ───────────────────────────────────────
  console.log("Creating bookings...");
  const bookings = [];

  for (const tpl of BOOKING_TEMPLATES) {
    const [custIdx, provIdx, catIdx, ago, status, price, notes, address, workNotes] = tpl;

    const customer = allCustomers[custIdx];
    const provider = allProviders[provIdx];
    const category = categories[catIdx];

    const scheduledDate = daysAgo(ago);
    scheduledDate.setHours(8 + randomInt(0, 9), randomItem([0, 30]), 0, 0);

    // Build status history
    const base = new Date(scheduledDate.getTime() - 86400000 * 3);
    const statusHistory = [{ status: "requested", changedAt: base, changedBy: customer._id }];

    if (["confirmed", "in-progress", "completed"].includes(status)) {
      statusHistory.push({ status: "confirmed", changedAt: new Date(scheduledDate.getTime() - 86400000), changedBy: provider._id });
    }
    if (["in-progress", "completed"].includes(status)) {
      statusHistory.push({ status: "in-progress", changedAt: scheduledDate, changedBy: provider._id });
    }
    if (status === "completed") {
      statusHistory.push({ status: "completed", changedAt: new Date(scheduledDate.getTime() + 86400000 * 2), changedBy: provider._id });
    }
    if (status === "cancelled") {
      statusHistory.push({ status: "cancelled", changedAt: new Date(scheduledDate.getTime() - 86400000), changedBy: customer._id });
    }

    // Before/after images for completed bookings
    const ba = BEFORE_AFTER[catIdx] || {};
    const beforeImages = status === "completed" ? (ba.before || []) : [];
    const afterImages  = status === "completed" ? (ba.after  || []) : [];

    const booking = await Booking.create({
      customerId: customer._id,
      providerId: provider._id,
      categoryId: category._id,
      address: address || randomItem(STREETS) + ", " + customer.city,
      city: customer.city,
      scheduledDateTime: scheduledDate,
      priceSnapshot: price,
      status,
      notes,
      workNotes: workNotes || undefined,
      cancelledBy: status === "cancelled" ? "customer" : undefined,
      statusHistory,
      beforeImages,
      afterImages,
      createdAt: base,
    });
    bookings.push(booking);
  }
  console.log(`  ✓ ${bookings.length} bookings`);

  // ── 8. Reviews ────────────────────────────────────────
  console.log("Creating reviews...");
  let reviewCount = 0;
  for (const [bkgIdx, rating, comment] of REVIEW_TEMPLATES) {
    const booking = bookings[bkgIdx];
    if (!booking || booking.status !== "completed") continue;
    await Review.create({
      bookingId: booking._id,
      customerId: booking.customerId,
      providerId: booking.providerId,
      rating,
      comment,
      createdAt: new Date(booking.scheduledDateTime.getTime() + 86400000 * 3),
    });
    reviewCount++;
  }
  console.log(`  ✓ ${reviewCount} reviews`);

  // ── 9. Recalculate Provider Ratings ──────────────────
  console.log("Recalculating provider ratings...");
  for (const provider of allProviders) {
    const stats = await Review.aggregate([
      { $match: { providerId: provider._id } },
      { $group: { _id: "$providerId", totalReviews: { $sum: 1 }, ratingAverage: { $avg: "$rating" } } },
    ]);
    if (stats.length > 0) {
      await ProviderProfile.findOneAndUpdate(
        { userId: provider._id },
        { totalReviews: stats[0].totalReviews, ratingAverage: Number(stats[0].ratingAverage.toFixed(2)) }
      );
    }
  }
  console.log("  ✓ Ratings updated\n");

  // ── Summary ──────────────────────────────────────────
  const completedCount  = bookings.filter((b) => b.status === "completed").length;
  const requestedCount  = bookings.filter((b) => b.status === "requested").length;
  const confirmedCount  = bookings.filter((b) => b.status === "confirmed").length;
  const inProgressCount = bookings.filter((b) => b.status === "in-progress").length;
  const cancelledCount  = bookings.filter((b) => b.status === "cancelled").length;

  console.log("═══════════════════════════════════════════════════════");
  console.log("  ✅  SEED COMPLETE — SevaConnect");
  console.log("═══════════════════════════════════════════════════════");
  console.log("");
  console.log("  🔑 PRIMARY DEMO ACCOUNTS (password: 123456)");
  console.log(`     Admin    → admin@sevaconnect.com`);
  console.log(`     Customer → customer@sevaconnect.com`);
  console.log(`     Provider → provider@sevaconnect.com`);
  console.log("");
  console.log("  📊 DATA SUMMARY");
  console.log(`     Categories : ${categories.length}`);
  console.log(`     Customers  : ${allCustomers.length}  (1 primary + ${extraCustomers.length} supporting)`);
  console.log(`     Providers  : ${allProviders.length}  (1 primary + ${extraProviderUsers.length} supporting)`);
  console.log(`     Bookings   : ${bookings.length}`);
  console.log(`       ├ completed   ${completedCount}`);
  console.log(`       ├ in-progress ${inProgressCount}`);
  console.log(`       ├ confirmed   ${confirmedCount}`);
  console.log(`       ├ requested   ${requestedCount}`);
  console.log(`       └ cancelled   ${cancelledCount}`);
  console.log(`     Reviews    : ${reviewCount}`);
  console.log("═══════════════════════════════════════════════════════\n");

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

/**
 * Database Seed Script for SevaConnect
 *
 * Populates the database with realistic sample data.
 * All user passwords: 123456
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

// ── Helpers ──────────────────────────────────────────────
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Seed Data ────────────────────────────────────────────

const PASSWORD = "123456";

const CATEGORIES = [
  {
    name: "Plumbing",
    description:
      "Professional plumbing services including pipe repair, leak fixing, bathroom fitting installation, and drainage solutions",
    basePrice: 299,
    icon: "plumbing",
  },
  {
    name: "Electrical Repair",
    description:
      "Certified electricians for wiring, switchboard repair, fan installation, inverter setup, and safety inspections",
    basePrice: 349,
    icon: "electrical_services",
  },
  {
    name: "House Cleaning",
    description:
      "Deep cleaning, regular home cleaning, kitchen cleaning, bathroom sanitization, and post-construction cleanup",
    basePrice: 499,
    icon: "cleaning_services",
  },
  {
    name: "Painting",
    description:
      "Interior and exterior wall painting, texture painting, waterproofing, and wood polishing services",
    basePrice: 999,
    icon: "format_paint",
  },
  {
    name: "AC Repair & Service",
    description:
      "Air conditioner installation, gas refilling, deep cleaning, annual maintenance, and compressor repair",
    basePrice: 599,
    icon: "ac_unit",
  },
  {
    name: "Carpentry",
    description:
      "Custom furniture, door and window repair, modular kitchen installation, and wood work solutions",
    basePrice: 449,
    icon: "carpenter",
  },
  {
    name: "Pest Control",
    description:
      "Cockroach, termite, bed bug, mosquito, and rodent control treatments for homes and offices",
    basePrice: 699,
    icon: "pest_control",
  },
  {
    name: "Gardening & Landscaping",
    description:
      "Garden maintenance, lawn mowing, plant care, landscape design, and terrace garden setup",
    basePrice: 399,
    icon: "yard",
  },
];

const ADMIN_USER = {
  name: "Raghav Kumar",
  email: "admin@sevaconnect.com",
  role: "admin",
  city: "Delhi",
  isApproved: true,
  approvalStatus: "approved",
};

const CUSTOMERS = [
  { name: "Priya Sharma", email: "priya.sharma@gmail.com", city: "Mumbai" },
  { name: "Amit Patel", email: "amit.patel@gmail.com", city: "Ahmedabad" },
  { name: "Sneha Reddy", email: "sneha.reddy@gmail.com", city: "Hyderabad" },
  { name: "Rajesh Gupta", email: "rajesh.gupta@gmail.com", city: "Delhi" },
  { name: "Ananya Iyer", email: "ananya.iyer@gmail.com", city: "Chennai" },
  { name: "Vikram Singh", email: "vikram.singh@gmail.com", city: "Jaipur" },
  { name: "Meera Nair", email: "meera.nair@gmail.com", city: "Bangalore" },
  { name: "Karan Malhotra", email: "karan.malhotra@gmail.com", city: "Pune" },
];

const PROVIDERS = [
  {
    name: "Ramesh Kumar",
    email: "ramesh.kumar@gmail.com",
    city: "Mumbai",
    bio: "15+ years of experience in residential and commercial electrical work. ISI certified electrician with expertise in complete house wiring, smart home installation, and industrial setups.",
    experienceYears: 15,
    categoryIndex: 1, // Electrical Repair
  },
  {
    name: "Lakshmi Devi",
    email: "lakshmi.devi@gmail.com",
    city: "Hyderabad",
    bio: "Running a team of 12 trained professionals specializing in deep home cleaning. We use eco-friendly products and modern equipment for spotless results every time.",
    experienceYears: 8,
    categoryIndex: 2, // House Cleaning
  },
  {
    name: "Manoj Tiwari",
    email: "manoj.plumber@gmail.com",
    city: "Delhi",
    bio: "Master plumber with expertise in modern bathroom fittings, concealed piping, water purifier installation, and emergency leak repair. Available 24/7 for urgent calls.",
    experienceYears: 12,
    categoryIndex: 0, // Plumbing
  },
  {
    name: "Arun Nair",
    email: "arun.painter@gmail.com",
    city: "Bangalore",
    bio: "Professional painter specializing in Royale and Dulux premium finishes, texture walls, and waterproofing. Completed 500+ residential projects across Bangalore.",
    experienceYears: 10,
    categoryIndex: 3, // Painting
  },
  {
    name: "Dinesh Yadav",
    email: "dinesh.acrepair@gmail.com",
    city: "Mumbai",
    bio: "Authorized service partner for Daikin, Voltas, and Blue Star. Expert in split AC, window AC, and central air conditioning systems. Quick 2-hour response time.",
    experienceYears: 9,
    categoryIndex: 4, // AC Repair
  },
  {
    name: "Santosh Patil",
    email: "santosh.patil@gmail.com",
    city: "Pune",
    bio: "Landscape architect and gardening expert. Specialized in terrace gardens, vertical gardens, and low-maintenance garden designs for apartments and villas.",
    experienceYears: 7,
    categoryIndex: 7, // Gardening
  },
  {
    name: "Abdul Rahman",
    email: "abdul.rahman@gmail.com",
    city: "Chennai",
    bio: "Government-licensed pest control operator. Using WHO-approved, odorless chemicals safe for children and pets. Annual maintenance contracts available.",
    experienceYears: 11,
    categoryIndex: 6, // Pest Control
  },
  {
    name: "Govind Mishra",
    email: "govind.carpenter@gmail.com",
    city: "Jaipur",
    bio: "Third-generation carpenter with modern design sensibility. Expert in modular kitchens, wardrobes, TV units, and traditional Rajasthani woodcraft.",
    experienceYears: 14,
    categoryIndex: 5, // Carpentry
  },
];

// Booking templates: [customerIdx, providerIdx, categoryIdx, daysAgo, status, price, notes]
const BOOKING_TEMPLATES = [
  // Completed bookings (spread across several months)
  [0, 0, 1, 150, "completed", 1200, "Need complete rewiring for 2BHK flat"],
  [1, 2, 0, 140, "completed", 550, "Kitchen sink leaking badly, urgent fix needed"],
  [2, 1, 2, 130, "completed", 1800, "Full house deep cleaning before Diwali"],
  [3, 2, 0, 120, "completed", 800, "Bathroom pipe replacement and new tap installation"],
  [4, 6, 6, 110, "completed", 2100, "Full home pest treatment for cockroaches and termites"],
  [5, 7, 5, 100, "completed", 3500, "Custom bookshelf and study table for kids' room"],
  [6, 3, 3, 95, "completed", 8500, "2BHK complete interior painting, textured accent walls"],
  [7, 5, 7, 90, "completed", 1500, "Terrace garden setup with drip irrigation"],
  [0, 4, 4, 80, "completed", 1800, "Split AC deep cleaning and gas refill for 3 units"],
  [1, 1, 2, 70, "completed", 999, "Bathroom and kitchen deep cleaning"],
  [3, 0, 1, 60, "completed", 650, "Ceiling fan installation and switchboard repair"],
  [6, 4, 4, 50, "completed", 2400, "AC installation for new 1.5 ton split unit"],
  [2, 7, 5, 45, "completed", 5500, "Modular kitchen cabinet doors replacement"],
  [5, 6, 6, 35, "completed", 1400, "Mosquito and bed bug treatment for 3BHK"],

  // In-progress bookings
  [4, 3, 3, 5, "in-progress", 12000, "Full villa exterior painting, 4 coats"],
  [7, 0, 1, 3, "in-progress", 900, "Inverter wiring and MCB panel upgrade"],
  [0, 1, 2, 2, "in-progress", 2500, "Post-renovation deep cleaning for 3BHK"],

  // Confirmed bookings
  [1, 5, 7, -2, "confirmed", 800, "Monthly garden maintenance visit"],
  [3, 4, 4, -3, "confirmed", 599, "Annual AC servicing for 2 units"],
  [6, 2, 0, -1, "confirmed", 450, "Leaking flush tank repair"],
  [2, 0, 1, -4, "confirmed", 1100, "Smart switch installation for 3 rooms"],

  // Requested bookings
  [5, 3, 3, -5, "requested", 6000, "Exterior wall waterproofing before monsoon"],
  [0, 7, 5, -3, "requested", 4500, "Custom wardrobe with mirror for master bedroom"],
  [7, 6, 6, -2, "requested", 1800, "Termite treatment for wooden furniture"],
  [4, 1, 2, -1, "requested", 1200, "Office deep cleaning for 1500 sq ft"],

  // Cancelled bookings
  [1, 0, 1, 25, "cancelled", 700, "Geyser installation - cancelled, bought a new one instead"],
  [6, 5, 7, 40, "cancelled", 600, "Garden cleanup - postponed due to rain"],
  [3, 6, 6, 15, "cancelled", 1400, "Pest control - rescheduled to next month"],
];

// Review templates: [bookingTemplateIdx, rating, comment]
const REVIEW_TEMPLATES = [
  [0, 5, "Ramesh ji did an excellent job with the rewiring. Very neat work, all wires properly concealed. Highly recommended for electrical work in Mumbai!"],
  [1, 4, "Good plumbing work. Manoj fixed the leak quickly. Only giving 4 stars because he arrived 30 minutes late, but the quality of work was solid."],
  [2, 5, "Lakshmi's team was fantastic! The house was sparkling clean after their deep cleaning session. They even cleaned behind the appliances. Worth every rupee."],
  [3, 4, "Pipe replacement went smoothly. Professional service, fair pricing. Will use again for future plumbing needs."],
  [4, 5, "Abdul bhai's pest control is the best in Chennai. Used odorless chemicals, safe for my kids. No cockroach sighting since the treatment 3 months ago!"],
  [5, 5, "Govind ji crafted a beautiful bookshelf. The woodwork is exceptional, exactly matching the design I showed him. True craftsman from Jaipur!"],
  [6, 4, "Arun's painting team did a wonderful job. The texture wall came out great. Minor touch-up was needed in one corner but they fixed it promptly."],
  [7, 5, "My terrace garden looks amazing! Santosh selected perfect plants for Pune weather. The drip irrigation system saves so much time. Very happy!"],
  [8, 4, "AC cleaning done well. All 3 units are cooling much better now. Professional service with transparent pricing."],
  [9, 5, "Best cleaning service in Hyderabad! The bathroom tiles are gleaming. Lakshmi and team are thorough and use quality cleaning products."],
  [10, 5, "Quick and efficient. Rajesh ji got the fans installed in under 2 hours. Everything is working perfectly. No complaints at all."],
  [11, 4, "Good AC installation. Dinesh's team was professional and cleaned up after the work. AC is running great. Slight delay in arrival but otherwise perfect."],
];

// ── Main Seed Function ───────────────────────────────────
async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("Connected.\n");

  // Clear existing data
  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    ServiceCategory.deleteMany({}),
    ProviderProfile.deleteMany({}),
    Booking.deleteMany({}),
    Review.deleteMany({}),
  ]);
  console.log("Cleared.\n");

  // ── 1. Create Categories ─────────────────────────────
  console.log("Creating categories...");
  const categories = await ServiceCategory.insertMany(CATEGORIES);
  console.log(`  Created ${categories.length} categories`);

  // ── 2. Create Admin ──────────────────────────────────
  console.log("Creating admin user...");
  const admin = await User.create({
    ...ADMIN_USER,
    password: PASSWORD,
  });
  console.log(`  Admin: ${admin.email}`);

  // ── 3. Create Customers ──────────────────────────────
  console.log("Creating customer accounts...");
  const customers = [];
  for (const c of CUSTOMERS) {
    const user = await User.create({
      ...c,
      role: "customer",
      password: PASSWORD,
    });
    customers.push(user);
  }
  console.log(`  Created ${customers.length} customers`);

  // ── 4. Create Providers + Profiles ───────────────────
  console.log("Creating provider accounts and profiles...");
  const providers = [];
  const profiles = [];
  for (const p of PROVIDERS) {
    const user = await User.create({
      name: p.name,
      email: p.email,
      city: p.city,
      role: "provider",
      password: PASSWORD,
      isApproved: true,
      approvalStatus: "approved",
    });
    providers.push(user);

    const profile = await ProviderProfile.create({
      userId: user._id,
      categories: [categories[p.categoryIndex]._id],
      bio: p.bio,
      experienceYears: p.experienceYears,
      availabilityStatus: "available",
      ratingAverage: 0,
      totalReviews: 0,
    });
    profiles.push(profile);
  }
  console.log(`  Created ${providers.length} providers with profiles`);

  // ── 5. Create Bookings ───────────────────────────────
  console.log("Creating bookings...");
  const bookings = [];
  for (const tpl of BOOKING_TEMPLATES) {
    const [custIdx, provIdx, catIdx, ago, status, price, notes] = tpl;
    const scheduledDate = daysAgo(ago);
    // Set time to morning hours
    scheduledDate.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0);

    const statusHistory = [
      {
        status: "requested",
        changedAt: new Date(scheduledDate.getTime() - 86400000 * 2),
        changedBy: customers[custIdx]._id,
      },
    ];

    if (["confirmed", "in-progress", "completed"].includes(status)) {
      statusHistory.push({
        status: "confirmed",
        changedAt: new Date(scheduledDate.getTime() - 86400000),
        changedBy: providers[provIdx]._id,
      });
    }
    if (["in-progress", "completed"].includes(status)) {
      statusHistory.push({
        status: "in-progress",
        changedAt: scheduledDate,
        changedBy: providers[provIdx]._id,
      });
    }
    if (status === "completed") {
      statusHistory.push({
        status: "completed",
        changedAt: new Date(scheduledDate.getTime() + 86400000),
        changedBy: providers[provIdx]._id,
      });
    }
    if (status === "cancelled") {
      statusHistory.push({
        status: "cancelled",
        changedAt: new Date(scheduledDate.getTime() - 86400000),
        changedBy: customers[custIdx]._id,
      });
    }

    const booking = await Booking.create({
      customerId: customers[custIdx]._id,
      providerId: providers[provIdx]._id,
      categoryId: categories[catIdx]._id,
      address: `${Math.floor(Math.random() * 500) + 1}, ${randomItem(["MG Road", "Station Road", "Nehru Nagar", "Gandhi Chowk", "Lake View Colony", "Sector 21", "Rajiv Nagar", "Shanti Colony", "Koramangala", "Banjara Hills"])}`,
      city: customers[custIdx].city,
      scheduledDateTime: scheduledDate,
      priceSnapshot: price,
      status,
      notes,
      cancelledBy: status === "cancelled" ? "customer" : undefined,
      statusHistory,
      createdAt: new Date(scheduledDate.getTime() - 86400000 * 3),
    });
    bookings.push(booking);
  }
  console.log(`  Created ${bookings.length} bookings`);

  // ── 6. Create Reviews ────────────────────────────────
  console.log("Creating reviews...");
  let reviewCount = 0;
  for (const [bkgIdx, rating, comment] of REVIEW_TEMPLATES) {
    const booking = bookings[bkgIdx];
    if (booking.status !== "completed") continue;

    await Review.create({
      bookingId: booking._id,
      customerId: booking.customerId,
      providerId: booking.providerId,
      rating,
      comment,
      createdAt: new Date(booking.createdAt.getTime() + 86400000 * 4),
    });
    reviewCount++;
  }
  console.log(`  Created ${reviewCount} reviews`);

  // ── 7. Recalculate Provider Ratings ──────────────────
  console.log("Recalculating provider ratings...");
  for (const provider of providers) {
    const stats = await Review.aggregate([
      { $match: { providerId: provider._id } },
      {
        $group: {
          _id: "$providerId",
          totalReviews: { $sum: 1 },
          ratingAverage: { $avg: "$rating" },
        },
      },
    ]);

    if (stats.length > 0) {
      await ProviderProfile.findOneAndUpdate(
        { userId: provider._id },
        {
          totalReviews: stats[0].totalReviews,
          ratingAverage: Number(stats[0].ratingAverage.toFixed(2)),
        }
      );
    }
  }
  console.log("  Done.\n");

  // ── Summary ──────────────────────────────────────────
  console.log("═══════════════════════════════════════════");
  console.log("  SEED COMPLETE");
  console.log("═══════════════════════════════════════════");
  console.log(`  Admin:      ${ADMIN_USER.email}`);
  console.log(`  Customers:  ${customers.length} accounts`);
  console.log(`  Providers:  ${providers.length} accounts`);
  console.log(`  Categories: ${categories.length}`);
  console.log(`  Bookings:   ${bookings.length}`);
  console.log(`  Reviews:    ${reviewCount}`);
  console.log(`  Password:   ${PASSWORD} (for all users)`);
  console.log("═══════════════════════════════════════════\n");

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

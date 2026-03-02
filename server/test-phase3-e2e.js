/**
 * Phase 3 + 4 E2E Workflow Test
 * Run: node test-phase3-e2e.js
 */

const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const BASE = "http://localhost:5000";

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log("   ✅", label);
    passed++;
  } else {
    console.log("   ❌", label);
    failed++;
  }
}

function request(method, urlPath, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE);

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(data),
          });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on("error", reject);

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  const ts = Date.now();

  console.log("=== PHASE 3 & 4 E2E TEST ===\n");

  // Connect to DB for admin seeding
  await mongoose.connect(process.env.MONGO_URI);
  const User = require("./src/models/User");
  const ServiceCategory = require("./src/models/ServiceCategory");

  // Register Customer
  const custEmail = `cust_${ts}@test.com`;
  const rCust = await request("POST", "/api/auth/register", {
    name: "Customer",
    email: custEmail,
    password: "pass1234",
    city: "Mumbai",
  });
  const customerToken = rCust.body.token;

  // Register Provider
  const provEmail = `prov_${ts}@test.com`;
  const rProv = await request("POST", "/api/auth/register", {
    name: "Provider",
    email: provEmail,
    password: "pass1234",
    role: "provider",
    city: "Mumbai",
  });
  const providerToken = rProv.body.token;

  // Create Admin
  const adminEmail = `admin_${ts}@test.com`;
  await request("POST", "/api/auth/register", {
    name: "Admin",
    email: adminEmail,
    password: "admin1234",
    city: "Mumbai",
  });

  await User.findOneAndUpdate(
    { email: adminEmail },
    { role: "admin", isApproved: true }
  );

  const rAdmin = await request("POST", "/api/auth/login", {
    email: adminEmail,
    password: "admin1234",
  });
  const adminToken = rAdmin.body.token;

  // Approve Provider
  await User.findOneAndUpdate(
    { email: provEmail },
    { isApproved: true }
  );

  // Create Category
  const rCat = await request(
    "POST",
    "/api/admin/categories",
    {
      name: "Plumbing_" + ts,
      description: "Plumbing",
      basePrice: 500,
    },
    { Authorization: "Bearer " + adminToken }
  );

  const categoryId = rCat.body.data._id;

  // Provider creates profile
  await request(
    "POST",
    "/api/provider/profile",
    {
      categories: [categoryId],
      bio: "Expert",
      experienceYears: 10,
    },
    { Authorization: "Bearer " + providerToken }
  );

  console.log("\n--- BOOKING WORKFLOW ---");

  // Create Booking
  const bookingTime = new Date(Date.now() + 3600000).toISOString();

  const rBooking = await request(
    "POST",
    "/api/bookings",
    {
      providerId: rProv.body.data._id,
      categoryId,
      address: "Some Address",
      city: "Mumbai",
      scheduledDateTime: bookingTime,
    },
    { Authorization: "Bearer " + customerToken }
  );

  assert("Booking created", rBooking.status === 201);
  const bookingId = rBooking.body.data._id;

  // Provider accept
  const rAccept = await request(
    "PATCH",
    `/api/bookings/${bookingId}/accept`,
    null,
    { Authorization: "Bearer " + providerToken }
  );
  assert("Booking confirmed", rAccept.body.data.status === "confirmed");

  // Provider start
  const rStart = await request(
    "PATCH",
    `/api/bookings/${bookingId}/start`,
    null,
    { Authorization: "Bearer " + providerToken }
  );
  assert("Booking in-progress", rStart.body.data.status === "in-progress");

  // Provider complete
  const rComplete = await request(
    "PATCH",
    `/api/bookings/${bookingId}/complete`,
    null,
    { Authorization: "Bearer " + providerToken }
  );
  assert("Booking completed", rComplete.body.data.status === "completed");

  // Invalid transition test
  const rInvalid = await request(
    "PATCH",
    `/api/bookings/${bookingId}/accept`,
    null,
    { Authorization: "Bearer " + providerToken }
  );
  assert("Invalid transition blocked", rInvalid.status === 400);

  console.log("\n--- REVIEW SYSTEM ---");

  // Submit Review
  const rReview = await request(
    "POST",
    "/api/reviews",
    {
      bookingId,
      rating: 5,
      comment: "Excellent service",
    },
    { Authorization: "Bearer " + customerToken }
  );

  assert("Review created", rReview.status === 201);

  // Duplicate Review
  const rDup = await request(
    "POST",
    "/api/reviews",
    {
      bookingId,
      rating: 4,
    },
    { Authorization: "Bearer " + customerToken }
  );

  assert("Duplicate review blocked", rDup.status === 400);

  console.log("\n--- DASHBOARDS ---");

  const rCustDash = await request(
    "GET",
    "/api/bookings/my",
    null,
    { Authorization: "Bearer " + customerToken }
  );
  assert("Customer dashboard works", rCustDash.status === 200);

  const rProvDash = await request(
    "GET",
    "/api/provider/bookings",
    null,
    { Authorization: "Bearer " + providerToken }
  );
  assert("Provider dashboard works", rProvDash.status === 200);

  console.log("\n=========================");
  console.log(`RESULTS: ${passed} passed, ${failed} failed`);
  console.log("=========================\n");

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Test crashed:", err);
  process.exit(1);
});
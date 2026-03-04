/**
 * Phase 6 & 7 Test Suite
 * Tests: Admin Provider Approval, Booking GET with ownership, Review deletion recalculation, Analytics
 * Run: node tests/test-phase6-7.js
 */
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

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
      headers: { "Content-Type": "application/json", ...headers },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
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

  console.log("=== PHASE 6 & 7 TEST SUITE ===\n");

  await mongoose.connect(process.env.MONGO_URI);
  const User = require("../src/models/User");
  const ServiceCategory = require("../src/models/ServiceCategory");
  const ProviderProfile = require("../src/models/ProviderProfile");

  // Setup: Create users
  const custEmail = `cust_${ts}@test.com`;
  const provEmail = `prov_${ts}@test.com`;
  const adminEmail = `admin_${ts}@test.com`;

  // Register Customer
  const rCust = await request("POST", "/api/auth/register", {
    name: "Customer",
    email: custEmail,
    password: "pass1234",
    city: "Mumbai",
  });
  const customerToken = rCust.body.token;
  const customerId = rCust.body.data._id;

  // Register Provider (not approved)
  const rProv = await request("POST", "/api/auth/register", {
    name: "Provider",
    email: provEmail,
    password: "pass1234",
    role: "provider",
    city: "Mumbai",
  });
  const providerToken = rProv.body.token;
  const providerUserId = rProv.body.data._id;

  // Create Admin
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

  // Create Category
  const rCat = await request(
    "POST",
    "/api/admin/categories",
    { name: "Plumbing_" + ts, description: "Plumbing services", basePrice: 500 },
    { Authorization: "Bearer " + adminToken }
  );
  const categoryId = rCat.body.data._id;

  // Provider creates profile
  await request(
    "POST",
    "/api/provider/profile",
    { categories: [categoryId], bio: "Expert plumber", experienceYears: 5 },
    { Authorization: "Bearer " + providerToken }
  );

  // ============================================
  // PHASE 6: ADMIN PROVIDER APPROVAL SYSTEM
  // ============================================

  console.log("--- PHASE 6: ADMIN PROVIDER APPROVAL ---\n");

  // Test 1: Non-admin cannot list providers
  console.log("1. Non-admin cannot list providers:");
  const r1 = await request(
    "GET",
    "/api/admin/providers",
    null,
    { Authorization: "Bearer " + customerToken }
  );
  assert("Status 403", r1.status === 403);
  console.log();

  // Test 2: Admin lists all providers
  console.log("2. Admin lists all providers:");
  const r2 = await request(
    "GET",
    "/api/admin/providers",
    null,
    { Authorization: "Bearer " + adminToken }
  );
  assert("Status 200", r2.status === 200);
  assert("success: true", r2.body.success === true);
  assert("Returns array", Array.isArray(r2.body.data));
  console.log();

  // Test 3: Admin lists unapproved providers
  console.log("3. Admin lists unapproved providers:");
  const r3 = await request(
    "GET",
    "/api/admin/providers?approved=false",
    null,
    { Authorization: "Bearer " + adminToken }
  );
  assert("Status 200", r3.status === 200);
  assert("Has unapproved provider", r3.body.data.some((p) => p.isApproved === false));
  console.log();

  // Test 4: Admin approves provider
  console.log("4. Admin approves provider:");
  const r4 = await request(
    "PATCH",
    `/api/admin/providers/${providerUserId}/approve`,
    null,
    { Authorization: "Bearer " + adminToken }
  );
  assert("Status 200", r4.status === 200);
  assert("isApproved: true", r4.body.data.isApproved === true);
  console.log();

  // Test 5: Admin rejects provider
  console.log("5. Admin rejects provider:");
  const r5 = await request(
    "PATCH",
    `/api/admin/providers/${providerUserId}/reject`,
    null,
    { Authorization: "Bearer " + adminToken }
  );
  assert("Status 200", r5.status === 200);
  assert("isApproved: false", r5.body.data.isApproved === false);
  console.log();

  // Approve again for further tests
  await request(
    "PATCH",
    `/api/admin/providers/${providerUserId}/approve`,
    null,
    { Authorization: "Bearer " + adminToken }
  );

  // Test 6: Non-admin cannot approve
  console.log("6. Non-admin cannot approve provider:");
  const r6 = await request(
    "PATCH",
    `/api/admin/providers/${providerUserId}/approve`,
    null,
    { Authorization: "Bearer " + customerToken }
  );
  assert("Status 403", r6.status === 403);
  console.log();

  // Test 7: Approve non-existent provider
  console.log("7. Approve non-existent provider:");
  const r7 = await request(
    "PATCH",
    "/api/admin/providers/000000000000000000000000/approve",
    null,
    { Authorization: "Bearer " + adminToken }
  );
  assert("Status 404", r7.status === 404);
  console.log();

  // ============================================
  // BOOKING WORKFLOW FOR PHASE 7 TESTS
  // ============================================

  console.log("--- SETUP: Booking Workflow ---\n");

  const bookingTime = new Date(Date.now() + 86400000).toISOString();

  const rBooking = await request(
    "POST",
    "/api/bookings",
    {
      providerId: providerUserId,
      categoryId,
      address: "123 Test St",
      city: "Mumbai",
      scheduledDateTime: bookingTime,
    },
    { Authorization: "Bearer " + customerToken }
  );

  const bookingId = rBooking.body.data._id;

  await request(
    "PATCH",
    `/api/bookings/${bookingId}/accept`,
    null,
    { Authorization: "Bearer " + providerToken }
  );

  await request(
    "PATCH",
    `/api/bookings/${bookingId}/start`,
    null,
    { Authorization: "Bearer " + providerToken }
  );

  await request(
    "PATCH",
    `/api/bookings/${bookingId}/complete`,
    null,
    { Authorization: "Bearer " + providerToken }
  );

  // ============================================
  // PHASE 7: PRODUCTION HARDENING
  // ============================================

  console.log("--- PHASE 7: BOOKING GET BY ID ---\n");

  // Test 8: Customer views their own booking
  console.log("8. Customer views own booking:");
  const r8 = await request(
    "GET",
    `/api/bookings/${bookingId}`,
    null,
    { Authorization: "Bearer " + customerToken }
  );
  assert("Status 200", r8.status === 200);
  assert("Has customer name", !!r8.body.data?.customerId?.name);
  assert("Has provider name", !!r8.body.data?.providerId?.name);
  assert("Has category name", !!r8.body.data?.categoryId?.name);
  console.log();

  // Test 9: Provider views their assigned booking
  console.log("9. Provider views assigned booking:");
  const r9 = await request(
    "GET",
    `/api/bookings/${bookingId}`,
    null,
    { Authorization: "Bearer " + providerToken }
  );
  assert("Status 200", r9.status === 200);
  console.log();

  // Test 10: Admin views any booking
  console.log("10. Admin views any booking:");
  const r10 = await request(
    "GET",
    `/api/bookings/${bookingId}`,
    null,
    { Authorization: "Bearer " + adminToken }
  );
  assert("Status 200", r10.status === 200);
  console.log();

  // Test 11: Customer cannot view other customer's booking
  // Create another customer
  const otherCustEmail = `other_${ts}@test.com`;
  await request("POST", "/api/auth/register", {
    name: "OtherCustomer",
    email: otherCustEmail,
    password: "pass1234",
    city: "Mumbai",
  });
  const rOtherLogin = await request("POST", "/api/auth/login", {
    email: otherCustEmail,
    password: "pass1234",
  });
  const otherCustomerToken = rOtherLogin.body.token;

  console.log("11. Customer cannot view other's booking:");
  const r11 = await request(
    "GET",
    `/api/bookings/${bookingId}`,
    null,
    { Authorization: "Bearer " + otherCustomerToken }
  );
  assert("Status 403", r11.status === 403);
  console.log();

  // Test 12: Invalid booking ID
  console.log("12. Invalid booking ID:");
  const r12 = await request(
    "GET",
    "/api/bookings/invalidid",
    null,
    { Authorization: "Bearer " + adminToken }
  );
  assert("Status 400", r12.status === 400);
  console.log();

  // ============================================
  // REVIEW DELETION RECALCULATES RATING
  // ============================================

  console.log("--- REVIEW DELETION RECALCULATION ---\n");

  // Submit review
  const rReview = await request(
    "POST",
    "/api/reviews",
    { bookingId, rating: 5, comment: "Great service!" },
    { Authorization: "Bearer " + customerToken }
  );
  const reviewId = rReview.body.data._id;

  // Check provider rating after review
  const profileBefore = await ProviderProfile.findOne({ userId: providerUserId });
  assert("Rating updated after review", profileBefore.ratingAverage === 5);
  assert("Total reviews is 1", profileBefore.totalReviews === 1);

  // Admin deletes review
  const rDelete = await request(
    "DELETE",
    `/api/admin/reviews/${reviewId}`,
    null,
    { Authorization: "Bearer " + adminToken }
  );
  assert("Review deleted", rDelete.status === 200);

  // Check provider rating recalculated
  const profileAfter = await ProviderProfile.findOne({ userId: providerUserId });
  assert("Rating reset after deletion", profileAfter.ratingAverage === 0);
  assert("Total reviews is 0", profileAfter.totalReviews === 0);
  console.log();

  // ============================================
  // ANALYTICS ENDPOINT
  // ============================================

  console.log("--- ANALYTICS ENDPOINT ---\n");

  // Test 13: Admin gets analytics
  console.log("13. Admin gets analytics:");
  const r13 = await request(
    "GET",
    "/api/admin/analytics",
    null,
    { Authorization: "Bearer " + adminToken }
  );
  assert("Status 200", r13.status === 200);
  assert("success: true", r13.body.success === true);
  assert("Has totalUsers", typeof r13.body.data?.totalUsers === "number");
  assert("Has totalProviders", typeof r13.body.data?.totalProviders === "number");
  assert("Has totalBookings", typeof r13.body.data?.totalBookings === "number");
  assert("Has completedBookings", typeof r13.body.data?.completedBookings === "number");
  assert("Has cancelledBookings", typeof r13.body.data?.cancelledBookings === "number");
  assert("Has averageBookingPrice", typeof r13.body.data?.averageBookingPrice === "number");
  assert("Has totalReviews", typeof r13.body.data?.totalReviews === "number");
  console.log();

  // Test 14: Non-admin cannot get analytics
  console.log("14. Non-admin cannot get analytics:");
  const r14 = await request(
    "GET",
    "/api/admin/analytics",
    null,
    { Authorization: "Bearer " + customerToken }
  );
  assert("Status 403", r14.status === 403);
  console.log();

  // ============================================
  // SUMMARY
  // ============================================

  console.log("=========================");
  console.log(`RESULTS: ${passed} passed, ${failed} failed`);
  console.log("=========================\n");

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Test crashed:", err);
  process.exit(1);
});

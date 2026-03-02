/**
 * Phase 2 Marketplace Structure Tests
 * Tests: ServiceCategory CRUD + ProviderProfile + Filtering
 * Run: node test-phase2.js
 */
const http = require("http");

const BASE = "http://localhost:5000";
let passed = 0;
let failed = 0;

function request(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
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
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function assert(label, condition) {
  if (condition) {
    console.log(`   ✅ ${label}`);
    passed++;
  } else {
    console.log(`   ❌ ${label}`);
    failed++;
  }
}

async function runTests() {
  const ts = Date.now();
  console.log("=== PHASE 2 MARKETPLACE STRUCTURE TESTS ===\n");

  // ---- SETUP: Create admin user directly via register, then fix role in DB ----
  // Since we can't register as admin, we register as customer then use the token
  // We'll need an admin. Let's register and login.

  // Register admin (will default to customer due to security fix)
  const adminEmail = `admin_${ts}@test.com`;
  await request("POST", "/api/auth/register", {
    name: "AdminUser",
    email: adminEmail,
    password: "admin1234",
    city: "Mumbai",
  });

  // We need a real admin token. Let's create a workaround:
  // Register normally, then we'll test that non-admin gets rejected,
  // and we need to manually seed an admin account.
  // For testing, let's just verify access control works.

  const customerEmail = `cust_${ts}@test.com`;
  const r_cust = await request("POST", "/api/auth/register", {
    name: "Customer",
    email: customerEmail,
    password: "pass1234",
    city: "Mumbai",
  });
  const customerToken = r_cust.body.token;

  const providerEmail = `prov_${ts}@test.com`;
  const r_prov = await request("POST", "/api/auth/register", {
    name: "Provider",
    email: providerEmail,
    password: "pass1234",
    role: "provider",
    city: "Mumbai",
  });
  const providerToken = r_prov.body.token;

  // ============ SECTION 1: ServiceCategory ============

  console.log("--- SECTION 1: ServiceCategory ---\n");

  // Test 1: Customer cannot create category (not admin)
  console.log("1. Customer cannot create category:");
  const r1 = await request(
    "POST",
    "/api/admin/categories",
    { name: "Plumbing", description: "All plumbing services", basePrice: 500 },
    { Authorization: "Bearer " + customerToken }
  );
  assert("Status 403", r1.status === 403);
  console.log();

  // Test 2: Provider cannot create category (not admin)
  console.log("2. Provider cannot create category:");
  const r2 = await request(
    "POST",
    "/api/admin/categories",
    { name: "Plumbing", description: "All plumbing services", basePrice: 500 },
    { Authorization: "Bearer " + providerToken }
  );
  assert("Status 403", r2.status === 403);
  console.log();

  // Test 3: Unauthenticated cannot create category
  console.log("3. Unauthenticated cannot create category:");
  const r3 = await request("POST", "/api/admin/categories", {
    name: "Plumbing",
    description: "All plumbing services",
    basePrice: 500,
  });
  assert("Status 401", r3.status === 401);
  console.log();

  // For actual admin tests, we need to seed an admin user.
  // Let's do it via MongoDB driver directly through a register + manual role update.
  // We'll use a helper: register a user, then update their role to admin via the API workaround.
  // Since we can't do that via API, we'll use Node MongoDB driver.

  const mongoose = require("mongoose");
  const dotenv = require("dotenv");
  dotenv.config({ path: require("path").resolve(__dirname, ".env") });

  await mongoose.connect(process.env.MONGO_URI);
  const User = require("./src/models/User");

  // Create admin user by updating role directly in DB
  const adminUser = await User.findOneAndUpdate(
    { email: adminEmail },
    { role: "admin", isApproved: true },
    { new: true }
  );

  // Login as admin to get fresh token with admin role
  const r_admin = await request("POST", "/api/auth/login", {
    email: adminEmail,
    password: "admin1234",
  });
  const adminToken = r_admin.body.token;

  // Test 4: Admin creates category
  console.log("4. Admin creates Plumbing category:");
  const r4 = await request(
    "POST",
    "/api/admin/categories",
    { name: "Plumbing_" + ts, description: "All plumbing services", basePrice: 500 },
    { Authorization: "Bearer " + adminToken }
  );
  assert("Status 201", r4.status === 201);
  assert("success: true", r4.body.success === true);
  assert("Has name", !!r4.body.data?.name);
  assert("basePrice: 500", r4.body.data?.basePrice === 500);
  const categoryId1 = r4.body.data?._id;
  console.log();

  // Test 5: Admin creates second category
  console.log("5. Admin creates Electrical category:");
  const r5 = await request(
    "POST",
    "/api/admin/categories",
    { name: "Electrical_" + ts, description: "Electrical work", basePrice: 700 },
    { Authorization: "Bearer " + adminToken }
  );
  assert("Status 201", r5.status === 201);
  const categoryId2 = r5.body.data?._id;
  console.log();

  // Test 6: Duplicate category name
  console.log("6. Duplicate category name rejected:");
  const r6 = await request(
    "POST",
    "/api/admin/categories",
    { name: "Plumbing_" + ts, description: "Duplicate", basePrice: 300 },
    { Authorization: "Bearer " + adminToken }
  );
  assert("Status 409", r6.status === 409);
  console.log();

  // Test 7: Admin updates category
  console.log("7. Admin updates category:");
  const r7 = await request(
    "PATCH",
    `/api/admin/categories/${categoryId1}`,
    { basePrice: 600 },
    { Authorization: "Bearer " + adminToken }
  );
  assert("Status 200", r7.status === 200);
  assert("Updated basePrice: 600", r7.body.data?.basePrice === 600);
  console.log();

  // Test 8: Public list categories
  console.log("8. Public list active categories:");
  const r8 = await request("GET", "/api/categories");
  assert("Status 200", r8.status === 200);
  assert("success: true", r8.body.success === true);
  assert("Returns array", Array.isArray(r8.body.data));
  assert("Has categories", r8.body.data.length >= 2);
  console.log();

  // ============ SECTION 2: ProviderProfile ============

  console.log("--- SECTION 2: ProviderProfile ---\n");

  // Test 9: Customer cannot create provider profile
  console.log("9. Customer cannot create provider profile:");
  const r9 = await request(
    "POST",
    "/api/provider/profile",
    { bio: "I am a customer", experienceYears: 5 },
    { Authorization: "Bearer " + customerToken }
  );
  assert("Status 403", r9.status === 403);
  console.log();

  // Test 10: Provider creates profile
  console.log("10. Provider creates profile:");
  const r10 = await request(
    "POST",
    "/api/provider/profile",
    {
      categories: [categoryId1, categoryId2],
      bio: "Expert plumber with 10 years experience",
      experienceYears: 10,
      availabilityStatus: "available",
    },
    { Authorization: "Bearer " + providerToken }
  );
  assert("Status 200", r10.status === 200);
  assert("success: true", r10.body.success === true);
  assert("Has bio", !!r10.body.data?.bio);
  assert("experienceYears: 10", r10.body.data?.experienceYears === 10);
  assert("Has categories array", Array.isArray(r10.body.data?.categories));
  console.log();

  // Test 11: Provider gets own profile
  console.log("11. Provider gets own profile:");
  const r11 = await request("GET", "/api/provider/profile", null, {
    Authorization: "Bearer " + providerToken,
  });
  assert("Status 200", r11.status === 200);
  assert("Has populated categories", r11.body.data?.categories?.length === 2);
  assert("__v NOT exposed", r11.body.data?.__v === undefined);
  console.log();

  // Test 12: Provider updates profile (upsert)
  console.log("12. Provider updates profile:");
  const r12 = await request(
    "POST",
    "/api/provider/profile",
    { bio: "Updated bio - senior plumber", experienceYears: 12 },
    { Authorization: "Bearer " + providerToken }
  );
  assert("Status 200", r12.status === 200);
  assert("Updated bio", r12.body.data?.bio === "Updated bio - senior plumber");
  assert("Updated experience: 12", r12.body.data?.experienceYears === 12);
  console.log();

  // Test 13: Invalid category ID rejected
  console.log("13. Invalid category ID rejected:");
  const r13 = await request(
    "POST",
    "/api/provider/profile",
    { categories: ["000000000000000000000000"] },
    { Authorization: "Bearer " + providerToken }
  );
  assert("Status 400", r13.status === 400);
  assert("Message mentions invalid", r13.body.message.includes("invalid"));
  console.log();

  // ============ SECTION 3: Filtering ============

  console.log("--- SECTION 3: Provider Filtering ---\n");

  // First approve the provider so they show up in public listing
  await User.findOneAndUpdate(
    { email: providerEmail },
    { isApproved: true }
  );

  // Test 14: Public list providers (no filter)
  console.log("14. Public list providers:");
  const r14 = await request("GET", "/api/providers");
  assert("Status 200", r14.status === 200);
  assert("Returns array", Array.isArray(r14.body.data));
  assert("Has providers", r14.body.data.length >= 1);
  console.log();

  // Test 15: Filter by city
  console.log("15. Filter providers by city=Mumbai:");
  const r15 = await request("GET", "/api/providers?city=Mumbai");
  assert("Status 200", r15.status === 200);
  assert("Has results", r15.body.data.length >= 1);
  console.log();

  // Test 16: Filter by wrong city
  console.log("16. Filter providers by city=NonExistent:");
  const r16 = await request("GET", "/api/providers?city=NonExistentCity");
  assert("Status 200", r16.status === 200);
  assert("Empty results", r16.body.data.length === 0);
  console.log();

  // Test 17: Filter by category
  console.log("17. Filter providers by category:");
  const r17 = await request("GET", `/api/providers?category=${categoryId1}`);
  assert("Status 200", r17.status === 200);
  assert("Has results", r17.body.data.length >= 1);
  console.log();

  // Test 18: Filter by city + category
  console.log("18. Filter by city=Mumbai + category:");
  const r18 = await request(
    "GET",
    `/api/providers?city=Mumbai&category=${categoryId1}`
  );
  assert("Status 200", r18.status === 200);
  assert("Has results", r18.body.data.length >= 1);
  console.log();

  // Cleanup: disconnect mongoose
  await mongoose.disconnect();

  // Summary
  console.log("=================================");
  console.log(`RESULTS: ${passed} passed, ${failed} failed out of ${passed + failed} assertions`);
  console.log("=================================");
}

runTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});

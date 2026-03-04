/**
 * Phase 1 Auth Tests — includes admin role injection test.
 * Run: node tests/test-auth.js
 */
const http = require("http");

const BASE = "http://localhost:5000";

function request(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
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

let passed = 0;
let failed = 0;

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
  console.log("=== PHASE 1 AUTH TESTS (with polish fixes) ===\n");

  // Test 1: Register customer
  console.log("1. Register customer:");
  const r1 = await request("POST", "/api/auth/register", {
    name: "TestCustomer",
    email: "cust_" + Date.now() + "@test.com",
    password: "pass1234",
    city: "Mumbai",
  });
  assert("Status 201", r1.status === 201);
  assert("success: true", r1.body.success === true);
  assert("role: customer", r1.body.data?.role === "customer");
  assert("isApproved: true", r1.body.data?.isApproved === true);
  assert("Has token", !!r1.body.token);
  assert("Password NOT exposed", !r1.body.data?.password);
  console.log();

  // Test 2: Register provider
  console.log("2. Register provider:");
  const r2 = await request("POST", "/api/auth/register", {
    name: "TestProvider",
    email: "prov_" + Date.now() + "@test.com",
    password: "pass1234",
    role: "provider",
    city: "Delhi",
  });
  assert("Status 201", r2.status === 201);
  assert("role: provider", r2.body.data?.role === "provider");
  assert("isApproved: false", r2.body.data?.isApproved === false);
  assert("Password NOT exposed", !r2.body.data?.password);
  console.log();

  // Test 3: Admin role injection (SECURITY)
  console.log("3. Admin role injection attempt:");
  const adminEmail = "admin_" + Date.now() + "@test.com";
  const r3 = await request("POST", "/api/auth/register", {
    name: "HackerAdmin",
    email: adminEmail,
    password: "pass1234",
    role: "admin",
    city: "Mumbai",
  });
  assert("Status 201 (registers but NOT as admin)", r3.status === 201);
  assert("role: customer (NOT admin)", r3.body.data?.role === "customer");
  console.log();

  // Test 4: Duplicate email
  console.log("4. Duplicate email:");
  const dupEmail = "dup_" + Date.now() + "@test.com";
  await request("POST", "/api/auth/register", {
    name: "First",
    email: dupEmail,
    password: "pass1234",
    city: "Mumbai",
  });
  const r4 = await request("POST", "/api/auth/register", {
    name: "Second",
    email: dupEmail,
    password: "pass1234",
    city: "Mumbai",
  });
  assert("Status 409", r4.status === 409);
  assert("Message: Email already registered", r4.body.message === "Email already registered");
  console.log();

  // Test 5: Short password
  console.log("5. Short password:");
  const r5 = await request("POST", "/api/auth/register", {
    name: "Short",
    email: "short_" + Date.now() + "@test.com",
    password: "123",
    city: "Mumbai",
  });
  assert("Status 400", r5.status === 400);
  assert("Message mentions 6 characters", r5.body.message.includes("6 characters"));
  console.log();

  // Test 6: Login success
  const loginEmail = "login_" + Date.now() + "@test.com";
  await request("POST", "/api/auth/register", {
    name: "LoginUser",
    email: loginEmail,
    password: "pass1234",
    city: "Mumbai",
  });
  console.log("6. Login success:");
  const r6 = await request("POST", "/api/auth/login", {
    email: loginEmail,
    password: "pass1234",
  });
  assert("Status 200", r6.status === 200);
  assert("success: true", r6.body.success === true);
  assert("Has token", !!r6.body.token);
  assert("Password NOT exposed", !r6.body.data?.password);
  const loginToken = r6.body.token;
  console.log();

  // Test 7: Login wrong password
  console.log("7. Login wrong password:");
  const r7 = await request("POST", "/api/auth/login", {
    email: loginEmail,
    password: "wrongpass",
  });
  assert("Status 401", r7.status === 401);
  assert("Message: Invalid email or password", r7.body.message === "Invalid email or password");
  console.log();

  // Test 8: GET /me without token
  console.log("8. GET /me without token:");
  const r8 = await request("GET", "/api/auth/me");
  assert("Status 401", r8.status === 401);
  assert("Message: Not authorized", r8.body.message.includes("Not authorized"));
  console.log();

  // Test 9: GET /me with valid token
  console.log("9. GET /me with valid token:");
  const r9 = await request("GET", "/api/auth/me", null, {
    Authorization: "Bearer " + loginToken,
  });
  assert("Status 200", r9.status === 200);
  assert("success: true", r9.body.success === true);
  assert("Has name", !!r9.body.data?.name);
  assert("Has email", !!r9.body.data?.email);
  assert("Password NOT exposed", !r9.body.data?.password);
  assert("__v NOT exposed", r9.body.data?.__v === undefined);
  console.log();

  // Summary
  console.log("=================================");
  console.log(`RESULTS: ${passed} passed, ${failed} failed out of ${passed + failed} assertions`);
  console.log("=================================");
}

runTests().catch(console.error);

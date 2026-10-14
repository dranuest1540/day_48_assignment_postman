import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import express from "express";
import bcrypt from "bcryptjs";

import { createAuthController } from "../controllers/auth.controller.js";
import { createAuthRouter } from "../routes/auth.routes.js";

process.env.JWT_SECRET = "test-only-secret-that-is-long-enough";

const users = new Map();
let nextId = 1;
let server;
let baseUrl;

const repository = {
    async findUserByEmail(email) {
        return [...users.values()].find((user) => user.email === email);
    },
    async findUserById(id) {
        const user = users.get(Number(id));
        if (!user) return undefined;
        const { password, ...publicUser } = user;
        return publicUser;
    },
    async createUser(name, email, password, role) {
        const id = nextId++;
        users.set(id, { id, name, email, password, role });
        return id;
    }
};

before(async () => {
    const app = express();
    app.use(express.json());
    app.use("/api/auth", createAuthRouter(createAuthController(repository)));
    server = app.listen(0, "127.0.0.1");
    await new Promise((resolve) => server.once("listening", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}/api/auth`;
});

after(async () => {
    await new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
    });
});

beforeEach(() => {
    users.clear();
    nextId = 1;
});

const request = (path, options = {}) => fetch(`${baseUrl}${path}`, options);
const json = (body) => ({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
});

test("register validates fields and rejects malformed email or short password", async () => {
    const response = await request("/register", json({
        name: " ",
        email: "not-an-email",
        password: "short"
    }));
    const body = await response.json();

    assert.equal(response.status, 422);
    assert.ok(body.errors.name);
    assert.ok(body.errors.email);
    assert.ok(body.errors.password);
});

test("register stores a bcrypt hash and duplicate email returns conflict", async () => {
    const response = await request("/register", json({
        name: " Test User ",
        email: "  TEST@example.com ",
        password: "password123"
    }));
    const body = await response.json();
    const storedUser = users.get(body.data.id);

    assert.equal(response.status, 201);
    assert.equal(body.data.name, "Test User");
    assert.equal(body.data.email, "test@example.com");
    assert.equal("password" in body.data, false);
    assert.notEqual(storedUser.password, "password123");
    assert.equal(await bcrypt.compare("password123", storedUser.password), true);

    const duplicate = await request("/register", json({
        name: "Another User",
        email: "test@example.com",
        password: "password123"
    }));

    assert.equal(duplicate.status, 409);
});

test("login returns a bearer token and /me returns the authenticated user", async () => {
    await request("/register", json({
        name: "Test User",
        email: "test@example.com",
        password: "password123"
    }));

    const loginResponse = await request("/login", json({
        email: "TEST@example.com",
        password: "password123"
    }));
    const loginBody = await loginResponse.json();

    assert.equal(loginResponse.status, 200);
    assert.ok(loginBody.data.token);
    assert.equal(loginBody.data.user.email, "test@example.com");
    assert.equal("password" in loginBody.data.user, false);

    const meResponse = await request("/me", {
        headers: { Authorization: `Bearer ${loginBody.data.token}` }
    });
    const meBody = await meResponse.json();

    assert.equal(meResponse.status, 200);
    assert.equal(meBody.data.email, "test@example.com");
});

test("login validates required fields and rejects incorrect credentials", async () => {
    await request("/register", json({
        name: "Test User",
        email: "test@example.com",
        password: "password123"
    }));

    const missingFields = await request("/login", json({ email: "", password: "" }));
    assert.equal(missingFields.status, 422);

    const response = await request("/login", json({
        email: "test@example.com",
        password: "wrong-password"
    }));

    assert.equal(response.status, 401);
});

test("/me rejects missing, malformed, and invalid bearer tokens", async () => {
    const missing = await request("/me");
    const malformed = await request("/me", {
        headers: { Authorization: "Basic abc" }
    });
    const invalid = await request("/me", {
        headers: { Authorization: "Bearer invalid-token" }
    });

    assert.equal(missing.status, 401);
    assert.equal(malformed.status, 401);
    assert.equal(invalid.status, 401);
});
import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import express from "express";
import jwt from "jsonwebtoken";

import { createProductController } from "../controllers/product.controller.js";
import { createProductRouter } from "../routes/product.routes.js";

process.env.JWT_SECRET = "test-only-secret-that-is-long-enough";

const products = new Map();
let nextId = 1;
let server;
let baseUrl;
const token = jwt.sign({ id: 7, role: "student" }, process.env.JWT_SECRET);

const repository = {
    async getAllProducts() {
        return [...products.values()];
    },
    async getProductById(id) {
        return products.get(Number(id));
    },
    async createProduct(productData) {
        const id = nextId++;
        const product = { id, ...productData };
        products.set(id, product);
        return id;
    },
    async updateProduct(id, productData) {
        products.set(Number(id), { ...products.get(Number(id)), ...productData });
        return 1;
    },
    async deleteProduct(id) {
        return Number(products.delete(Number(id)));
    }
};

before(async () => {
    const app = express();
    app.use(express.json());
    app.use("/api/products", createProductRouter(createProductController(repository)));
    server = app.listen(0, "127.0.0.1");
    await new Promise((resolve) => server.once("listening", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}/api/products`;
});

after(async () => {
    await new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
    });
});

beforeEach(() => {
    products.clear();
    nextId = 1;
});

const request = (path, options = {}) => fetch(`${baseUrl}${path}`, options);
const json = (method, body, authenticated = true) => ({
    method,
    headers: {
        "Content-Type": "application/json",
        ...(authenticated ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
});

test("GET /products returns 200 and a product array", async () => {
    const response = await request("/");
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body.data, []);
});

test("POST /products without a token returns 401", async () => {
    const response = await request("/", json("POST", { name: "Keyboard", price: 25 }, false));
    assert.equal(response.status, 401);
});

test("authenticated CRUD returns expected statuses and missing product returns 404", async () => {
    const createdResponse = await request("/", json("POST", {
        name: "Keyboard",
        description: "Mechanical keyboard",
        price: 75.5,
        stock: 4
    }));
    const createdBody = await createdResponse.json();
    const productId = createdBody.data.id;

    assert.equal(createdResponse.status, 201);
    assert.equal(createdBody.data.created_by, 7);

    const listed = await request("/");
    assert.equal(listed.status, 200);
    assert.equal((await listed.json()).data.length, 1);

    const fetched = await request(`/${productId}`);
    assert.equal(fetched.status, 200);

    const updated = await request(`/${productId}`, json("PATCH", { price: 80 }));
    assert.equal(updated.status, 200);
    assert.equal((await updated.json()).data.price, 80);

    const replaced = await request(`/${productId}`, json("PUT", {
        name: "Updated Keyboard",
        description: "Updated description",
        price: 90,
        stock: 2
    }));
    assert.equal(replaced.status, 200);

    const deleted = await request(`/${productId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    assert.equal(deleted.status, 200);
    assert.equal((await request(`/${productId}`)).status, 404);
    assert.equal((await request("/99999")).status, 404);
});

test("product create and patch return 422 for invalid input", async () => {
    const invalidCreate = await request("/", json("POST", { name: " ", price: -1 }));
    assert.equal(invalidCreate.status, 422);

    const emptyBody = await request("/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
    });
    assert.equal(emptyBody.status, 422);

    const emptyPrice = await request("/", json("POST", { name: "Mouse", price: "" }));
    assert.equal(emptyPrice.status, 422);

    const created = await request("/", json("POST", { name: "Mouse", price: 10 }));
    const productId = (await created.json()).data.id;
    const invalidPatch = await request(`/${productId}`, json("PATCH", { stock: -1 }));
    assert.equal(invalidPatch.status, 422);
});

test("protected update and delete return 401 without a token", async () => {
    await request("/", json("POST", { name: "Mouse", price: 10 }));
    const update = await request("/1", json("PATCH", { price: 12 }, false));
    const remove = await request("/1", { method: "DELETE" });

    assert.equal(update.status, 401);
    assert.equal(remove.status, 401);
});
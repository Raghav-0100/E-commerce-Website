import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";

console.log("Category Routes Imported:", categoryRoutes);

import productRoutes from "./routes/productRoutes.js";
import { connectRedis } from "./config/redisClient.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

connectDB();
//connectRedis();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://e-commerce-website-6kq2.onrender.com",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

console.log("Auth Routes Loaded");
console.log("Category Routes Loaded");
console.log("Product Routes Loaded");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

// app.get("/", (req, res) => {
//   res.send("<h1>Welcome to Parking System</h1>");
// });

app.get("/", (req, res) => {
  res.send("Backend Version 2");
});

app.get("/hello", (req, res) => {
  res.send("Hello");
});

const PORT = process.env.PORT || 8080;
const MODE = process.env.NODE_ENV || "development";

app.listen(PORT, () => {
  console.log(`Server running in ${MODE} mode on port ${PORT}`.bgCyan.white);
});


/// without redis 


// --- GET /product/get-product ---
//   Requests completed: 100
//   Avg latency:        172.17 ms
//   p99 latency:        790 ms
//   Errors:             0

// --- GET /product/product-list/1 ---
//   Requests completed: 100
//   Avg latency:        46.37 ms
//   p99 latency:        140 ms
//   Errors:             0

// --- GET /category/get-category ---
//   Requests completed: 100
//   Avg latency:        29.15 ms
//   p99 latency:        39 ms
//   Errors:             0



// with redis 

// C:\Main web-dev projects\E-commerce App> redis-^C            
// PS C:\Main web-dev projects\E-commerce App> npm run benchmark

// > e-commerce-app@1.0.0 benchmark
// > node benchmark.js

// Benchmarking against http://localhost:8080 — 100 requests per endpoint

// --- GET /product/get-product ---
//   Requests completed: 100
//   Avg latency:        16.95 ms
//   p99 latency:        178 ms
//   Errors:             0

// --- GET /product/product-list/1 ---
//   Requests completed: 100
//   Avg latency:        7.2 ms
//   p99 latency:        16 ms
//   Errors:             0

// --- GET /category/get-category ---
//   Requests completed: 100
//   Avg latency:        5.29 ms
//   p99 latency:        14 ms
//   Errors:             0

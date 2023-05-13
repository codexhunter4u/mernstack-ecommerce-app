import express from "express";
import color from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import connetDB from "./Config/db.js";
import authRoutes from "./Router/AuthRoutes.js";
import orderRoutes from "./Router/OrderRoutes.js";
import categoryRoutes from "./Router/CategoryRoutes.js";
import productRoutes from "./Router/ProductRoutes.js";

// Config env file
dotenv.config();

// database config
connetDB();

//esmodule fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rest Object
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// build folder path
app.use(express.static(path.join(__dirname, "./client/build")));

// PORT
const PORT = process.env.PORT || 8000;

// All Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/category", categoryRoutes);

// Rest API Routes
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// App listen
app.listen(PORT, () => {
  console.log(
    `Server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});

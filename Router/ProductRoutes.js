import express from "express";
import {
  create,
  update,
  remove,
  getAll,
  getSingle,
  productPhoto,
  filters,
  count,
  list,
  searchProduct,
  similarProduct,
  productCategory,
} from "../Controller/ProductController.js";
import formidable from "express-formidable";
import { isAdmin, requireSignIn } from "../Middleware/AuthMiddleware.js";

const router = express.Router();

// Create Product [POST]
router.post("/create", requireSignIn, isAdmin, formidable(), create);

// Update Product [PUT]
router.put("/update/:pid", requireSignIn, isAdmin, formidable(), update);

// Get All Product [GET]
router.get("/all", getAll);

// Update Product [GET]
router.get("/single/:slug", getSingle);

// Get Product Photo [GET]
router.get("/photo/:pid", productPhoto);

// Delete product
router.delete("/delete/:pid", remove);

// Filter product
router.post("/product-filters", filters);

// Product count
router.get("/product-count", count);

// Product per page
router.get("/product-list/:page", list);

// Search product
router.get("/search/:keyword", searchProduct);

// Similar product
router.get("/related-product/:pid/:cid", similarProduct);

// Category wise product
router.get("/product-category/:slug", productCategory);

export default router;

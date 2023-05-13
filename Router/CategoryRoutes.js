import express from "express";
import { isAdmin, requireSignIn } from "../Middleware/AuthMiddleware.js";
import {
  single,
  create,
  update,
  remove,
  getAll,
} from "../Controller/CategoryController.js";

const router = express.Router();

// Routes[POST]
router.post("/create", requireSignIn, isAdmin, create);

//Update category[PUT]
router.put("/update/:id", requireSignIn, isAdmin, update);

//Get all category[GET]
router.get("/all", getAll);

//single category
router.get("/single/:slug", single);

//Delete category
router.delete("/delete/:id", requireSignIn, isAdmin, remove);

export default router;

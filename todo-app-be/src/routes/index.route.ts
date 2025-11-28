import { Router } from "express";
import authRouter from "./auth.route.js";
import todoRouter from "./todo.route.js";
import { protect } from "../milddlewares/auth.middleware.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/todos", protect, todoRouter);

export default router;

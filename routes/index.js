import { Router } from "express";
// Import all of the api routes
import apiRoutes from "./api/index.js";

const router = Router();

// add prefix of '/api' to all of the api routes imported from the '/api' directory.
router.use("/api", apiRoutes);

export default router;
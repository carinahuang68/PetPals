import express from 'express';
import { addNewPal, deletePal, getAPal, getPals, updatePal } from './pal.function.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get("/", protect, getPals);
router.get("/:id", protect, getAPal);
router.post("/", protect, addNewPal);
router.delete("/:id", protect, deletePal);
router.put("/:id", protect, updatePal);

export default router;
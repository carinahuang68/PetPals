import express from 'express';
import { addNewPal, deletePal, getAPal, getPals, updatePal } from './pal.function.js';
// import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get("/", getPals);
router.get("/:id", getAPal);
router.post("/", addNewPal);
router.delete("/:id", deletePal);
router.put("/:id", updatePal);

export default router;
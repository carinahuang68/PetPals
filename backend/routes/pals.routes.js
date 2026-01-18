import express from 'express';
import { addNewPal, deletePal, getAPal, getPals, getPals, updatePal } from './pals.function.js';
// import { protect } from '../middleware/auth.js';

router.get("/", protect, getPals);
router.get("/", protect, getAPal);
router.post("/", protect, addNewPal);
router.delete("/", protect, deletePal);
router.put("/", protect, updatePal);
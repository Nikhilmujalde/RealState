import express from "express";
import { createListing, deletListing, editListing } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifiedUser.js";

const router = express.Router()


router.post('/create',verifyToken,createListing)
router.delete('/delete/:id',verifyToken,deletListing)
router.post('/edit/:id',verifyToken,editListing)

export default router;
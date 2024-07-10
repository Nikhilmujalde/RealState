import express from "express";
import { createListing, deletListing, editListing, getListing } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifiedUser.js";

const router = express.Router()


router.post('/create',verifyToken,createListing)
router.delete('/delete/:id',verifyToken,deletListing)
router.put('/edit/:id',verifyToken,editListing)
// we don't need to verify the user here because everybody will be able to see the listing
router.get('/getListing/:id',getListing)

export default router;
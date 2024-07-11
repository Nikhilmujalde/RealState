import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js"
import mongoose from "mongoose"
export const createListing=async(req,res,next)=>{
    try {
        const listing = await Listing.create(req.body)
        return res.status(201).json(listing)
    } catch (error) {
        next(error)
    }
}

export const deletListing=async(req,res,next)=>{
    if (!mongoose.isValidObjectId(req.params.id)) {
        return next(errorHandler(404, 'Listing not found'))
    }
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(404,'Listing not found'))
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401,'You can only delete your own listing'))
    }

    try {
        await Listing.findByIdAndDelete(req.params.id)
        return res.status(200).json('Listing has been deleted')
    } catch (error) {
        next(error)
    }
}

export const editListing=async(req,res,next)=>{
    if (!mongoose.isValidObjectId(req.params.id)) {
        return next(errorHandler(404, 'Listing not found'))
    }
    const listing = await Listing.findById(req.params.id)
    if(!listing){
        return next(errorHandler(404,'Listing not found'))
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401,'You can only update your own listing'))
    }
    try {
        const editListing = await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true})
        return res.status(200).json(editListing)
    } catch (error) {
        next(error)
    }
}


export const getListing=async(req,res,next)=>{
    try {
        const listing = await Listing.findById(req.params.id)
        if(!listing){
            return next(errorHandler(404,'Listing not found'))
        }
        res.status(200).json(listing)
    } catch (error) {
        next(error)
    }
}

export const getListings=async(req,res,next)=>{
    try {
        // now what we are doing here is lets say our url is api/listing/get?limit=2
        // so we will get limit as 2 say just rent and furnished or if it is not given then 9
        const limit = parseInt(req.query.limit) || 9
        const startIndex = parseInt(req.query.startIndex) || 0
        let offer = req.query.offer
        if(offer === undefined || offer === 'false'){
            offer = {$in:[false,true]}
        }

        // what is furnished we are checking req and in it we are checking what is the value of furnished 
        let furnished = req.query.furnished
        if(furnished === undefined || offer === 'false'){
            furnished = {$in:[false,true]}
        }
        let parking = req.query.parking
        if(parking === undefined || parking === 'false'){
            parking = {$in:[false,true]}
        }

        let type = req.query.type

        if(type === undefined || type === 'all'){
            type = {$in:['sale','rent']}
        }

        const searchTerm = req.query.searchTerm || ''
        const sort = req.query.sort || 'createdAt'
        const order = req.query.order || 'desc'

        // here options i means dont care about uppercase and lowercase
        const listings = await Listing.find({
            name:{$regex:searchTerm, $options: 'i'},
            offer,
            furnished,
            parking,
            type,
        }).sort(
            {[sort]:order}
        ).limit(limit).skip(startIndex)

        return res.status(200).json(listings)

    } catch (error) {
        next(error)
    }
}
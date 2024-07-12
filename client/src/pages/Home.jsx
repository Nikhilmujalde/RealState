import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import 'swiper/swiper-bundle.css'
import { Navigation } from 'swiper/modules'
import Listingitem from '../components/Listingitem'
const Home = () => {
  SwiperCore.use([Navigation])
  const [offerListings, setofferListings] = useState([])
  const [saleListings, setsaleListings] = useState([])
  const [rentListings, setrentListings] = useState([])
  console.log(saleListings)
  useEffect(() => {
    const fetchOfferListing = async()=>{
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit4`)
        const data = await res.json()
        setofferListings(data)
        fetchRentListings()
      } catch (error) {
        console.log(error)
      }
    }
    const fetchRentListings=async()=>{
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit4`)
        const data = await res.json()
        setrentListings(data)
        fetchSaleListing()
      } catch (error) {
        console.log(error)
      }
    }
    const fetchSaleListing=async()=>{
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit4`)
        const data = await res.json()
        setsaleListings(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchOfferListing()
  }, [])
  
  return (
    <div>
      {
        <div className="flex flex-col gap-6 p-28 max-w-6xl mx-auto">
          <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Simplify your <span className='text-slate-500'>search</span> <br /> for the perfect home.
          </h1>
          <div className="text-gray-400 text-xs sm:text-sm">
          "MiraiDwell is your go-to destination for finding your next home. With a diverse array of <br /> properties to choose from, ranging from cozy apartments to spacious houses, we cater <br /> to all your housing needs. Start your search with MiraiDwell and discover the perfect place to live."
          </div>
          <Link className='text-xs sm:text-sm hover:underline text-blue-800' to={'/search'}>Lets get started</Link>
        </div>
      }
      {
        <Swiper navigation>
          
         { offerListings && offerListings.length > 0  && offerListings.map((listing)=>(
            <SwiperSlide key={listing._id}>
              <div className="h-[500px]"  style={{background:`url(${listing.imageUrls[0]}) center no-repeat` ,backgroundSize:'cover'} }></div>
            </SwiperSlide>
          ))}
          </Swiper>
      }
      {
        <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
          {
            offerListings && offerListings.length > 0 && (
              <div>
                <div className='my-3'>
                  <h2 className='text-2xl font-semibold text-slate-700'>Recent Offers</h2>
                  <Link className='text-sm text-blue-800 hover:underline my-3' to={'/search?offer=true'}>
                    View all
                  </Link>
                </div>
                <div className='flex flex-wrap gap-4'>
                  {
                    offerListings.map((listing)=>(
                      <Listingitem key={listing._id} listing={listing}/>
                    ))
                  }
                </div>
              </div>
            )
          }
          {
            rentListings && rentListings.length > 0 && (
              <div>
                <div className='my-3'>
                  <h2 className='text-2xl font-semibold text-slate-700'>Recent places for rent</h2>
                  <Link className='text-sm text-blue-800 hover:underline my-3' to={'/search?type=rent'}>
                    View all
                  </Link>
                </div>
                <div className='flex flex-wrap gap-4'>
                  {
                    rentListings.map((listing)=>(
                      <Listingitem key={listing._id} listing={listing}/>
                    ))
                  }
                </div>
              </div>
            )
          }
          {
            saleListings && saleListings.length > 0 && (
              <div>
                <div className='my-3'>
                  <h2 className='text-2xl font-semibold text-slate-700'>Recent places for sale</h2>
                  <Link className='text-sm text-blue-800 hover:underline my-3' to={'/search?type=sale'}>
                    View all
                  </Link>
                </div>
                <div className='flex flex-wrap gap-4'>
                  {
                    saleListings.map((listing)=>(
                      <Listingitem key={listing._id} listing={listing}/>
                    ))
                  }
                </div>
              </div>
            )
          }
        </div>

      }
    </div>
  )
}

export default Home

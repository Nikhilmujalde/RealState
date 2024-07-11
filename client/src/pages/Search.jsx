import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Listingitem from '../components/Listingitem.jsx'
const Search = () => {
    const navigate = useNavigate()
    const [setsidebardata, setsetsidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',

    })
    const [loading, setloading] = useState(false)
    const [listings, setlistings] = useState([])
    const [showMore, setshowMore] = useState(false)
    console.log(listings)
    useEffect(() => {

        // we are doing this so that when se change on search bar we the changes in the left side of the div
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const typefromUrl = urlParams.get('type')
        const parkingFromUrl = urlParams.get('parking')
        const furnishedFromUrl = urlParams.get('furnished')
        const offerFromUrl = urlParams.get('offer')
        const sortFromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')

        if (
            searchTermFromUrl || typefromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl
        ) {
            setsetsidebardata({
                searchTerm: searchTermFromUrl || '',
                type: typefromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc'
            })
        }

        const fetchListings = async () => {
            setloading(true)
            const searchQuery = urlParams.toString()
            const res = await fetch(`/api/listing/get?${searchQuery}`)
            const data = await res.json()
            if(data.length > 8){
                setshowMore(true)
            }


            setlistings(data)
            setloading(false)
        }
        setloading(false)
        fetchListings()
    }, [location.search])


    // console.log(setsidebardata)
    const handleChange = (e) => {
        // here why we are keeping the previous sidebar data because we are checking all the conditions one by one and adding it on the basis of all the checks but we have also have to keep track of the previous condition 
        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setsetsidebardata({ ...setsidebardata, type: e.target.id })
        }

        if (e.target.id === 'searchTerm') {
            setsetsidebardata({ ...setsidebardata, searchTerm: e.target.value })
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            // we are doing this because we can get the data from the url also where we have put it as a string so we will have to check for both the condition
            setsetsidebardata({ ...setsidebardata, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false })
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at'

            const order = e.target.value.split('_')[1] || 'desc'

            setsetsidebardata({ ...setsidebardata, sort, order })
        }
    }

    const handleSubmit = (e) => {
        // we are changing the part of the url only when they are changed otherwise we will not change them if we dont do these than when next time we submit the form it will search based on the previous filters
        e.preventDefault();
        const urlParams = new URLSearchParams();
    
        if (setsidebardata.searchTerm) {
            urlParams.set('searchTerm', setsidebardata.searchTerm);
        }
        if (setsidebardata.type !== 'all') {
            urlParams.set('type', setsidebardata.type);
        }
        if (setsidebardata.parking) {
            urlParams.set('parking', setsidebardata.parking);
        }
        if (setsidebardata.furnished) {
            urlParams.set('furnished', setsidebardata.furnished);
        }
        if (setsidebardata.offer) {
            urlParams.set('offer', setsidebardata.offer);
        }
        if (setsidebardata.sort !== 'created_at' || setsidebardata.order !== 'desc') {
            urlParams.set('sort', setsidebardata.sort);
            urlParams.set('order', setsidebardata.order);
        }
    
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };
    
    const onShowMoreClick=async()=>{
        // we will fetch the data after teh listings that we are already seeing
        const numberOfListings = listings.length
        const startIndex = numberOfListings
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('startIndex',startIndex)
        const searchQuery = urlParams.toString()
        const res = await fetch(`/api/listing/get?${searchQuery}`)
        const data = await res.json()
        if(data.length < 9){
            setshowMore(false)

        }
        setlistings([...listings,...data])  
    }
    return (
        <div className='flex flex-col md:flex-row'>
            <div className="left p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className="flex items-center gap-2">
                        <label className='whitespace-nowrap font-semibold'>
                            Search Term
                        </label>
                        <input type="text" id='searchTerm' value={setsidebardata.searchTerm} onChange={handleChange} placeholder='Search...' className='border rounded-lg p-3 w-full' />
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <label className='font-semibold'>Type:</label>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={setsidebardata.type === 'all'} type="checkbox" id='all' className='w-5' />
                            <span>Rent & Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={setsidebardata.type === 'rent'} type="checkbox" id='rent' className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={setsidebardata.type === 'sale'} type="checkbox" id='sale' className='w-5' />
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={setsidebardata.offer} type="checkbox" id='offer' className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <label className='font-semibold'>Ameneties:</label>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={setsidebardata.parking} type="checkbox" id='parking' className='w-5' />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='furnished' onChange={handleChange} checked={setsidebardata.furnished} className='w-5' />
                            <span>Furnished</span>
                        </div>

                    </div>
                    <div className="flex items-center gap-2">
                        <label className='font-semibold'>
                            Sort
                        </label>
                        <select onChange={handleChange} defaultValue={`created_at_desc`} name="" id="sort_order" className='border rounded-lg p-3'>
                            <option value="regularPrice_desc">Price high to low</option>
                            <option value="regularPrice_asc">Price low to high</option>
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option>
                        </select>

                    </div>
                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90'>Search</button>
                </form>
            </div>
            <div className="right flex-1">
                <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results</h1>
                <div className="p-7 flex flex-wrap gap-4 ">
                    {!loading && listings.length === 0 && (
                        <p className='text-xl text-slate-700 text-center'>No listing found</p>
                    )}
                    {loading && (
                        <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
                    )}
                    {!loading && listings && listings.map((listing) => (
                        <Listingitem key={listing._id} listing={listing} />
                    ))}
                    {showMore &&
                    (
                        <button className='text-green-700 hover:underline p-7 text-center w-full' onClick={()=>onShowMoreClick()}>Show More</button>
                    )
                    }
                </div>
            </div>
        </div>
    )
}

export default Search

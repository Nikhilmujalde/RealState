import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { app } from '../firebase'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
const UpdateListing = () => {
    const navigate = useNavigate()
    const [files, setfiles] = useState([])
    const [formData, setformData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 1000,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    })
    const params = useParams()
    const { currentUser } = useSelector((state) => state.user)
    const [imageUploadError, setimageUploadError] = useState(false)
    const [uploading, setuploading] = useState(false)
    const [loading, setloading] = useState(false)
    const [error, seterror] = useState(false)
    // console.log(files)
    // console.log(formData)
    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId
            // console.log(ListingId)
            try {
                const res = await fetch(`/api/listing/getListing/${listingId}`)
                if (!res.ok) {
                    throw new Error('Failed to fetch listing')
                }
                const data = await res.json()
                setformData(data)
            } catch (error) {
                console.error('Error fetching listing:', error)
                seterror('Failed to fetch listing')
            }
            // setformData(data)
        }

        fetchListing()
    }, [])

    const handleImageSubmit = async (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setuploading(true)
            setimageUploadError(false)
            const promises = []
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))
            }
            Promise.all(promises).then((urls) => {
                setformData({
                    ...formData, imageUrls: formData.imageUrls.concat(urls),
                })
                setimageUploadError(false)
                setuploading(false)
            }).catch((error) => {
                setuploading(false)
                setimageUploadError('2mb max per image')
            })
            // now we want to keep the previous form data so that it can be saved and then viewed by others
        }
        else {
            setimageUploadError('You can only upload only 6 images per listing')
            setuploading(false)
        }
        // setuploading(false)
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    // console.log('Upload is ' + progress + "%done");
                    console.log(Math.round(progress))
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadUrl) => {
                            resolve(downloadUrl)
                        }
                    )
                },
            );
        })
    }
    const handleImageDelete = (index) => {
        setformData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
    }

    const handleChange = (e) => {
        // doing this so we can only choose one rent or sale
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setformData({
                ...formData,
                type: e.target.id
            })
        }
        // now setting for parking furnished and offer
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setformData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }

        // now for the remaining parts
        if (e.target.type === 'text' || e.target.type === 'number' || e.target.type === 'textarea') {
            setformData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (formData.imageUrls.length < 1) return seterror('You must upload at least one image')
            if (+formData.regularPrice < +formData.discountPrice) return seterror('Discount cannot be greater than regular Price')
            setloading(true)
            seterror(false)

            const res = await fetch(`/api/listing/edit/${params.listingId}`, {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                })
            })

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to update listing: ${res.status} - ${errorText}`);
            }

            const data = await res.json()
            setloading(false)

            if (data.success === false) {
                seterror(data.message)
            }

            navigate(`/listing/${data._id}`)
        } catch (error) {
            seterror(error.message)
            setloading(false)
        }
    }

    return (
        <div className='p-3 max-w-4xl mx-auto'>
            <h1 className='font-semibold text-center text-3xl my-7'>Update  Listing</h1>
            <form onSubmit={handleSubmit} action="" className='flex flex-col sm:flex-row gap-4'>
                <div className="flex flex-col gap-4 flex-1">
                    <input type="text" onChange={handleChange} value={formData.name} placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required />
                    <input type="text" onChange={handleChange} value={formData.description} placeholder='Description' className='border p-3 rounded-lg' id='description' required />
                    <input type="text" placeholder='Address' onChange={handleChange} value={formData.address} className='border p-3 rounded-lg' id='address' required />
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" id='sale' onChange={handleChange} checked={formData.type === 'sale'} className='w-5' />
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='rent' onChange={handleChange} checked={formData.type === 'rent'} className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='parking' onChange={handleChange} checked={formData.parking === true} className='w-5' />
                            <span>Parking Spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='furnished' onChange={handleChange} checked={formData.furnished === true} className='w-5' />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='offer' onChange={handleChange} checked={formData.offer === true} className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input type="number" id='bedrooms' min={1} onChange={handleChange} value={formData.bedrooms} max={100} required className='p-3 border border-gray-400 rounded-lg' />
                            <span>Beds</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id='bathrooms' min={1} max={100} onChange={handleChange} value={formData.bathrooms} required className='p-3 border border-gray-400 rounded-lg' />
                            <span>Bathrooms</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id='regularPrice' min={1000} max={100000000} required onChange={handleChange} value={formData.regularPrice} className='p-3 border border-gray-400 rounded-lg' />
                            <div className="flex flex-col items-center">
                                <span>Regular Price</span>
                                {formData.type === 'rent' && (
                                    <span className='text-xs'>(Rs / month)</span>
                                )}
                            </div>
                        </div>
                        {formData.offer &&
                            <div className="flex items-center gap-2">
                                <input type="number" id='discountPrice' min={0} max={100000000} onChange={handleChange} value={formData.discountPrice} required className='p-3 border border-gray-400 rounded-lg' />
                                <div className="flex flex-col items-center">
                                    <span>Discounted Price</span>
                                    {formData.type === 'rent' && (
                                        <span className='text-xs'>(Rs / month)</span>
                                    )}
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    <p className='font-semibold'>Images:
                        <span className='font-normal text-gray-600 ml-2'>The first image will be cover</span>
                    </p>
                    <div className="flex gap-4">
                        <input onChange={(e) => setfiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
                        <button type='button' disabled={uploading} onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-90'>{uploading ? 'Uploading...' : 'Upload'}</button>
                    </div>
                    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div key={url} className="flex justify-between p-3 border items-center">
                                <img src={url} alt="listing image" className='w-20 h-29 object-contain rounded-lg' />
                                <button type='button' onClick={() => handleImageDelete(index)} className='p-3 rounded-lg uppercase hover:opacity-90 text-red-700'>Delete</button>
                            </div>

                        ))
                    }
                    <button disabled={loading || uploading} className='p-3 mt-4 bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-80'>{loading ? 'Updating...' : 'Update Listing'}</button>
                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div>

            </form>
        </div>
    )
}

export default UpdateListing

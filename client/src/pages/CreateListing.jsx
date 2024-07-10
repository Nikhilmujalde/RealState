import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import React from 'react'
import { useState } from 'react'
import { app } from '../firebase'
const CreateListing = () => {
    const [files, setfiles] = useState({})
    const [formData, setformData] = useState({
        imageUrls:[],
    })
    const [imageUploadError, setimageUploadError] = useState(false)
    const [uploading, setuploading] = useState(false)
    // console.log(files)
    console.log(formData)
    const handleImageSubmit=async(e)=>{
        if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            setuploading(true)
            setimageUploadError(false)
            const promises = []
            for(let i = 0;i<files.length;i++){
                promises.push(storeImage(files[i]))
            }
            Promise.all(promises).then((urls)=>{
                setformData({...formData,imageUrls:formData.imageUrls.concat(urls),
                })
                setimageUploadError(false)
                setuploading(false)
            }).catch((error)=>{
                setuploading(false)
                setimageUploadError('2mb max per image')
            })
            // now we want to keep the previous form data so that it can be saved and then viewed by others
        }
        else{
            setimageUploadError('You can only upload only 6 images per listing')
            setuploading(false)
        }
        // setuploading(false)
    }

    const storeImage=async(file)=>{
        return new Promise((resolve,reject)=>{
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage,fileName)
            const uploadTask = uploadBytesResumable(storageRef,file)
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
    const handleImageDelete=(index)=>{
        setformData({
            ...formData,
            imageUrls:formData.imageUrls.filter((_,i)=> i !== index)
        })
    }
    return (
        <div className='p-3 max-w-4xl mx-auto'>
            <h1 className='font-semibold text-center text-3xl my-7'>Create a Listing</h1>
            <form action="" className='flex flex-col sm:flex-row gap-4'>
                <div className="flex flex-col gap-4 flex-1">
                    <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required />
                    <input type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' required />
                    <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='name' required />
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" id='sale' className='w-5' />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='rent' className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='parking' className='w-5' />
                            <span>Parking Spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='furnished' className='w-5' />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='offer' className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input type="number" id='beds' min={1} max={10} required className='p-3 border border-gray-400 rounded-lg' />
                            <span>Beds</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id='bathroom' min={1} max={10} required className='p-3 border border-gray-400 rounded-lg' />
                            <span>Bathrooms</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id='regular' min={1} max={10} required className='p-3 border border-gray-400 rounded-lg' />
                            <div className="flex flex-col items-center">
                                <span>Regular Price</span>
                                <span className='text-xs'>(Rs / month)</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id='discounted' min={1} max={10} required className='p-3 border border-gray-400 rounded-lg' />
                            <div className="flex flex-col items-center">
                                <span>Discounted Price</span>
                                <span className='text-xs'>(Rs / month)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    <p className='font-semibold'>Images:
                        <span className='font-normal text-gray-600 ml-2'>The first image will be cover</span>
                    </p>
                    <div className="flex gap-4">
                        <input onChange={(e)=>setfiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
                        <button type='button' disabled={uploading} onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-90'>{uploading?'Uploading...':'Upload'}</button>
                    </div>
                        <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                        {
                            formData.imageUrls.length > 0 && formData.imageUrls.map((url,index)=>(
                                <div key={url} className="flex justify-between p-3 border items-center">
                                    <img src={url} alt="listing image" className='w-20 h-29 object-contain rounded-lg' />
                                    <button type='button' onClick={()=>handleImageDelete(index)} className='p-3 rounded-lg uppercase hover:opacity-90 text-red-700'>Delete</button>
                                </div>
                                
                            ))
                        }
                    <button className='p-3 mt-4 bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-80'>Create Listing</button>
                </div>
               
            </form>
        </div>
    )
}

export default CreateListing

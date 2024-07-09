import React, { useState,useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
const Profile = () => {
  const {currentUser} = useSelector((state=>state.user))
  const fileRef = useRef(null)
  const [file, setfile] = useState(undefined)
  const [filePer, setfilePer] = useState(0)
  const [fileError, setfileError] = useState(false)
  const [formData, setformData] = useState({})
  // console.log(filePer)
  // console.log(file)
  // console.log(formData)
  // console.log(fileError)
  const handleFileUpload=(file)=>{
    const storage = getStorage(app)
    // we will create a unique file name so that when the user changes it profile it does not give an error
    const fileName = new Date().getTime()+file.name
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef,file)
    uploadTask.on('state_changed',
      (snapshot)=>{
        const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100
        // console.log('Upload is ' + progress + "%done");
        setfilePer(Math.round(progress))
      },
      (error)=>{
        setfileError(true)
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadUrl)=>{
            setformData({...formData,avatar:downloadUrl})
          }
        )
      },
    );
  }
  useEffect(() => {
    if(file){
      handleFileUpload(file)
      
    }
  }, [file])
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col ' action="">
        <input onChange={(e)=>setfile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*'/>
          <img onClick={()=>fileRef.current.click()} className='rounded-full w-24 self-center mt-2 h-24 object-cover cursor-pointer' src={ formData.avatar || currentUser.avatar} alt="profile" />
        <p className='text-sm self-center'>
          {fileError ?
          (<span className='text-red-700'>Error Image Upload (Image should be less than 2 mb)</span>):
          filePer > 0 && filePer < 100 ? 
          <span className='text-slate-700'>{`Uploading ${filePer}%`}</span>:
          filePer === 100 ?
          <span className='text-green-700'>Image Successfully uploaded</span>:""
        }
        </p>
        <input type="text" placeholder='username' id='username' className='border p-3 rounded-lg my-2' />
        <input type="email" placeholder='email' id='email' className='border p-3 rounded-lg my-2' />
        <input type="password" placeholder='password' id='password' className='border p-3 my-2 rounded-lg' />
        <button className='bg-gray-600 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70'>update </button>
      </form>
      <div className='flex justify-between mt-3'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}

export default Profile

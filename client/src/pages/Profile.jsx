import React from 'react'
import { useSelector } from 'react-redux'
const Profile = () => {
  const {currentUser} = useSelector((state=>state.user))
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col ' action="">
        <img className='rounded-full w-24 self-center mt-2 h-24 object-cover cursor-pointer' src={currentUser.avatar} alt="profile" />
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

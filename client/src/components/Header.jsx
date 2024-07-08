import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
const Header = () => {
    return (
        <header className='bg-gray-300 shadow-md'>
            <div className="flex justify-between items-center mx-auto max-w-6xl p-3">
                <Link to={'/'}>
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                    <span className='text-gray-500'>Real</span>
                    <span className='text-gray-900'>State</span>
                </h1>
                </Link>
                <form action="" className='bg-gray-100 p-3 justify-between rounded-xl flex items-center w-24 sm:w-64'>
                    <input type="text" placeholder='Search...' className='bg-transparent focus:outline-none' />
                    <FaSearch className='text-gray-600'/>
                </form>
                <ul className='flex gap-4'>
                    <Link to={'/home'}>
                    <li className='hidden sm:inline text-gray-700 hover:underline'>Home</li>
                    </Link>
                    <Link to={'/about'}>
                    <li className='hidden sm:inline text-gray-700 hover:underline'>About</li>
                    </Link>
                    <Link to={'/sing-in'}>
                    <li className='  text-gray-700 hover:underline'>Sign in</li>
                    </Link>
                </ul>
            </div>
        </header>
    )
}

export default Header

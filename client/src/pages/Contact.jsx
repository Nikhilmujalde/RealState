import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Contact = ({ listing }) => {
    const [landlord, setlandlord] = useState(null)
    const [message, setmessage] = useState("")
    useEffect(() => {
        const fetchLandLord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`)
                const data = await res.json()
                setlandlord(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchLandLord()
    }, [listing.userRef])
    const handleChange = (e) => {
        setmessage(e.target.value)
    }
    const handleSendMessage = () => {
        window.location.href = `mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`
    }
    const handleCopyEmail = () => {
        if (landlord?.email) {
            navigator.clipboard.writeText(landlord.email).then(() => {
                toast.success('Email copied', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    });
                // alert('Email copied to clipboard!')
            }).catch(err => {
                console.error('Failed to copy email: ', err)
            })
        }
    }

    return (
        <>
            <ToastContainer/>
            {landlord && (
                <div>
                    <p>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
                    <div className='mt-3'>Click below to copy</div>
                    <button
                        className='bg-slate-600 text-white text-center p-3  rounded-lg hover:opacity-90 mt-3 block'
                        onClick={handleCopyEmail}
                    >
                        {landlord.email}
                    </button>
                     
                </div>

            )}
        </>
    )
}

export default Contact

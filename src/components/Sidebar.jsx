import React from 'react'
import { FiLogOut } from "react-icons/fi";
import { BiCompass, BiMessageRoundedDetail, BiSearch } from 'react-icons/bi'
import { CgProfile } from 'react-icons/cg'
import { FaRegHeart } from 'react-icons/fa'
import { HiHome } from 'react-icons/hi'
import { IoPaperPlane } from 'react-icons/io5'
import { MdOutlineAddBox, MdSlowMotionVideo } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const Sidebar = (props) => {
    const navigate = useNavigate();

    const Logout = async () => {
        try {
            // Send request to server to clear the cookie
            const response = await fetch(`${import.meta.env.VITE_SERVER}/logout`, {
                method: 'POST',
                credentials: 'include' // Include cookies in the request
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Optionally, log the response data
            const result = await response.json();
            console.log(result.message);
            // Navigate to the login page or other actions
            setTimeout(() => {
                navigate('/login'); // Redirect to login page
            }, 1000);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };
    return (
        <>
            <div className='static md:absolute md:bottom-0 left-0  h-screen md:h-auto md:w-screen bg-white z-10 border-2 flex md:flex-row flex-col justify-around '>
                <div className="flex lg:hidden gap-4 text-gray-700 p-4">
                    <button onClick={() => {
                        navigate('/')
                    }}>
                        <img className='h-14' src="/images/ig.png" alt="logo" />
                    </button>
                </div>
                <div className="flex gap-4 text-gray-700 py-4 px-6 hover:bg-gray-200 ">
                    <button className='flex gap-4 w-full h-full' onClick={() => {
                        navigate('/')
                    }}>
                        <HiHome size="25" />
                        <h4  className='lg:hidden'>Home</h4>
                    </button>
                </div>
                <div className="flex gap-4 text-gray-700 py-4 px-6 hover:bg-gray-200 ">
                    <button className='flex gap-4 w-full h-full' onClick={() => {
                        navigate('/search')
                    }}>
                        <BiSearch size="25" />
                        <h4  className='lg:hidden'>Search</h4>
                    </button>
                </div>
                
                <div className="flex gap-4 text-gray-700 py-4 px-6 hover:bg-gray-200 ">
                    <FaRegHeart size="25" />
                    <h4  className='lg:hidden'>Notifications</h4>
                </div>
                <div className=" text-gray-700 py-4 px-6 hover:bg-gray-200 ">
                    <button className='flex gap-4 w-full h-full' onClick={() => {
                        navigate('/create')
                    }}>
                        <MdOutlineAddBox size="25" />
                        <h4  className='lg:hidden'>Create</h4>
                    </button>
                </div>
                <div className="flex gap-4 text-gray-700 py-4 px-6 hover:bg-gray-200 ">
                    <button className='flex gap-4 w-full h-full' onClick={() => {
                        navigate(`/profile/${props.username}`)
                    }}>
                        <CgProfile size="25" />
                        <h4  className='lg:hidden'>Profile</h4>
                    </button>
                </div>
                <div className="flex gap-4 text-gray-700 py-4 px-6 hover:bg-gray-200 ">
                    <button className='flex gap-4 w-full h-full' onClick={Logout}>
                        <FiLogOut size="25" />
                        <h4  className='lg:hidden'>Logout</h4>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Sidebar

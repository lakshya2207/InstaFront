import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const SignUp = () => {
  const navigate= useNavigate()
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { username, fullname, email, password };

    // Basic client-side validation
    if (!username || !fullname || !email || !password) {
      toast.error('All fields are required!');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER}/signup`, formData);

      if (response.status === 200) {
        toast.success('Signup successful!');
        setTimeout(() => {
          navigate('/')
        }, 1000);

      } else {
        toast.error('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('User already exists or an error occurred. Please try again.');
    }
  };

  return (
    <div className='absolute w-screen flex items-center justify-center'>
      <div className="items-center justify-center mt-10">
        <div className="border-2 p-8 rounded shadow-sm w-96">
          <img className='m-auto h-20' src="/images/ig.png" alt="INSTAGRAM" />
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 mb-2 text-sm border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-2 mb-2 text-sm border rounded"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full p-2 mb-2 text-sm border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-4 text-sm border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-[#1877F2] text-white w-full py-2 rounded hover:bg-blue-600"
            >
              Sign Up
            </button>
          </form>

          <div className='text-center'>
            <button className='m-auto my-2 text-[#1877F2] font-semibold block'>
              Login with Facebook
            </button>
            <a href="#" className='text-blue-950 text-xs'>
              Forgotten your Password?
            </a>
          </div>
        </div>
        
        <div className="border-2 my-4 p-4 text-center rounded shadow-sm w-96">
          <span>
            Already have an account? <Link to='/Login' className='font-bold text-[#1877F2]'>Login</Link>
          </span>
        </div>

        <p className='m-6 text-center'>Get Instagram</p>
        <div className='flex justify-around'>
          <img className='h-10' src="/images/playstore.png" alt="Play Store" />
          <img className='h-10' src="/images/microsoft.png" alt="Microsoft Store" />
        </div>
      </div>

      {/* Add ToastContainer to render toasts */}
      <ToastContainer />
    </div>
  );
};

export default SignUp;
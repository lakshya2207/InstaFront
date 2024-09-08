import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Convert form data to URL-encoded format
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Set content type to URL-encoded
        },
        body: formData.toString(), // Convert URLSearchParams to a string
        credentials: 'include', // Ensure cookies are sent with the request
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/')
        }, 2000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <div className="login h-screen m-auto w-[90vw] flex items-center justify-evenly">
        <div className="IMG md:hidden relative top-[-20px] mt-10">
          <img className='absolute right-[-60px] top-[14px] border-black shadow-xl border-4 rounded-xl' src="/images/screenshot1.png" alt="" />
          <img className=' border-black border-4 rounded-xl' src="/images/screenshot2.png" alt="" />
        </div>
        <div className=" mt-10">
          <div className="border-2 p-8 rounded shadow-sm w-96">
            <a href="http://www.instagram.com">
              <img className='m-auto h-20' src="/images/ig.png" alt="INSTAGRAM" />
            </a>
            <input  
              type="email"
              name='email'
              placeholder="Phone Number, Username or Email address"
              className="w-full p-2 mb-2 text-sm border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              name='password'
              placeholder="Password"
              className="w-full p-2 mb-4 text-sm border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="bg-[#1877F2] text-white w-full py-2 rounded hover:bg-blue-600"
              onClick={handleLoginSubmit}
            >
              Log In
            </button>
            <div className='text-center'>
              <button className='m-auto my-2 text-[#1877F2] font-semibold block'>Login with Facebook</button>
              <a href="#" className='text-blue-950 text-xs'>Forgotten your Password?</a>
            </div>
          </div>
          <div className="border-2 my-4 p-4 text-center rounded shadow-sm w-96">
            <span>Don't have an account? <Link to='/Signup' className='font-bold text-[#1877F2]'>SignUp</Link></span>
          </div>
          <p className='m-6 text-center'>Get Instagram</p>
          <div className='flex justify-around'>
            <img className='h-10' src="/images/playstore.png" alt="" />
            <img className='h-10' src="/images/microsoft.png" alt="" />
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;

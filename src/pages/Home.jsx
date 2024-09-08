import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from 'axios'; // Import axios
import { ToastContainer, toast } from "react-toastify";

import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Menu from '../components/Menu';


const Home = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['token','userid','currentuser']);
  const [userName, setUserName] = useState('')
  const [userID, setuserID] = useState('')
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies) {
        navigate("/login");
        return; // Early return if no token
      }

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_SERVER}/verify`,
          {},
          { withCredentials: true }
        );

        const { status,id, username ,fullname} = data;
        // console.log(data);
        if (status) {
          setUserName(username);
          setCookie('currentuser',username)
          setCookie('userid',id)
          setuserID(id)
          setFullName(fullname);
          setTimeout(() => {
            
            toast(`Welcome ${username}`, { position: "top-right" });
          }, 1000);
          
        } else {
          removeCookie("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verifying cookie:", error);
        removeCookie("token");
        navigate("/login");
      }
    };

    verifyCookie();
  }, [cookies.token, navigate, removeCookie]);

  

  return (
    <>
      <div className='relative flex justify-between'>
        <Sidebar username={userName} />
        <Feed currentuser={userName}/>
        <Menu username={userName} fullname={fullName} />
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;

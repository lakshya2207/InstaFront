import React, { useEffect, useState } from 'react'
import MenuCard from './MenuCard'
import { useNavigate } from 'react-router-dom'

const Menu = (props) => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/profile')
  }
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

  const [users, setUsers] = useState([]);
  async function getUsers() {
    const url = `${import.meta.env.VITE_SERVER}/allusers`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include' // or 'same-origin' depending on your needs
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      //   console.log(json);
      setUsers(json);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    setTimeout(() => {

      getUsers()
    }, 100);
  }, [])

  return (
    <div className="p-8 h-screen right-0 items-start flex flex-col gap-4 border-2 w-2/6 lg:hidden">

      <MenuCard username={props.username} fullname={props.fullname} />
      <p className='mx-5 font-semibold text-sm text-gray-400'>Suggested for you</p>
      {users ? users.map(user => (

        <MenuCard key={user.username} dp={user.profilePicture} username={user.username} fullname={user.fullname} />
      )) :
        <h1>"Loading..."</h1>
      }
      <button className='p-2 bg-blue-600 rounded-md text-white' onClick={Logout}> Logout</button>
    </div>
  )
}

export default Menu

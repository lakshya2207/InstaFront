import React, { useEffect, useState } from 'react'

import PostCard from './PostCard'
import { useCookies } from 'react-cookie';
import axios from 'axios';

const Feed = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(['token','currentuser']);
  const [posts, setPosts] = useState([]);
  const [savedposts, setSavedposts] = useState([])
  async function getData() {
    const url = `${import.meta.env.VITE_SERVER}/allposts`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include' // or 'same-origin' depending on your needs
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      // console.log(json);
      setPosts(json);
    } catch (error) {
      console.error(error.message);
    }
  }
  const fetchSavedPosts = async (username) => {
    try {
        // Perform the HTTP GET request using axios with the username included in the URL
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/savedpostsidlist/${username}`, {
            withCredentials: true // Include cookies in the request if needed
        });

        // Extract the data from the response
        const data = response.data;

        // Log or return the data
        setSavedposts(data)
        // console.log('Saved posts data:', data);
        return data;

    } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error('There was a problem with the fetch operation:', error);
        return []; // Return an empty array in case of error
    }
};
  useEffect(() => {
    setTimeout(() => {

      getData()
      fetchSavedPosts(cookies.currentuser)
    }, 500);
  }, [])


  return ( 
    <div className='h-screen w-full overflow-y-auto '>

      <div className='m-auto h-full flex flex-col items-center gap-10'>
      {posts ? posts.map(post => {
        // console.log(`Post ID: ${post._id}, Is Saved: ${savedposts.includes(post.id)}`);
        // console.log(savedposts.includes(post._id));
        return (
          <PostCard
            saved={savedposts.includes(post._id)}
            currentuser={props.currentuser}
            key={post._id}
            post={post}
          />
        );
      }) : <h1>Loading...</h1>}
      </div>

    </div>
  )
}

export default Feed

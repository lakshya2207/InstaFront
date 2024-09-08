import React, { useState, useEffect } from 'react';
import { CiBookmark } from "react-icons/ci";
import { IoBookmark } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { toast, ToastContainer } from 'react-toastify';

// Replace with your actual API URLs
const POST_API_URL = `${import.meta.env.VITE_SERVER}/posts`;
const USER_API_URL = `${import.meta.env.VITE_SERVER}`;

const PostCard = (props) => {
  const [likedPosts, setLikedPosts] = useState(props.post.likes);
  const [liked, setLiked] = useState(props.post.likes.includes(props.currentuser));
  const [saved, setSaved] = useState(props.post.saved.includes(props.currentuser));
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  // const [deleted, setDeleted] = useState(false)
  // Update the saved state when props.saved changes
  useEffect(() => {
  }, [saved]);

  // Function to handle like or dislike actions
  const handleLike = async () => {
    const url = liked ? `${POST_API_URL}/dislike` : `${POST_API_URL}/like`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: props.currentuser,
          post_id: props.post._id,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result.message); // Handle success message

      // Update local state for likes
      setLiked(!liked);
      if (liked) {
        setLikedPosts(likedPosts.filter(user => user !== props.currentuser));
      } else {
        setLikedPosts([...likedPosts, props.currentuser]);
      }
    } catch (error) {
      console.error('Error:', error); // Handle error
    }
  };

  // Function to handle save or unsave actions
  const handleSave = async () => {
    const url = saved ? `${USER_API_URL}/unsave` : `${USER_API_URL}/save`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: props.currentuser,
          post_id: props.post._id,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result.message); // Handle success message
      setSaved(!saved); // Toggle saved state
    } catch (error) {
      console.error('Error:', error); // Handle error
    }
  };
  const handleDelete = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete this post?');

    // If the user confirms, proceed with the delete request
    if (confirmed) {
      const url = `${USER_API_URL}/post/${props.post._id}`;

      try {
        const response = await fetch(url, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result.message); // Handle success message
        toast.success('Post deleted successfully!'); // Show success toast
        setTimeout(() => {
            window.location.reload()
        }, 1000);

      } catch (error) {
        console.error('Error:', error); // Handle error 
        toast.error('Failed to delete post.'); // Show error toast

      }
    }
  };


  // Toggle popup visibility
  const togglePopup = () => setShowPopup(!showPopup);

  return (
    <div key={props.post._id} className="w-96 p-5 rounded-md shadow-xl">
      <div className="flex w-full justify-between">
        <a href={`/profile/${props.post.userId.username}`} className='py-2 font-semibold'>{props.post.userId.username}</a>
        {props.currentuser == props.post.userId.username ? <button onClick={handleDelete} className='py-2 font-semibold text-red-500'>
          <AiOutlineDelete />
        </button> : ""}

      </div>
      <img
        src={props.post.image}
        alt={props.post.caption}
        className="mt-2 w-full max-h-[400px] object-contain rounded-md"
      />
      <div className="relative flex justify-between items-center mt-2">
        <div className='flex'>
          <button className='py-2 font-semibold flex items-center' onClick={handleLike}>
            {liked ? `❤️` : "🤍"}
          </button>
          <span
            className="ml-2 py-2 cursor-pointer"
            onClick={togglePopup}
          >
            {likedPosts.length}
          </span>
        </div>
        <button onClick={handleSave} className='py-2 font-semibold'>
          {saved ? <IoBookmark size={22} /> : <CiBookmark size={22} />}
          {/*saved ? "saved": "notsaved"*/}
        </button>
        {showPopup && (
          <div className="absolute top-10 left-0 w-48 bg-white border rounded-md shadow-lg p-2 z-10">
            <div className="font-semibold mb-1">Liked by:</div>
            <ul>
              {likedPosts.map(user => (
                <li key={user} className="text-sm">{user}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <p>
        <a href={`/profile/${props.post.userId.username}`} className='py-2 mr-2 font-semibold'>{props.post.userId.username}</a>
        {props.post.caption}
      </p>
      <ToastContainer></ToastContainer>
    </div>

  );
};

export default PostCard;

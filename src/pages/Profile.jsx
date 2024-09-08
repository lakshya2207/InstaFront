import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { useNavigate, useParams, } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from 'axios'; // Import axios
import { toast, ToastContainer } from 'react-toastify';
import PostCard from '../components/PostCard';
import { IoMdClose } from "react-icons/io";

const Profile = () => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const [posts, setPosts] = useState([])
    const [savedPosts, setSavedPosts] = useState([])
    const [select, setSelect] = useState("posts")
    const { userName } = useParams(); // Get the username from the URL parameters
    const [currentuser, setCurrentuser] = useState('')
    const [userData, setUserData] = useState(null); // State to store user data
    const [loading, setLoading] = useState(true); // State to handle loading status
    const [error, setError] = useState(null); // State to handle errors
    const [isFollowing, setIsFollowing] = useState(false);
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState("Hey this is Instagram");
    const [profilePic, setProfilePic] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXt16aeDkPn9pIbkt4pmMTEK2egqnIGcjVtw_Vec0a7pri5sT_");
    const [newProfilePic, setNewProfilePic] = useState('');
    const [selectedPost, setSelectedPost] = useState(null);

    const openModal = (post) => {
        setSelectedPost(post);
    };
    const closeModal = () => {
        setSelectedPost(null);
    };


    const handleSave = async () => {
        // Upload new profile picture to Cloudinary if selected
        let updatedProfilePic = profilePic;
        if (newProfilePic) {
            const data = new FormData();
            data.append("file", newProfilePic);
            data.append("upload_preset", "lakshyainsta");
            data.append("cloud_name", "dgbmuw01l");

            try {
                const res = await fetch('https://api.cloudinary.com/v1_1/dgbmuw01l/image/upload', {
                    method: "POST",
                    body: data
                });

                const cloudData = await res.json();
                updatedProfilePic = cloudData.url;
                toast.success("Profile picture updated successfully");
            } catch (error) {
                toast.error("Image upload failed");
                console.error(error);
                return;
            }
        }

        // Prepare the data to send to the server
        const updatedData = {
            bio,
            profilePicture: updatedProfilePic
        };

        // Make the PATCH request to the server
        axios.patch(`${import.meta.env.VITE_SERVER}/edit`, updatedData, { withCredentials: true })
            .then(response => {
                setProfilePic(updatedProfilePic);
                setIsEditing(false);
            })
            .catch(error => {
                toast.error('Save failed');
                console.error('Save failed:', error);
            });
    };
    const onclickposts = () => {
        setSelect("posts")
    }
    const onclicksaved = () => {
        setSelect("saved")

    }

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER}/user/${userName}`, {
                withCredentials: true,
            });

            setUserData(response.data);
            setBio(response.data.bio);
            response.data.profilePicture && setProfilePic(response.data.profilePicture);

            // Use the currentuser from state
            setIsFollowing(response.data.followers.includes(currentuser));
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Error fetching user data');
        } finally {
            setLoading(false);
        }
    };

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

            const { status, username } = data;
            if (status) {
                setCurrentuser(username);
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

    const fetchPosts = async (username) => {

        try {
            // Perform the HTTP GET request using axios with the username included in the URL
            const response = await axios.get(`${import.meta.env.VITE_SERVER}/posts/${username}`, {
                withCredentials: true // Include cookies in the request
            });

            // Extract the data from the response
            const data = response.data;

            // Log or return the data
            setPosts(data)
            console.log('Posts data:', data);
            return data;

        } catch (error) {
            // Handle any errors that occurred during the fetch
            console.error('There was a problem with the fetch operation:', error);
        }
    };
    const fetchSavedPosts = async (username) => {
        try {
            // Perform the HTTP GET request using axios with the username included in the URL
            const response = await axios.get(`${import.meta.env.VITE_SERVER}/savedposts/${username}`, {
                withCredentials: true // Include cookies in the request if needed
            });

            // Extract the data from the response
            const data = response.data;
            setSavedPosts(data)
            // console.log(data)
            return data;

        } catch (error) {
            // Handle any errors that occurred during the fetch
            console.error('There was a problem with the fetch operation:', error);
            return []; // Return an empty array in case of error
        }
    };
    const followUser = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER}/user/follow`,
                { follower: currentuser, followed: userName },
                { withCredentials: true } // Include cookies in the request if needed
            );

            if (response.status === 200) {
                setIsFollowing(true); // Update state to reflect that the user is now followed
                toast.success('You are now following this user!');
            }
        } catch (error) {
            console.error('Error following user:', error);
            toast.error('Failed to follow user');
        }
    };
    const unfollowUser = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER}/user/unfollow`,
                { follower: currentuser, followed: userName },
                { withCredentials: true } // Include cookies in the request if needed
            );

            if (response.status === 200) {
                setIsFollowing(false); // Update state to reflect that the user is now unfollowed
                toast.success('You have unfollowed this user!');
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
            toast.error('Failed to unfollow user');
        }
    };

    useEffect(() => {
        setTimeout(() => {
            verifyCookie();
        }, 100);
    }, [cookies.token, navigate, removeCookie, userName]);

    useEffect(() => {
        if (currentuser) {
            fetchUserData();
            fetchPosts(userName);
            fetchSavedPosts(userName);
        }
    }, [currentuser, userName]); // Re-run this effect when currentuser or userName changes


    if (loading) return <p>Loading...</p>; // Show a loading message while fetching data
    if (error) return <p>{error}</p>; // Show an error message if there was an error
    return (
        <div className='relative flex justify-between'>
            <Sidebar username={currentuser} />
            <div className='relative md:h-screen h-full  overflow-y-auto w-screen flex-1 items-center px-20 py-14 sm:px-0 sm:pt-2 justify-center'>
                <div className='profile p-2 description flex justify-center sm:justify-start'>
                    <div className='relative w-[40%] sm:w-auto items-center'>
                        <img
                            className='profile picture m-auto start-0 sm:h-20 rounded-full border-spacing-2 border-red-600 h-40'
                            src={newProfilePic ? URL.createObjectURL(newProfilePic) : profilePic}
                            alt="profilePicture"
                        />
                        {isEditing && (
                            <input
                                type='file'
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setNewProfilePic(file);
                                    }
                                }}
                                className='ml-20 mt-2'
                            />
                        )}


                    </div>
                    <div className='px-5 w-[60%]'>
                        <div className="w-4/12 flex gap-6">
                            <p className='text-lg font-semibold'>{"@" + userData.username}</p>
                            {currentuser !== userName && (
                                !isFollowing ? (
                                    <button onClick={followUser} className='text-sm font-semibold p-1 px-4 rounded-xl bg-gray-200 hover:bg-gray-300'>
                                        Follow
                                    </button>
                                ) : (
                                    <button onClick={unfollowUser} className='text-sm font-semibold p-1 px-4 rounded-xl bg-gray-200 hover:bg-gray-300'>
                                        Unfollow
                                    </button>
                                )
                            )}

                            {currentuser == userName ? <button onClick={isEditing ? handleSave : () => setIsEditing(true)} className='whitespace-nowrap text-sm font-semibold p-1 px-4 rounded-xl bg-gray-200 hover:bg-gray-300'>{isEditing ? 'Save Profile' : 'Edit Profile'}</button> : ""}
                        </div>
                        <div className="w-4/12 my-2 font-semibold flex gap-6">
                            <p className='whitespace-nowrap'>{`${userData.posts.length} Posts`}</p>
                            <p className='whitespace-nowrap cursor-pointer' onClick={() => { setShowFollowers(!showFollowers); setShowFollowing(false) }}>
                                {userData.followers.length + " Followers"}
                            </p>
                            <p className='whitespace-nowrap cursor-pointer' onClick={() => { setShowFollowing(!showFollowing); setShowFollowers(false) }}>
                                {userData.following.length + " Following"}
                            </p>
                        </div>
                        {/* Popup for Followers */}
                        {showFollowers && (
                            <div className='absolute self-center ml-16 bg-white border rounded-md shadow-lg p-4 z-10'>
                                <h3 className='font-semibold mb-2'>Followers</h3>
                                <ul>
                                    {userData.followers.length === 0 ? (
                                        <li>No followers</li>
                                    ) : (
                                        userData.followers.map(follower => (
                                            <li className='hover:bg-gray-100 px-2' key={follower}>
                                                <a className='cursor-pointer' href={`/profile/${follower}`}>
                                                    {follower}
                                                </a>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* Popup for Following */}
                        {showFollowing && (
                            <div className=' absolute self-center ml-44 bg-white border rounded-md shadow-lg p-2 z-10'>
                                <h3 className='font-semibold mb-2'>Following</h3>
                                <ul>
                                    {userData.following.length === 0 ? (
                                        <li>Not following anyone</li>
                                    ) : (
                                        userData.following.map(following => (
                                            <li className='hover:bg-gray-100 px-2' key={following}>
                                                <a className='cursor-pointer' href={`/profile/${following}`}>
                                                    {following}
                                                </a>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        )}

                        <div className="w-[340px] my-2">
                            <h3 className='font-semibold'>{userData.fullname.split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(' ')}</h3>
                            {isEditing ? (<div>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className='w-full p-2 border border-gray-300 rounded'
                                />
                                <button onClick={() => setIsEditing(false)} className='ml-64 text-sm font-semibold p-1 px-4 rounded-xl text-white bg-zinc-800 hover:bg-zinc-700'>cancel</button>
                            </div>
                            ) : (
                                <p className='Bio whitespace-pre-line'>
                                    {bio}
                                </p>
                            )}
                        </div>

                        <div className="flex"></div>
                    </div>
                </div>

                <div className='w-full mt-20'>
                    <div className="">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex gap-6 justify-center" aria-label="Tabs">
                                <p
                                    onClick={onclicksaved}
                                    style={{ display: `${currentuser == userName ? "" : "none"}` }}
                                    className={select == "saved" ? "shrink-0 border-b-2 border-sky-500 px-1 pb-4 text-sm font-medium text-sky-600 " : " shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"}

                                >
                                    Saved
                                </p>

                                <p
                                    onClick={onclickposts}
                                    className={select == "posts" ? "shrink-0 border-b-2 border-sky-500 px-1 pb-4 text-sm font-medium text-sky-600" : "shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"}
                                    aria-current="page"
                                >
                                    Posts
                                </p>
                            </nav>
                        </div>
                        <div className={`${select == "posts" ? "" : "hidden"} flex flex-wrap gap-2`} id='posts'>
                            <div className="p-4 w-full items-center">
                                {posts.length === 0 ? (
                                    <p>No posts available</p>
                                ) : (
                                    <div className="flex flex-wrap gap-4 justify-start sm:justify-center">
                                        {posts.map(post =>
                                        (
                                            <div
                                                key={post._id}
                                                className="w-52 h-52 sm:w-72 sm:h-72  cursor-pointer"
                                                onClick={() => openModal(post)}
                                            >
                                                <img
                                                    src={post.image}
                                                    alt={post.caption}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {selectedPost && (
                                    <div className="fixed h-[calc(100dvh)] inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                                        <div className="relative bg-white p-4 rounded-md">
                                            <button
                                                onClick={closeModal}
                                                className="absolute top-2 right-2 rounded-full p-1"
                                            >
                                                <IoMdClose size={30} />
                                            </button>
                                            <PostCard currentuser={currentuser} post={selectedPost} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={select == "saved" ? "" : "hidden"} id='saved'>
                            <div className="p-4">
                                {savedPosts.length === 0 ? (
                                    <p>No posts available</p>
                                ) : (
                                    <div className="flex flex-wrap gap-4 justify-start sm:justify-center">
                                        {savedPosts.map(post => (
                                            <div key={post._id} onClick={() => openModal(post)} className="w-52 h-52 sm:w-72 sm:h-72  cursor-pointer">
                                                <img
                                                    src={post.image}
                                                    alt={post.caption}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {selectedPost && (
                                    <div className="fixed h-[calc(100dvh)] inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                                        <div className="relative bg-white p-4 rounded-md">
                                            <button
                                                onClick={closeModal}
                                                className="absolute top-2 right-2 rounded-full p-1"
                                            >
                                                <IoMdClose size={30} />
                                            </button>
                                            <PostCard currentuser={currentuser} post={selectedPost} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer></ToastContainer>
        </div>


    )
}

export default Profile

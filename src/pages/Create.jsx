  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import { BsUpload } from "react-icons/bs";
  import { toast, ToastContainer } from 'react-toastify';
  import { useNavigate } from 'react-router-dom';
  import Sidebar from '../components/Sidebar'
  import { useCookies } from 'react-cookie';

  const Create = () => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState('');
    const [username, setUsername] = useState('')
    const [caption, setCaption] = useState(''); // State for the caption


    const saveImage = async () => {
      if (!image) {
        return toast.error("Please upload an image");
      }

      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset",import.meta.env.VITE_UPLOAD_PRESET);
      data.append("cloud_name", "dgbmuw01l");

      try {
        const res = await fetch('https://api.cloudinary.com/v1_1/dgbmuw01l/image/upload', {
          method: "POST",
          body: data
        });

        const cloudData = await res.json();
        setUrl(cloudData.url);
        handleSubmit(cloudData.url, caption);
        toast.success("Image uploaded successfully");
        setTimeout(() => {
          navigate(`/profile/${username}`)
        }, 1500);
      } catch (error) {
        toast.error("Image upload failed");
        console.error(error);
      }
    };

    const handleSubmit = async (imageUrl, caption) => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER}/createpost`, {
          imageUrl: imageUrl,
          caption: caption // Include caption in the request
        }, { withCredentials: true });
        console.log(`Success: ${response.data.message}`);
      } catch (error) {
        toast.error("Submission failed");
        console.error(`Error: ${error.message}`);
      }
    };
    
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

          const { status, username } = data;
          // console.log(data);
          if (status) {
            setUsername(username);
            setTimeout(() => {
              
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

      <div className='flex justify-between items-center h-screen'>
      <Sidebar username={username} />
        <div className="upload m-auto bg-[#f0f0f0] p-10 rounded-xl">
          <div className="input flex justify-center mb-5">
            <label htmlFor="file-upload" className="custom-file-upload" style={{ display: "inline-block", cursor: "pointer" }}>
              {image
                ? <img className="w-72 lg:w-96 rounded-xl" src={URL.createObjectURL(image)} alt="Uploaded" />
                : <BsUpload className='p-2 rounded-md bg-zinc-400' size='60' />}
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className='hidden' // Hide the default file input
            />
          </div>
          {!image && <h4>Upload Image</h4>}
          {image && (
            <>
              <input
                type="text"
                placeholder="Enter caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="mt-4 p-2 border rounded-md w-full lg:w-96"
              />
              <button onClick={saveImage} className="mt-4 w-72 lg:w-96 rounded-md text-white font-semibold p-2 bg-[#0077b6]">
                Upload
              </button>
            </>
          )}
        </div>
        <ToastContainer />
      </div>
    );
  };

  export default Create;

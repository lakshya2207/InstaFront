import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
const Search = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const [username, setUsername] = useState('');

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

    useEffect(() => {
        const fetchUsers = async () => {
            const url =`${import.meta.env.VITE_SERVER}/allusers`;
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include', // or 'same-origin' depending on your needs
                });
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
                const json = await response.json();
                setUsers(json);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);

        const lowercasedQuery = searchQuery.toLowerCase();
        if (searchQuery === '') {
            setFilteredUsers([]); // Hide list if query is empty
        } else {
            const filtered = users.filter(
                (user) =>
                    user.username.toLowerCase().startsWith(lowercasedQuery) ||
                    user.fullname.toLowerCase().startsWith(lowercasedQuery)
            );
            setFilteredUsers(filtered);
        }
    };

    return (
        <div className='flex h-screen'>
            <Sidebar username={username} />
            <div className="p-4 mx-auto w-80">
            <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={handleSearch}
            className="w-full  p-2 border border-gray-400 rounded-md focus:border-gray-400 focus:outline-none"
        />
        
                {filteredUsers.length > 0 && (
                    <ul className="mt-2 border border-gray-300 rounded-md bg-white shadow-lg">
                        {filteredUsers.map((user) => (
                            <li
                                key={user.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                            >
                            <a className='cursor-pointer' href={`/profile/${user.username}`}>  
                            {user.fullname} ({user.username})
                            </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
export default Search;

import React from 'react'
import { useNavigate } from 'react-router-dom';

const MenuCard = (props) => {
    const navigate = useNavigate();
    const handleClick=()=>{
        navigate(`/profile/${props.username}`)
    }
    return (
        <div onClick={handleClick} className=" cursor-pointer flex gap-6 relative">
            <img className="block mx-auto h-10 rounded-full " src={props.dp|| './images/dp.jpg'} alt="Woman's Face" />
            <div className=" flex">
                <div className="">
                    <p className=" font-semibold text-gray-700   ">
                        {props.fullname.split(' ') // Split the string into an array of words
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word and make the rest lowercase
                            .join(' ')}
                    </p>
                    <p className="text-slate-500 text-sm font-normal">
                        {"@" + props.username}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default MenuCard

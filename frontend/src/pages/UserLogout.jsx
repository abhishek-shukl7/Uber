import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogout = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    axios.get(`${import.meta.env.VITE_API_URL}/users/logout`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if(response.status == 200 || response.status == 201 || response.status == 304){
            localStorage.removeItem('token');
            navigate('/signin');
        }
    });

    return (
        <div>Logged Out.</div>
    );
};

export default UserLogout;
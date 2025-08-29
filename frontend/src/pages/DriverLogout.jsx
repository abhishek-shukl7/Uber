import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DriverLogout = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    axios.get(`${import.meta.env.VITE_API_URL}/driver/logout`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if(response.status == 200){
            localStorage.removeItem('token');
            navigate('/driver/signin');
        }
    });

    return (
        <div>Logged Out.</div>
    );
};

export default DriverLogout;
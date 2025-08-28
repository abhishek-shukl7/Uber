import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from 'axios';

const UserProtectWrapper = ({ children }) => {

    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { user , setUser } = useContext(UserDataContext);
    const [ isLoading , setIsLoading ] = useState(true);

    useEffect(() => {
        if(!token){
            navigate('/signin');
            return;
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/users/getuser`,{
            headers : {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if(response.status == 200){
                setUser(response.data)
                setIsLoading(false)
            }
        }).catch(error => {
            console.log(err)
            localStorage.removeItem('token')
            navigate('/signin')
        })
    }, [ token ]);

    if(isLoading || !user){
        return (
            <div>Loading....</div>
        );
    }

    return (
        <>
        { children }
        </>
    )
};

export default UserProtectWrapper;
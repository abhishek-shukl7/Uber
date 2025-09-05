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
            },
            validateStatus: (status) => {
                return status === 200 || status === 201 || status === 304;
            }
        }).then(response => {
            console.log('User data response',response);   
            if(response.status == 200 || response.status == 201){
                setUser(response.data)
                setIsLoading(false)
            }
        }).catch(error => {
            console.log('API error',error)
            localStorage.removeItem('token')
            navigate('/signin')
        })
    }, [ token,navigate, setUser ]);

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
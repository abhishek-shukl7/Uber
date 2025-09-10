import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DriverDataContext } from "../context/DriverContext";
import axios from 'axios';

const DriverProtectWrapper = ({ children }) => {

    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { driver , setDriver } = useContext(DriverDataContext);
    const [ isLoading , setIsLoading ] = useState(true);

    useEffect(() => {
        if(!token){
            navigate('/driver/signin');
            return ;
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/driver/getdriver`,{
            headers : {
                Authorization: `Bearer ${token}`
            },
            validateStatus: (status) => {
                return status === 200 || status === 201 || status === 304;
            }
        }).then(response => {
            if(response.status == 200 || response.status == 201){
                setDriver(response.data)
                setIsLoading(false)
            }
        }).catch(error => {
            console.log('API error',error)
            localStorage.removeItem('token')
            navigate('/driver/signin')
        })
    }, [ token ]);

    if(isLoading || !driver){
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

export default DriverProtectWrapper;
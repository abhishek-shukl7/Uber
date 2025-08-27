import React,{ useEffect, useState, useRef} from "react";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserDataContext } from "../context/UserContext";
import { SocketContext } from "../context/SocketContext";

import LiveTracking from '../components/LiveTracking.jsx'

const Home = () => {

    const { user } = useContext(UserDataContext);
    const { socket } = useContext(SocketContext);

    const panelCloseRef = useRef(null);
    const { pickup,setPickup} = useState('');
    const { destination,setDestination} = useState('');
    const { panelOpen,setPanelOpen} = useState(false);
    const { activeField,setActiveField} = useState(null);

    const { vehiclePanel,setVehiclePanel} = useState(false);
    const { pickupSuggestions,setPickupSuggestions} = useState([]);
    const { destinationSuggestions,setDestinationSuggestions} = useState([]);

    const { fare,setFare} = useState({});

    const handlePickupChange = async (e) => {
        setPickup(e.target.value);
        try{
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,{
                params: e.target.value,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPickupSuggestions(response);
        }catch(err){
            console.log("error in getting pickup suggestions.");
        }
    }

    const handleDestinationChange = async (e) => {
        setPickup(e.target.value);
        try{
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,{
                params: e.target.value,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setDestinationSuggestions(response);
        }catch(err){
            console.log("error in getting destination suggestions.");
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();
    }

    // const findTrip = async (e) => {
    async function  findTrip() {
        setPanelOpen(true);
        setVehiclePanel(true);
        try{
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/getfare`,{
                params: { pickup,destination },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFare(response.data);
        }catch(err){
            console.log("error in getting fare.");
        }
    }

    return (

        <div className='h-screen relative overflow-hidden'>
            <img className='w-16 absolute left-5 top-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
            <div className='h-screen w-screen'>
                <LiveTracking />
            </div>
            <div className=' flex flex-col justify-end h-screen absolute top-0 w-full'>
                <div className='h-[30%] p-6 bg-white relative'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                    }} className='absolute opacity-0 right-6 top-6 text-2xl'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>

                    <h4 className='text-2xl font-semibold'>Find a trip</h4>
                    <form className='relative py-3' onSubmit={(e) => {
                        submitHandler(e)
                    }}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                        <input
                            type='text'
                            placeholder="Add a pickup location"
                            value={pickup}
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField(pickup)
                            }}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full' 
                            onChange={handlePickupChange}
                        />

                        <input
                            type='text'
                            placeholder="Add a destination location"
                            value={destination}
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField(destination)
                            }}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full' 
                            onChange={handleDestinationChange}
                        />
                    </form>
                    <button 
                        onClick={findTrip}
                        className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>
                        Find Trip
                    </button>
                </div>

                <div ref={panelRef} className='bg-white h-0'>
                    
                </div>
            </div>
        </div>

    )
}

export default Home;
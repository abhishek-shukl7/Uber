import React,{ useEffect, useState, useRef} from "react";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserDataContext } from "../context/UserContext";
import { SocketContext } from "../context/SocketContext";

import LiveTracking from '../components/LiveTracking.jsx'
import LocationSearchPanel from '../components/LocationSearchPanel.jsx'
import VehiclePanel from '../components/VehiclePanel.jsx'
import ConfirmRide from '../components/ConfirmRide.jsx'
import LookingForDriver from '../components/LookingForDriver.jsx'
import WaitingForDriver from '../components/WaitingForDriver.jsx'

const Home = () => {

    const { user } = useContext(UserDataContext);
    const { socket } = useContext(SocketContext);

    const panelRef = useRef(null);
    const panelCloseRef = useRef(null);
    const confirmRidePanelRef = useRef(null);
    const vehicleFoundRef = useRef(null);
    const vehiclePanelRef = useRef(null);
    const waitingForDriverRef = useRef(null);
    
    const [ pickup,setPickup] = useState('');
    const [ destination,setDestination] = useState('');
    const [ panelOpen,setPanelOpen] = useState(false);
    const [ activeField,setActiveField] = useState(null);

    const [ vehiclePanel,setVehiclePanel] = useState(false);
    const [ vehicleType,setVehicleType] = useState(null);
    const [ pickupSuggestions,setPickupSuggestions] = useState([]);
    const [ destinationSuggestions,setDestinationSuggestions] = useState([]);

    const [ vehicleFound,setVehicleFound] = useState(false);
    const [ confirmRidePanel,setConfirmRidePanel] = useState(false);
    const [ waitingForDriver,setWaitingForDriver] = useState(false);

    const [ fare,setFare] = useState({});
    const [ ride,setRide] = useState(null); 

    const navigate = useNavigate();

    useEffect(() => {
        socket.emit("join",{ userType: 'user' , userId: user._id})
    },[user])

    socket.on("ride-confirmed", ride => {
        setVehicleFound(false)
        setWaitingForDriver(true)
        setRide(ride)
    })

    socket.on("ride-started", ride => {
        console.log("ride")
        setWaitingForDriver(false)
        navigate('/riding',{ state: {ride} })
    })

    const handlePickupChange = async (e) => {
        setPickup(e.target.value);
        try{
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/map/getSuggestions`,{
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPickupSuggestions(response.data);
        }catch(err){
            console.log("error in getting pickup suggestions.",err);
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value);
        try{
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/map/getSuggestions`,{
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setDestinationSuggestions(response.data);
        }catch(err){
            console.log("error in getting destination suggestions.",err);
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();
    }

    useGSAP(function () {
        if(panelOpen){
            gsap.to(panelRef.current,{
                height:'70%',
                padding: 24
            })
            gsap.to(panelCloseRef.current,{
                opacity: 1
            })
        }else{
            gsap.to(panelRef.current,{
                height:'0%',
                padding: 0
            })
            gsap.to(panelCloseRef.current,{
                opacity: 0
            })
        }
    },[panelOpen])

    useGSAP(function () {
        if(vehiclePanel){
            gsap.to(vehiclePanelRef.current,{
                transform: 'translateY(0)'
            })
        }else{
            gsap.to(vehiclePanelRef.current,{
                transform: 'translateY(100%)'
            })
        }
    },[vehiclePanel])

    useGSAP(function () {
        if(confirmRidePanel){
            gsap.to(confirmRidePanelRef.current,{
                transform: 'translateY(0)'
            })
        }else{
            gsap.to(confirmRidePanelRef.current,{
                transform: 'translateY(100%)'
            })
        }
    },[confirmRidePanel])

    useGSAP(function () {
        if(vehicleFound){
            gsap.to(vehicleFoundRef.current,{
                transform: 'translateY(0)'
            })
        }else{
            gsap.to(vehicleFoundRef.current,{
                transform: 'translateY(100%)'
            })
        }
    },[vehicleFound])

    useGSAP(function () {
        if(waitingForDriver){
            gsap.to(waitingForDriverRef.current,{
                transform: 'translateY(0)'
            })
        }else{
            gsap.to(waitingForDriverRef.current,{
                transform: 'translateY(100%)'
            })
        }
    },[waitingForDriver])

    // const findTrip = async (e) => {
    async function  findTrip() {
        setPanelOpen(false);
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

    async function createRide(){
        try{
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/createRide`,
                { pickup,destination,vehicleType },{
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                // console.log(response);
                setRide(response.data);
                return response.data;
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
                                setActiveField('pickup')
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
                                setActiveField('destination')
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

                <div ref={panelRef} className='bg-white h-0' id="LocationSearchPanel">
                    <LocationSearchPanel 
                        suggestions = {activeField == 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                        setVehiclePanel={setVehiclePanel}
                        setPanelOpen={setPanelOpen}
                    />
                </div>
            </div>

            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <VehiclePanel 
                setConfirmRidePanel={setConfirmRidePanel}
                setVehicleType={setVehicleType}
                fare={fare}
                setVehiclePanel={setVehiclePanel}
                />
            </div>
            
            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <ConfirmRide 
                pickup={pickup}
                destination={destination}
                fare={fare}
                vehicleType={vehicleType}
                createRide={createRide}
                setConfirmRidePanel={setConfirmRidePanel}
                setVehicleFound={setVehicleFound}
                />
            </div>

            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <LookingForDriver 
                pickup={pickup}
                destination={destination}
                fare={fare}
                vehicleFound={vehicleFound}
                vehicleType={vehicleType}
                createRide={createRide}
                setVehicleFound={setVehicleFound}
                />
            </div>

            <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <WaitingForDriver 
                waitingForDriver={waitingForDriver}
                setWaitingForDriver={setWaitingForDriver}
                ride={ride}
                setVehicleFound={setVehicleFound}
                />
            </div>

        </div>

    )
}

export default Home;
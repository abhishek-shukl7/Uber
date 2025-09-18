import React, { useContext , useState ,useEffect } from "react";
import {DriverDataContext} from "../context/DriverContext";
import axios from "axios";

const DriverDetails = () => {

    
    const [ totalRides , setTotalRides ] = useState(0);
    const [ totalEarned , settotalEarned ] = useState(0);
    const [ totalDuration , setTotalDuration ] = useState(0);
    const [ totalDistance , setTotalDistance ] = useState(0);
    useEffect(() => {
        async function getDriverData(){
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/driver-details`,{},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if((response.status == 200 || response.status == 201 || response.status == 304) && response.data.length > 0){
                // const data = await response.json();
                setTotalRides(response.data.length);
                let earned = 0;
                let duration = 0;
                let distance = 0;
                response.data.forEach(ride => {
                    if(ride.fare > 0){
                        earned += ride.fare;
                    }
                    if(ride.duration > 0){
                        duration += ride.duration;
                    }
                    if(ride.distance > 0){
                        distance += ride.distance;
                    }
                });
                
                settotalEarned(earned)  
                setTotalDuration((duration/3600).toFixed(2))  
                setTotalDistance((distance/1000).toFixed(0))  
                return 
            }else{
                setTotalRides(0)
                settotalEarned(0)  
                setTotalDuration(0)  
                setTotalDistance(0)  
            }
        }
        getDriverData();
    },[])
    
    const {driver} = useContext(DriverDataContext)

    
    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    <img className='h-10 w-10 rounded-full object-cover' src="https://t4.ftcdn.net/jpg/07/17/84/71/360_F_717847111_5dqQRbCOnSKiALUJzWHkjozKZAEQdVsf.jpg" alt="" />
                    <h4 className='text-lg font-medium capitalize'>{driver?.fullname?.firstname + " " + driver?.fullname?.lastname}</h4>
                </div>
                <div>
                    <h4 className='text-xl font-semibold'>₹{totalEarned}</h4>
                    <p className='text-sm text-gray-600'>Earned</p>
                </div>
            </div>
            <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
                    <h5 className='text-lg font-medium'>{totalRides}</h5>
                    <p className='text-sm text-gray-600'>Total Number Rides</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
                    <h5 className='text-lg font-medium'>{totalDistance} Km</h5>
                    <p className='text-sm text-gray-600'>Total Distance</p>
                    
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
                    <h5 className='text-lg font-medium'>{totalDuration} Hours</h5>
                    <p className='text-sm text-gray-600'>Total Duration</p>
                </div>

            </div>
        </div>
    );
}

export default DriverDetails
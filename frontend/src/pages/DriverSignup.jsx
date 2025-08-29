import React,{ useContext, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DriverDataContext } from '../context/DriverContext';

const DriverSignup = () => {  
    const [ email,setEmail ] = useState('');
    const [ password,setPassword ] = useState('');
    const [ firstname,setFirstName ] = useState('');
    const [ lastname,setLastName ] = useState('');

    const [ vehicleColor,setVehicleColor ] = useState('');
    const [ vehiclePlate,setVehiclePlate ] = useState('');
    const [ vehicleCapacity,setVehicleCapacity ] = useState('');
    const [ vehicleType,setVehicleType ] = useState('');
    const [ vehicleName,setVehicleName ] = useState('');

    const [ driverdata, setDriverData ] = useState({});

    const navigate = useNavigate();

    const  { driver,setDriver }  = useContext(DriverDataContext);

    const submitHandler = async (e) => {
        e.preventDefault();
        const newUser = {
            fullname : {
                firstname,
                lastname
            },
            password: password,
            email: email,
            vehicle : {
                capacity: vehicleCapacity,
                color: vehicleColor,
                plate: vehiclePlate,
                vehicleType: vehicleType,
                vehicleName: vehicleName
            },
        };

        // console.log(newUser);

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/driver/register`,newUser);

        if(response.status == 200){
            const data = response.data;
            setDriver(data.driver);
            localStorage.setItem('token',data.token);
            navigate('/driver/home');
        }

        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setVehicleColor('');
        setVehiclePlate('');
        setVehicleCapacity('');
        setVehicleType('');
        setVehicleName('');
    }

    return (
        <div>
            <div className='p-7 h-screen flex flex-col justify-between'>
                <div>
                    <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />
                    <form onSubmit={(e) => {
                        submitHandler(e)
                    }}>
                        <h3 className='text-lg w-full font-medium mb-2'>What's our Driver's name</h3>
                        <div className='flex gap-4 mb-7'>
                            <input 
                                required 
                                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                                type="text"
                                placeholder='First Name'
                                value={firstname}
                                onChange={(e) => {
                                    setFirstName(e.target.value)
                                }}
                            />
                            <input 
                                required 
                                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                                type="text"
                                placeholder='Last Name'
                                value={lastname}
                                onChange={(e) => {
                                    setLastName(e.target.value)
                                }}
                            />
                        </div>
                        <h3 className='text-lg font-medium mb-2'>What's your email</h3>
                            <input
                                required
                                type='email'
                                className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                                placeholder='email@example.com'
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                            />
                        
                        <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
                            <input
                                required
                                type='password'
                                className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                                placeholder='password'
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                            />
                        
                        <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
                        <div className='flex gap-4 mb-7'>
                            <input 
                                required
                                placeholder='Vehicle Color'
                                type='text'
                                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                                value={vehicleColor}
                                onChange={(e) => {
                                    setVehicleColor(e.target.value)
                                }}
                            />

                            <input 
                                required
                                placeholder='Vehicle Plate'
                                type='text'
                                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                                value={vehiclePlate}
                                onChange={(e) => {
                                    setVehiclePlate(e.target.value)
                                }}
                            />
                        </div>
                        <div className='flex gap-4 mb-7'>
                            <input 
                                required
                                placeholder='Vehicle Capacity'
                                type='number'
                                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                                value={vehicleCapacity}
                                onChange={(e) => {
                                    setVehicleCapacity(e.target.value)
                                }}
                            />
                            <select 
                                required
                                placeholder='Vehicle Type'
                                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                                value={vehicleType}
                                onChange={(e) => {
                                    setVehicleType(e.target.value)
                                }}>
                                <option value="" disabled>Select Vehicle Type</option>
                                <option value="car">Car</option>
                                <option value="auto">Auto</option>
                                <option value="motorcycle">Motorcycle</option>
                            </select>
                        </div>
                        <div className='flex gap-4 mb-7'>
                            <input 
                                required
                                placeholder='Vehicle Name'
                                type='text'
                                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                                value={vehicleName}
                                onChange={(e) => {
                                    setVehicleName(e.target.value)
                                }}
                            />
                        </div>

                        <button
                        className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
                        >Create Driver Account</button>

                    </form>
                    <p className='text-center'>Already have a account? <Link to='/driver/login' className='text-blue-600'>Login here</Link></p>
                </div>
                <div>
                    <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
                    Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
                </div>
            </div>
        </div>
    );

}
export default DriverSignup;
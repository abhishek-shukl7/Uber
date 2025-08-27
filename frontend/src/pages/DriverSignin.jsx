import React,{ useContext,useState} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DriverDataContext } from "../context/DriverContext";

const DriverSignin = () => {

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [driverData,setDriverData] = useState({});

    const  { driver,setDriver } = useContext(DriverDataContext);
    const navigate = useNavigate(); 

    const submitHandler = async (e) => {
        e.preventDefault();
        const driverData = {
            email: email,
            password: password
        };
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/driver/login`,driverData);

        if(response.status == 200){
            const data = response.data;
            setDriver(data.driver);
            localStorage.setItem('token',data.token);
            navigate('/driver/home');   
        }
        setEmail('');
        setPassword('');
    };

    return (
        <div className='p-7 h-screen flex flex-col justify-between'>
            <div>
                <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />
                <form onSubmit={(e) => {
                    submitHandler(e)
                }}>
                    <h3 className='text-lg font-medium mb-2'>What's your email</h3>
                    <input
                        required
                        value={email}
                        placeholder="email@example.com"
                        className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                        type='email'
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                    />
                    <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
                    <input
                        required
                        value={password}
                        placeholder="password"
                        className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                        type='password'
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    />
                    <button
                        className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
                    >Login</button>
                </form>
                <p className='text-center'>New here? <Link to='/driver/signup' className='text-blue-600'>Create new Account</Link></p>
            </div>
            <div>
                <Link
                to='/login'
                className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
                >Sign in as User</Link>
            </div>
        </div>

    );

}

export default DriverSignin;
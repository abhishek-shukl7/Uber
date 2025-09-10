import React, { createContext, useState,useEffect } from 'react'

export const DriverDataContext = createContext(null)


const DriverContext = ({ children }) => {

    const [ driver, setDriver ] = useState(null);

    const updateDriver = (driverData) => {
        setDriver(driverData);
    };

    useEffect(() => {
            const token = localStorage.getItem('token');
            if (token) {
                setDriver(prev => ({ ...prev, isLoggedIn: true }));
            }
    }, []);

    const value = {
        driver,
        setDriver,
        updateDriver,
        isLoggedIn: driver?.isLoggedIn || false
     };

    return (
        
            <DriverDataContext.Provider value={value}>
                {children}
            </DriverDataContext.Provider>
        
        
    )
}

export default DriverContext
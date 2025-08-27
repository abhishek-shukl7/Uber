import React, { createContext, useState } from 'react'

export const DriverDataContext = createContext()


const DriverContext = ({ children }) => {

    const [ driver, setDriver ] = useState(null);

    const updateDriver = (driverData) => {
        setDriver(driverData);
    };

    const value = {
        driver,
        setDriver,
        updateDriver
     };
    return (
        <div>
            <DriverDataContext.Provider value={value}>
                {children}
            </DriverDataContext.Provider>
        </div>
        
    )
}

export default DriverContext
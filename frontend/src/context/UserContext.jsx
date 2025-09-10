import React, { createContext, useState , useEffect} from 'react'

export const UserDataContext = createContext()


const UserContext = ({ children }) => {

    const [ user, setUser ] = useState({
        email: '',
        isLoggedIn: false,
        fullName: {
            firstName: '',
            lastName: ''
        }
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser(prev => ({ ...prev, isLoggedIn: true }));
        }
    }, []);

    return (
        
            <UserDataContext.Provider value={{ user, setUser }}>
                {children}
            </UserDataContext.Provider>
        
        
    )
}

export default UserContext
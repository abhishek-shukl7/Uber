import React, { createContext, useEffect } from 'react'
import { io } from 'socket.io-client'

export const SocketContext = createContext()

const socket = io(`${import.meta.env.VITE_BASE_URL}`)

const SocketProvider = ({ children }) => {

    useEffect(() => {
        socket.io('connect',() => {
            console.log('socket connected to server');
        })
        socket.io('disconnected',() => {
            console.log('socket disconnected to server');
        })
    },[]);

    return (
        <div>
            <SocketContext.Provider value={socket}>
                {children}
            </SocketContext.Provider>
        </div>
        
    )
}

export default SocketProvider
import React from 'react';
import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import UserContext from './context/UserContext.jsx';
import AuthContext from './context/AuthContext.jsx';
import DriverContext from './context/DriverContext.jsx';
import SocketProvider from './context/SocketContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthContext>
            <DriverContext>
                <UserContext> 
                    <SocketProvider>  
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </SocketProvider> 
                </UserContext>
            </DriverContext>
        </AuthContext>
    </StrictMode>
);
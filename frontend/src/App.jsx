import React from 'react';
import { Route, Routes,Navigate } from 'react-router-dom'

import Home from './pages/Home'
import Start from './pages/Start'

import DriverProtectWrapper from './pages/DriverProtectWrapper'
import DriverSignup from './pages/DriverSignup'
import DriverSignin from './pages/DriverSignin'
import DriverLogout from './pages/DriverLogout'
import DriverHome from './pages/DriverHome'
import DriverRiding from './pages/DriverRiding'

import UserSignup from './pages/UserSignup'
import UserSignin from './pages/UserSignin'
import UserLogout from './pages/UserLogout'
import UserRiding from './pages/UserRiding'
import UserProtectWrapper from './pages/UserProtectWrapper'

import AuthRedirect from './components/AuthRedirect.jsx';
import AuthDriverRedirect from './components/AuthDriverRedirect.jsx';
import GoogleMapsProvider from './context/GoogleMapsProvider'; 
import 'remixicon/fonts/remixicon.css'
const App = () => {
    return (
        <div>
        <GoogleMapsProvider>
            <Routes>

                <Route path='/'
                    element={
                        <Start />
                    } />

                <Route path='/home'
                    element={
                        <UserProtectWrapper>
                            <Home />
                        </UserProtectWrapper>
                    } />
                
                <Route path='/signup'
                    element={
                        <AuthRedirect>
                        <UserSignup />
                        </AuthRedirect>
                    } />
                <Route path='/signin'
                    element={
                        <AuthRedirect>
                        <UserSignin />
                        </AuthRedirect>
                    } />
                <Route path='/logout'
                    element={
                        <UserProtectWrapper>
                            <UserLogout />
                        </UserProtectWrapper>
                    } />
                <Route path='/riding'
                    element={
                        <UserRiding />
                    } />
                
                <Route path='/driver/signup'
                    element={
                        <AuthDriverRedirect>
                        <DriverSignup />
                        </AuthDriverRedirect>
                    } />
                <Route path='/driver/signin'
                    element={
                        <AuthDriverRedirect>
                        <DriverSignin />
                        </AuthDriverRedirect>
                    } />
                <Route path='/driver/logout'
                    element={
                        <DriverProtectWrapper>
                            <DriverLogout />
                        </DriverProtectWrapper>
                    } />

                <Route path='/driver/home'
                    element={
                        <DriverProtectWrapper>
                            <DriverHome />
                      
                        </DriverProtectWrapper>
                    } />
                <Route path='/driver/riding'
                    element={
                        <DriverProtectWrapper>
                            <DriverRiding />
                      
                        </DriverProtectWrapper>
                    } />

                <Route path="/driver/*" element={<Navigate to="/driver/home" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </GoogleMapsProvider>
        </div>
        
    )
};

export default App;
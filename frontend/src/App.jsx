import React from 'react';
import { Route, Routes } from 'react-router-dom'
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

import 'remixicon/fonts/remixicon.css'
const App = () => {
    return (
        <div>
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
                        <UserSignup />
                    } />
                <Route path='/signin'
                    element={
                        <UserSignin />
                    } />
                <Route path='/user/logout'
                    element={
                        <UserProtectWrapper>
                            <UserLogout />
                        </UserProtectWrapper>
                    } />
                <Route path='/user/riding'
                    element={
                        <UserRiding />
                    } />
                
                <Route path='/driver/signup'
                    element={
                        <DriverSignup />
                    } />
                <Route path='/driver/signin'
                    element={
                        <DriverSignin />
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
            </Routes>
        </div>
        
    )
};

export default App;
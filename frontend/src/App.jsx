import React from 'react';
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import UserSignup from './pages/UserSignup'
import UserSignin from './pages/UserSignin'
// import UserLogout from './pages/UserLogout'
import UserProtectWrapper from './pages/userProtectWrapper'
import 'remixicon/fonts/remixicon.css'
import UserLogout from './pages/UserLogout';

const App = () => {
    return (
        <div>
            <Routes>
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
                    
            </Routes>
        </div>
        
    )
};

export default App;
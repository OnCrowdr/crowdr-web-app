"use client";
import React from 'react'
import Topbar from './components/TopBar';
import LoginFormContext from '@/app/common/hooks/useLoginForm';
import FormPage from "./components/FormPage";


const Login = () => {
    return (
        <div>
            <Topbar />
            <LoginFormContext>
                <FormPage />
            </LoginFormContext>
        </div>
    )
}

export default Login
"use client";
import React from 'react'
import Topbar from './login-components/TopBar';
import LoginFormContext from '../_hooks/useLoginForm';
import FormPages from "./login-components/FormPages"

const Login = () => {
    return (
        <div>
            <Topbar />
            <LoginFormContext>
                <FormPages/>
            </LoginFormContext>
        </div>
    )
}

export default Login
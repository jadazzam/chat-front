import React, {ReactNode} from "react"
import {Button, TextField} from "@mui/material";
import Form from "next/form";
import {signIn} from "@/app/actions/login";
import LoginFormWrapper from "@/app/components/Wrapper";
import {useAuth} from "@/app/providers/auth";

export const LoginForm = () => {
    return (
        <LoginFormWrapper>
            <TextField
                required
                id="outlined-required"
                label="Required"
                name="email"
                placeholder="john@example.com"
            />

            <TextField
                required
                id="outlined-required"
                label="password"
                name='password'
                placeholder="password"
            />
            <Button type="submit" variant="contained">Sign in</Button>
        </LoginFormWrapper>

    )
}

LoginForm.Wrapper = function LoginFormWrapper({children}: { children: ReactNode }) {
    const setAuth = useAuth()?.setAuth;
    return (
        <div className='w-full bg-amber-400'>
            <Form className='flex flex-col w-1/5 mx-auto' action={async (formData) => {
                const res = await signIn(formData)
                if (setAuth && res) setAuth(res)
                return res
            }}>
                {children}
            </Form>
        </div>
    )
}
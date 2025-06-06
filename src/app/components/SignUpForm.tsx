import React, {ReactNode} from "react"
import {Button, TextField} from "@mui/material";
import Form from "next/form";
import {signUp} from "@/app/actions/auth";
import SignUpFormWrapper from "@/app/components/SignUpWrapper";
import {useAuth} from "@/app/providers/auth";

export const SignUpForm = () => {
    return (
        <SignUpFormWrapper>
            <TextField
                required
                id="outlined-required"
                label="name"
                name="name"
                placeholder="John"
            />
            <TextField
                required
                id="outlined-required"
                label="email"
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
            <Button type="submit" variant="contained">Sign up</Button>
        </SignUpFormWrapper>

    )
}

SignUpForm.Wrapper = function SignUpFormWrapper({children}: { children: ReactNode }) {
    const setAuth = useAuth()?.setAuth;
    return (
        <div className='w-full bg-amber-400'>
            <Form className='flex flex-col w-1/5 mx-auto' action={async (formData) => {
                const res = await signUp(formData)
                if (setAuth && res) setAuth(res)
            }}>
                {children}
            </Form>
        </div>
    )
}
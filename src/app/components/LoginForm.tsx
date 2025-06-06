import React, {ReactNode} from "react"
import {Button, TextField} from "@mui/material";
import Form from "next/form";
import {signIn} from "@/app/actions/login";
import LoginFormWrapper from "@/app/components/Wrapper";

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
    return (
        <Form action={async (formData) => await signIn(formData)}>
            {children}
        </Form>
    )
}
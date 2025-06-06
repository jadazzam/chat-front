"use client"
import {LoginForm} from "./LoginForm";


const LoginFormWrapper = ({children}: { children: React.ReactNode }) => {
    return <LoginForm.Wrapper>{children}</LoginForm.Wrapper>
}
export default LoginFormWrapper
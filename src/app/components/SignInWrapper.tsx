"use client"
import {SignInForm} from "./SignInForm";


const LoginFormWrapper = ({children}: { children: React.ReactNode }) => {
    return <SignInForm.Wrapper>{children}</SignInForm.Wrapper>
}
export default LoginFormWrapper
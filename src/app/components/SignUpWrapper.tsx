"use client"
import {SignUpForm} from "./SignUpForm";


const SignUpFormWrapper = ({children}: { children: React.ReactNode }) => {
    return <SignUpForm.Wrapper>{children}</SignUpForm.Wrapper>
}
export default SignUpFormWrapper
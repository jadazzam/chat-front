import {Button, TextField} from "@mui/material";
import Form from "next/form";
import {signIn} from "@/app/actions/login";

export const LoginForm = () => {
    return (
        <>
            <Form action={async (formData) => await  signIn(formData)}>
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
            </Form>
        </>

    )
}
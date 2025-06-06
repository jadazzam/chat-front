export const signIn = async (formData: FormData): Promise<void> => {
    console.log("signIn", formData);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        })
        return await response.json()
        return
    } catch (error) {
        console.error("Error sign in form", error)
        throw error;
    }
}
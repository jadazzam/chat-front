'use client'
import {createContext, useContext, useEffect, useState} from "react";
import {UsersType} from "@/app/types/users";
import {SignInType} from "@/app/types/auth";

interface AuthContextType extends SignInType {
    setAuth: (credentials: SignInType) => void;
    unSetAuth: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UsersType | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Load from localStorage on first render
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);

    const setAuth = (credentials: SignInType): void => {
        const {user, token} = credentials;
        setUser(user);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        if (token) localStorage.setItem("token", token);
    };

    const unSetAuth = (): void => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{user, token, setAuth, unSetAuth}}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
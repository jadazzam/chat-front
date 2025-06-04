"use client";

import { io } from "socket.io-client";

export const socket = io("http://localhost:8080", {
    reconnectionDelayMax: 10000,
    auth: {
        // Must NOT have Bearer before token
        token: process.env.NEXT_PUBLIC_TOKEN
    },
    // query: {
    //     "my-key": "my-value"
    // }
});
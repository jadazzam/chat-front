"use client";
import React, {useEffect, useState} from "react";
import {Button, InputAdornment, TextField} from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useForm, SubmitHandler } from "react-hook-form"

interface IFormInput {
    content: string
}

type MessageType = {id: string, content: string, create_at: Date, room_id: string, user_id: string}
const Chat = () => {
    const { register, handleSubmit } = useForm<IFormInput>()
    const [messages, setMessages] = useState<MessageType[]>([]);

    const getMessages = async () => {
        try {
            const response =  await fetch('http://localhost:8080/rooms/3?complete=true', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZvbmd2YW5ndnVuZ3Zpbmd2b3VuZ0BleGFtcGxlLmNvbSIsIm5hbWUiOiJWb25nIHZhbmcgdnVuZyB2aW5nIHZvdW5nIiwiaWQiOiIyMCIsImlhdCI6MTc0ODM5NTE3NiwiZXhwIjoxNzQ4OTk5OTc2fQ.g0kcdDCCcVbOjkN-sRKkK8EBwzCbtAs8dZ9d2cPbdBs"
                },
            })
            if (response) return response.json()
        } catch(e) {
            console.error("Error getMessages() in chat", e)
            throw e
        }
    }

    useEffect(() => {
        const res = getMessages().then(res => setMessages(res.messages))
        console.log("res =>", res)
    }, []);

    const postMessage = async(content: string) => {
        try {
            const res =  await fetch("http://localhost:8080/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZvbmd2YW5ndnVuZ3Zpbmd2b3VuZ0BleGFtcGxlLmNvbSIsIm5hbWUiOiJWb25nIHZhbmcgdnVuZyB2aW5nIHZvdW5nIiwiaWQiOiIyMCIsImlhdCI6MTc0ODM5NTE3NiwiZXhwIjoxNzQ4OTk5OTc2fQ.g0kcdDCCcVbOjkN-sRKkK8EBwzCbtAs8dZ9d2cPbdBs"
                },
                body: JSON.stringify({content: content, room_id: "3"})
            })
            return res.json()
        } catch(e) {
            console.error('Error PostMessage in chat', e)
            throw e
        }

    }
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        console.log("OnSubmit", data);
        const {content} = data
        if (content) {
            console.log("create here CONTENT =>", content)
            const create:MessageType = await postMessage(content)
            if (create) setMessages(prevState => [...prevState, create])

        }
    }

console.log("messages in component =>", messages)
    return (
        <>
            {messages.map((msg: { id: string; content: string }) => {
                return <h3 key={msg.id}>{msg.content}</h3>
            })}
            <form onSubmit={handleSubmit(onSubmit)}>
                {/*<label>Enter message here: </label>*/}
                <TextField
                    {...register("content")}
                    id="content"
                    label="Enter message"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                        },
                    }}
                    variant="standard"
                />
                <Button variant="contained" type="submit">Send</Button>
            </form>


        </>

    )
}

export  default Chat
'use client';
import React, {useEffect, useState} from 'react';
import {useAuth} from '@/providers/auth';
import {RoomsType} from '@/types/rooms'
import {getRooms} from '@/services/rooms';
import {AuthContextType} from "@/types/auth";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Page() {
    const [rooms, setRooms] = useState<RoomsType[]>([]);
    const auth: AuthContextType | null = useAuth();

    useEffect(() => {

        if (auth?.token) {
            getRooms(auth?.token).then((res: RoomsType[]) => {
                if (res) setRooms(res)
            }).catch(e => console.error("Error /rooms getRooms", e))
        }
    }, [auth?.token]);


    return (
        <>
            <Typography sx={{textAlign: 'center', mt: 4, fontWeight: 'semibold', fontSize: '3.75rem'}}>
                Rooms you can join
            </Typography>
            {rooms.map((_room: RoomsType) => {
                const isOwner = _room.owner_id && auth?.user?.id && (Number(_room.owner_id) === Number(auth?.user?.id))
                return (
                    <Box key={_room.id} sx={{width: 350, marginY: 5, marginX: "auto"}}>
                        <Card variant="outlined">
                            <React.Fragment>
                                <CardContent>
                                    {isOwner &&
                                        <Typography gutterBottom sx={{color: 'text.secondary', fontSize: 14}}>
                                            You are owner of this room
                                        </Typography>}
                                    <Typography variant="h5" component="div">
                                        {_room.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        Feel free to join chat &
                                        <br/>
                                        {'start sending messages to other members'}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Enter room</Button>
                                </CardActions>
                            </React.Fragment>
                        </Card>
                    </Box>
                )
            })}

        </>
    )
}
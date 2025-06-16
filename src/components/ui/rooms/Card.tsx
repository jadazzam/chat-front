import { Box } from '@mui/system';
import Card from '@mui/material/Card';
import React, { Fragment } from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { RoomsType } from '@/types/rooms';
import { UsersType } from '@/types/users';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { postRoomMember } from '@/services/roomsMembers';
import { useAuth } from '@/providers/auth';
import { redirect } from 'next/navigation';

export const RoomCard = ({ id, children }: { id: string; children: React.ReactNode }) => {
  return (
    <Box id={id} sx={{ width: 350, marginY: 5, marginX: 'auto' }}>
      <Card variant="outlined">
        <Fragment>
          <CardContent>{children}</CardContent>
        </Fragment>
      </Card>
    </Box>
  );
};

RoomCard.TitleSecondary = function RoomsCardTitleSecondary({ text }: { text: string }) {
  return (
    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
      {text}
    </Typography>
  );
};

RoomCard.TitleRoom = function RoomCardTitleRoom({ text }: { text: string }) {
  return (
    <Typography variant="h5" component="div">
      {text}
    </Typography>
  );
};

RoomCard.Description = function RoomCardDescription({
  description,
}: {
  description: React.ReactNode;
}) {
  return <Typography variant="body2">{description}</Typography>;
};

RoomCard.ActionButton = function RoomCardActionButton({
  text,
  roomId,
  userId,
}: {
  text: string;
  roomId: string;
  userId: string;
}) {
  const token = useAuth()?.token ?? null;
  return (
    <CardActions>
      <Button
        onClick={async () => {
          if (token) {
            const enter = await postRoomMember({ roomId, userId, token });
            if (enter.room_id) redirect(`/rooms/${enter.room_id}`);
            // TODO : message else() if enter room fails. Display alert?
          }
        }}
        size="small"
      >
        {text}
      </Button>
    </CardActions>
  );
};

type RoomCardTemplateProps = {
  room: RoomsType;
  user: UsersType;
  description: React.ReactNode;
  buttonText: string;
};

export const RoomCardTemplate = ({
  room,
  user,
  description,
  buttonText,
}: RoomCardTemplateProps) => {
  const isOwner = room.owner_id && user?.id && Number(room.owner_id) === Number(user?.id);
  return (
    <RoomCard key={room.id} id={room.id.toString()}>
      {isOwner && <RoomCard.TitleSecondary text="You are owner of this room" />}
      <RoomCard.TitleRoom text={room.name} />
      <RoomCard.Description description={description} />
      <RoomCard.ActionButton roomId={room.id} userId={user?.id} text={buttonText} />
    </RoomCard>
  );
};
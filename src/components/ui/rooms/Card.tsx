import { Box } from '@mui/system';
import Card from '@mui/material/Card';
import React, { Fragment } from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { RoomsType } from '@/types/rooms';
import { UsersType } from '@/types/users';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';

export const RoomCard = ({ key, children }: { key: string; children: React.ReactNode }) => {
  return (
    <Box key={key} sx={{ width: 350, marginY: 5, marginX: 'auto' }}>
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

RoomCard.ActionButton = function RoomCardActionButton({ text }: { text: string }) {
  return (
    <CardActions>
      <Button size="small">{text}</Button>
    </CardActions>
  );
};

type RoomCardTemplateProps = {
  key: string;
  room: RoomsType;
  user: UsersType | null;
  description: React.ReactNode;
  buttonText: string;
};

export const RoomCardTemplate = ({
  key,
  room,
  user,
  description,
  buttonText,
}: RoomCardTemplateProps) => {
  const isOwner = room.owner_id && user?.id && Number(room.owner_id) === Number(user?.id);
  return (
    <RoomCard key={key}>
      {isOwner && <RoomCard.TitleSecondary text="You are owner of this room" />}
      <RoomCard.TitleRoom text={room.name} />
      <RoomCard.Description description={description} />
      <RoomCard.ActionButton text={buttonText} />
    </RoomCard>
  );
};
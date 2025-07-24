import { getInitiales, stringAvatar } from '@/middlewares/helpers';
import { MessageType } from '@/types/messages';
import { Avatar, Box, Button, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';

export const RoomLayout = ({
  title,
  messages,
  userId,
  handleSubmit,
  inputRef,
}: {
  title: string;
  messages: MessageType[];
  userId: string | undefined;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) => {
  return (
    <>
      <RoomLayout.Title title={title} />
      <RoomLayout.MessagesBox>
        {messages.length ? (
          messages.map((message: MessageType) => {
            return (
              <RoomLayout.Message
                key={message.key}
                userIsSender={message.userId === userId}
                message={message}
              />
            );
          })
        ) : (
          <RoomLayout.NoMessage />
        )}
        <RoomLayout.MessageForm handleSubmit={handleSubmit} inputRef={inputRef} />
      </RoomLayout.MessagesBox>
    </>
  );
};

RoomLayout.Title = function Title({ title }: { title: string }) {
  return (
    <Typography
      variant="h3"
      component="h3"
      sx={{
        textAlign: 'center',
        mt: 4,
        fontWeight: 600,
        fontSize: '2.5rem',
        lineHeight: 1.2,
        color: '#222222', // soft black color
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      }}
    >
      Welcome to {title}
    </Typography>
  );
};

RoomLayout.MessagesBox = function MessagesBox({ children }: { children: React.ReactNode }) {
  return (
    <Box
      component="section"
      sx={{
        p: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginX: '20%',
      }}
    >
      {children}
    </Box>
  );
};

RoomLayout.NoMessage = function NoMessage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#4b5563',
        fontSize: '1.1rem',
        fontWeight: 500,
        letterSpacing: '0.01em',
        textAlign: 'center',
        px: 2,
      }}
    >
      No messages yet...
      <Typography variant="body2" sx={{ mt: 1, color: '#6b7280', fontSize: '0.9rem' }}>
        Start the conversation by sending a message.
      </Typography>
    </Box>
  );
};

RoomLayout.Message = function Message({
  userIsSender,
  message,
}: {
  userIsSender: boolean;
  message: MessageType;
}) {
  return (
    <Box
      sx={{
        alignSelf: userIsSender ? 'flex-end' : 'flex-start',
        backgroundColor: userIsSender ? '#3b82f6' : '#f3f4f6', // blue-500 or gray-100
        color: userIsSender ? '#ffffff' : '#1f2937', // white or gray-800
        px: 2,
        py: 1.5,
        borderRadius: 3,
        maxWidth: '70%',
        mb: 1,
        fontSize: '1rem',
        boxShadow: 1,
      }}
    >
      <Box sx={{ marginLeft: `${userIsSender ? 'auto' : 'left'}`, display: 'flex' }}>
        {!userIsSender && <Avatar {...stringAvatar(getInitiales(message?.user?.name ?? 'N A'))} />}
        <Box sx={{ marginLeft: 1, display: 'flex', alignItems: 'center', flex: 1 }}>
          <Typography variant="body2" gutterBottom></Typography>
          <Typography variant="body2" gutterBottom>
            {message.content}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

RoomLayout.MessageFormBox = function MessageFormBox({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#f3f4f6',
        borderRadius: '9999px',
        padding: '10px 16px',
        fontSize: '1rem',
        color: '#1f2937',
        border: '1px solid #e5e7eb',
        outline: 'none',
        marginTop: '5rem',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        '&::placeholder': {
          color: '#9ca3af',
          opacity: 1,
        },
        '&:focus': {
          border: '1px solid #3b82f6',
          boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)',
        },
      }}
    >
      {children}
    </Box>
  );
};

RoomLayout.MessageForm = function MessageForm({
  handleSubmit,
  inputRef,
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <RoomLayout.MessageFormBox>
      <form
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
        }}
        onSubmit={handleSubmit}
      >
        <TextField
          inputRef={inputRef}
          sx={{ padding: '8px 0', width: '100%' }}
          name="content"
          id="content"
          aria-placeholder=""
          placeholder="Type your message here ..."
          variant="standard"
          defaultValue=""
          required
        />
        <Button type="submit" endIcon={<SendIcon />}></Button>
      </form>
    </RoomLayout.MessageFormBox>
  );
};

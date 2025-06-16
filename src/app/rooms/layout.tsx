import { SocketProvider } from '@/providers/socket';

const RoomsLayout = ({ children }: { children: React.ReactNode }) => {
  return <SocketProvider>{children}</SocketProvider>;
};

export default RoomsLayout;
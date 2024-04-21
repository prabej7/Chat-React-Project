import { io } from 'socket.io-client';
import url from '../url';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Register from './Register';
import SideBar from '@/components/ui/sideBar';
import { ToastDemo } from './test';
import { useToast } from '@/components/ui/use-toast';
import { formatedTime } from '@/time';





interface Msg {
    username: string,
    text: string
}

interface User {
    username: string,
    id: string
}

const ChatBox: React.FC = () => {
    const { toast } = useToast();
    const [cookies, setCookie, removeCookie] = useCookies(['user', 'allUsers']);
    const [msg, setMsg] = useState<string>("");
    const [render, setRender] = useState<boolean>(false);
    const [allMsg, setAllMsg] = useState<Msg[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [socket, setSocket] = useState<any>(null);


    useEffect(() => {

        const newSocket = io(url);
        setSocket(newSocket);



        return () => {
            newSocket.disconnect();
        };
    }, []);

    const time = formatedTime;

    useEffect(() => {

        if (socket) {
            socket.emit('get-user', 'data');
            socket.on('joined', (name: string) => {
                toast({
                    title: `${name} joined the chat!`,
                    description: `${time}`,
                });
            })
            socket.on('all-user', (data: User[]) => {
                setUsers(data)
            });

            socket.on('send', (data: Msg) => {
                setAllMsg(prev => [...prev, data]);
            });

            socket.on('leave', (data: string) => {
                if (data !== null) {
                    toast({
                        title: `${data} left the chat!`,
                        description: `${time}`,
                    })
                    setUsers(
                        users.filter((user) => {
                            return user.username != data
                        }));
                }
            })
        }

    }, [socket]);

    function hanldeSend() {
        if (msg !== "") {
            let data = {
                username: cookies.user,
                text: msg
            }
            socket.emit('msg', data);
            setRender(!render);
            setMsg("");
        }
    }

    if (!cookies.user) {
        return <Register />
    }


    function handleLogout() {

        // removeCookie('user');
    }


    return (
        <div className='flex justify-center items-center h-screen gap-5'>

            <SideBar users={users} />

            <Card className=' h-96 w-96 flex flex-col justify-around' >
                <ScrollArea className='h-96 overflow-auto' >

                    {allMsg.map((msg) => {
                        return cookies.user === msg.username ? <div className="chat chat-end">
                            <div className="chat-bubble">You: {msg.text}</div>
                        </div> : <div className="chat chat-start">
                            <div className="chat-bubble">{msg.username}: {msg.text}</div>
                        </div>
                    })}

                </ScrollArea>
                <div className='flex' >
                    <Input placeholder='Message' className='rounded-t-none rounded-r-none rounded-br-none' onChange={(e) => setMsg(e.target.value)} value={msg} />
                    <Button style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 0 }} onClick={hanldeSend} >Send</Button>
                </div>
            </Card>
            <Button onClick={handleLogout} > Logout</Button>
        </div>
    )
}

export default ChatBox;

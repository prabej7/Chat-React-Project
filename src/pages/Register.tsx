import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { io } from 'socket.io-client';
import url from "@/url";
const Register: React.FC = () =>{
    const socket = io(url);

    const [cookies, setCookie] = useCookies(['user']);
    const [username, setUsername] = useState<string>("");

    function handleClick(){
        if(username!==""){
            socket.emit('user-joined',username);
            setCookie('user',username,{
                expires: new Date(Date.now() + 365 * 24 *60 * 60 * 1000)
            });
        }else{
            console.log('empty field');
        }
        
    }

   
    return(
        <div className='flex justify-center items-center h-screen flex-col'>
        <div className=' flex flex-col gap-4' >
            <Input placeholder='Username' onChange={(e)=>setUsername(e.target.value)} />
            <Button onClick={handleClick} >Enter</Button>
        </div>
        
    </div>
    )
}

export default Register;
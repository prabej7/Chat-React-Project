import { useCookies } from "react-cookie";
import { Card } from "./card";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

interface Socket{
    username: string,
    id: string
}

interface User {
    users?: Socket[]
}

const SideBar: React.FC<User> = (props) => {
    const [cookie, setCookie] = useCookies(['user']);
    console.log(props.users);
    return (
        <div>
            <Card className="h-96 w-52" >
                <div className=" border-b px-5 py-2 flex gap-5 items-center" >
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className="font-bold text-gray-700" >Hi, Admin</h1>
                </div>
                        {props.users?.map((user)=>{
                            return <div className=" border-b px-5 py-2 text-gray-700 font-semibold hover:bg-gray-100 hover:text-gray-800 hover:cursor-pointer" >
                            {user.username}
                            </div>
                        })}
            </Card>
        </div>
    )
}

export default SideBar;
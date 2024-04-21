import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:'http://localhost:5173'
    },
});

interface Users{
    [key: string]: string;
}

let users: Users = {};

let allUser: any[] = [];

io.on('connection',socket=>{
    socket.on('user-joined',(name)=>{
        users[socket.id] = name;
        allUser.push(
            {username: name, id: socket.id}
        );
        socket.broadcast.emit('joined',name);
        io.emit('all-user',allUser);
    });

    socket.on('get-user',()=>{
        io.emit('all-user',allUser);
    })

    
    socket.on('msg',(data)=>{
        socket.broadcast.emit('send',data);
        socket.emit('send',data);
    });



    socket.on('disconnect',(data)=>{
        allUser = allUser.filter((user)=>{
            return user.username!==users[socket.id]
        });
        socket.broadcast.emit('leave',users[socket.id]);
    });

    
});

app.get('/users',async(req,res)=>{
    io.emit('all-user',users);
    res.send(users);
})

server.listen(5000,()=>{
    console.log('Server is running at port 5000');
})
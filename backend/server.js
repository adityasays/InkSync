const express = require("express")
const app = express();
 
const server = require("http").createServer(app);
const {Server} =  require ("socket.io");
const io = new Server(server);

app.get('/',(req,res)=>{
    res.send("this is a whiteboard")
})
let roomIdG , imgURLG;

io.on("connection",(socket)=>{
    // Log when a new connection is established
    console.log("New client connected");

    socket.on("userJoined" , (data)=>{
        const {name , userId , roomId , host , presenter}=data;
        roomIdG=roomId
        socket.join(roomId);

      

        
        socket.emit("userisJoined" , {success : true});

        
        socket.broadcast.to(roomId).emit("whiteboardDataResponse", {
            imgURL : imgURLG
        });
    });

    socket.on("whiteboardData", (data)=>{
        // Updating  the whiteboard data
        imgURLG = data;

      

        
        socket.broadcast.to(roomIdG).emit("whiteboardDataResponse", {
            imgURL: data
        });
    });
});

const port = process.env.PORT || 5000
server.listen(port,()=>{
    console.log("server is running on http://localhost:5000")
})
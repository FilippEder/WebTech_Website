const ChatSocket = require('../chatsocket/chatsocket')

let chatSocket;

function initSocket(server){
    chatSocket = new ChatSocket(server)
    chatSocket.initSocket();

    chatSocket.io?.on('connection', (socket)=>{
        console.log(`Socket.IO client connected: ${socket.id}`);

        socket.on('jsonData', (data)=>
        console.log(`jsonData from ${socket.id}:`, JSON.stringify(data))
        );
        socket.on('message', (data)=>
        console.log(`message from ${socket.id}:`, JSON.stringify(data))
        );
    });
}

module.exports = { initSocket }
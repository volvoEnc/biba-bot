socketIo.on('connection', socket => {
    SocketService.loadMessage(socket);
    socket.on('send_message', data => {
        SocketService.botMessage(data);
        pre_send(data.text, data.conversation.id);
    })
})
socketIo.on('connection', socket => {
    SocketService.loadMessage(socket);
    socket.on('send_message', data => {
        pre_send(data.text, data.peer_id);
    })
})
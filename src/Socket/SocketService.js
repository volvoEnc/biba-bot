class SocketService {
    static users = [];
    static conversations = [];
    static history = [];

    static getUserInfoCache(userId) {
        return this.users[userId];
    }
    static getConversationInfoCache(conversationId) {
        return this.conversations[conversationId];
    }
    static async getUserInfoVK(userId) {
        return await bot.api('users.get', {user_ids: userId});
    }
    static async getConversationInfoVK(peerId) {
        return await bot.api('messages.getConversationsById', {peer_ids: peerId});
    }
    static async getUserInfo(userId) {
        let user = this.getUserInfoCache(userId);
        if (user === undefined) {
            user = await this.getUserInfoVK(userId);
            this.users[userId] = user;
            return user;
        }
        return user;
    }
    static async getConversationInfo(peerId) {
        let conversation = this.getConversationInfoCache(peerId);
        if (conversation === undefined) {
            conversation = await this.getConversationInfoVK(peerId);
            this.conversations[peerId] = conversation;
            return conversation;
        }
        return conversation;
    }

    static saveMessage(data) {
        this.history.push(data);
        if (this.history.length > 100) {
            this.history.pop();
        }
    }
    static loadMessage(socket) {
        let time = 100;
        this.history.forEach((message, index) => {
            setTimeout(() => {
                socket.emit('new_message', message);
            }, time * index);
        });
    }
    static async sendMessage(message) {
        if (message.from_id !== undefined &&
            message.peer_id !== undefined &&
            message.text !== undefined &&
            message.text !== ''
        ) {
            let conversation = await this.getConversationInfo(message.peer_id);
            if (conversation.count <= 0) return;
            let user = await this.getUserInfo(message.from_id);
            if (user[0] === undefined) return;
            let display_name = user[0].last_name + ' ' + user[0].first_name;
            let data = {
                conversation: {
                    id: message.peer_id,
                    title: conversation.items[0].chat_settings.title,
                    count: conversation.items[0].chat_settings.members_count
                },
                user: {
                    id: message.from_id,
                    display_name: display_name
                },
                text: message.text
            };
            socketIo.emit('new_message', data);
            this.saveMessage(data);
        }
    }
}
global.SocketService = SocketService;
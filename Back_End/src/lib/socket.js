const Server = require('socket.io').Server;
const Message = require('../models/message.model.js');

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.REACT_APP_FRONTEND_URL,
            credentials: true
        }
    });

    const userSockets = new Map(); // { userId: socketId }
    const userActivities = new Map(); // { userId: activity }

    io.on('connection', (socket) => {

        socket.on('user_connected', (userId) => {
            userSockets.set(userId, socket.id);
            userActivities.set(userId, 'idle');

            // broadcast to all other users that this user has logged in
            io.emit('user_connected', userId);

            // send the list of online users to the newly connected user
            socket.emit('users_online', Array.from(userSockets.keys()));

            // sending the activities of users to all other users in real time
            io.emit('activities', Array.from(userActivities.entries()));
        });

        socket.on('update_activity', ({ userId, activity }) => {
            userActivities.set(userId, activity);
            io.emit('activity_updated', { userId, activity });
        });

        socket.on('send_message', async (messageData) => {
            try {
                const { senderId, receiverId, content } = messageData;
                const message = await Message.create({ senderId, receiverId, content });

                // Emit the message to the recipient if they are online
                const recipientSocketId = userSockets.get(receiverId);
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('receive_message', message);
                }

                socket.emit('message_sent', message); // Acknowledge the sender that the message was sent

            } catch (error) {
                console.error('Error saving message:', error);
                socket.emit('error', { message: 'Failed to send message', error: error.message });
            }
        });

        socket.on('disconnect', () => {
            const disconnectedUserId = Array.from(userSockets.entries()).find(([userId, socketId]) => socketId === socket.id)?.[0];
            if (disconnectedUserId) {
                userSockets.delete(disconnectedUserId);
                userActivities.delete(disconnectedUserId);
                io.emit('user_disconnected', disconnectedUserId);
            }
        });
    });


    return io;
};

module.exports = initializeSocket;
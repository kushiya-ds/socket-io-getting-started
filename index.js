import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { setupDB, getScalingAdapter } from './utils.js';

const functionInstanceId = Math.floor(Math.random() * 10000);
console.log('Started with instance id ' + functionInstanceId);

const Message = setupDB();
const __dirname = dirname(fileURLToPath(import.meta.url));
const adapter = await getScalingAdapter();
const app = express();
const server = createServer(app);

// Create Socket.IO server and add Redis adapter
const io = new Server(server, {
  connectionStateRecovery: {},
  adapter: adapter,
});

app.get('/', (req, res) => {
  console.log("Getting / from instance id " + functionInstanceId);
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', async (socket) => {
  console.log("Socket connected on instance id " + functionInstanceId);
  socket.on('chat message', async (msg, clientOffset, callback) => {
    console.log("Got chat message on instance id " + functionInstanceId);
    let result;
    try {
      const message = new Message({
        id: await Message.findOne()
          .sort('-id')
          .then((lastMsg) => (lastMsg?.id || 0) + 1),
        content: msg,
        clientOffset,
      });
      result = await message.save();
    } catch (e) {
      console.error(e);
      callback();
      return;
    }
    io.emit('chat message', msg, result.id);
    callback();
  });

  if (!socket.recovered) {
    try {
      const messages = await Message.find({
        id: { $gt: socket.handshake.auth.serverOffset || 0 },
      });
      messages.forEach((message) => {
        socket.emit('chat message', message.content, message.id);
      });
    } catch (e) {
      console.error(e);
    }
  }
});

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`Server running`);
});

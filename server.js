const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });
  
  
  socket.on('leave_room', (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });

  
  socket.on('chat_message', (data) => {
    io.to(data.room).emit('new_message', data.message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
const mongoose = require('mongoose');


const mongoDB = 'mongodb+srv://HengZhou:<Zh51403225900>@cluster0.xinik57.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected to the database.');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose failed to connect to the database:', err);
});

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String, 
});

const User = mongoose.model('User', UserSchema);


const MessageSchema = new mongoose.Schema({
  room: String,
  username: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', MessageSchema);



  app.use(bodyParser.json());
  app.post('/register', async (req, res) => {
    try {
      
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(400).send('Username already exists');
      }
  
      
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({ username: req.body.username, password: hashedPassword });
  
     
      await user.save();
      res.status(201).send('User registered successfully');
    } catch (error) {
      res.status(500).send('Error registering new user');
    }
  });
  
 
  app.post('/login', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(400).send('User not found');
      }
  
      
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).send('Invalid password');
      }
  
     
      res.status(200).send('User logged in successfully');
    } catch (error) {
      res.status(500).send('Error logging in user');
    }
  });
  
  
  app.post('/sendMessage', async (req, res) => {
    try {
      const { room, username, message } = req.body;
      const newMessage = new Message({ room, username, message });
      await newMessage.save();
      res.status(201).send('Message sent');
    } catch (error) {
      res.status(500).send('Error sending message');
    }
  });


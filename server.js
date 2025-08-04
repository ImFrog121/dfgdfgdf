const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Отдаем статические файлы из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Обработчик корневого пути
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Хранилище пользователей
const users = {};

// Обработка подключений Socket.io
io.on('connection', (socket) => {
  console.log('Новый пользователь подключен:', socket.id);

  // Регистрация пользователя
  socket.on('register', (username) => {
    users[socket.id] = username;
    io.emit('user-list', Object.values(users));
    socket.broadcast.emit('user-connected', username);
  });

  // Отправка сообщений
  socket.on('message', (data) => {
    const { message } = data;
    const username = users[socket.id];
    io.emit('message', {
      username,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  });

  // Отключение пользователя
  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    io.emit('user-list', Object.values(users));
    if (username) {
      socket.broadcast.emit('user-disconnected', username);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
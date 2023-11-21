const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Rota inicial
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Evento de conexão
io.on('connection', (socket) => {
  console.log('Um cliente se conectou');

  // Evento de mensagem
  socket.on('mensagem', (mensagem) => {
    console.log(`Mensagem recebida: ${mensagem}`);

    // Enviar a mensagem de volta para todos os clientes conectados
    socket.emit('mensagem', `Servidor: ${mensagem}`);
  });

  // Evento de desconexão
  socket.on('disconnect', () => {
    console.log('Um cliente se desconectou');
  });
});

// Iniciar o servidor na porta 3000
const porta = 3000;
server.listen(porta, () => {
  console.log(`Servidor está ouvindo na porta ${porta}`);
});

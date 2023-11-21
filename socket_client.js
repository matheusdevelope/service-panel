const io = require('socket.io-client');

const serverUrl = 'http://localhost:3000'; // URL do seu servidor WebSocket

const socket = io(serverUrl);

// Manipulador para quando a conexão for estabelecida
socket.on('connect', () => {
  console.log('Conexão estabelecida com o servidor WebSocket.');
  
  // Emita um evento para ingressar em uma sala
  socket.emit('join room', 'sala-teste');


});
let count = 0;
socket.on("notification", (data) => {
  console.log("notification", data);
  count++;
  if(count > 10){
    socket.emit('leave room', 'sala-teste');
    socket.disconnect();
  }
});
// Manipulador para lidar com desconexão
socket.on('disconnect', () => {
  console.log('Desconectado do servidor WebSocket.');

});

// Realize ações de teste, como enviar mensagens
// setTimeout(() => {
//   socket.emit('chat message', 'Olá, servidor WebSocket!');
// }, 5000); // Envie uma mensagem após 5 segundos

// // Evento para sair da sala
// setTimeout(() => {
//   socket.emit('leave room', 'sala-teste');
// }, 15000); // Saia da sala após 15 segundos


console.log('Cliente WebSocket iniciado.');
const io = require("socket.io-client");

const SERVER_URL = "http://localhost:3000"; 
const socket = io(SERVER_URL, {
  query: {
    room: 
      "9cdc75af-8319-4427-a89e-f3f3bee295ba"
    ,
  },
});

socket.on("connect", () => {
  console.log("Conectado ao servidor");

  // Lógica para enviar dados para o servidor, se necessário
  // socket.emit('data', { /* Seus dados aqui */ });
});

socket.on("data", (data) => {
  console.log("Recebido dados do servidor:", data.rows.length);
});

socket.on("error", (error) => {
  console.log("Erro:", error);
});
socket.on("disconnect", () => {
  console.log("Desconectado do servidor");
});

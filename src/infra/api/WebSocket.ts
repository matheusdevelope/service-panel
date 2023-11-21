import { Server, Socket } from "socket.io";
import HttpServer from "./HttpServer";

export default class WebSocket {
  private io!: Server;
  private rooms: Record<string, Socket[]> = {};

  constructor(readonly httpServer: HttpServer) {}
  init() {
    this.io = new Server(this.httpServer.server, {
      cors: {
        origin: "*",
      },
    });

    this.io.on("connection", (socket) => {
      socket.on("join_room", (roomName: string) => {
        socket.join(roomName);
        if (!this.rooms[roomName]) this.rooms[roomName] = [];
        this.rooms[roomName].push(socket);
      });

      socket.on("leave_room", (roomName: string) => {
        socket.leave(roomName);
        if (this.rooms[roomName])
          this.rooms[roomName] = this.rooms[roomName].filter(
            (client) => client !== socket
          );
      });

      socket.on("available_rooms", () => {
        const rooms = Object.keys(this.rooms);
        socket.emit("available_rooms", rooms);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected");
        for (const roomName in this.rooms) {
          this.rooms[roomName] = this.rooms[roomName].filter(
            (client) => client !== socket
          );
        }
      });
    });

    setInterval(() => {
      for (const roomName in this.rooms) {
        const roomClients = this.rooms[roomName];
        const message = "Esta é uma notificação da sala " + roomName;
        roomClients.forEach((client) => {
          client.emit("notification", message);
        });
      }
    }, 5000);
  }
}

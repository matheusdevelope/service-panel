import { Server } from "socket.io";
import HttpServer from "../HttpServer";
import WebSocketClient from "./WebSocketClient";

export default class WebSocket {
  private io!: Server;
  private clients: Record<string, WebSocketClient> = {};
  
  constructor(readonly httpServer: HttpServer) {}
  init() {
    this.io = new Server(this.httpServer.server, {
      cors: {
        origin: "*",
      },
    });
    this.io.on("connection", (socket) => {
      this.clients[socket.id] = new WebSocketClient(socket);

    });
  }
  emit(event: string, data: any, room?: string) {
    if (room)
      return this.io.to(room).emit(event, {
        room,
        data,
      });

    return this.io.emit(event, data);
  }
  clientsInRoom(room: string) {
    return this.io.sockets.adapter.rooms.get(room)?.size || 0;
  }
  clientsCount() {
    return Object.keys(this.clients).length;
  }
}

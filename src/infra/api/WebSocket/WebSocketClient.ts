import { Socket } from "socket.io";
// import { inject } from "../../../DI";
// import PanelsController from "../../../application/PanelsController";
export default class WebSocketClient {
  rooms: string[] = [];

  // @inject("panelsController")
  // private panelController!: PanelsController;

  constructor(readonly socket: Socket) {
    this.socket.on("join_room", this.joinRoom);
    this.socket.on("leave_room", this.leaveRoom);

    this.socket.on("disconnect", () => {
      this.rooms.forEach((room) => {
        this.socket.leave(room);
      });
    });
  }
  joinRoom = async (rooms: string[] | string) => {
    if (Array.isArray(rooms)) {
      rooms.forEach((room) => {
        this.joinRoom(room);
      });
    } else {
      if (rooms && !this.rooms.includes(rooms)) {
        this.socket.join(rooms);
        this.socket.emit("join_room", rooms);
        this.rooms.push(rooms);
        // await this.panelController.panels
        //   .find((panel) => panel.room === rooms)
        //   ?.sendData();
      }
    }
  };
  leaveRoom = (rooms: string[] | string) => {
    if (Array.isArray(rooms)) {
      rooms.forEach((room) => {
        this.leaveRoom(room);
      });
    } else {
      if (rooms && this.rooms.includes(rooms)) {
        this.socket.leave(rooms);
        this.socket.emit("leave_room", rooms);
        this.rooms = this.rooms.filter((room) => room !== rooms);
      }
    }
  };
}

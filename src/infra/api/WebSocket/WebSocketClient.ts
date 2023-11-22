import { Socket } from "socket.io";
import { inject } from "../../../DI";
import {PanelsControllerInterface} from "../../../application/PanelsController";

export default class WebSocketClient {
  @inject("panelsController")
  private panelsController!: PanelsControllerInterface;

  constructor(readonly socket: Socket) {
    const room = socket.handshake.query.room as string;
    this.init(room);
  }
  init(room: string) {
    try {
      if (room) {
        this.socket.join(room);
        this.panelsController.on(room, "data", this.handler);
        this.socket.on("disconnect", () => {
          this.socket.leave(room);
          this.panelsController.off(room, "data", this.handler);
        });
      } else {
        this.socket.emit("error", "No room to join");
        this.socket.disconnect();
      }
    } catch (error: any) {
      this.socket.emit("error", error.message);
    }
  }
  handler = (data: any) => {
    this.socket.emit("data", data);
  };
}

import { inject } from "../DI";
import Panel from "../domain/entity/Panel";
import Connection from "../infra/database/Connection";
import WebSocket from "../infra/api/WebSocket/WebSocket";

export default class PanelController {
  interval?: NodeJS.Timer;
  roomClientsCount = 0;
  room: string;
  @inject("connection")
  private connection!: Connection;
  @inject("socket")
  private socket!: WebSocket;

  constructor(readonly panel: Panel) {
    this.room = panel.id;
    this.startLoop();
  }

  async sendData() {
    if (this.roomClientsCount === 0) return;
    const data = await this.connection.query(this.panel.statement, []);
    this.socket.emit("data", data, this.room);
  }

  private updateRoomClientsCount() {
    this.roomClientsCount = this.socket.clientsInRoom(this.room);
  }

  private async loopHandler() {
    this.updateRoomClientsCount();
    await this.sendData();
  }

  startLoop() {
    this.interval = setInterval(async () => {
      await this.loopHandler();
    }, this.panel.interval);
  }

  stopLoop = () => {
    if (this.interval) {
      clearInterval(this.interval as NodeJS.Timeout);
      this.interval = undefined;
    }
  }

  isLooping() {
    return this.interval !== undefined;
  }
}

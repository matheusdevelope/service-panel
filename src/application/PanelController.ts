import EventEmitter from "events";
import { inject } from "../DI";
import Panel from "../domain/entity/Panel";
import Connection from "../infra/database/Connection";

export default class PanelController extends EventEmitter {
  interval?: NodeJS.Timer;

  @inject("connection")
  private connection!: Connection;

  constructor(readonly panel: Panel) {
    super();
  }
  private async sendData() {
    const data = await this.connection.query(this.panel.statement, []);
    this.emit("data", data);
  }
  startLoop() {
    this.interval = setInterval(async () => {
      if (this.listenerCount("data") === 0) {
        this.stopLoop();
        return;
      }
      this.sendData();
    }, this.panel.interval);
    this.sendData();
  }
  stopLoop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }
  isLooping() {
    return this.interval !== undefined;
  }
}

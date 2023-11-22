import PanelRepository from "../domain/repository/PanelRepository";
import GetPanels from "./GetPanels";
import PanelController from "./PanelController";

export interface PanelsControllerInterface {
  panels: PanelController[];
  on(room: string, event: string, handler: (...args: any[]) => void): void;
  off(room: string, event: string, handler: (...args: any[]) => void): void;
}

export default class PanelsController implements PanelsControllerInterface {
  panels: PanelController[] = [];
  constructor(private readonly repository: PanelRepository) {}
  async init() {
    if (this.panels.length > 0) return;
    const getPanels = new GetPanels(this.repository);
    const panels = await getPanels.execute();
    this.panels = panels.map((panel) => {
      return new PanelController(panel);
    });
  }
  stop() {
    this.panels.forEach((panel) => {
      panel.stopLoop();
      panel.removeAllListeners();
    });

    this.panels = [];
  }
  on(room: string, event: string, handler: (...args: any[]) => void) {
    const panel = this.panels.find((panel) => panel.panel.id === room);
    if (!panel) throw new Error("Panel not found");
    if (!panel.isLooping()) panel.startLoop();
    panel.on(event, handler);
  }
  off(room: string, event: string, handler: (...args: any[]) => void) {
    const panel = this.panels.find((panel) => panel.panel.id === room);
    if (!panel) throw new Error("Panel not found");
    panel.off(event, handler);
  }
}

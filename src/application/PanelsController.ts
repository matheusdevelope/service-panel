import PanelRepository from "../domain/repository/PanelRepository";
import GetPanels from "./GetPanels";
import PanelController from "./PanelController";

export default class PanelsController {
  panels: PanelController[] = [];
  constructor(private readonly repository: PanelRepository) {}
  async start() {    
    this.stop();
    const getPanels = new GetPanels(this.repository);
    const panels = await getPanels.execute();
    this.panels = panels.map((panel) => {
      return new PanelController(panel);
    });
  }
  stop() {
    this.panels.forEach((panel) => {
      panel.stopLoop();
    });
    this.panels = [];
  }
}


import Panel from "../domain/entity/Panel";
import PanelRepository from "../domain/repository/PanelRepository";

export default class UpdatePanel {
  constructor(private panelRepository: PanelRepository) {}

  async execute(input: PanelInput): Promise<Panel> {
    const panel = new Panel(
      input.id,
      input.description,
      input.statement,
      input.interval
    );
    await this.panelRepository.save(panel);
    return panel;
  }
}

export interface PanelInput {
  id:string;
  description: string;
  statement: string;
  interval: number;
}

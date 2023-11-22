import PanelRepository from "../domain/repository/PanelRepository";

export default class DeletePanel {
  constructor(private readonly panelRepository: PanelRepository) {}

  async execute(id: string): Promise<void> {
    await this.panelRepository.delete(id);
  }
}

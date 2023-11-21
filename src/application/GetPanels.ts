import Panel from "../domain/entity/Panel";
import PanelRepository from "../domain/repository/PanelRepository";


export default class GetPanels {
    constructor(
        private readonly panelRepository: PanelRepository
    ) {}

    async execute(): Promise<Panel[]> {
      return  await this.panelRepository.list();
    }
}
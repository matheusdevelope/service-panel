import Panel from "../domain/entity/Panel";
import PanelRepository from "../domain/repository/PanelRepository";


export default class GetPanel {
    constructor(
        private readonly panelRepository: PanelRepository
    ) {}

    async execute(id:string): Promise<Panel|undefined> {
      const panel = await this.panelRepository.get(id)
      return   panel;
    }
}
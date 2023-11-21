import { randomUUID } from "crypto";
import Panel from "../domain/entity/Panel";
import PanelRepository from "../domain/repository/PanelRepository";


export default class CreatePanel {
    constructor(
        private readonly panelRepository: PanelRepository
    ) {}

    async execute(input:PanelInput): Promise<Panel> {
        const id = randomUUID();
        const panel = new Panel(id, input.description, input.statement, input.interval);
        await this.panelRepository.save(panel);
        return panel;
    }
}

export interface PanelInput{
    description:string;
    statement:string;
    interval:number;
}
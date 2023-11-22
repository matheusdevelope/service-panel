import Panel from "../../domain/entity/Panel";
import PanelRepository from "../../domain/repository/PanelRepository";

export default class PanelInMemoryRepository implements PanelRepository{
    panels: Panel[];

    constructor() {
         this.panels = [];
    }
    async save(panel:Panel): Promise<void> {
        if(await this.get(panel.id)) throw new Error("Panel already exists");
        this.panels.push(panel);
    }
    async get(id?:string): Promise<Panel|undefined> {
         return this.panels.find(panel => panel.id === id);
    }
    async list() : Promise<Panel[]>{
        return this.panels;
    }
    async delete(id:string): Promise<void> {
        this.panels = this.panels.filter(panel => panel.id !== id);
    }
    async migrate(): Promise<void> {
        return;
    }
    
}
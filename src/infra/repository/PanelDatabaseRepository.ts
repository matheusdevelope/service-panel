import Panel from "../../domain/entity/Panel";
import PanelRepository from "../../domain/repository/PanelRepository";
import Connection from "../database/Connection";

export default class PanelDatabaseRepository implements PanelRepository{
    constructor(readonly connection: Connection) {
    }
    async save(panel:Panel): Promise<void> {
       await this.connection.query("INSERT INTO panels (id, description, query) VALUES ($1, $2, $3)", [panel.id, panel.description, panel.statement])

    }
    async get(id?:string): Promise<Panel|undefined> {
         const result = await this.connection.one("SELECT * FROM panels WHERE id = $1", [id])
         if(!result) return undefined;
         const panel = new Panel(result.id, result.description, result.query, result.interval)   
         return panel;
    }
    async list() : Promise<Panel[]>{
        const panels = []
        const result = await this.connection.query("SELECT * FROM panels", [])
        for (let row of result.rows) {
            panels.push(new Panel(row.id, row.description, row.query, row.interval))
        }
        return panels;
    }
    
}
import Query from "../../domain/entity/Query";
import QueryRepository from "../../domain/repository/QueryRepository";
import Connection from "../database/Connection";

export default class QueryDatabaseRepository implements QueryRepository{
    constructor(readonly connection: Connection) {
    }
    async save(panel:Query): Promise<void> {
       await this.connection.query("INSERT INTO panels (id, description, query) VALUES ($1, $2, $3)", [panel.id, panel.description, panel.statement])

    }
    async get(id?:string): Promise<Query|undefined> {
         const result = await this.connection.one("SELECT * FROM panels WHERE id = $1", [id])
         if(!result) return undefined;
         const panel = new Query(result.id, result.description, result.query)   
         return panel;
    }
    async list() : Promise<Query[]>{
        const panels = []
        const result = await this.connection.query("SELECT * FROM panels", [])
        for (let row of result.rows) {
            panels.push(new Query(row.id, row.description, row.query))
        }
        return panels;
    }
    
}
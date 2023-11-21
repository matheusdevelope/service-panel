import Query from "../../domain/entity/Query";
import QueryRepository from "../../domain/repository/QueryRepository";

export default class QueryInMemoryRepository implements QueryRepository{
    querys: Query[];

    constructor() {
         this.querys = [];
    }
    async save(query:Query): Promise<void> {
        if(await this.get(query.id)) throw new Error("Query already exists");
        this.querys.push(query);
    }
    async get(id?:string): Promise<Query|undefined> {
         return this.querys.find(query => query.id === id);
    }
    async list() : Promise<Query[]>{
        return this.querys;
    }
    
}
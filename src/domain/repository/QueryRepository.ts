import Query from "../entity/Query";

export default interface QueryRepository {
    save(panel:Query):Promise<void>;
    get(id:string):Promise<Query|undefined>;
    list():Promise<Query[]>;
}
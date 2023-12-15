import Column from "./Column";


export default class Panel {
    id: string;
    description: string;
    statement: string;
    interval: number;
    columns:Column[] = [];
    constructor(id:string, description:string, statement:string, interval:number, columns:Column[] = [])
    {
        if(!id) throw new Error("Panel id is required");
        if(!description) throw new Error("Panel description is required");
        if(!statement) throw new Error("Panel statement is required");
        if(!interval) throw new Error("Panel interval is required");
        this.id = id;
        this.description = description;
        this.statement = statement;
        this.interval = interval;
        this.columns = columns;
    }
}
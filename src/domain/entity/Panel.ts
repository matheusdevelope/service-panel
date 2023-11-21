

export default class Panel {
    id: string;
    description: string;
    statement: string;
    interval: number;
    
    constructor(id:string, description:string, statement:string, interval:number)
    {
        if(!id) throw new Error("Panel id is required");
        if(!description) throw new Error("Panel description is required");
        if(!statement) throw new Error("Panel statement is required");
        if(!interval) throw new Error("Panel interval is required");
        this.id = id;
        this.description = description;
        this.statement = statement;
        this.interval = interval;
    }
}


export default class Query {
    id: string;
    description: string;
    statement: string;
    
    constructor(id:string, description:string, statement:string)
    {
        if(!id) throw new Error("Panel id is required");
        if(!description) throw new Error("Panel description is required");
        if(!statement) throw new Error("Panel statement is required");
        this.id = id;
        this.description = description;
        this.statement = statement;
    }
}
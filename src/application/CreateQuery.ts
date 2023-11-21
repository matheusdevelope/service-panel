import { randomUUID } from "crypto";
import Query from "../domain/entity/Query";
import QueryRepository from "../domain/repository/QueryRepository";


export default class CreateQuery {
    constructor(
        private readonly queryRepository: QueryRepository
    ) {}

    async execute(input:QueryInput): Promise<Query> {
        const id = randomUUID();
        const query = new Query(id, input.description, input.statement);
        await this.queryRepository.save(query);
        return query;
    }
}

export interface QueryInput{
    description:string;
    statement:string;
}
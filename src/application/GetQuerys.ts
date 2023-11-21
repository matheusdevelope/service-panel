import Query from "../domain/entity/Query";
import QueryRepository from "../domain/repository/QueryRepository";


export default class GetQuerys {
    constructor(
        private readonly queryRepository: QueryRepository
    ) {}

    async execute(): Promise<Query[]> {
      return  await this.queryRepository.list();
    }
}
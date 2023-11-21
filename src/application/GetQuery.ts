import Query from "../domain/entity/Query";
import QueryRepository from "../domain/repository/QueryRepository";


export default class GetQuery {
    constructor(
        private readonly queryRepository: QueryRepository
    ) {}

    async execute(id:string): Promise<Query|undefined> {
      const query = await this.queryRepository.get(id)
      return   query;
    }
}
import { describe, expect, test } from "vitest";
import QueryInMemoryRepository from "../../src/infra/repository/QueryInMemoryRepository";
import CreateQuery, { QueryInput } from "../../src/application/CreateQuery";
import GetQuery from "../../src/application/GetQuery";

describe("GetQuerys", () => {
  test("should get a Query", async () => {
    let QueryRepository = new QueryInMemoryRepository();
    let createQuery = new CreateQuery(QueryRepository);
    const input: QueryInput = {
      description: "Test Panel",
      statement: "SELECT * FROM test",
    };
    const query = await createQuery.execute(input);
    let getQuery = new GetQuery(QueryRepository);
    const ret_Query = await getQuery.execute(query.id);
    expect(ret_Query).toBeDefined();
    expect(ret_Query?.id).toEqual(query.id);
  });
});

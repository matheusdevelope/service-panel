
import {  describe, expect, test } from "vitest";
import QueryInMemoryRepository from "../../src/infra/repository/QueryInMemoryRepository";
import GetQuerys from "../../src/application/GetQuerys";
import CreateQuery, { QueryInput } from "../../src/application/CreateQuery";

describe("GetQuerys", () => {
    test('should get all panels', async () => {
        let panelRepository = new QueryInMemoryRepository();
        let getQuerys = new GetQuerys(panelRepository);
        expect((await getQuerys.execute()).length).toEqual(0);
        let createQuery = new CreateQuery(panelRepository);
        const input: QueryInput = {
            description: "Test Panel",
            statement: "SELECT * FROM test",
          };
        await createQuery.execute(input);
        await createQuery.execute(input);
        expect((await getQuerys.execute()).length).toEqual(2);
    });
})
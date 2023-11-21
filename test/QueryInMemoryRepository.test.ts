import { beforeEach, describe, expect, test } from "vitest";
import QueryInMemoryRepository from "../src/infra/repository/QueryInMemoryRepository";
import Query from "../src/domain/entity/Query";

describe("QueryInMemoryRepository", () => {
  let repository: QueryInMemoryRepository;

  beforeEach(() => {
    repository = new QueryInMemoryRepository();
  });

  test("should create a new repository instance", () => {
    expect(repository.querys).toEqual([]);
  });

  test("should save a new query", async () => {
    const query = new Query("1", "Test Query", "SELECT * FROM users");
    await repository.save(query);
    expect(repository.querys).toEqual([query]);
  });

  test("should throw an error if query already exists", async () => {
    const query = new Query("1", "Test Query", "SELECT * FROM users");
    await repository.save(query);
    await expect(repository.save(query)).rejects.toThrow(
      "Query already exists"
    );
  });

  test("should get a query by id", async () => {
    const query = new Query("1", "Test Query", "SELECT * FROM users");
    await repository.save(query);
    const result = await repository.get("1");
    expect(result).toEqual(query);
  });

  test("should return undefined if query does not exist", async () => {
    const result = await repository.get("1");
    expect(result).toBeUndefined();
  });

  test("should list all querys", async () => {
    const query1 = new Query("1", "Test Query 1", "SELECT * FROM users");
    const query2 = new Query("2", "Test Query 2", "SELECT * FROM orders");
    await repository.save(query1);
    await repository.save(query2);
    const result = await repository.list();
    expect(result).toEqual([query1, query2]);
  });
});
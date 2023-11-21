import { describe, expect, test } from "vitest";
import Query from "../src/domain/entity/Query";

describe("Query", () => {
  test("should create a new Query instance", () => {
    const id = "1";
    const description = "Test Query";
    const statement = "SELECT * FROM users";
    const query = new Query(id, description, statement);
    expect(query.id).toEqual(id);
    expect(query.description).toEqual(description);
    expect(query.statement).toEqual(statement);
  });

  test("should throw an error if id is not provided", () => {
    expect(() => new Query("", "Test Query", "SELECT * FROM users")).toThrow(
      "Panel id is required"
    );
  });

  test("should throw an error if description is not provided", () => {
    expect(() => new Query("1", "", "SELECT * FROM users")).toThrow(
      "Panel description is required"
    );
  });

  test("should throw an error if statement is not provided", () => {
    expect(() => new Query("1", "Test Query", "")).toThrow(
      "Panel statement is required"
    );
  });
});
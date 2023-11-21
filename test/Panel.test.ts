import { describe, expect, test } from "vitest";
import Panel from "../src/domain/entity/Panel";

const interval = 1000;
describe("Panel", () => {
  test("should create a new Panel instance", () => {
    const id = "1";
    const description = "Test Panel";
    const statement = "SELECT * FROM users";
    const panel = new Panel(id, description, statement, interval);
    expect(panel.id).toEqual(id);
    expect(panel.description).toEqual(description);
    expect(panel.statement).toEqual(statement);
  });

  test("should throw an error if id is not provided", () => {
    expect(() => new Panel("", "Test Panel", "SELECT * FROM users", interval)).toThrow(
      "Panel id is required"
    );
  });

  test("should throw an error if description is not provided", () => {
    expect(() => new Panel("1", "", "SELECT * FROM users", interval)).toThrow(
      "Panel description is required"
    );
  });

  test("should throw an error if statement is not provided", () => {
    expect(() => new Panel("1", "Test Panel", "", interval)).toThrow(
      "Panel statement is required"
    );
  });
  test("should throw an error if interva is not provided or invalid", () => {
    expect(() => new Panel("1", "Test Panel", "", 0)).toThrow(
      "Panel statement is required"
    );
  });
});
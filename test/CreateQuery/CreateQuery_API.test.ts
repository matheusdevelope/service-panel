import { describe, expect, test } from "vitest";
import axios from "axios";
import { QueryInput } from "../../src/application/CreateQuery";
import { test_base_url } from "../constants";
const base_url = test_base_url;

describe("CreatePanel API", () => {
  test("should create a new query", async () => {
    const input: QueryInput = {
      description: "Test Panel",
      statement: "SELECT * FROM test",
    };
    try {
      const query = await axios.post(`${base_url}/querys`, input);

      expect(query.data.id).toBeDefined();
      expect(query.status).toBe(201);
      expect(query.data.description).toBe(input.description);
      expect(query.data.statement).toBe(input.statement);
    } catch (error:any) {
      throw new Error(`status: ${error.response.status} - ${error.response.data}`);
    }
  });
});

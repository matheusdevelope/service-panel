import { describe, expect, test } from "vitest";
import axios from "axios";
import { QueryInput } from "../../src/application/CreateQuery";
import { test_base_url } from "../constants";
const base_url = test_base_url;

describe("GetQuery API", () => {
  test("should get a Query", async () => {
    const input: QueryInput = {
      description: "Test Panel",
      statement: "SELECT * FROM test",
    };
    const query_created = await axios.post(`${base_url}/querys`, input, {
      validateStatus: () => true,
    });
    const query = await axios.get(
      `${base_url}/querys/${query_created.data.id}`,
      { validateStatus: () => true }
    );
    expect(query.status).toBe(200);
    expect(query.data.id).toBe(query_created.data.id);
  });

  test("should not get a Query", async () => {
    const query = await axios.get(`${base_url}/querys/aabb123`, {
      validateStatus: () => true,
    });
    expect(query.status).toBe(404);
  });
});

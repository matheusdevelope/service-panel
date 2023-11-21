import { describe, expect, test } from "vitest";
import axios from "axios";
import { test_base_url } from "../constants";
const base_url = test_base_url;

describe("GetQuerys API", () => {
  test("should get a list of Querys", async () => {
    const query = await axios.get(`${base_url}/querys`, {
      validateStatus: () => true,
    });
    expect(query.status).toBe(200);
    expect(query.data).toBeDefined();
    expect(Array.isArray(query.data)).toBe(true);

  });
});

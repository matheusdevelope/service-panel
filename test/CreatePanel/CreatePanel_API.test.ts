import { describe, expect, test } from "vitest";
import axios from "axios";
import { PanelInput } from "../../src/application/CreatePanel";
import { test_base_url } from "../constants";
const base_url = test_base_url;

describe("CreatePanel API", () => {
  test("should create a new panel", async () => {
    const input: PanelInput = {
      description: "Test Panel",
      statement: "SELECT * FROM test",
      interval: 1000,
    };
    try {
      const panel = await axios.post(`${base_url}/panels`, input);

      expect(panel.data.id).toBeDefined();
      expect(panel.status).toBe(201);
      expect(panel.data.description).toBe(input.description);
      expect(panel.data.statement).toBe(input.statement);
    } catch (error:any) {
      throw new Error(`status: ${error.response.status} - ${error.response.data}`);
    }
  });
});

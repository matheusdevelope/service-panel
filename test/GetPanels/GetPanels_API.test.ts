import { describe, expect, test } from "vitest";
import axios from "axios";
import { test_base_url } from "../constants";
const base_url = test_base_url;

describe("GetPanels API", () => {
  test("should get a list of Panels", async () => {
    const panel = await axios.get(`${base_url}/panels`, {
      validateStatus: () => true,
    });
    expect(panel.status).toBe(200);
    expect(panel.data).toBeDefined();
    expect(Array.isArray(panel.data)).toBe(true);

  });
});

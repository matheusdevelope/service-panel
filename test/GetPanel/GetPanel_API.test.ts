import { describe, expect, test } from "vitest";
import axios from "axios";
import { PanelInput } from "../../src/application/CreatePanel";
import { test_base_url } from "../constants";
const base_url = test_base_url;

describe("GetPanel API", () => {
  test("should get a Panel", async () => {
    const input: PanelInput = {
      description: "Test Panel",
      statement: "SELECT * FROM test",
      interval: 1000,
    };
    const panel_created = await axios.post(`${base_url}/panels`, input, {
      validateStatus: () => true,
    });
    const panel = await axios.get(
      `${base_url}/panels/${panel_created.data.id}`,
      { validateStatus: () => true }
    );
    expect(panel.status).toBe(200);
    expect(panel.data.id).toBe(panel_created.data.id);
  });

  test("should not get a Panel", async () => {
    const panel = await axios.get(`${base_url}/panels/aabb123`, {
      validateStatus: () => true,
    });
    expect(panel.status).toBe(404);
  });
});

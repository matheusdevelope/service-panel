import { beforeAll, describe, expect, test } from "vitest";
import axios from "axios";
import { test_base_url } from "../constants";
import Panel from "../../src/domain/entity/Panel";
const base_url = test_base_url;
let panel: Panel;
describe("DeletePanels API", () => {
  beforeAll(async () => {
    panel = (
      await axios.post(
        `${base_url}/panels`,
        {
          description: "Test Panel",
          statement: "SELECT * FROM Paineis",
          interval: 1000,
        },
        { validateStatus: () => true }
      )
    ).data;
  });
  test("should delete a Panel", async () => {
    const ret = await axios.delete(`${base_url}/panels/${panel.id}`, {
      validateStatus: () => true,
    });
    expect(ret.status).toBe(200);
  });
});

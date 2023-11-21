import { describe, expect, test } from "vitest";
import PanelInMemoryRepository from "../../src/infra/repository/PanelInMemoryRepository";
import CreatePanel, { PanelInput } from "../../src/application/CreatePanel";
import GetPanel from "../../src/application/GetPanel";

describe("GetPanels", () => {
  test("should get a Panel", async () => {
    let PanelRepository = new PanelInMemoryRepository();
    let createPanel = new CreatePanel(PanelRepository);
    const input: PanelInput = {
      description: "Test Panel",
      statement: "SELECT * FROM test",
      interval: 1000,
    };
    const panel = await createPanel.execute(input);
    let getPanel = new GetPanel(PanelRepository);
    const ret_Panel = await getPanel.execute(panel.id);
    expect(ret_Panel).toBeDefined();
    expect(ret_Panel?.id).toEqual(panel.id);
  });
});

import { afterAll, beforeAll, describe, expect, test } from "vitest";
import PanelInMemoryRepository from "../../src/infra/repository/PanelInMemoryRepository";
import GetPanels from "../../src/application/GetPanels";
import CreatePanel, { PanelInput } from "../../src/application/CreatePanel";
import DeletePanel from "../../src/application/DeletePanel";
import GetPanel from "../../src/application/GetPanel";
let getPanels: GetPanels;
let getPanel: GetPanel;
let createPanel: CreatePanel;
let deletePanel: DeletePanel;
const input: PanelInput = {
  description: "Test Panel",
  statement: "SELECT * FROM Paineis",
  interval: 1000,
};
describe("DeletePanels", () => {
  beforeAll(() => {
    let panelRepository = new PanelInMemoryRepository();
    getPanels = new GetPanels(panelRepository);
    getPanel = new GetPanel(panelRepository);
    createPanel = new CreatePanel(panelRepository);
    deletePanel = new DeletePanel(panelRepository);
  });
  afterAll(async () => {
    console.log("Cleaning up...");
    
    const panes = await getPanels.execute();
    for (const panel of panes) {
      await deletePanel.execute(panel.id);
    }
  });
  test("should delete a panel", async () => {
    const panel_created = await createPanel.execute(input);
    await deletePanel.execute(panel_created.id);
    const panel = await getPanel.execute(panel_created.id);
    expect(panel).toBeUndefined();
  });
});

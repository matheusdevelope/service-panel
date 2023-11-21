import { describe, expect, test } from "vitest";
import CreatePanel, { PanelInput } from "../../src/application/CreatePanel";
import PanelInMemoryRepository from "../../src/infra/repository/PanelInMemoryRepository";

describe("CreatePanel", () => {
  test("should create a new panel", async () => {
    let panelRepository = new PanelInMemoryRepository();
    let createPanel = new CreatePanel(panelRepository);
    const input: PanelInput = {
      description: "Test Panel",
      statement: "SELECT * FROM test",
      interval: 1000,
    };
    const panel = await createPanel.execute(input);
    const get_panel = await panelRepository.get(panel.id);
    expect(get_panel).toBeDefined();
    expect(get_panel?.id).toBe(panel.id);
  });
});

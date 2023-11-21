import { describe, expect, test } from "vitest";
import CreatePanel, { QueryInput } from "../../src/application/CreateQuery";
import PanelInMemoryRepository from "../../src/infra/repository/QueryInMemoryRepository";

describe("CreatePanel", () => {
  test("should create a new panel", async () => {
    let panelRepository = new PanelInMemoryRepository();
    let createPanel = new CreatePanel(panelRepository);
    const input: QueryInput = {
      description: "Test Panel",
      statement: "SELECT * FROM test",
    };
    const panel = await createPanel.execute(input);
    const get_panel = await panelRepository.get(panel.id);
    expect(get_panel).toBeDefined();
    expect(get_panel?.id).toBe(panel.id);
  });
});

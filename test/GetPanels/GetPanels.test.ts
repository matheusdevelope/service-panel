
import {  describe, expect, test } from "vitest";
import PanelInMemoryRepository from "../../src/infra/repository/PanelInMemoryRepository";
import GetPanels from "../../src/application/GetPanels";
import CreatePanel, { PanelInput } from "../../src/application/CreatePanel";

describe("GetPanels", () => {
    test('should get all panels', async () => {
        let panelRepository = new PanelInMemoryRepository();
        let getPanels = new GetPanels(panelRepository);
        expect((await getPanels.execute()).length).toEqual(0);
        let createPanel = new CreatePanel(panelRepository);
        const input: PanelInput = {
            description: "Test Panel",
            statement: "SELECT * FROM test",
            interval: 1000
          };
        await createPanel.execute(input);
        await createPanel.execute(input);
        expect((await getPanels.execute()).length).toEqual(2);
    });
})
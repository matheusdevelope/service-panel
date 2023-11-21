import { beforeEach, describe, expect, test } from "vitest";
import PanelInMemoryRepository from "../src/infra/repository/PanelInMemoryRepository";
import Panel from "../src/domain/entity/Panel";

const interval = 1000;
describe("PanelInMemoryRepository", () => {
  let repository: PanelInMemoryRepository;

  beforeEach(() => {
    repository = new PanelInMemoryRepository();
  });

  test("should create a new repository instance", () => {
    expect(repository.panels).toEqual([]);
  });

  test("should save a new panel", async () => {
    const panel = new Panel("1", "Test Panel", "SELECT * FROM users", interval);
    await repository.save(panel);
    expect(repository.panels).toEqual([panel]);
  });

  test("should throw an error if panel already exists", async () => {
    const panel = new Panel("1", "Test Panel", "SELECT * FROM users", interval);
    await repository.save(panel);
    await expect(repository.save(panel)).rejects.toThrow(
      "Panel already exists"
    );
  });

  test("should get a panel by id", async () => {
    const panel = new Panel("1", "Test Panel", "SELECT * FROM users", interval);
    await repository.save(panel);
    const result = await repository.get("1");
    expect(result).toEqual(panel);
  });

  test("should return undefined if panel does not exist", async () => {
    const result = await repository.get("1");
    expect(result).toBeUndefined();
  });

  test("should list all panels", async () => {
    const panel1 = new Panel("1", "Test Panel 1", "SELECT * FROM users", interval);
    const panel2 = new Panel("2", "Test Panel 2", "SELECT * FROM orders", interval);
    await repository.save(panel1);
    await repository.save(panel2);
    const result = await repository.list();
    expect(result).toEqual([panel1, panel2]);
  });
});
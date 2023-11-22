import Panel from "../../domain/entity/Panel";
import PanelRepository from "../../domain/repository/PanelRepository";
import Connection from "../database/Connection";

export default class PanelDatabaseRepository implements PanelRepository {
  constructor(readonly connection: Connection) {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.migrate();
  }

  async save(panel: Panel): Promise<void> {
    try {
      await this.connection.query(panel.statement, []);
    } catch (e) {
      throw new Error("Invalid statement, please check your statement");
    }
    if (await this.get(panel.id)) {
      await this.connection.query(
        "UPDATE Paineis SET Descricao = @1, Query = @2, Intervalo = @3 WHERE CodPainel = @4",
        [panel.description, panel.statement, panel.interval, panel.id]
      );
      return;
    }
    await this.connection.query(
      "INSERT INTO Paineis (CodPainel, Descricao, Query, Intervalo) VALUES (@1, @2, @3, @4)",
      [panel.id, panel.description, panel.statement, panel.interval]
    );
  }
  async get(id?: string): Promise<Panel | undefined> {
    const result = await this.connection.one(
      "SELECT * FROM Paineis WHERE CodPainel = @1",
      [id]
    );
    if (!result) return undefined;
    const panel = new Panel(
      result.CodPainel,
      result.Descricao,
      result.Query,
      result.Intervalo
    );
    return panel;
  }
  async delete(id: string): Promise<void> {
    const panel = await this.get(id);
    if (!panel) return undefined;
    await this.connection.query("DELETE FROM Paineis WHERE CodPainel = @1", [
      id,
    ]);
  }
  async list(): Promise<Panel[]> {
    const panels = [];
    const result = await this.connection.query("SELECT * FROM Paineis", []);
    for (let row of result.rows) {
      panels.push(new Panel(row.CodPainel, row.Descricao, row.Query, row.Intervalo));
    }
    return panels;
  }
  async migrate(): Promise<void> {
    try {
      const createTableQuery = `
                IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Paineis')
                BEGIN
                    CREATE TABLE Paineis (
                        CodPainel VARCHAR(255) PRIMARY KEY,
                        Descricao VARCHAR(255),
                        Query VARCHAR(MAX),
                        Intervalo INT
                    );
                END`;
      await this.connection.query(createTableQuery, []);
    } catch (error) {
      console.error("Erro ao migrar tabela 'Paineis':", error);
      throw error;
    }
  }
}

import Column from "../../domain/entity/Column";
import Panel from "../../domain/entity/Panel";
import PanelRepository from "../../domain/repository/PanelRepository";
import Connection from "../database/Connection";

export default class PanelDatabaseRepository implements PanelRepository {
 private _schema: string | undefined;
  constructor(readonly connection: Connection,  schema?: string) {
    this._schema = schema;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    //await this.migrate();
  }

  get schema(): string  {
    return this._schema ? this._schema.endsWith(".")  ? this._schema : this._schema+ "." : "";
  }

  async save(panel: Panel): Promise<void> {
    try {
      await this.connection.query(panel.statement, []);
    } catch (e) {
      throw new Error("Invalid statement, please check your statement");
    }
    if (await this.get(panel.id)) {
      await this.connection.query(
        "UPDATE " + this.schema + "Paineis SET Descricao = @1, Query = @2, Intervalo = @3, WHERE CodPainel = @4",
        [panel.description, panel.statement, panel.interval, panel.id]
      );
      return;
    }
    await this.connection.query(
      "INSERT INTO " + this.schema + "Paineis (CodPainel, Descricao, Query, Intervalo) VALUES (@1, @2, @3, @4)",
      [panel.id, panel.description, panel.statement, panel.interval]
    );
  }
  async get(id?: string): Promise<Panel | undefined> {
    const result = await this.connection.one(
      "SELECT * FROM " + this.schema + "Paineis WHERE CodPainel = @1",
      [id]
    );
    if (!result) return undefined;

    const columns = await this.getColumnsFromQuery(result.Query);

    const panel = new Panel(
      result.CodPainel,
      result.Descricao,
      result.Query,
      result.Intervalo,
      columns
    );
    return panel;
  }
  async delete(id: string): Promise<void> {
    const panel = await this.get(id);
    if (!panel) return undefined;
    await this.connection.query("DELETE FROM " + this.schema + "Paineis WHERE CodPainel = @1", [
      id,
    ]);
  }
  async list(): Promise<Panel[]> {
    const panels = [];
    const result = await this.connection.query("SELECT * FROM " + this.schema + "Paineis", []);
    for (let row of result.rows) {
      const columns = await this.getColumnsFromQuery(row.Query);
      
      panels.push(
        new Panel(
          row.CodPainel,
          row.Descricao,
          row.Query,
          row.Intervalo,
          columns
        )
      );
    }
    return panels;
  }
  async migrate(): Promise<void> {
    try {
      const createTableQuery = `
                IF NOT EXISTS (SELECT 1 FROM sysobjects WHERE type = 'U' AND name = 'Paineis')
                BEGIN
                    CREATE TABLE Paineis (
                        CodPainel VARCHAR(255) PRIMARY KEY,
                        Descricao VARCHAR(255) NOT NULL,
                        Query VARCHAR(8000) NOT NULL,
                        Intervalo INT NOT NULL,
                        Duracao INT NOT NULL,
                    );
                END`;
      await this.connection.query(createTableQuery, []);
    } catch (error) {
      console.error("Erro ao migrar tabela 'Paineis':", error);
      throw error;
    }
  }

  private async getColumnsFromQuery(query: string): Promise<Column[]> {
    try {
      const result = (await this.connection.one(query, [])) as {
        [key: string]: any;
      };
      const columns: Column[] = [];
      for (let key in result) {

        const value = result[key];
        
        columns.push(new Column(key, typeof value));
      }      
      return columns;
    } catch (error) {
      console.log("Erro ao obter colunas da query:", error);

      return [];
    }
  }
}

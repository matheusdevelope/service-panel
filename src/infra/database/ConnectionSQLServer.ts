import sql from "mssql";
import Connection from "./Connection";
import { Config } from "./Config";
export default class ConnectionSQLServer implements Connection {
  private pool: sql.ConnectionPool;
  constructor(readonly config: Config) {
    this.pool = new sql.ConnectionPool({
      user: config.user,
      password: config.password,
      server: config.host,
      database: config.database,
      port: config.port,
      options: {
        encrypt: false,
        enableArithAbort: true,
      },
    });
  }
  async query(query: string, params: any[]): Promise<any> {
    try {
      await this.pool.connect();
      const request = this.pool.request();      
      if (params) {
        params.forEach((param, index) => {          
          request.input(`${index + 1}`, param);
        });
      }
      const result = await request.query(query);
      return {
        rows: result.recordset,
        rowCount: result.rowsAffected[0],
      };
    } catch (error) {
      throw error;
    }
  }
  async one(query: string, params: any[]): Promise<any> {
    try {
      await this.pool.connect();
      const request = this.pool.request();
      if (params) {
        params.forEach((param, index) => {          
          request.input(`${index + 1}`, param);
        });
      }

      const result = await request.query(query);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }
  async open(): Promise<void> {
    await this.pool.connect();
  }
  async close(): Promise<void> {
    await this.pool.close();
  }
}

import Express, { Request, Response } from "express";
import HttpServer, { ResponseHttpServer } from "./HttpServer";
import { Server, createServer } from "http";
import cors from 'cors'

export default class ExpressAdapter implements HttpServer {
  app: any;
  server: Server;
  constructor() {
    this.app = Express();
    this.app.use(Express.json());
    this.app.use(
      cors({
        origin: "*",
      })
    );
    this.server = createServer(this.app);
  }
  on(
    method: string,
    url: string,
    callback: (params: any, body: any) => Promise<ResponseHttpServer>
  ): void {
    this.app[method](url, async (req: Request, res: Response) => {
      try {
        const output = await callback(req.params, req.body);
        res.status(output.status || 200).json(output.body);
      } catch (error) {
        res.status(500).end();
      }
    });
  }
  listen(port: number, callback: Function): void {
    this.server.listen(port, () => [callback()]);
  }
}

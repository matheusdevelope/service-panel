import CreateQuery from "../../application/CreateQuery";
import GetQuery from "../../application/GetQuery";
import GetQuerys from "../../application/GetQuerys";
import HttpServer from "./HttpServer";
import QueryRepository from "../../domain/repository/QueryRepository";

export default class Router {
  constructor(
    readonly httpServer: HttpServer,
    readonly queryRepository: QueryRepository
  ) {}
  init() {
    this.httpServer.on("post", "/querys", async (params: any, body: any) => {
      try {
        const createQuery = new CreateQuery(this.queryRepository);
        const query = await createQuery.execute({description: body.description, statement: body.statement});
        const ret = { status: 201, body: query };
        return ret;
      } catch (error: any) {
        return { status: 500, body: error.message };
      }
    });

    this.httpServer.on("get", "/querys", async (params: any, body: any) => {
      try {
        const getQuerys = new GetQuerys(this.queryRepository);
        const query = await getQuerys.execute();
        const ret = { status: 200, body: query };
        return ret;
      } catch (error: any) {
        return { status: 500, body: error.message };
      }
    });

    this.httpServer.on("get", "/querys/:id", async (params: any, body: any) => {
      try {
        const getQuery = new GetQuery(this.queryRepository);
        const query = await getQuery.execute(params.id);
        if (!query) {
          return { status: 404 };
        }
        return { status: 200, body: query };
      } catch (error: any) {
        return { status: 500, body: error.message };
      }
    });
  }
}

import { inject } from "../../DI";
import CreatePanel from "../../application/CreatePanel";
import GetPanel from "../../application/GetPanel";
import GetPanels from "../../application/GetPanels";
import HttpServer from "./HttpServer";
import PanelRepository from "../../domain/repository/PanelRepository";
import DeletePanel from "../../application/DeletePanel";
import UpdatePanel from "../../application/UpdatePanel";
import WebSocket from "./WebSocket/WebSocket";
import PanelsController from "../../application/PanelsController";

export default class Router {
  @inject("socket")
  private socket!: WebSocket;
  @inject("panelsController")
  private panelsController: PanelsController | undefined;
  constructor(
    readonly httpServer: HttpServer,
    readonly panelRepository: PanelRepository
  ) {}
  init() {
    this.httpServer.on("post", "/panels", async (params: any, body: any) => {
      try {
        const createPanel = new CreatePanel(this.panelRepository);

        const panel = await createPanel.execute({
          description: body.description,
          statement: body.statement,
          interval: body.interval,
        });
        const ret = { status: 201, body: panel };
        this.restartPanelsController();
        return ret;
      } catch (error: any) {
        return { status: 400, body: error.message };
      }
    });

    this.httpServer.on("put", "/panels/:id", async (params: any, body: any) => {
      try {
        const createPanel = new UpdatePanel(this.panelRepository);
        const panel = await createPanel.execute({
          id: params.id,
          description: body.description,
          statement: body.statement,
          interval: body.interval,
        });
        const ret = { status: 201, body: panel };
        this.restartPanelsController();
        return ret;
      } catch (error: any) {
        return { status: 400, body: error.message };
      }
    });

    this.httpServer.on("get", "/panels", async (params: any, body: any) => {
      try {
        const getPanels = new GetPanels(this.panelRepository);
        const panel = await getPanels.execute();
        const ret = { status: 200, body: panel };
        return ret;
      } catch (error: any) {
        return { status: 500, body: error.message };
      }
    });

    this.httpServer.on("get", "/panels/:id", async (params: any, body: any) => {
      try {
        const getPanel = new GetPanel(this.panelRepository);
        const panel = await getPanel.execute(params.id);
        if (!panel) {
          return { status: 404 };
        }
        return { status: 200, body: panel };
      } catch (error: any) {
        return { status: 500, body: error.message };
      }
    });

    this.httpServer.on(
      "delete",
      "/panels/:id",
      async (params: any, body: any) => {
        try {
          const getPanel = new GetPanel(this.panelRepository);
          const panel = await getPanel.execute(params.id);
          if (!panel) {
            return { status: 404 };
          }
          const deletePanel = new DeletePanel(this.panelRepository);
          await deletePanel.execute(params.id);
          const ret = { status: 200, body: panel };
          this.restartPanelsController();
          return ret;
        } catch (error: any) {
          return { status: 500, body: error.message };
        }
      }
    );

    this.httpServer.on(
      "get",
      "/panels-connected",
      async (params: any, body: any) => {
        try {
          const ret = {
            status: 200,
            body: {
              clients: this.socket.clientsCount(),
            },
          };
          return ret;
        } catch (error: any) {
          return { status: 500, body: error.message };
        }
      }
    );

    this.httpServer.on(
      "get",
      "/panels/start",
      async (params: any, body: any) => {
        try {
          this.panelsController?.start();
          const ret = {
            status: 200,
            body: {
              message: "Panels restarted",
            },
          };
          return ret;
        } catch (error: any) {
          return { status: 500, body: error.message };
        }
      }
    );
    this.httpServer.on(
      "get",
      "/panels/stop",
      async (params: any, body: any) => {
        try {
          this.panelsController?.stop();
          const ret = {
            status: 200,
            body: {
              message: "Panels restarted",
            },
          };
          return ret;
        } catch (error: any) {
          return { status: 500, body: error.message };
        }
      }
    );
  }
  restartPanelsController = () => {
    if (this.panelsController) {
      this.panelsController.start();
    }
  };
}

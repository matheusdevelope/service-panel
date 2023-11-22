import dotenv from "dotenv";
dotenv.config();
import { Registry } from "./DI";
import ExpressAdapter from "./infra/api/ExpressAdapter";
import Router from "./infra/api/Router";
import WebSocket from "./infra/api/WebSocket/WebSocket";
import ConnectionSQLServer from "./infra/database/ConnectionSQLServer";
import PanelsController from "./application/PanelsController";
import AppConfig from "./AppConfig";
import PanelDatabaseRepository from "./infra/repository/PanelDatabaseRepository";

const appConfig = new AppConfig(process.argv);

const SqlServerConnection = new ConnectionSQLServer(appConfig.dbConfig);
Registry.getInstance().provide("connection", SqlServerConnection);

const httpServer = new ExpressAdapter();
Registry.getInstance().provide("httpServer", httpServer);

const socket = new WebSocket(httpServer);
socket.init();
Registry.getInstance().provide("socket", socket);

const panelRepository = new PanelDatabaseRepository(SqlServerConnection);
Registry.getInstance().provide("panelRepository", panelRepository);

const router = new Router(httpServer, panelRepository);
router.init();

const panelsController = new PanelsController(panelRepository);
panelsController.init();
Registry.getInstance().provide("panelsController", panelsController);

httpServer.listen(appConfig.httpConfig.port, () => {
  console.log(`Server listening on port ${appConfig.httpConfig.port}`);
});

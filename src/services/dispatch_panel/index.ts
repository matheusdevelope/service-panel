import { Server } from "socket.io";
import {
  ConnectionSqlServer,
  ConnectionSybase,
  Database,
} from "repository-data7";
import HTTP_Server_Dispatch from "./http";
import { EnumKeysDispatchPanel } from "../../types/params";
import { appendFileSync } from "fs";
import { tmpdir } from "os";
import path from "path";

let IO: Server | null = null;
let timer: NodeJS.Timer;
let connections_count = 0;

interface IMessageBox {
  title: string;
  message: string;
}
function showMessageBox({ title, message }: IMessageBox) {
  console.log(title, message);
}
function generateFileName(base:string) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const fileName = `${base}-${year}-${month}-${day}.txt`;
  return fileName;
}

function LogFile(data:string) {
  try {
    appendFileSync( path.join(tmpdir() , generateFileName('log-data7-panel')),
    `
    ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}
    ${data}
    -------------------------------------------------------------------------

    `)
  } catch (error) {
    console.log(error);
  }
}
async function SendData(query: string, DB: any) {
  if (connections_count > 0) {
    try {
      const ret = await DB.query(query);
      IO?.emit("data_dispath_panel", ret);
    } catch (error) {
      clearInterval(timer);
      showMessageBox({
        title: "Error",
        message: String(error),
      });
    }
  }
}
interface IParams {
  [key: string]: string;
}
function execute(params: IParams) {
  try {
    if (IO) return IO;
    const config = params;

    const database = config[EnumKeysDispatchPanel.database];
    const server_port = Number(config[EnumKeysDispatchPanel.server_port] || 0);
    const time_refresh =
      Number(config[EnumKeysDispatchPanel.time_refresh]) ;
    const db_params = {
      user: config[EnumKeysDispatchPanel.user],
      password: config[EnumKeysDispatchPanel.pass],
      dbname: config[EnumKeysDispatchPanel.dbname],
      host: config[EnumKeysDispatchPanel.host],
      port: Number(config[EnumKeysDispatchPanel.port] || 0),
      // libJava:
      //   process.env.MODE === "development"
      //     ? undefined
      //     : resolve(
      //         __dirname,
      //         "../../../../node_modules/sybase/JavaSybaseLink/dist/JavaSybaseLink.jar"
      //       ),
    };

    if (!server_port)
      return showMessageBox({
        title: "Painel de Expedição",
        message: "Serviço não iniciado, porta inválida.",
      });

    const connectionDB =
      database.toString().toUpperCase() == "SYBASE"
        ? new ConnectionSybase(db_params)
        : new ConnectionSqlServer(db_params);
    const DB = new Database(connectionDB);
    HTTP_Server_Dispatch().execute(server_port,()=>{
      console.log("Server is runnig in port " + config[EnumKeysDispatchPanel.server_port]);      
    });
    IO = new Server(HTTP_Server_Dispatch().execute(server_port), {
      cors: {
        origin: "*",
      },
    });
    LogFile( `--- Socket Service Enabled\n`)

    IO.on("error", (e) => {
      showMessageBox({
        title: "Painel de Expedição",
        message:
          "Erro ao no serviço de socket do painel de expedição: \n" + String(e),
      });
    });

    IO.on("connection", (socket) => {
      LogFile(`Socket Connection: \nidDevice: ${socket.handshake.query.idDevice} \nsocketId: ${socket.id}`)
      showMessageBox({
        title: "Painel de Expedição",
        message: "Painel conectado.",
      });
      connections_count++;
      socket.on("refresh_data_dispath_panel", async (..._) => {
        const ret = await DB.query(config[EnumKeysDispatchPanel.query]);
        socket.emit("data_dispath_panel", ret);
      });
      socket.on("disconnect", () => {
        LogFile(`Socket Disconnection: \nidDevice: ${socket.handshake.query.idDevice} \nsocketId: ${socket.id}`)
        if (connections_count > 0) connections_count--;
        showMessageBox({
          title: "Painel de Expedição",
          message: "Painel desconectado.",
        });
      });
    });

    timer = setInterval(
      () =>  SendData(String(config[EnumKeysDispatchPanel.query]), DB),
      time_refresh
    );
    return IO;
  } catch (e) {
    LogFile(`Socket Error Execute Method:\n${String(e)}`)
    showMessageBox({
      title: "Painel de Expedição",
      message:
        "Erro ao iniciar o serviço do painel de expedição: \n" + String(e),
    });
  }
}

function stop() {
  connections_count = 0;
  clearInterval(timer);
  IO?.disconnectSockets();
  IO?.removeAllListeners();
  IO = null;
  HTTP_Server_Dispatch().stop(() => console.log);
  LogFile( `--- Socket Service Disabled `)
}

export default function SocketService() {
  return {
    execute,
    stop,
  };
}

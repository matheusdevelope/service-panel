import ExpressAdapter from "./infra/api/ExpressAdapter";
import Router from "./infra/api/Router";
import WebSocket from "./infra/api/WebSocket";
import QueryInMemoryRepository from "./infra/repository/QueryInMemoryRepository";

const httpServer = new ExpressAdapter();
const queryRepository = new QueryInMemoryRepository();

const socket = new WebSocket(httpServer);
socket.init();

const router = new Router(httpServer, queryRepository);
router.init();


httpServer.listen(3000, ()=>{
  console.log("Server is listening on port 3000")
})

// const servers = [
//   {
//     id:"1",
//     name: "Server 1",
//     status: "online",
//     port: 3000,
//     panels:[
//       {
//         query:"1",
//         sync_interval: 5,
//         duration: 10,
//       }
//     ]
//   }
// ]

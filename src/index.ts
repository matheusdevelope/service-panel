import getParamsTerminal from "./handlers/get-params-terminal";
import SocketService from "./services/dispatch_panel";


const Params = getParamsTerminal()
console.log(Params);
if(Params)
SocketService().execute(Params)



import { Server } from "http";

  export default interface HttpServer {
    on(method:string, url:string, callback:(params:any, body:any)=>Promise<ResponseHttpServer>):void;
    listen(port:number, callback:Function):void;
    server:Server
  }
export interface ResponseHttpServer {
  status?: number;
  body?: any;
}
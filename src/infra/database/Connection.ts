export default interface Connection{
    query(query:string, params:any[]):Promise<any>
    one(query:string, params:any[]):Promise<any>
    open():Promise<void>
    close():Promise<void>
    connected():Promise<boolean>
}
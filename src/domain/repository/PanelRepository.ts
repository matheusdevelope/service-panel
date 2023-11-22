import Panel from "../entity/Panel";

export default interface PanelRepository {
    save(panel:Panel):Promise<void>;
    get(id:string):Promise<Panel|undefined>;
    delete(id:string):Promise<void>;
    list():Promise<Panel[]>;
    migrate():Promise<void>;
}
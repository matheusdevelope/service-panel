import Panel from "../entity/Panel";

export default interface PanelRepository {
    save(panel:Panel):Promise<void>;
    get(id:string):Promise<Panel|undefined>;
    list():Promise<Panel[]>;
}
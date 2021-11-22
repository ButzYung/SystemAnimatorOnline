import { WebContents } from 'electron';
declare class ObjectsRegistry {
    private nextId;
    private storage;
    private owners;
    private electronIds;
    add(webContents: WebContents, contextId: string, obj: any): number;
    get(id: number): any;
    remove(webContents: WebContents, contextId: string, id: number): void;
    clear(webContents: WebContents, contextId: string): void;
    private saveToStorage;
    private dereference;
    private registerDeleteListener;
}
declare const _default: ObjectsRegistry;
export default _default;

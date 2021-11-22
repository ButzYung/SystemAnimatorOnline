export declare class CallbacksRegistry {
    private nextId;
    private callbacks;
    private callbackIds;
    private locationInfo;
    add(callback: Function): number;
    get(id: number): Function;
    getLocation(callback: Function): string | undefined;
    apply(id: number, ...args: any[]): any;
    remove(id: number): void;
}

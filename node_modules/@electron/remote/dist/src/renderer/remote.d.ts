import { BrowserWindow, WebContents } from 'electron';
export declare function getBuiltin(module: string): any;
export declare function getCurrentWindow(): BrowserWindow;
export declare function getCurrentWebContents(): WebContents;
export declare function getGlobal<T = any>(name: string): T;
export declare function createFunctionWithReturnValue<T>(returnValue: T): () => T;

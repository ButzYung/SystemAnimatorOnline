import { WebContents } from 'electron';
export declare const isRemoteModuleEnabled: (contents: WebContents) => boolean | undefined;
export declare function enable(contents: WebContents): void;
export declare function initialize(): void;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.browserModuleNames = exports.commonModuleNames = void 0;
const get_electron_binding_1 = require("./get-electron-binding");
exports.commonModuleNames = [
    'clipboard',
    'nativeImage',
    'shell',
];
exports.browserModuleNames = [
    'app',
    'autoUpdater',
    'BaseWindow',
    'BrowserView',
    'BrowserWindow',
    'contentTracing',
    'crashReporter',
    'dialog',
    'globalShortcut',
    'ipcMain',
    'inAppPurchase',
    'Menu',
    'MenuItem',
    'nativeTheme',
    'net',
    'netLog',
    'MessageChannelMain',
    'Notification',
    'powerMonitor',
    'powerSaveBlocker',
    'protocol',
    'screen',
    'session',
    'ShareMenu',
    'systemPreferences',
    'TopLevelWindow',
    'TouchBar',
    'Tray',
    'View',
    'webContents',
    'WebContentsView',
    'webFrameMain',
].concat(exports.commonModuleNames);
const features = get_electron_binding_1.getElectronBinding('features');
if (!features || features.isDesktopCapturerEnabled()) {
    exports.browserModuleNames.push('desktopCapturer');
}
if (!features || features.isViewApiEnabled()) {
    exports.browserModuleNames.push('ImageView');
}

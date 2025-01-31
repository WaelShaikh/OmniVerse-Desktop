import type { ContextBridge } from "@common/ContextBridge";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ContextBridge", <ContextBridge>{
    onNativeThemeChanged: (callback: () => void) => ipcRenderer.on("nativeThemeChanged", callback),
    themeShouldUseDarkColors: () => ipcRenderer.sendSync("themeShouldUseDarkColors"),
    openSettings: () => ipcRenderer.send("openSettings"),
    closeSettings: () => ipcRenderer.send("closeSettings"),
    saveAndCloseSettings: (data) => ipcRenderer.send("saveAndCloseSettings", data),
    saveAndCloseStartup: (data) => ipcRenderer.send("saveAndCloseStartup", data),

    focusPrompt: (callback) => ipcRenderer.on("focusPrompt", () => callback()),

    // tempUrlChanged: (data) => ipcRenderer.send('onTempUrlChanged', data),
    // updateTempUrl: (callback) => ipcRenderer.on('newTempUrl', (event, data) => callback(data)),
    // urlChanged: (data) => ipcRenderer.send('onUrlChanged', data),

    updateUrl: (callback) => ipcRenderer.on("newUrl", (event, data) => callback(data)),
    updateUseAPI: (callback) => ipcRenderer.on("newUseAPI", (event, data) => callback(data)),

    // settingsChanged: (data) => ipcRenderer.send('onSettingsChanged', data),

    // updateSettings: (callback) => ipcRenderer.on('newSettings', (event, data:SettingsProps) => callback(data))

    // updatePrompt: (data) => ipcRenderer.send('onUpdatePrompt', data),
    // setPrompt: (callback) => ipcRenderer.on('onSetPrompt', (event, data) => callback(data)),

    sendPrompt: (data) => ipcRenderer.send("onSendPrompt", data),
    clearResponse: (callback) => ipcRenderer.on("onClearResponse", (event, data) => callback(data)),
    LLMResponse: (callback) => ipcRenderer.on("onLLMResponse", (event, data) => callback(data)),
    userResponse: (callback) => ipcRenderer.on("onUserResponse", (event, data) => callback(data)),

    resize: (data) => ipcRenderer.send("onResize", data),

    clearPrompt: (callback) => ipcRenderer.on("onClearPrompt", (event, data) => callback(data)),
    escape: () => ipcRenderer.send("onEscape"),

    selectLocalModel: () => ipcRenderer.send("selectLocalModel"),
    selectLocalModelFromStartup: () => ipcRenderer.send("selectLocalModelFromStartup"),
    updateLocalModel: (callback) => ipcRenderer.on("updateLocalModel", (event, data) => callback(data)),

    quit: () => ipcRenderer.send("quit"),

    isGenerating: (callback) => ipcRenderer.on("isGenerating", (event, data) => callback(data)),
    sendAbort: () => ipcRenderer.send("onSendAbort"),

    getMicStream: (callback) => ipcRenderer.on("getMicStream", (event, data) => callback(data)),
    // micStreamReady: (data) => ipcRenderer.send("onMicStreamReady", data),
    micStream: (data) => ipcRenderer.send("onMicStream", data),
    setPromptFromMic: (callback) => ipcRenderer.on('onSetPromptFromMic', (event, data) => callback(data)),
    
});

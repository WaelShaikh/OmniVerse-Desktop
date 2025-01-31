export type ContextBridge = {
    onNativeThemeChanged: (callback: () => void) => void;
    themeShouldUseDarkColors: () => boolean;
    openSettings: () => void;
    closeSettings: () => void;

    saveAndCloseSettings: (data: unknown) => void;
    saveAndCloseStartup: (data: unknown) => void;

    focusPrompt: (data: CallableFunction) => void;

    // tempUrlChanged: (data) => void,
    // updateTempUrl: (data) => void,
    // urlChanged: (data) => void,

    updateUrl: (data: CallableFunction) => void;
    updateUseAPI: (data: CallableFunction) => void;
    // updateUrl: (data) => void,

    // settingsChanged: (data) => void,

    // updateSettings: (data) => void,

    // updatePrompt: (data:string) => void,
    // setPrompt: (data:CallableFunction) => void,

    sendPrompt: (data: string) => void;
    LLMResponse: (data: CallableFunction) => void;
    userResponse: (data: CallableFunction) => void;
    clearResponse: (data: CallableFunction) => void;
    resize: (data: number) => void;

    clearPrompt: (data: CallableFunction) => void;
    escape: () => void;

    selectLocalModel: () => void;
    selectLocalModelFromStartup: () => void;
    updateLocalModel: (data: CallableFunction) => void;

    quit: () => void;

    isGenerating: (data: CallableFunction) => void;
    sendAbort: () => void;

    getMicStream: (data: CallableFunction) => void;
    // micStreamReady: (data) => void;
    micStream: (data) => void;
    setPromptFromMic: (data:CallableFunction) => void,
};

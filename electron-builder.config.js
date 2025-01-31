/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const baseConfig = {
    appId: "com.wael.OmniVerse",
    productName: "OmniVerse",
    directories: {
        output: "release",
        buildResources: "build",
    },
    files: ["dist-main/index.js", "dist-preload/index.js", "dist-renderer/**/*"],
    // files: ["dist-main/index.js", "dist-preload/index.js", "dist-renderer/**/*", "models/**/*"],
    extraMetadata: {
        version: process.env.VITE_APP_VERSION,
    },
    // extraResources: ["src/models/*"]
};

/**
 * @type {Record<NodeJS.Platform, import('electron-builder').Configuration>}
 */
const platformSpecificConfigurations = {
    // darwin: {
    //     ...baseConfig,
    //     afterPack: "./build/macos/codeSign.mjs",
    //     mac: {
    //         icon: "build/app-icon-dark.png",
    //         target: [{ target: "dmg" }, { target: "zip" }],
    //     },
    // },
    win32: {
        ...baseConfig,
        // appx: {
        //     applicationId: "Wael.OmniVerse",
        //     backgroundColor: "#1F1F1F",
        //     displayName: "OmniVerse",
        //     identityName: "Wael.OmniVerse",
        //     publisher: "CN=AD6BF16D-50E3-4FD4-B769-78A606AFF75E",
        //     publisherDisplayName: "Wael Shaikh",
        //     languages: ["en-US"],
        // },
        nsis: {
            oneClick: false,
            allowToChangeInstallationDirectory: true,
            createDesktopShortcut: false,
            deleteAppDataOnUninstall: true,
            license: "LICENSE.md",
        },
        win: {
            icon: "build/app-icon-dark.png",
            // target: [{ target: "msi" }, { target: "nsis" }, { target: "zip" }, { target: "appx" }],
            // target: [{ target: "msi" }, { target: "nsis" }, { target: "zip" }],
            target: [{ target: "nsis" }],
        },
    },
    // linux: {
    //     ...baseConfig,
    //     linux: {
    //         category: "Utility",
    //         icon: "build/app-icon-dark.png",
    //         target: [{ target: "AppImage" }, { target: "deb" }, { target: "zip" }],
    //     },
    // },
};

module.exports = platformSpecificConfigurations[process.platform];

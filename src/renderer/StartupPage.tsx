import {
    FluentProvider,
    // SwitchOnChangeData,
    InputOnChangeData,
    // Link,
    // Table,
    // TableBody,
    // TableRow,
    // TableCell,
    webDarkTheme,
    webLightTheme,
    type Theme,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
// import { BorderNone16Filled } from "@fluentui/react-icons";
import { Button, Input } from "@fluentui/react-components";
// import { Switch } from "@fluentui/react-components";
import { Field, Radio, RadioGroup } from "@fluentui/react-components";

const shouldUseDarkColors = (): boolean =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

export const customDarkTheme: Theme = {
    ...webDarkTheme,
    // colorCompoundBrandStroke: '#f9c23c',
    colorCompoundBrandStroke: "#f9c23c",
    colorCompoundBrandStrokePressed: "#00000000",

    colorCompoundBrandBackground: "#f9c23cff",
    colorCompoundBrandBackgroundHover: "#f9d24cff",
    colorCompoundBrandBackgroundPressed: "#c9920cff",

    colorBrandBackground: "#f9c23cff",
    colorBrandBackgroundPressed: "#c9920cff",
    colorBrandBackgroundHover: "#f9d24cff",

    colorCompoundBrandStrokeHover: "#f9c23cff",

    colorCompoundBrandForeground1: "#f9c23cff",
    colorCompoundBrandForeground1Hover: "#f9d24cff",
    colorCompoundBrandForeground1Pressed: "#c9920cff",

    // colorCompoundBrandForeground1Pressed: '#ffffffff',
    // colorCompoundBrandStrokePressed
    // colorNeutralForeground2BrandPressed
    // colorNeutralForeground3BrandPressed
    // colorBrandForegroundLinkPressed
    // colorCompoundBrandBackgroundPressed
    // colorCompoundBrandForeground1Pressed

    // colorNeutralForeground1: '#00ff00ff',
    // colorNeutralForeground1Hover: '#00ff00ff',
    // colorNeutralForeground1Pressed: '#00ff00ff',
    // colorNeutralForeground1Selected: '#00ff00ff',

    // colorNeutralForeground2: '#00ff00ff',
    // colorNeutralForeground2Hover: '#00ff00ff',
    // colorNeutralForeground2Pressed: '#00ff00ff',
    // colorNeutralForeground2Selected: '#00ff00ff',

    // colorNeutralForeground2Link: '#00ff00ff',
    // colorNeutralForeground2LinkHover: '#00ff00ff',
    // colorNeutralForeground2LinkPressed: '#00ff00ff',
    // colorNeutralForeground2LinkSelected: '#00ff00ff',

    // colorNeutralForeground1Static: '#00ff00ff',
};

export const customLightTheme: Theme = {
    ...webLightTheme,
    // colorCompoundBrandStroke: '#f9c23c',
    colorCompoundBrandStroke: "#f9c23c",
    colorCompoundBrandStrokePressed: "#00000000",

    colorCompoundBrandBackground: "#f9c23cff",
    colorCompoundBrandBackgroundHover: "#f9d24cff",
    colorCompoundBrandBackgroundPressed: "#c9920cff",

    colorBrandBackground: "#f9c23cff",
    colorBrandBackgroundPressed: "#c9920cff",
    colorBrandBackgroundHover: "#f9d24cff",

    colorCompoundBrandStrokeHover: "#f9c23cff",

    colorCompoundBrandForeground1: "#f9c23cff",
    colorCompoundBrandForeground1Hover: "#f9d24cff",
    colorCompoundBrandForeground1Pressed: "#c9920cff",

    // colorNeutralForeground1: '#ff0000ff',
    // colorNeutralForeground1Hover: '#ff0000ff',
    // colorNeutralForeground1Pressed: '#ff0000ff',
    // colorNeutralForeground1Selected: '#ff0000ff',

    // colorNeutralForeground2: '#ff0000ff',
    // colorNeutralForeground2Hover: '#ff0000ff',
    // colorNeutralForeground2Pressed: '#ff0000ff',
    // colorNeutralForeground2Selected: '#ff0000ff',

    // colorNeutralForeground2Link: '#ff0000ff',
    // colorNeutralForeground2LinkHover: '#ff0000ff',
    // colorNeutralForeground2LinkPressed: '#ff0000ff',
    // colorNeutralForeground2LinkSelected: '#ff0000ff',

    // colorNeutralForeground1Static: '#ff0000ff',
};

const getTheme = () => (shouldUseDarkColors() ? customDarkTheme : customLightTheme);

export const StartupPage = () => {
    window.onkeydown = function (evt) {
        // disable zooming
        if ((evt.code == "Minus" || evt.code == "Equal") && (evt.ctrlKey || evt.metaKey)) {
            evt.preventDefault();
        }
    };

    const [useAPI, setUseAPI] = useState<boolean>(true);
    const [url, setUrl] = useState<string>("http://localhost:8000/v1");
    const [localModelPath, setLocalModelPath] = useState<string>("");

    const [theme, setTheme] = useState<Theme>(getTheme());

    const updateTempUrl = (e: React.ChangeEvent<HTMLInputElement>, tempurl: InputOnChangeData) => {
        setUrl(tempurl.value);
    };

    // const updateUseAPI = (e: React.ChangeEvent<HTMLInputElement>, switchdata: SwitchOnChangeData) => {
    //     setUseAPI(switchdata.checked);
    // };

    useEffect(() => {
        window.ContextBridge.onNativeThemeChanged(() => setTheme(getTheme()));

        window.ContextBridge.updateUrl((data: string) => {
            setUrl(data);
        });

        window.ContextBridge.updateUseAPI((data: boolean) => {
            setUseAPI(data);
        });

        window.ContextBridge.updateLocalModel((data: string) => {
            setLocalModelPath(data);
        });
    }, []);

    return (
        <FluentProvider theme={theme} style={{ height: "100vh", background: "transparent" }}>
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    boxSizing: "border-box",
                    color: theme.colorNeutralForeground1,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: 0,
                        // padding: 20,
                        margin: 0,
                        boxSizing: "border-box",
                        backgroundColor: "transparent",
                        color: theme.colorNeutralForeground1,
                        height: "100%",
                    }}
                >
                    <div
                        id="screen"
                        style={{
                            height: "100%",
                            width: "100%",
                            transform: "translateX(0%)",
                            transition: "all .25s ease-out 0s",
                        }}
                    >
                        {/* <div style={{userSelect: "none", display: "flex", flexDirection: "column", padding: 20, textAlign: "center", verticalAlign: "middle", fontSize: "100px", left:"50%", top: "50%", transform: "translate(-50%, -50%)", position: "fixed"}}>
                                Welcome
                            </div> */}
                        <div
                            style={{
                                marginTop: "20px",
                                userSelect: "none",
                                display: "flex",
                                flexDirection: "column",
                                textAlign: "center",
                                verticalAlign: "middle",
                                fontSize: "125px",
                                left: "50%",
                                width: "100%",
                                top: "50%",
                                transform: "translate(-50%, -50%)",
                                position: "fixed",
                            }}
                        >
                            <div>
                                {/* <div style={{fontSize: "30px", marginBottom: "50px", fontWeight: "lighter"}}>Meet</div> */}
                                Omni ✨
                                <div
                                    style={{
                                        fontSize: "25px",
                                        marginTop: "75px",
                                        fontWeight: "lighter",
                                        fontStyle: "italic",
                                    }}
                                >
                                    Your personal local assistant
                                </div>
                            </div>
                        </div>

                        {/* <div style={{userSelect: "none", display: "flex", flexDirection: "column", textAlign: "center", verticalAlign: "middle", fontSize: "30px", left:"150%", width: "100%", top: "50%", transform: "translate(-50%, -50%)", position: "fixed"}}>
                                <div>
                                    <div style={{fontSize: "30px", marginBottom: "10px", fontWeight: "lighter"}}>
                                        Whats your name?
                                    </div>
                                    <br />
                                    <Input
                                        // autoFocus
                                        // width={"100%"}
                                        tabIndex={-1}
                                        size="large"
                                        placeholder="User"
                                        appearance="filled-darker"
                                        // appearance="underline"
                                        // style={{borderRadius: 50}}
                                        // onChange={updateTempUrl}
                                        // value={tempurl}
                                    />
                                </div>
                            </div> */}

                        <div
                            style={{
                                userSelect: "none",
                                display: "flex",
                                flexDirection: "column",
                                textAlign: "center",
                                verticalAlign: "middle",
                                fontSize: "30px",
                                left: "150%",
                                width: "100%",
                                top: "10%",
                                transform: "translate(-50%, 0%)",
                                position: "fixed",
                            }}
                        >
                            <div
                                style={{
                                    transform: "translateX(0%)",
                                    left: "50%",
                                    width: "100%",
                                    fontSize: "30px",
                                    marginBottom: "10px",
                                    fontWeight: "lighter",
                                }}
                            >
                                Load a local GGUF model or use an OpenAI API
                                <br />
                                <span style={{ fontSize: "small" }}>You can change these settings later too</span>
                                <div
                                    style={{
                                        textAlign: "left",
                                        paddingLeft: "30px",
                                        paddingRight: "30px",
                                        paddingTop: "30px",
                                    }}
                                >
                                    <RadioGroup tabIndex={-1} defaultValue="API">
                                        <Radio
                                            tabIndex={-1}
                                            value="API"
                                            onClick={() => {
                                                setUseAPI(true);
                                            }}
                                            label={
                                                <>
                                                    {/* <span style={{fontSize: "large", fontWeight:"normal"}}>API</span> */}
                                                    <span style={{ fontSize: "large" }}>
                                                        OpenAI API Endpoint: &nbsp;
                                                    </span>
                                                    <Input
                                                        // autoFocus
                                                        // width={"100%"}
                                                        tabIndex={-1}
                                                        // size="small"
                                                        placeholder="http://localhost:8000/v1"
                                                        // appearance="filled-darker"
                                                        // appearance="underline"
                                                        // style={{borderRadius: 50}}
                                                        onChange={updateTempUrl}
                                                        value={url}
                                                        // value={tempurl}
                                                        // autoFocus
                                                        width={"100%"}
                                                        // size="large"
                                                        // placeholder=""
                                                        appearance="filled-lighter"
                                                        // appearance="underline"
                                                        // style={{borderRadius: 50}}
                                                        // onChange={updateTempUrl}
                                                        // value={url}
                                                        style={{
                                                            // border:"none",
                                                            // backgroundColor:"#FFF1",
                                                            outlineWidth: 0,
                                                            // borderRadius: 10
                                                        }}
                                                    />
                                                </>
                                            }
                                        />
                                        <br />
                                        <Radio
                                            tabIndex={-1}
                                            value="Local"
                                            onClick={() => {
                                                setUseAPI(false);
                                            }}
                                            label={
                                                <>
                                                    {/* <span style={{fontSize: "large", fontWeight:"normal"}}>Download</span> */}
                                                    <>
                                                        <span style={{ fontSize: "large", fontWeight: "normal" }}>
                                                            Load local model:
                                                        </span>{" "}
                                                        &nbsp;&nbsp;
                                                        <Button
                                                            tabIndex={-1}
                                                            onClick={() => {
                                                                window.ContextBridge.selectLocalModelFromStartup();
                                                            }}
                                                        >
                                                            Upload
                                                        </Button>
                                                        <Field label={localModelPath}></Field>
                                                    </>
                                                </>
                                            }
                                        />
                                    </RadioGroup>
                                    <br />
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                userSelect: "none",
                                display: "flex",
                                flexDirection: "column",
                                textAlign: "center",
                                verticalAlign: "middle",
                                fontSize: "100px",
                                left: "250%",
                                width: "100%",
                                top: "50%",
                                transform: "translate(-50%, -50%)",
                                position: "fixed",
                            }}
                        >
                            <div>
                                Omni is now ready!
                                <div style={{ fontSize: "25px", marginTop: "75px", fontWeight: "lighter" }}>
                                    Press <code>Win+/</code> to activate
                                </div>
                                <div style={{ fontSize: "25px", marginTop: "25px", fontWeight: "lighter" }}>
                                    Enter <code>/settings</code> to access settings
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 10,
                            padding: 20,
                            float: "right",
                            justifyContent: "right",
                            position: "fixed",
                            bottom: 0,
                            right: 0,
                        }}
                    >
                        <Button
                            tabIndex={-1}
                            id="button"
                            appearance="secondary"
                            shape="circular"
                            onClick={() => {
                                if (document.getElementById("screen")!.style.transform.slice(11, -2) == "-200") {
                                    console.log([useAPI, url]);
                                    window.ContextBridge.saveAndCloseStartup([useAPI, url, localModelPath]);
                                    // window.ContextBridge.openSettings();
                                } else if (document.getElementById("screen")!.style.transform.slice(11, -2) == "-100") {
                                    document.getElementById("screen")!.style.transform =
                                        "translateX(" +
                                        (
                                            parseInt(document.getElementById("screen")!.style.transform.slice(11, -2)) -
                                            100
                                        ).toString() +
                                        "%)";
                                    document.getElementById("button")!.innerHTML = "Done";
                                    document.getElementById("button")!.style.backgroundColor = "#f9c23c";
                                } else {
                                    // document.getElementById("button").disabled = true;
                                    document.getElementById("screen")!.style.transform =
                                        "translateX(" +
                                        (
                                            parseInt(document.getElementById("screen")!.style.transform.slice(11, -2)) -
                                            100
                                        ).toString() +
                                        "%)";
                                }
                            }}
                        >
                            Next
                        </Button>
                        {/* <Button appearance="secondary" shape="circular" onClick={()=>window.ContextBridge.closeSettings()}>Close</Button> */}
                    </div>
                </div>
            </div>
        </FluentProvider>
    );
};

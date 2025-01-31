import {
    FluentProvider,
    // Link,
    // Table,
    // TableBody,
    // TableHeader,
    // TableHeaderCell,
    // TableRow,
    // TableCell,
    webDarkTheme,
    webLightTheme,
    type Theme,
} from "@fluentui/react-components";
import { useEffect, useRef, useState } from "react";
// import { SettingsOptions } from "./SettingsOptions";
// import { BorderNone16Filled } from "@fluentui/react-icons";
// import { Sidebar } from "./Sidebar";
// import { Input, Button } from "@fluentui/react-components";
import { PromptBox } from "./PromptBox";
// import { Switch } from "@fluentui/react-components";

const shouldUseDarkColors = (): boolean =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

export const customDarkTheme: Theme = {
    ...webDarkTheme,
    // colorCompoundBrandStroke: '#f9c23c',
    colorCompoundBrandStroke: "#f9c23c00",
    colorCompoundBrandStrokePressed: "#00000000",

    colorCompoundBrandBackground: "#f9c23cff",
    colorCompoundBrandBackgroundHover: "#f9d24cff",
    colorCompoundBrandBackgroundPressed: "#c9920cff",

    colorBrandBackground: "#f9c23cff",
    colorBrandBackgroundPressed: "#c9920cff",
    colorBrandBackgroundHover: "#f9d24cff",

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
    colorCompoundBrandStroke: "#f9c23c00",
    colorCompoundBrandStrokePressed: "#00000000",

    colorCompoundBrandBackground: "#f9c23cff",
    colorCompoundBrandBackgroundHover: "#f9d24cff",
    colorCompoundBrandBackgroundPressed: "#c9920cff",

    colorBrandBackground: "#f9c23cff",
    colorBrandBackgroundPressed: "#c9920cff",
    colorBrandBackgroundHover: "#f9d24cff",

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

// const getTheme = () => (shouldUseDarkColors() ? webDarkTheme : webLightTheme);
const getTheme = () => (shouldUseDarkColors() ? customDarkTheme : customLightTheme);

export const ChatboxPage = () => {
    window.onkeydown = function (evt) {
        // disable zooming
        if ((evt.code == "Minus" || evt.code == "Equal") && (evt.ctrlKey || evt.metaKey)) {
            evt.preventDefault();
        }
    };

    // const [LLMResponse, setLLMResponse] = useState<string>('');
    let lastMsg = "user";
    let msgID = 0;

    const [theme, setTheme] = useState<Theme>(getTheme());

    // const messageList = document.getElementById("messageList");
    const elementRef = useRef<HTMLDivElement>(null);

    // const messages = [];

    useEffect(() => {
        window.ContextBridge.onNativeThemeChanged(() => setTheme(getTheme()));

        window.ContextBridge.userResponse((data: string) => {
            msgID += 1;
            lastMsg = "user";
            console.log(data);
            elementRef.current!.innerHTML +=
                '<div className="messageContainer" style="position: relative;width: calc(100% - 20px);left: 50%;transform: translateX(-50%);height: auto;margin-top: 25px;margin-bottom: 25px;overflow-wrap: break-word"><div className="message" style="width:fit-content;min-height: 1.5em;max-width: 80%;background-color: #222;position: relative;right: -100%;transform: translateX(-100%);border-radius: 2em;font-size: 1.5em; line-height: 1.5em;padding: 20px">' +
                data +
                "</div></div>";
        });
    }, []);

    window.ContextBridge.LLMResponse((data: string) => {
        // console.log(LLMResponse);
        // setLLMResponse(LLMResponse + data);
        // var elem = document.getElementById('data');
        // elementRef.current?.scrollTop = elementRef.current.scrollHeight;
        if (lastMsg == "user") {
            elementRef.current!.innerHTML +=
                '<div className="messageContainer" style="position: relative;width: calc(100% - 20px);left: 50%;transform: translateX(-50%);height: auto;margin-bottom: 25px;overflow-wrap: break-word"><div id="' +
                msgID +
                '" className="message" style="width:fit-content;min-height: 1.5em;max-width: 80%;background-color: #796124;position: relative;left:0;border-radius: 2em;font-size: 1.5em; line-height: 1.5em;padding: 20px">' +
                data +
                "</div></div>";
            lastMsg = "llm";
        } else {
            document.getElementById(msgID.toString())!.innerHTML += data;
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // console.log(LLMResponseContainer);
        // window.ContextBridge.resize(100);

        // if(lastMsg == "user") {

        // }
    });

    return (
        <FluentProvider theme={theme} style={{ height: "100vh", width: "100%", background: "transparent" }}>
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
                        // backgroundColor: "#F00"
                        color: theme.colorNeutralForeground1,
                    }}
                >
                    {/* <div style={{ flexGrow: 1 }}> */}
                    <div style={{ padding: 10, height: "100%", width: "100%" }}>
                        <div
                            ref={elementRef}
                            style={{
                                position: "fixed",
                                backgroundColor: "#fff1",
                                borderRadius: "10px",
                                width: "calc(100% - 20px)",
                                height: "calc(100% - 65px)",
                                boxSizing: "border-box",
                                whiteSpace: "pre-wrap",
                                overflow: "scroll",
                                scrollbarWidth: "none",
                            }}
                        >
                            {/* <div className="messageContainer" style={{ position: "relative",width: "calc(100% - 20px)",left: "50%",transform: "translateX(-50%)",height: "auto",marginTop: "25px",marginBottom: "25px",overflowWrap: "break-word"}}>
                                    <div className="message" style={{ width:"fit-content",minHeight: "1.5em",maxWidth: "80%",backgroundColor: "#222",position: "relative",right: "-100%",transform: "translateX(-100%)",borderRadius: "2em",fontSize: "1.5em", lineHeight: "1.5em",paddingTop:"20px",paddingBottom: "20px",paddingLeft: "20px", paddingRight: "20px"}}>
                                        Hello, who are you?
                                    </div>
                                </div>
                                <div className="messageContainer" style={{ position: "relative",width: "calc(100% - 20px)",left: "50%",transform: "translateX(-50%)",height: "auto",marginBottom: "25px",overflowWrap: "break-word"}}>
                                    <div className="message" style={{ width:"fit-content",minHeight: "1.5em",maxWidth: "80%",backgroundColor: "#796124",position: "relative",left: "0px",borderRadius: "2em",fontSize: "1.5em", lineHeight: "1.5em", paddingTop: "20px", paddingBottom: "20px", paddingLeft: "20px", paddingRight: "20px"}}>
                                        I'm Omni, a large language model.
                                    </div>
                                </div> */}
                        </div>
                        <div
                            style={{ marginBottom: "10px", bottom: "0", position: "fixed", width: "calc(100% - 20px)" }}
                        >
                            <PromptBox />
                        </div>
                    </div>
                    {/* </div> */}
                </div>
            </div>
        </FluentProvider>
    );
};

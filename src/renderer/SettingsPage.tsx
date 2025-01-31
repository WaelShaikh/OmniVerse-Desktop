import {
    Field,
    FluentProvider,
    // SwitchOnChangeData,
    InputOnChangeData,
    Radio,
    RadioGroup,
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
import { useEffect, useState } from "react";
// import { SettingsOptions } from "./SettingsOptions";
// import { BorderNone16Filled } from "@fluentui/react-icons";
// import { Sidebar } from "./Sidebar";
import { Button, Input } from "@fluentui/react-components";
// import { Switch } from "@fluentui/react-components";

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

// const getTheme = () => (shouldUseDarkColors() ? webDarkTheme : webLightTheme);
const getTheme = () => (shouldUseDarkColors() ? customDarkTheme : customLightTheme);

export const SettingsPage = () => {
    window.onkeydown = function (evt) {
        // disable zooming
        if ((evt.code == "Minus" || evt.code == "Equal") && (evt.ctrlKey || evt.metaKey)) {
            evt.preventDefault();
        }
    };

    const [useAPI, setUseAPI] = useState<boolean>(false);

    const [url, setUrl] = useState<string>("");

    const [localModelPath, setLocalModelPath] = useState<string>("");

    const [theme, setTheme] = useState<Theme>(getTheme());

    // interface InputOnChangeData {
    //     value: string;
    // }

    const updateTempUrl = (e: React.ChangeEvent<HTMLInputElement>, tempurl: InputOnChangeData) => {
        setUrl(tempurl.value);
        // window.ContextBridge.tempUrlChanged(tempurl.value);
    };

    // const updateUseAPI = (e: React.ChangeEvent<HTMLInputElement>, switchdata: SwitchOnChangeData) => {
    //     setUseAPI(switchdata.checked);
    //     // window.ContextBridge.tempUrlChanged(tempurl.value);
    // };

    useEffect(() => {
        window.ContextBridge.onNativeThemeChanged(() => setTheme(getTheme()));

        // window.ContextBridge.updateTempUrl((data:string) => {
        //     // console.log("received updated temp:", data);
        //     // alert();
        //     setTempurl(data);
        //     // alert("1:"+data);
        // });
        window.ContextBridge.updateUrl((data: string) => {
            console.log("got url");
            // alert(data);
            // alert(data);
            // console.log(data);
            // alert(data)
            // console.log(data);
            // setUrl(data);
            setUrl(data);
            // console.log(data)
            // console.log("URL:", url);
            // console.log("tempURL:", tempurl);
            // setTempurl(url);
            // alert("2:"+data);
        });

        window.ContextBridge.updateUseAPI((data: boolean) => {
            // console.log("got use api", data);
            // alert(data);
            // alert(useAPI);
            // alert(data);
            // alert(data);
            // console.log(data);
            // alert(data)
            // console.log(data);
            setUseAPI(data);
            // alert(useAPI);
            // console.log(data)
            // console.log("URL:", url);
            // console.log("tempURL:", tempurl);
            // setTempurl(url);
            // alert("2:"+data);
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
                {/* <Sidebar theme={theme} /> */}
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
                    {/* <PromptBox /> */}
                    <div style={{ flexGrow: 1 }}>
                        <div style={{ display: "flex", flexDirection: "column", padding: 20 }}>
                            {/* <Table>
                            <TableHeader>
                                <TableRow style={{borderBlockColor: "transparent"}}>
                                    <TableHeaderCell style={{width:"100%", fontSize:"250%"}}>Settings</TableHeaderCell>
                                    <TableHeaderCell style={{ width: 50 }}></TableHeaderCell>
                                </TableRow>
                            </TableHeader>

                                <TableBody>
                                    <TableRow style={{borderBlockColor: "transparent", width:"100%", backgroundColor: "transparent"}}>
                                        <TableCell style={{height:20}}>
                                        </TableCell>
                                        <TableCell style={{height:20}}>
                                        </TableCell>
                                    </TableRow>


                                    <TableRow style={{borderBlockColor: "transparent", width:"100%", backgroundColor: "transparent"}}>
                                        <TableCell>
                                            Use API
                                        </TableCell>
                                        <TableCell style={{right:"0%", width:"100%"}}>
                                            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                                                <Switch onChange={updateUseAPI} checked={useAPI}></Switch>
                                            </div>
                                        </TableCell>
                                    </TableRow>






                                    <TableRow style={{borderBlockColor: "transparent", marginBottom: 20, backgroundColor: "transparent"}}>
                                        <TableCell>
                                            OpenAI API Endpoint
                                        </TableCell>
                                        <TableCell style={{right:"0%", width:"100%"}}>
                                            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                                                <Input
                                                    autoFocus
                                                    width={"100%"}
                                                    // size="large"
                                                    placeholder=""
                                                    appearance="filled-lighter"
                                                    // appearance="underline"
                                                    // style={{borderRadius: 50}}
                                                    onChange={updateTempUrl}
                                                    value={url}
                                                    style={{
                                                        // border:"none",
                                                        // backgroundColor:"#FFF1",
                                                        outlineWidth: 0
                                                        // borderRadius: 10
                                                    }}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    
                                </TableBody>
                        </Table> */}

                            <div
                                style={{
                                    transform: "translateX(0%)",
                                    left: "50%",
                                    width: "100%",
                                    fontSize: "250%",
                                    marginBottom: "10px",
                                    fontWeight: "lighter",
                                }}
                            >
                                Settings
                                <div style={{ paddingTop: "30px" }}>
                                    <RadioGroup tabIndex={-1} value={useAPI ? "API" : "Local"}>
                                        <Radio
                                            style={{ height: "40px", width: "100%" }}
                                            tabIndex={-1}
                                            value="API"
                                            onClick={() => {
                                                setUseAPI(true);
                                            }}
                                            label={
                                                <>
                                                    <span style={{ fontSize: "large" }}>
                                                        OpenAI API Endpoint: &nbsp;
                                                    </span>
                                                    <Input
                                                        // autoFocus
                                                        // width={"100%"}
                                                        tabIndex={-1}
                                                        // size="small"
                                                        // placeholder="http://localhost:8000/v1"
                                                        // appearance="filled-darker"
                                                        // appearance="underline"
                                                        // style={{borderRadius: 50}}
                                                        onChange={updateTempUrl}
                                                        value={url}
                                                        // value={tempurl}
                                                        autoFocus
                                                        width={"100%"}
                                                        // size="large"
                                                        placeholder=""
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
                                                    <>
                                                        <span style={{ fontSize: "large", fontWeight: "normal" }}>
                                                            Load local model:
                                                        </span>{" "}
                                                        &nbsp;&nbsp;
                                                        <Button
                                                            tabIndex={-1}
                                                            onClick={() => {
                                                                window.ContextBridge.selectLocalModel();
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
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 10,
                            padding: 20,
                            float: "right",
                            justifyContent: "right",
                        }}
                    >
                        <Button
                            appearance="primary"
                            shape="circular"
                            onClick={() => {
                                // window.ContextBridge.urlChanged(tempurl);
                                window.ContextBridge.saveAndCloseSettings([useAPI, url, localModelPath]);
                            }}
                        >
                            Save
                        </Button>
                        <Button
                            appearance="secondary"
                            shape="circular"
                            onClick={() => window.ContextBridge.closeSettings()}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </FluentProvider>
    );
};

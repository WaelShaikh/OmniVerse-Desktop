import {
    FluentProvider,
    // Link,
    webDarkTheme,
    webLightTheme,
    type Theme,
} from "@fluentui/react-components";

import { Sparkle28Regular } from "@fluentui/react-icons";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
// import { Input, Button } from "@fluentui/react-components";

const shouldUseDarkColors = (): boolean =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

export const customDarkTheme: Theme = {
    ...webDarkTheme,
    // colorCompoundBrandStroke: '#f9c23c',
    colorCompoundBrandStroke: "#f9c23c00",
};

export const customLightTheme: Theme = {
    ...webLightTheme,
    // colorCompoundBrandStroke: '#f9c23c',
    colorCompoundBrandStroke: "#f9c23c00",
};

// const getTheme = () => (shouldUseDarkColors() ? webDarkTheme : webLightTheme);
const getTheme = () => (shouldUseDarkColors() ? customDarkTheme : customLightTheme);

export const ResponsePage = () => {
    window.onkeydown = function (evt) {
        // disable zooming
        if ((evt.code == "Minus" || evt.code == "Equal") && (evt.ctrlKey || evt.metaKey)) {
            evt.preventDefault();
        }
    };

    const [theme, setTheme] = useState<Theme>(getTheme());

    const [LLMResponse, setLLMResponse] = useState<string>("");

    // const elementRef = createRef<HTMLPreElement>();
    const elementRef = useRef<HTMLPreElement>(null);

    function handleKeyPress(event: { key: string }) {
        if (event.key == "Escape") {
            window.ContextBridge.escape();
        }
    }

    window.addEventListener("keyup", handleKeyPress, true);

    useEffect(() => {
        window.ContextBridge.onNativeThemeChanged(() => setTheme(getTheme()));
        // setHeight(elementRef);
        // console.log(elementRef);
        // console.log(elementRef.current.clientHeight);
    }, []);

    useLayoutEffect(() => {
        // console.log(elementRef.current.clientHeight);
        // if(elementRef.current != undefined && elementRef.current !== null) {
        // if(elementRef.current.clientHeight !== null)
        if (elementRef.current) window.ContextBridge.resize(elementRef.current.clientHeight);
        // }
    }, [LLMResponse]);

    window.ContextBridge.clearResponse(() => {
        setLLMResponse("");
    });

    // const LLMResponseContainer =
    //     <div style={{width: "100%"}}>
    //             <pre  ref={elementRef} style={{margin: "auto", fontWeight:"lighter",  width: "95%", whiteSpace: "break-spaces", fontSize: "150%", fontFamily:"inherit", lineHeight: "125%", marginTop:20}}>
    //                 {LLMResponse}
    //             </pre>
    //     </div>;

    window.ContextBridge.LLMResponse((data: string) => {
        // console.log(LLMResponse);
        setLLMResponse(LLMResponse + data);

        // var elem = document.getElementById('data');
        // elementRef.current?.scrollTop = elementRef.current.scrollHeight;

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // console.log(LLMResponseContainer);
        // window.ContextBridge.resize(100);
    });

    return (
        <FluentProvider theme={theme} style={{ height: "100%", background: "transparent" }}>
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
                }}
            >
                {/* <Collapse visible={true}> */}
                {/* <div style={{width: "100%"}}>
                            <pre style={{margin: "auto", fontWeight:"lighter",  width: "95%", whiteSpace: "break-spaces", fontSize: "150%", fontFamily:"inherit", lineHeight: "125%", marginTop:20}}>
                                {LLMResponse}
                            </pre>
                    </div> */}
                {/* </Collapse> */}

                {/* <LLMResponseContainer /> */}
                {/* {LLMResponseContainer} */}
                <div style={{ width: "100%", marginTop: 20 }}>
                    <Sparkle28Regular
                        style={{ position: "fixed", bottom: "10px", right: "10px", color: "#f9c23c" }}
                    ></Sparkle28Regular>
                    <pre
                        id="pre"
                        ref={elementRef}
                        style={{
                            margin: "auto",
                            fontWeight: "lighter",
                            width: "95%",
                            whiteSpace: "break-spaces",
                            fontSize: "150%",
                            fontFamily: "inherit",
                            lineHeight: "150%",
                            paddingBottom: 40,
                            boxSizing: "border-box",
                        }}
                    >
                        {LLMResponse}
                    </pre>
                </div>
            </div>
        </FluentProvider>
    );
};

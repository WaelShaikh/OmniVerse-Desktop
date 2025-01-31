// import { Avatar, Input, Text } from "@fluentui/react-components";
// import { makeStyles } from '@fluentui/react-components';
import { Input, Spinner } from "@fluentui/react-components";
// import { SendRegular } from "@fluentui/react-icons";
// import { Sparkle32Regular } from "@fluentui/react-icons";
import { Sparkle28Regular, Stop16Filled } from "@fluentui/react-icons";
import { useLayoutEffect, useRef, useState } from "react";

// const useOverrides = makeStyles({
//     input: { borderRadius: "borderRadiusCircular" },
//   });

//   function MyInput() {
//     const overrides = useOverrides();

//     return (
//       <>
//         <Input style={{borderRadius: 50,borderRight: '50px solid transparent'}} className={overrides.input} autoFocus width={"100%"} size="large" contentAfter={<SendRegular />} placeholder="" appearance="filled-darker"/>
//       </>
//     );
//   }

export const PromptBox = () => {
    window.onkeydown = function (evt) {
        // disable zooming
        if ((evt.code == "Minus" || evt.code == "Equal") && (evt.ctrlKey || evt.metaKey)) {
            evt.preventDefault();
        }

        if (evt.code == "KeyR" && (evt.ctrlKey || evt.metaKey)) {
            evt.preventDefault();
        }
    };

    const [prompt, setPrompt] = useState<string>("");

    // const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);
    // const addAudioChunk = (chunk: BlobPart) => {
    //     setAudioChunks((prevChunks) => [...prevChunks, chunk]);
    // };
    // const resetAudioChunks = () => {
    //     setAudioChunks([]);
    // };

    const [contentAfter, setContentAfter] = useState<JSX.Element>(<Sparkle28Regular />);

    // let recorder:MediaRecorder;
    // const recorderRef = useRef<MediaRecorder | null>(null);

    const elementRef = useRef<HTMLInputElement>(null);

    interface InputOnChangeData {
        value: string;
    }

    const updatePrompt = (e: React.ChangeEvent<HTMLInputElement>, prompt: InputOnChangeData) => {
        setPrompt(prompt.value);
        // window.ContextBridge.updatePrompt(prompt.value);
    };

    const getPrompt = (prompt: string) => {
        if (prompt.trim() != "") {
            if (prompt == "/settings") {
                // console.log(prompt);
                setPrompt("");
                window.ContextBridge.openSettings();
            } else if (prompt == "/quit") {
                // console.log(prompt);
                setPrompt("");
                window.ContextBridge.quit();
            } else {
                // console.log(prompt);
                setPrompt("");
                window.ContextBridge.sendPrompt(prompt);
            }
            // BrowserWindow.getFocusedWindow()?.setMaximumSize(1024,512);
            // window?.setMaximumSize(1024,512);
            // window?.setSize(1024,512);
            // window.ContextBridge.resizeWindow(() => setTheme(getTheme()));
        }
    };

    const enterToSubmit = (event: React.FormEvent<HTMLInputElement>) => {
        // console.log(event);
        // KeyboardEvent ev = event.nativeEvent;
        const ev = new KeyboardEvent("ev", event);
        // console.log(ev);
        if (ev.key == "Enter") {
            //&& !ev.shiftKey) {
            // if(ev.key == "Enter" && !ev.shiftKey) {
            
            // recorder.stop();
            // if (recorderRef.current) {
            //     recorderRef.current.stop();
            // }
            
            getPrompt(prompt);
        }

        if (ev.key == "Escape") {
            //&& !ev.shiftKey) {
            // getPrompt(prompt);
            setPrompt("");
            // if (recorderRef.current) {
            //     recorderRef.current.stop();
            // }
            window.ContextBridge.escape();
        }
    };

    useLayoutEffect(() => {
        window.ContextBridge.isGenerating((data: boolean) => {
            // alert("isgenerating: " + data);
            console.log("isgenerating: " + data);
            elementRef.current!.disabled = data;
            // alert(data)
            if (data == true) {
                // setContentAfter(<Spinner size="tiny" appearance="inverted" onClick={()=>{window.ContextBridge.sendAbort()}} />);
                // setContentAfter(<Stop16Filled />);
                setContentAfter(
                    <>
                        <Spinner
                            style={{ position: "absolute", bottom: "6px", right: "6px" }}
                            size="small"
                            appearance="inverted"
                            onClick={() => {
                                window.ContextBridge.sendAbort();
                            }}
                        />
                        <Stop16Filled
                            style={{ position: "relative" }}
                            onClick={() => {
                                window.ContextBridge.sendAbort();
                            }}
                        />
                    </>,
                );
            } else {
                setContentAfter(<Sparkle28Regular />);
            }
        });

        window.ContextBridge.clearPrompt(() => {
            setPrompt("");
        });

        window.ContextBridge.focusPrompt(() => {
            elementRef.current!.focus();
        });

        window.ContextBridge.setPromptFromMic((data:string) => {
            setPrompt(data);
        });

        // window.ContextBridge.getMicStream(async (sampling_rate:number) => {
        //     const audioChunks: BlobPart[] | undefined = [];
        //     recorderRef.current?.resume();
        // });

        // window.ContextBridge.getMicStream(async (sampling_rate:number) => {
        //     // console.log(sampling_rate);
        //     // console.log("got request to get mic stream");
        //     // console.log(stream);
        //     // console.log(stream.getAudioTracks()[0]);

        //     const audioChunks: BlobPart[] | undefined = [];
    
        //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    
        //     const audioTrack = stream.getAudioTracks()[0]
        //     stream.addTrack(audioTrack);
        //     // recorder = new MediaRecorder(stream);
        //     const recorder = new MediaRecorder(stream);
        //     recorderRef.current = recorder;


            
        //     // window.ContextBridge.micStreamReady(audioTrack);
    
        //     recorder.ondataavailable = async (event) => {
        //         // console.log("got data");
        //         // console.log("event");
        //         // console.log(event);
        //         audioChunks.push(event.data);
        //         const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        //         // console.log("audioBlob");
        //         // console.log(audioBlob);
        //         // const audioUrl = URL.createObjectURL(audioBlob);
        //         // console.log("audioUrl");
        //         // console.log(audioUrl);
        //         // window.ContextBridge.micStream(audioUrl);
    
    
    
    
        //         const audioContextRef = new AudioContext({
        //             sampleRate: sampling_rate,
        //         });
    
    
        //         const fileReader = new FileReader();
        //         fileReader.onloadend = async () => {
        //             const arrayBuffer = fileReader.result;
        //             if (arrayBuffer instanceof ArrayBuffer) {
        //                 const decoded = await audioContextRef.decodeAudioData(arrayBuffer);
        //                 let audio = decoded.getChannelData(0);
        //                 if (audio.length > sampling_rate*30) {
        //                 // Get last MAX_SAMPLES
        //                 audio = audio.slice(-sampling_rate*30);
        //                 }
                
        //                 // worker.current.postMessage({
        //                 //   type: "generate",
        //                 //   data: { audio, language },
        //                 // });
        //                 window.ContextBridge.micStream(audio);
        //             }
        //         };
        //         fileReader.readAsArrayBuffer(audioBlob);
    
        //     };
        //     recorder.start(1000);
    
    
    
    
        //     // navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        //     //     .then(stream => {
        //     //         console.log(stream);
        //     //         console.log(stream.getAudioTracks()[0]);
        //     //         const audioTrack = stream.getAudioTracks()[0]
        //     //         stream.addTrack(audioTrack);
        //     //         recorder = new MediaRecorder(stream);
        //     //         // window.ContextBridge.micStreamReady(audioTrack);
    
        //     //         recorder.ondataavailable = async (event) => {
        //     //             // console.log("got data");
        //     //             // console.log("event");
        //     //             // console.log(event);
        //     //             audioChunks.push(event.data);
        //     //             const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        //     //             // console.log("audioBlob");
        //     //             // console.log(audioBlob);
        //     //             // const audioUrl = URL.createObjectURL(audioBlob);
        //     //             // console.log("audioUrl");
        //     //             // console.log(audioUrl);
        //     //             // window.ContextBridge.micStream(audioUrl);
    
    
    
    
        //     //             const audioContextRef = new AudioContext({
        //     //                 sampleRate: sampling_rate,
        //     //             });
    
    
        //     //             const fileReader = new FileReader();
        //     //             fileReader.onloadend = async () => {
        //     //                 const arrayBuffer = fileReader.result;
        //     //                 if (arrayBuffer instanceof ArrayBuffer) {
        //     //                     const decoded = await audioContextRef.decodeAudioData(arrayBuffer);
        //     //                     let audio = decoded.getChannelData(0);
        //     //                     if (audio.length > sampling_rate*30) {
        //     //                     // Get last MAX_SAMPLES
        //     //                     audio = audio.slice(-sampling_rate*30);
        //     //                     }
                        
        //     //                     // worker.current.postMessage({
        //     //                     //   type: "generate",
        //     //                     //   data: { audio, language },
        //     //                     // });
        //     //                     window.ContextBridge.micStream(audio);
        //     //                 }
        //     //             };
        //     //             fileReader.readAsArrayBuffer(audioBlob);
    
        //     //         };
        //     //         recorder.start(1000);
        //     //         // setTimeout(()=>{recorder.stop();}, 5000);
        //     //     })
        //     //     .catch(error => {
        //     //         console.error('Error accessing microphone:', error);
        //     //     });
        // });
    }, []);

    // window.ContextBridge.isGenerating((data:boolean) => {
    //     alert("isgenerating: " + data);
    //     elementRef.current!.disabled = data;
    // });

    // window.ContextBridge.clearPrompt(() => {
    //     setPrompt("");
    // });

























    












 

















    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                // gap: 20,
                gap: 0,
                padding: 0,
            }}
        >
            <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Input
                    ref={elementRef}
                    autoFocus
                    width={"100%"}
                    size="large"
                    // contentBefore={<SearchRegular />}
                    // contentAfter={<SendRegular />}
                    // contentBefore={<Sparkle28Regular />}
                    // contentAfter={<Sparkle28Regular
                    //     // style={{color:"#f9c23c"}}
                    // />}
                    contentAfter={contentAfter}
                    placeholder=""
                    // appearance="filled-darker"
                    // appearance="filled-lighter"
                    appearance="underline"
                    // appearance="underline"
                    // style={{borderRadius: 50}}
                    onChange={updatePrompt}
                    onKeyDown={enterToSubmit}
                    value={prompt}
                    // onSubmit={getPromptSubmit}
                    // onSubmitCapture={}
                    style={{
                        border: "none",
                        backgroundColor: "#FFF1",
                        borderRadius: 10,
                    }}
                />
            </div>

            {/* <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Text size={200} align="end">
                        John Doe
                    </Text>
                    <Text size={100} align="end">
                        john.doe@gmail.com
                    </Text>
                </div>
                <Avatar size={36} name="John Doe" />
            </div> */}
        </div>
    );
};

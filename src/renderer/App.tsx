import {
    FluentProvider,
    // Link,
    // MessageBar,
    // MessageBarBody,
    // MessageBarTitle,
    // Table,
    // TableBody,
    // TableHeader,
    // TableHeaderCell,
    // TableRow,
    webDarkTheme,
    webLightTheme,
    type Theme,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { PromptBox } from "./PromptBox";

// import { Collapse } from '@fluentui/react-motion-components-preview';

// import OpenAI from 'openai';

const shouldUseDarkColors = (): boolean =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

export const customDarkTheme: Theme = {
    ...webDarkTheme,
    // colorCompoundBrandStroke: '#f9c23c',
    colorCompoundBrandStroke: "#f9c23c00",
    // colorNeutralForeground1: '#e2e2e2ff',
    // colorCompoundBrandForeground1Pressed: '#ff0000ff'
    // // colorCompoundBrandStrokePressed
    // // colorNeutralForeground2BrandPressed
    // // colorNeutralForeground3BrandPressed
    // // colorBrandForegroundLinkPressed
    // // colorCompoundBrandBackgroundPressed
    // // colorCompoundBrandForeground1Pressed
};

export const customLightTheme: Theme = {
    ...webLightTheme,
    // colorCompoundBrandStroke: '#f9c23c',
    colorCompoundBrandStroke: "#f9c23c00",
    // colorBrandForegroundOnLight: '#ff0000ff',
    // colorNeutralForeground1: '#242424ff'
};

// const getTheme = () => (shouldUseDarkColors() ? webDarkTheme : webLightTheme);
const getTheme = () => (shouldUseDarkColors() ? customDarkTheme : customLightTheme);

export const App = () => {
    const [theme, setTheme] = useState<Theme>(getTheme());
    




















    // async function test() {
    //     const x = await navigator.mediaDevices.enumerateDevices();
    //     alert(x);
    // console.dir(x);

    // }
    // console.log("starting");
    // test();

    // navigator.mediaDevices.enumerateDevices()
    // .then(devices => {
    //     const defaultAudioInput = devices.find(device => device.kind === 'audioinput' && device.deviceId === 'default');

    //     if (defaultAudioInput) {
    //         console.log('Default audio input device:', defaultAudioInput);
    //     } else {
    //         console.log('No default audio input device found.');
    //     }
    // })
    // .catch(error => {
    //     console.error('Error accessing media devices:', error);
    // });


    // const audioChunks: BlobPart[] | undefined = [];

    // navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    //     console.log(stream);
    //     const mediaRecorder = new MediaRecorder(stream);


    //     mediaRecorder.onstop = () => {
    //         const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    //         const audioUrl = URL.createObjectURL(audioBlob);
    //         console.log(audioUrl);
    //         console.log("stopped");
    //         // document.getElementById('audio').src = audioUrl;
    //         // audioChunks = [];
    //     };

    //     mediaRecorder.ondataavailable = event => {
    //         console.log("got data", audioChunks.length);
    //         audioChunks.push(event.data);
    //         const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    //         const audioUrl = URL.createObjectURL(audioBlob);
    //         console.log(audioUrl);
    //     };
    //     console.log("starting");
    //     mediaRecorder.start();
    //     console.log("started");
    //     setTimeout(()=>{mediaRecorder.stop();}, 5000);
        
    // })

    // ipcMain.on('get-mic-stream', (event, arg) => {
    //     navigator.mediaDevices.getUserMedia({ audio: true })
    //         .then(stream => {
    //             // Process the stream here, e.g., create an AudioContext
    //             const audioContext = new AudioContext();
    //             const source = audioContext.createMediaStreamSource(stream);
    //             // ... further processing
    //             event.reply('mic-stream-ready', stream);
    //         })
    //         // .catch(err => {
    //         //     console.error('Error accessing microphone:', err);
    //         //     event.reply('mic-stream-error', err);
    //         // });
    // });




















    
    // const [url, setUrl] = useState<string>('');
    // const [prompt, setPrompt] = useState<string>('');

    // const [LLMResponse, setLLMResponse] = useState<string>('');

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // const client = new OpenAI({
    //     apiKey: 'My API Key',
    //     // baseURL: process.env.VITE_DEV_SERVER_URL
    //     baseURL: "http://localhost:8000/v1",
    //     dangerouslyAllowBrowser: true
    // });

    // const sendPrompt = async () => {
    // const chatCompletion = await client.chat.completions.create({
    //     messages: [
    //         { role: "system", content: "You are a helpful assistant. Answer concisely."},
    //         { role: 'user', content: "who was hitler?" }
    //     ],
    //     model: 'ehartford_wizard-vicuna-7b-uncensored',
    //     stream: true,
    //     // echo: true,
    //     // stop: ["</s>", "ASSISTANT:", "USER:"]
    // });

    // console.log(chatCompletion.choices[0].message);
    // for await (const part of chatCompletion) {
    //     console.log(part.choices[0]?.delta?.content || '');
    // }

    // const chatPrompt = "whats 2+2?";
    // const messages = chatPrompt.split('\n').map(message => ({ role: 'user', content: message.trim() }));
    // const promptData = { messages: [{ role: 'user', content: "whats 2+2?" }], model: 'ehartford_wizard-vicuna-7b-uncensored', stream: true, slot_id: -1, stop: ["</s>", "ASSISTANT:", "USER:", "[END]"]}

    // const requestOptions = {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(promptData),
    // };

    // fetch('http://localhost:8000/v1/chat/completions', requestOptions)
    // .then(response => {
    //     const readableStream = response.body
    //     const reader = readableStream?.getReader();
    //     const decoder = new TextDecoder();
    //     let partialData = '';

    //     function processStreamData({ done, value }) {
    //         if (done) {
    //             console.log('Stream processing complete');
    //             return;
    //         }

    //         const chunk = decoder.decode(value, { stream: true });

    //         const combinedData = partialData + chunk;
    //         const lines = combinedData.split('\n');

    //         for (let i = 0; i < lines.length - 1; i++) {
    //             if (lines[i] != "") {
    //                 const json = JSON.parse(lines[i].substring(lines[i].indexOf('{'), lines[i].lastIndexOf('}') + 1));
    //                 if (json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.content !== undefined) {
    //                     console.log(json.choices[0].delta.content);
    //                 }
    //             }
    //         }

    //         partialData = lines[lines.length - 1];
    //         reader.read().then(processStreamData);
    //     }
    //     reader.read().then(processStreamData);
    // })
    // };
    // sendPrompt();

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        window.ContextBridge.onNativeThemeChanged(() => setTheme(getTheme()));

        // window.ContextBridge.updateUrl((url:string) => {
        //     setUrl(url);
        //     // sendPrompt();

        //     // client.baseURL = data;
        // });
    }, []);

    // window.ContextBridge.LLMResponse((data:string) => {
    //     console.log(LLMResponse);
    //     setLLMResponse(LLMResponse + data);
    // });

    // window.ContextBridge.clearResponse(() => {
    //     setLLMResponse("");
    // });

    return (
        <FluentProvider theme={theme} style={{ height: "100%", background: "transparent" }}>
            {/* <div
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "row",
                    boxSizing: "border-box",
                }}
            > */}
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
                <PromptBox />

                {/* <Component>
                    </Component> */}

                {/* <Collapse visible={true}>
                        <div style={{}}>{LLMResponse}</div>
                    </Collapse> */}

                {/* <div style={{ flexGrow: 1 }}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell style={{ width: 50 }}>From</TableHeaderCell>
                                    <TableHeaderCell>Subject</TableHeaderCell>
                                    <TableHeaderCell style={{ width: 100 }}>Received on</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <Mails isLoading={isLoading} />
                            </TableBody>
                        </Table>
                    </div> */}
            </div>
            {/* </div> */}
        </FluentProvider>
    );
};

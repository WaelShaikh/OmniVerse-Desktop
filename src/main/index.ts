// TODO: Speech To Text
    // Stop transcription when user clicks backspace or any letter or textbox

// TODO: Figure out multi turn voice convo

// TODO: add model loading indicator

// TODO: add button or /screen to add screenshot to prompt. Optionally add setting to always add screenshot

// TODO: File/Image drag and drop

// TODO: add theming option in app

// TODO: Implement chat history

// TODO: Add quick access buttons: summarize, code, etc.

// TODO: /memory

// Implement username

// GET ollama
// Figure out chat templates for API
// Separate api and builtinAI functions into separate files
// Add voice support (whisper)
// https://github.com/SYSTRAN/faster-whisper
// https://github.com/davabase/whisper_real_time
// https://github.com/collabora/WhisperLive



// Microsoft OmniParser



// BACKENDS:
// ollama
// node-llama-cpp
// openai (client)
// ollamajs
// transformersjs
// nexa-sdk
// llama.cpp

// https://github.com/niuzaisheng/ScreenAgent?tab=readme-ov-file#related-projects

// https://github.com/microsoft/UFO
// https://appagent-official.github.io/
// https://github.com/mnotgod96/AppAgent
// https://github.com/x-plug/mobileagent
// https://github.com/mobilellm/autodroid
// https://github.com/xbmxb/coco-agent
// https://github.com/niuzaisheng/ScreenAgentWebClient

// https://huggingface.co/openbmb/MiniCPM-V-2_6
// https://huggingface.co/NexaAIDev/gemma-2-2b-it-GGUF
// https://github.com/Significant-Gravitas/AutoGPT
// https://os-copilot.github.io/
// https://github.com/google-research/google-research/tree/master/android_in_the_wild
// https://dl.acm.org/doi/10.1145/3126594.3126651

// finetune florence 2 on dataset

// Reference:
// https://github.com/microsoft/UFO
// https://github.com/Upsonic/gpt-computer-assistant
// https://github.com/OS-Copilot/OS-Copilot
// https://github.com/njucckevin/SeeClick
// https://github.com/vietanhdev/llama-assistant

// https://nexaai.com/
// https://github.com/NexaAI/nexa-sdk
// https://docs.nexaai.com/getting-started/installation
// https://docs.nexaai.com/getting-started/installation#gpu-cuda
// https://nexaai.com/models
// https://nexaai.com/xtuner/llava-phi-3-mini/gguf-q4_0/file
// https://nexaai.com/meta/Llama3.2-3B-Instruct/gguf-q4_0/readme
// https://nexaai.com/Qwen/Qwen2.5-1.5B-Instruct/gguf-q4_0/readme
// https://nexaai.com/BlackForestLabs/FLUX.1-schnell/gguf-q4_0/readme
// https://nexaai.com/Systran/faster-whisper-tiny/bin-cpu-fp16/readme
// https://nexaai.com/Systran/faster-whisper-tiny.en/bin-cpu-fp16/readme

import {
    app,
    BrowserWindow,
    dialog,
    globalShortcut,
    ipcMain,
    Menu,
    // nativeImage,
    nativeTheme,
    screen,
    Tray,
    type IpcMainEvent,
} from "electron";





// let { pipeline, env } = await import('@huggingface/transformers');

// import("@huggingface/transformers").then(async (ref) => {
//     console.log(ref.env);
// });


// import { pipeline, env } from "@huggingface/transformers";

// if (process.env.NODE_ENV === "production") {
//     console.log(process.env.PUBLIC_URL);
//     // env.localModelPath = path.join(__dirname, "..", "models");
//     // env.allowLocalModels = true;
//     // env.allowRemoteModels = true;
// } else {
//     // console.log();
//     // env.localModelPath = path.join(__dirname, "..", "src", "models");
//     env.localModelPath = settings.localModelPath;
// }





import fs from "fs";
import { LlamaChatSession } from "node-llama-cpp";
import path from "path";


let tray: Tray = null;
let chatboxWindow: BrowserWindow = null;

let responseWindow: BrowserWindow = null;
let promptWindow: BrowserWindow = null;
let settingsWindow: BrowserWindow = null;
let startupWindow: BrowserWindow = null;
const settings = {
    useAPI: true,
    url: "http://localhost:8000/v1",
    localModelPath: "",
    chatboxWindow: {
        height: 0,
        width: 0,
        x: 0,
        y: 0,
    },
};
let nodeLlamaCpp = null;
let session: LlamaChatSession;
// let chatboxSession:LlamaChatSession;

// let shouldAbort = false;
let controller: AbortController;
// let isGenerating = false;

import OpenAI from "openai";
let client: OpenAI;

// let history = [];

// const writeSettings = (data) => {
//     fs.writeFileSync(path.join(app.getPath("userData"), "settings.json"), JSON.stringify(data));
// };

const writeSettings = () => {
    fs.writeFileSync(path.join(app.getPath("userData"), "settings.json"), JSON.stringify(settings));
};

const readSettings = () => {
    try {
        const data = fs.readFileSync(path.join(app.getPath("userData"), "settings.json"), "utf-8");
        settings.useAPI = JSON.parse(data).useAPI;
        settings.url = JSON.parse(data).url;
        settings.localModelPath = JSON.parse(data).localModelPath;
        settings.chatboxWindow.height = JSON.parse(data).chatboxWindow.height;
        settings.chatboxWindow.width = JSON.parse(data).chatboxWindow.width;
        settings.chatboxWindow.x = JSON.parse(data).chatboxWindow.x;
        settings.chatboxWindow.y = JSON.parse(data).chatboxWindow.y;

        if (settings.useAPI == true) {
            loadAPI();
        }

        return JSON.parse(data);
    } catch (error) {
        console.log(error);
        settings.useAPI = true;
        settings.url = "http://localhost:8000/v1";
        settings.localModelPath = "";
        // settings.chatboxWindow.height = screen.getPrimaryDisplay().size.height;
        // settings.chatboxWindow.width = 450;
        // settings.chatboxWindow.x = screen.getPrimaryDisplay().size.width - 450;
        // settings.chatboxWindow.y = 0;
        settings.chatboxWindow.height = 0;
        settings.chatboxWindow.width = 0;
        settings.chatboxWindow.x = 0;
        settings.chatboxWindow.y = 0;

        writeSettings();
    }
};
readSettings();

function loadAPI() {
    client = new OpenAI({
        apiKey: "",
        // baseURL: process.env.VITE_DEV_SERVER_URL
        // baseURL: "http://localhost:8000/v1",
        baseURL: settings.url,
        // dangerouslyAllowBrowser: true
    });
}

async function loadLLAMA() {
    const llama = await nodeLlamaCpp.getLlama();

    let modelPath: string;

    if (process.env.NODE_ENV === "production") {
        // modelPath = path.join(__dirname, "..", "models", "llama-3-8b-instruct-1048k.Q4_K_M.gguf");
        modelPath = settings.localModelPath;
    } else {
        // modelPath = path.join(__dirname, "..", "src", "models", "llama-3-8b-instruct-1048k.Q4_K_M.gguf");
        modelPath = settings.localModelPath;
    }
    const model = await llama.loadModel({
        modelPath: modelPath,
    });

    const context = await model.createContext();
    const sequence = context.getSequence();
    session = new nodeLlamaCpp.LlamaChatSession({
        // contextSequence: context.getSequence(),
        contextSequence: sequence,
        // chatWrapper: new Llama3ChatWrapper()
        // chatWrapper: new Llama2ChatWrapper()
    });
    // chatboxSession = new nodeLlamaCpp.LlamaChatSession({
    //     // contextSequence: context.getSequence(),
    //     contextSequence: sequence
    //     // chatWrapper: new Llama3ChatWrapper()
    //     // chatWrapper: new Llama2ChatWrapper()
    // });
    console.log("loaded LLaMa");

    // const chatHistory = session.getChatHistory();
    // await fs.writeFile("chatHistory.json", JSON.stringify(chatHistory), "utf8");
    // const chatHistory = JSON.parse(await fs.readFile("chatHistory.json", "utf8"));
    // session.setChatHistory(chatHistory);
}

import("node-llama-cpp").then(async (ref) => {
    nodeLlamaCpp = ref;

    if (settings.useAPI == false && settings.localModelPath != "") {
        loadLLAMA();

        // const llama = await nodeLlamaCpp.getLlama();
        // const model = await llama.loadModel({
        //     modelPath: path.join(__dirname, "..", "src", "models", "llama-3-8b-instruct-1048k.Q4_K_M.gguf"),
        // });
        // const context = await model.createContext();
        // session = new nodeLlamaCpp.LlamaChatSession({
        //     contextSequence: context.getSequence(),
        //     // chatWrapper: new Llama3ChatWrapper()
        // });
        // console.log("ready");

        // const chatHistory = session.getChatHistory();
        // await fs.writeFile("chatHistory.json", JSON.stringify(chatHistory), "utf8");
        // const chatHistory = JSON.parse(await fs.readFile("chatHistory.json", "utf8"));
        // session.setChatHistory(chatHistory);
    }
});



// let generator = null;

// async function loadLLM() {
//     generator = await pipeline('text-generation', 'onnx-community/Llama-3.2-3B-Instruct ');
//     const text = await generator("Text");
// }

// import { pipeline, env } from "@huggingface/transformers";
// import {
//     AutoTokenizer,
//     AutoModelForCausalLM,
//     TextStreamer,
//     InterruptableStoppingCriteria,
//   } from "@huggingface/transformers";
  

// loadLLM();

// if (process.env.NODE_ENV === "production") {
//     console.log(process.env.PUBLIC_URL);
//     // env.localModelPath = path.join(__dirname, "..", "models");
//     // env.allowLocalModels = true;
//     // env.allowRemoteModels = true;
// } else {
//     // console.log();
//     // env.localModelPath = path.join(__dirname, "..", "src", "models");
//     // env.localModelPath = settings.localModelPath;
//     // console.log(env.localModelPath);
//     // env.localModelPath = 'C://user/path/to/models/';
//     env.localModelPath = path.join(__dirname, 'relative', 'path', 'to', 'file.txt');

// }

// import { getInstance } from './llm.js';
// console.log(getInstance)

// import { LLMPipeline } from './llm.js';
// console.log(LLMPipeline)
// const instance = LLMPipeline.getInstance();


            // import { run } from "./llm.js"
            // const instance = run();

            // const instance = run();
            // console.log("got instance");

            // const messages = [
            //     { role: "system", content: "You are a helpful assistant." },
            //     { role: "user", content: "Tell me a funny joke." },
            // ];
            // console.log("prompting");
            // const output = instance(messages);
            // console.log("got answer");
            // console.log(output);

// import { pipeline } from "@huggingface/transformers";

// // env.allowRemoteModels = true;

// import {
//     AutoTokenizer,
//     AutoModelForCausalLM,
//     // TextStreamer,
//     // InterruptableStoppingCriteria,
//   } from "@huggingface/transformers";

// // function progress_callback(e) {
// //     console.log(e);
// // }


// async function loadLLM() {
//     console.log("start");
// // console.log("1");

// function progress_callback(e) {
//   console.log(e.progress);
// }
// const { pipeline } = await import('@huggingface/transformers');
// // // Create a text-generation pipeline
// // const generator = await pipeline(
// //   "text-generation",
// //   "onnx-community/Llama-3.2-3B-Instruct",
// //   {progress_callback, dtype: "q4f16"}
// // );

// // // Define the list of messages
// // const messages = [
// //   { role: "system", content: "You are a helpful assistant." },
// //   { role: "user", content: "Tell me a funny joke." },
// // ];
// // console.log("2");

// // // Generate a response
// // const output = await generator(messages, { max_new_tokens: 128 });
// // console.log(output);
// // console.log(output[0].generated_text.at(-1).content);


//     console.log("1");
//     // const tokenizer = AutoTokenizer.from_pretrained("onnx-community/Llama-3.2-3B-Instruct", {
//     //     progress_callback,
//     // });

//     // const model = AutoModelForCausalLM.from_pretrained("onnx-community/Llama-3.2-3B-Instruct", {
//     //     device: "webgpu",
//     //     progress_callback,
//     // });


//     // Create a text-generation pipeline
//     const generator = await pipeline(
//         "text-generation",
//         // "onnx-community/Llama-3.2-3B-Instruct",
//         // { progress_callback, dtype: "q4f16", use_external_data_format: true}
//         // "onnx-community/Llama-3.2-1B-Instruct",
//         "onnx-community/Qwen2.5-1.5B-Instruct", 
//         // "HuggingFaceTB/SmolLM-1.7B-Instruct", 
//         { progress_callback, dtype: "q4" }
//         // "onnx-community/MobileLLM-125M",
//         // { progress_callback, dtype: "fp16" }

//     );
//     console.log("loaded generator");



  
//     // Define the list of messages
//     const messages = [
//         { role: "system", content: "You are a helpful assistant." },
//         { role: "user", content: "Tell me a funny joke." },
//     ];
    
//     // Generate a response
//     const output = await generator(messages, { max_new_tokens: 128, callback_function: function (beams) {
//         const decodedText = generator.tokenizer.decode(beams[0].output_token_ids, {
//             skip_special_tokens: true,
//         })
//         console.log(decodedText);
//     } }, );
//     // console.log(output[0].generated_text.at(-1).content);
//     console.log("done");
// }


// loadLLM();
































// import { Pipeline } from "@huggingface/transformers";
// import { desktopCapturer } from "electron";
// import { RawImage } from "@huggingface/transformers";
// import { Detector } from "./detector.js";
// import { Caption } from "./captioning.js";
// import wavefile from "wavefile";

// let transcriber:Pipeline = null;

// async function loadWhisper(ref) {


//     console.log("loading Whisper");
//     transcriber = await ref.pipeline(
//         "automatic-speech-recognition",
//         "onnx-community/whisper-tiny.en",
//         { dtype: { encoder_model: "fp32", decoder_model_merged: "q4" } },
//     );

//     console.log("loaded Whisper");
//     // transcribe_audio();
// }



// async function loadOmniParser(ref) {

//     function iou(a, b) {
//         const x1 = Math.max(a.x1, b.x1);
//         const y1 = Math.max(a.y1, b.y1);
//         const x2 = Math.min(a.x2, b.x2);
//         const y2 = Math.min(a.y2, b.y2);
      
//         const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
//         const area1 = (a.x2 - a.x1) * (a.y2 - a.y1);
//         const area2 = (b.x2 - b.x1) * (b.y2 - b.y1);
//         const union = area1 + area2 - intersection;
      
//         return intersection / union;
//       }
      
//       function nms(detections, iouThreshold) {
//         const result = [];
//         while (detections.length > 0) {
//           const best = detections.reduce((acc, detection) =>
//             detection.score > acc.score ? detection : acc,
//           );
//           result.push(best);
//           detections = detections.filter(
//             (detection) => iou(detection, best) < iouThreshold,
//           );
//         }
//         return result;
//       }

//     class Detector {
//         model: any;
//         processor: any;

//         constructor(model, processor) {
//           this.model = model;
//           this.processor = processor;
//         }
      
      
//         async predict(
//           input,
//           { confidence_threshold = 0.25, iou_threshold = 0.7 } = {},
//         ) {
//           const image = await ref.RawImage.read(input);
//           const { pixel_values } = await this.processor(image);
      
//           // Run detection
//           const { output0 } = await this.model({ images: pixel_values });
      
//           // Post-process output
//           const permuted = output0[0].transpose(1, 0);
//           // `permuted` is a Tensor of shape [ 5460, 5 ]:
//           // - 5460 potential bounding boxes
//           // - 5 parameters for each box:
//           //   - first 4 are coordinates for the bounding boxes (x-center, y-center, width, height)
//           //   - the last one is the confidence score
      
//           // Format output
//           const result = [];
//           const [scaledHeight, scaledWidth] = pixel_values.dims.slice(-2);
//           for (const [xc, yc, w, h, score] of permuted.tolist()) {
//             // Filter if not confident enough
//             if (score < confidence_threshold) continue;
      
//             // Get pixel values, taking into account the original image size
//             const x1 = ((xc - w / 2) / scaledWidth) * image.width;
//             const y1 = ((yc - h / 2) / scaledHeight) * image.height;
//             const x2 = ((xc + w / 2) / scaledWidth) * image.width;
//             const y2 = ((yc + h / 2) / scaledHeight) * image.height;
      
//             // Add to result
//             result.push({ x1, x2, y1, y2, score });
//           }
      
//           return nms(result, iou_threshold);
//         }
      
//         static async from_pretrained(model_id) {
//           const model = await ref.AutoModel.from_pretrained(model_id);
//           const processor = await ref.AutoProcessor.from_pretrained(model_id);
//           return new Detector(model, processor);
//         }
//       }

//       class Caption {
//         model: any;
//           processor: any;
//           tokenizer: any;
//           task: string;
//           text_inputs: any;

//         constructor(model, processor, tokenizer) {
//           this.model = model;
//           this.processor = processor;
//           this.tokenizer = tokenizer;
      
//           // Prepare text inputs
//           this.task = "<CAPTION>";
//           const prompts = processor.construct_prompts(this.task);
//           this.text_inputs = tokenizer(prompts);
//         }
      
//         /**
//          * Generate a caption for an image.
//          * @param {import("@huggingface/transformers").RawImage} image The input image.
//          * @returns {Promise<string>} The caption for the image
//          */
//         async describe(image) {
//           const vision_inputs = await this.processor(image);
      
//           // Generate text
//           const generated_ids = await this.model.generate({
//             ...this.text_inputs,
//             ...vision_inputs,
//             max_new_tokens: 256,
//           });
      
//           // Decode generated text
//           const generated_text = this.tokenizer.batch_decode(generated_ids, {
//             skip_special_tokens: false,
//           })[0];
      
//           // Post-process the generated text
//           const result = this.processor.post_process_generation(
//             generated_text,
//             this.task,
//             image.size,
//           );
//           return result[this.task];
//         }
      
//         static async from_pretrained(model_id) {
//           const model = await ref.Florence2ForConditionalGeneration.from_pretrained(
//             model_id,
//             {
//             //   device: "webgpu",
//               dtype: {
//                   embed_tokens: "fp16",
//                   vision_encoder: "fp16",
//                   encoder_model: "q4",
//                   decoder_model_merged: "q4",
//               },
//             },
//           );
//           const processor = await ref.AutoProcessor.from_pretrained(model_id);
//           const tokenizer = await ref.AutoTokenizer.from_pretrained(model_id);
      
//           return new Caption(model, processor, tokenizer);
//         }
//       }







//     console.log("loading OmniParser");


//     // const url = 'https://www.betaarchive.com/imageupload/1272633939.or.67475.jpg';


//     // const url =
//     // "https://raw.githubusercontent.com/microsoft/OmniParser/refs/heads/master/imgs/google_page.png";


//     // desktopCapturer.getSources({ types: ['screen'] })
//     //     .then( sources => {
//     //         document.getElementById('screenshot-image').src = sources[0].thumbnail.toDataURL() // The image to display the screenshot
//     //     })
//     console.log("loading image");
//     const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: screen.getPrimaryDisplay().workAreaSize, fetchWindowIcons: true });
//     // console.log("SOURCES");
//     // console.log(sources);
//     // const url = sources[0].thumbnail.toDataURL();
//     // sources[0].thumbnail.toJPEG();
//     // sources[0].thumbnail.toBitmap();
//     // sources[0].thumbnail.toDataURL();
//     // const image2 = nativeImage.createFromDataURL(url);

//     const thumbnail = nativeImage.createFromBuffer(sources[0].thumbnail.toPNG());
//     const imageBuffer = thumbnail.toPNG();
//     const image = await ref.RawImage.fromBlob(new Blob([imageBuffer]));

//     const filePath = path.join(app.getPath('desktop'), 'screenshotasasas2.png');
//     fs.writeFile(filePath, imageBuffer, err => {
//         if (err) return console.log('Failed to Save Image', err);
//       });
//     // await imageBuffer.save(filePath);


//     // const image = await ref.RawImage.read(url);
//     console.log("loaded image");



//     // Load detection model
//     const detector_model_id = "onnx-community/OmniParser-icon_detect";
//     const detector = await Detector.from_pretrained(detector_model_id);
//     console.log("loaded detector");


//     // Load captioning model
//     const captioning_model_id = "onnx-community/Florence-2-base-ft";
//     const captioning = await Caption.from_pretrained(captioning_model_id);
//     console.log("loaded captioning");

//     console.log("running detector");

//     // Run detection
//     const detections = await detector.predict(image, {
//     confidence_threshold: 0.05,
//     iou_threshold: 0.25,
//     });
//     console.log("got detections");
//     console.log(detections);








//     for (const { x1, x2, y1, y2, score } of detections) {
//     // Crop image
//     const bbox = [x1, y1, x2, y2].map(Math.round);
//     const cropped_image = await image.crop(bbox);

//     // Run captioning
//     const text = await captioning.describe(cropped_image);
//     console.log({ text, bbox, score });

//     }

// }





// import("@huggingface/transformers").then(async (ref) => {
//     // nodeLlamaCpp = ref;

//     // if (settings.useAPI == false && settings.localModelPath != "") {
//     //     loadLLAMA();
//     // }

//     loadWhisper(ref);

//     loadOmniParser(ref);
// });












// async function read_audio(url, sampling_rate = 16000) {
//     const buffer = Buffer.from(await fetch(url).then((x) => x.arrayBuffer()));

//     // Read .wav file and convert it to required format
//     const wav = new wavefile.WaveFile(buffer);
//     wav.toBitDepth("32f");
//     wav.toSampleRate(sampling_rate);
//     let samples = wav.getSamples();
//     if (Array.isArray(samples)) {
//         if (samples.length > 1) {
//         const SCALING_FACTOR = Math.sqrt(2);

//         // Merge channels (into first channel to save memory)
//         for (let i = 0; i < samples[0].length; ++i) {
//             samples[0][i] = (SCALING_FACTOR * (samples[0][i] + samples[1][i])) / 2;
//         }
//         }

//         // Select first channel
//         samples = samples[0];
//     }
//     return samples;
// }






// async function read_audio(buffer, sampling_rate = 16000) {

//     // const audioBuffer = await new AudioContext().decodeAudioData(buffer);
//     // const wav1 = new wavefile.WaveFile();
    
//     // wav1.fromScratch(audioBuffer.numberOfChannels, audioBuffer.length, '32f', audioBuffer.getChannelData(0));
    
//     // for (let i = 1; i < audioBuffer.numberOfChannels; i++) {
//     //     wav1.addChannel(audioBuffer.getChannelData(i));
//     // }

//     // return wav.toBuffer();
//     // Use buffer directly instead of fetching
//     const wav = new wavefile.WaveFile(Buffer.from(buffer));
//     wav.toBitDepth("32f");
//     wav.toSampleRate(sampling_rate);
//     let samples = wav.getSamples();
//     if (Array.isArray(samples)) {
//         if (samples.length > 1) {
//         const SCALING_FACTOR = Math.sqrt(2);

//         // Merge channels (into first channel to save memory)
//         for (let i = 0; i < samples[0].length; ++i) {
//             samples[0][i] = (SCALING_FACTOR * (samples[0][i] + samples[1][i])) / 2;
//         }
//         }

//         // Select first channel
//         samples = samples[0];
//     }
//     return samples;
// }



// async function transcribe_audio(audio:any) {
// async function transcribe_audio(audio) {
//     // const audio = await read_audio(
//     //     "https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav",
//     //     transcriber.processor.feature_extractor.config.sampling_rate,
//     // );

//     // const audio = await read_audio(
//     //     buffer,
//     //     transcriber.processor.feature_extractor.config.sampling_rate,
//     // );
    
//     // Run model w/ default settings
//     // console.time("Execution time");
//     const output = await transcriber(audio);
//     // console.timeEnd("Execution time");
//     console.log(output);

//     // console.log(output.text.replace(/\[.*?\]/g, ''));
    
//     promptWindow.webContents.send('onSetPromptFromMic', output.text);
// }

// transcribe_audio();






































const createBrowserWindow = (): BrowserWindow => {
    const preloadScriptFilePath = path.join(__dirname, "..", "dist-preload", "index.js");

    return new BrowserWindow({
        autoHideMenuBar: true,
        // backgroundMaterial: "mica",
        backgroundMaterial: "acrylic",
        // backgroundMaterial: "auto",
        // backgroundMaterial: "none",
        // backgroundMaterial: "tabbed",
        vibrancy: "header",
        frame: false,
        // transparent: true,
        webPreferences: {
            preload: preloadScriptFilePath,
            devTools: false,
        },
        icon: path.join(__dirname, "..", "build", "app-icon-dark.png"),

        width: 1024,
        // height: 1000,
        height: screen.getPrimaryDisplay().bounds.height * 0.8,
        // height: 39,
        // height: 512,
        // minWidth: 1024,
        // minHeight: 80,

        resizable: false,
        maxHeight: 39,

        // maxHeight: 512,
        center: true,
        // alwaysOnTop: true,
        skipTaskbar: true,
    });
};

const createResponseBrowserWindow = (): BrowserWindow => {
    const preloadScriptFilePath = path.join(__dirname, "..", "dist-preload", "index.js");

    return new BrowserWindow({
        autoHideMenuBar: true,
        backgroundMaterial: "mica",
        // backgroundMaterial: "acrylic",
        // backgroundMaterial: "auto",
        // backgroundMaterial: "none",
        // backgroundMaterial: "tabbed",
        vibrancy: "header",
        frame: false,
        // transparent: true,
        webPreferences: {
            preload: preloadScriptFilePath,
            devTools: false,
        },
        icon: path.join(__dirname, "..", "build", "app-icon-dark.png"),

        width: 1024,
        // height: 1000,
        height: screen.getPrimaryDisplay().bounds.height * 0.7,
        // height: 39,
        // height: 512,
        // minWidth: 1024,
        // minHeight: 80,

        // resizable: true,
        // maxHeight: 39,

        maxHeight: screen.getPrimaryDisplay().bounds.height * 0.7,
        center: true,
        show: false,
        // skipTaskbar: true
    });
};

const createSettingsBrowserWindow = (): BrowserWindow => {
    const preloadScriptFilePath = path.join(__dirname, "..", "dist-preload", "index.js");

    return new BrowserWindow({
        // parent: mainWindow,
        autoHideMenuBar: true,
        backgroundMaterial: "mica",
        // backgroundMaterial: "acrylic",
        // backgroundMaterial: "auto",
        vibrancy: "header",
        frame: false,
        // transparent: false,
        webPreferences: {
            preload: preloadScriptFilePath,
            devTools: false,
        },
        icon: path.join(__dirname, "..", "build", "app-icon-dark.png"),

        width: 512,
        height: 768,
        // height: 512,
        minWidth: 512,
        minHeight: 768,
        // resizable: false,
        // maxHeight: 39,
        // maxHeight: 512,
        center: true,
        // skipTaskbar: true
    });
};

const createChatboxBrowserWindow = (): BrowserWindow => {
    const preloadScriptFilePath = path.join(__dirname, "..", "dist-preload", "index.js");

    return new BrowserWindow({
        x: settings.chatboxWindow.height == 0 ? screen.getPrimaryDisplay().size.width - 450 : settings.chatboxWindow.x,
        // y: screen.getPrimaryDisplay().size.height - 800,
        y: settings.chatboxWindow.height == 0 ? 0 : settings.chatboxWindow.y,
        // parent: mainWindow,
        autoHideMenuBar: true,
        backgroundMaterial: "mica",
        // backgroundMaterial: "acrylic",
        // backgroundMaterial: "auto",
        vibrancy: "header",
        // frame: false,
        // transparent: false,
        webPreferences: {
            preload: preloadScriptFilePath,
            // devTools: false
        },
        icon: path.join(__dirname, "..", "build", "app-icon-dark.png"),

        width: settings.chatboxWindow.height == 0 ? 450 : settings.chatboxWindow.width,
        height:
            settings.chatboxWindow.height == 0
                ? screen.getPrimaryDisplay().size.height - 450
                : settings.chatboxWindow.height,
        // height: 512,
        minWidth: 200,
        // minHeight: 400,
        // resizable: false,
        show: false,
        // maxHeight: 39,
        // maxHeight: 512,
        // center: true,
        // skipTaskbar: true,
        // alwaysOnTop: true,
    });
};

const loadFileOrUrl = (browserWindow: BrowserWindow) => {
    if (process.env.VITE_DEV_SERVER_URL) {
        browserWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        browserWindow.loadFile(path.join(__dirname, "..", "dist-renderer", "index.html"));
        // browserWindow.loadFile(path.join(__dirname, "index.html"));
    }
};

function openSettings() {
    readSettings();
    if (settingsWindow == null) {
        settingsWindow = createSettingsBrowserWindow();
        // mainWindow.setContentSize(1024, 40)
        // settingsWindow.setSize(512, 1024);
        if (process.env.VITE_DEV_SERVER_URL) {
            settingsWindow.loadURL(path.join(process.env.VITE_DEV_SERVER_URL, "settings.html"));
        } else {
            // settingsWindow.loadFile(path.join(__dirname, "..", "src", "renderer", "settings.html"));
            // settingsWindow.loadFile(path.join(__dirname, "..", "settings.html"));
            // settingsWindow.loadFile(path.join(__dirname, "..", "dist-renderer", "settings.html"));
            settingsWindow.loadURL(path.resolve(__dirname, "..", "dist-renderer", "settings.html"));
            // settingsWindow.loadFile(path.join(__dirname, "../src/renderer/settings.html"));
            // settingsWindow.loadFile(path.join(__dirname, "..", "dist-renderer", "settings.html"));
        }
        // settingsWindow.on("")
        settingsWindow.on("closed", () => {
            settingsWindow = null;
        });

        settingsWindow.webContents.on("did-finish-load", () => {
            // console.log(readSettings().value);
            // const settings = readSettings();
            // console.log("read:", settings);
            settingsWindow.webContents.send("newUseAPI", settings.useAPI);
            settingsWindow.webContents.send("newUrl", settings.url);
            settingsWindow.webContents.send("updateLocalModel", settings.localModelPath);
            // settingsWindow.webContents.send('newTempUrl', settings.value);
        });
    } else {
        settingsWindow.show();
    }
}

function openChatbox() {
    if (chatboxWindow == null) {
        chatboxWindow = createChatboxBrowserWindow();
        if (process.env.VITE_DEV_SERVER_URL) {
            chatboxWindow.loadURL(path.join(process.env.VITE_DEV_SERVER_URL, "chatbox.html"));
        } else {
            chatboxWindow.loadURL(path.resolve(__dirname, "..", "dist-renderer", "chatbox.html"));
        }

        chatboxWindow.on("close", (e) => {
            e.preventDefault();
            chatboxWindow.hide();
        });

        chatboxWindow.on("closed", () => {
            chatboxWindow = null;
        });

        chatboxWindow.webContents.on("did-finish-load", () => {
            chatboxWindow.show();
        });

        chatboxWindow.on("moved", () => {
            settings.chatboxWindow.x = chatboxWindow.getPosition()[0];
            settings.chatboxWindow.y = chatboxWindow.getPosition()[1];
            settings.chatboxWindow.width = chatboxWindow.getSize()[0];
            settings.chatboxWindow.height = chatboxWindow.getSize()[1];
            writeSettings();
        });

        chatboxWindow.on("resized", () => {
            settings.chatboxWindow.x = chatboxWindow.getPosition()[0];
            settings.chatboxWindow.y = chatboxWindow.getPosition()[1];
            settings.chatboxWindow.width = chatboxWindow.getSize()[0];
            settings.chatboxWindow.height = chatboxWindow.getSize()[1];
            writeSettings();
        });
    } else {
        // chatboxWindow.show()
        if (chatboxWindow.isVisible()) {
            chatboxWindow.hide();
        } else {
            chatboxWindow.show();
        }
    }
}

const registerIpcEventListeners = () => {
    ipcMain.on("themeShouldUseDarkColors", (event: IpcMainEvent) => {
        event.returnValue = nativeTheme.shouldUseDarkColors;
    });

    ipcMain.on("openSettings", () => {
        // readSettings();
        // if(settingsWindow == null) {
        //     settingsWindow = createSettingsBrowserWindow();
        //     // mainWindow.setContentSize(1024, 40)
        //     // settingsWindow.setSize(512, 1024);
        //     if (process.env.VITE_DEV_SERVER_URL) {
        //         settingsWindow.loadURL(path.join(process.env.VITE_DEV_SERVER_URL, "settings.html"));

        //     } else {
        //         // settingsWindow.loadFile(path.join(__dirname, "..", "src", "renderer", "settings.html"));
        //         // settingsWindow.loadFile(path.join(__dirname, "..", "settings.html"));
        //         // settingsWindow.loadFile(path.join(__dirname, "..", "dist-renderer", "settings.html"));
        //         settingsWindow.loadURL(path.resolve(__dirname, "..", "dist-renderer", "settings.html"));
        //         // settingsWindow.loadFile(path.join(__dirname, "../src/renderer/settings.html"));
        //         // settingsWindow.loadFile(path.join(__dirname, "..", "dist-renderer", "settings.html"));
        //     }
        //     // settingsWindow.on("")
        //     settingsWindow.on("closed", () => {
        //         settingsWindow = null;
        //     });

        //     settingsWindow.webContents.on('did-finish-load', () => {
        //         // console.log(readSettings().value);
        //         // const settings = readSettings();
        //         // console.log("read:", settings);
        //         settingsWindow.webContents.send('newUseAPI', settings.useAPI);
        //         settingsWindow.webContents.send('newUrl', settings.url);
        //         settingsWindow.webContents.send('updateLocalModel', settings.localModelPath);
        //         // settingsWindow.webContents.send('newTempUrl', settings.value);
        //     });
        // } else {
        //     settingsWindow.show()
        // }
        openSettings();
    });

    ipcMain.on("closeSettings", () => {
        if (settingsWindow != null) {
            settingsWindow.hide();
            settingsWindow = null;
        }
    });

    ipcMain.on("saveAndCloseSettings", (event, data) => {
        if (settingsWindow != null) {
            settingsWindow.hide();
            settingsWindow = null;
            // if(data[0] == false && data[2] == "") {
            //     data[0] = true
            // }
            // console.log(url);
            settings.useAPI = data[0];
            settings.url = data[1];
            settings.localModelPath = data[2];
            writeSettings();
            for (const browserWindow of BrowserWindow.getAllWindows()) {
                browserWindow.webContents.send("newUseAPI", data[0]);
                browserWindow.webContents.send("newUrl", data[1]);
                browserWindow.webContents.send("updateLocalModel", data[2]);
            }

            if (data[0] == false && session == undefined) {
                loadLLAMA();
            } else if (data[0] == true) {
                if (client == undefined) {
                    loadAPI();
                } else {
                    client.baseURL = settings.url;
                }
            }
        }
    });

    ipcMain.on("onEscape", () => {
        if (settingsWindow != null) {
            settingsWindow.hide();
            // settingsWindow = null;
        }

        if (responseWindow != null) {
            responseWindow.webContents.send("onClearResponse");
            responseWindow.hide();
            // responseWindow = null;
        }

        if (promptWindow != null) {
            promptWindow.webContents.send("onClearPrompt");
            // promptWindow.close();
            promptWindow.hide();
            // promptWindow = null;
        }
    });

    ipcMain.on("onSendAbort", () => {
        controller.abort();
    });

    ipcMain.on("selectLocalModel", async () => {
        const x = await dialog.showOpenDialog({
            title: "Select Model",
            filters: [{ name: "GGUF Models", extensions: ["gguf"] }],
            properties: ["openFile"],
        });
        settingsWindow.webContents.send("updateLocalModel", x.filePaths[0]);
    });

    // ipcMain.on('onTempUrlChanged', (event, data) => {
    //     for (const browserWindow of BrowserWindow.getAllWindows()) {
    //         browserWindow.webContents.send('newTempUrl', data);
    //     }
    // });

    // ipcMain.on('onUrlChanged', (event, data) => {
    //     for (const browserWindow of BrowserWindow.getAllWindows()) {
    //         browserWindow.webContents.send('newUrl', data);
    //     }
    // });

    // ipcMain.on('onUpdatePrompt', async (event, data) => {
    //     for (const browserWindow of BrowserWindow.getAllWindows()) {
    //         browserWindow.webContents.send('onSetPrompt', data);
    //     }

    //     console.log("User: ", data, "\n");
    //     const answer = await session.prompt(data);
    //     console.log(answer);

    // });

    ipcMain.on("onSendPrompt", async (event, data) => {
        const fromChatbox = event.sender.getTitle() == "Omni Chatbox";

        if (fromChatbox == true) {
            // if(chatboxWindow != null)
            chatboxWindow.webContents.send("onUserResponse", data);
        }

        // const msgID = Math.random();

        controller = new AbortController();

        // if(controller) {
        //     controller.abort();
        //     // controller = new AbortController();
        //     shouldAbort = true;
        // }
        // else {
        //     controller = new AbortController();
        //     shouldAbort = false;
        // }

        if (fromChatbox == false) {
            if (responseWindow == null) {
                responseWindow = createResponseBrowserWindow();
                // responseWindow.setContentSize(1024, 40)
                // responseWindow.setSize(512, 1024);
                if (process.env.VITE_DEV_SERVER_URL) {
                    responseWindow.loadURL(path.join(process.env.VITE_DEV_SERVER_URL, "response.html"));
                } else {
                    // responseWindow.loadFile(path.join(__dirname, "..", "src", "renderer", "response.html"));
                    responseWindow.loadFile(path.join(__dirname, "..", "dist-renderer", "response.html"));
                }

                responseWindow.on("closed", () => {
                    responseWindow = null;
                });

                responseWindow.once("ready-to-show", () => {
                    responseWindow.show();
                });

                responseWindow.webContents.on("did-finish-load", () => {
                    // responseWindow.webContents.send('newUrl', settings.url);
                });
            } else {
                responseWindow.webContents.send("onClearResponse");
                // responseWindow.webContents.send('onClearResponse');
                // setTimeout(()=>{responseWindow.webContents.send('onClearResponse');responseWindow.show()},0);
                responseWindow.show();
            }
        }

        // console.log("User: ", data, "\n");
        // console.log("calling model");

        // for (const browserWindow of BrowserWindow.getAllWindows()) {
        // browserWindow.webContents.send('onClearResponse');
        // }

        if (fromChatbox == false) {
            responseWindow.webContents.send("onClearResponse");

            // responseWindow.maxHeight = screen.getPrimaryDisplay().bounds.height*0.7;
        }

        // const answer = await session.prompt(data);

        // const answer = await session.prompt(data, {

        // controller = new AbortController();

        // isGenerating = true;
        if (fromChatbox == false) {
            promptWindow.webContents.send("isGenerating", true);
        } else {
            chatboxWindow.webContents.send("isGenerating", true);
        }

        if (settings.useAPI == false) {
            try {
                if (fromChatbox == false) {
                    await session.prompt(data, {
                        onTextChunk(chunk: string) {
                            // console.log(shouldAbort);
                            // if(!responseWindow.isVisible() && !shouldAbort) {
                            //     responseWindow.show()
                            // }
                            // for (const browserWindow of BrowserWindow.getAllWindows()) {
                            //     browserWindow.webContents.send('onLLMResponse', chunk);
                            // }

                            // if(fromChatbox == false) {
                            responseWindow.webContents.send("onLLMResponse", chunk);
                            // if(shouldAbort == true) {
                            //     responseWindow.webContents.send('onClearResponse');
                            //     responseWindow.hide()
                            // }
                            // } else {
                            //     chatboxWindow.webContents.send('onLLMResponse', chunk);
                            // }
                        },
                        stopOnAbortSignal: true,
                        signal: controller.signal,
                    });
                } else {
                    await session.prompt(data, {
                        // await chatboxSession.prompt(data, {
                        onTextChunk(chunk: string) {
                            // for (const browserWindow of BrowserWindow.getAllWindows()) {
                            //     browserWindow.webContents.send('onLLMResponse', chunk);
                            // }
                            chatboxWindow.webContents.send("onLLMResponse", chunk);
                        },
                        stopOnAbortSignal: true,
                        signal: controller.signal,
                    });
                }
            } catch {
                // shouldAbort = false;
                // controller = null;
                console.log("aborteddddd");
            }
            // shouldAbort = false;
            // controller = null;
            // isGenerating = false;

            // promptWindow.webContents.send('isGenerating', false);
            if (fromChatbox == false) {
                promptWindow.webContents.send("isGenerating", false);
            } else {
                chatboxWindow.webContents.send("isGenerating", false);
            }
        } else {
            try {
                const chatCompletion = await client.chat.completions.create({
                    messages: [
                        // { role: "system", content: "You are a helpful assistant. Answer concisely."},
                        { role: "user", content: data },
                    ],
                    // model: 'ehartford_wizard-vicuna-7b-uncensored',
                    model: "",
                    stream: true,
                    // echo: true,
                    // stop: ["</s>", "ASSISTANT:", "USER:"]
                });

                // console.log(chatCompletion.choices[0].message);
                for await (const part of chatCompletion) {
                    // console.log(part.choices[0]?.delta?.content || '');
                    if (fromChatbox == false) {
                        responseWindow.webContents.send("onLLMResponse", part.choices[0]?.delta?.content || "");
                    } else {
                        chatboxWindow.webContents.send("onLLMResponse", part.choices[0]?.delta?.content || "");
                    }
                }

                // shouldAbort = false;
                // controller = null;
            } catch {
                if (fromChatbox == false) {
                    responseWindow.webContents.send(
                        "onLLMResponse",
                        "Couldn't connect to server. Please make sure that your server is active and that you have entered the correct URL in settings.\n\nOpen settings by prompting: /settings",
                    );
                } else {
                    chatboxWindow.webContents.send(
                        "onLLMResponse",
                        "Couldn't connect to server. Please make sure that your server is active and that you have entered the correct URL in settings.\n\nOpen settings by prompting: /settings",
                    );
                }
                // shouldAbort = false;
                // controller = null;
            }
            // isGenerating = false;

            // promptWindow.webContents.send('isGenerating', false);
            if (fromChatbox == false) {
                promptWindow.webContents.send("isGenerating", false);
            } else {
                chatboxWindow.webContents.send("isGenerating", false);
            }
        }

        // console.log(answer);

        // console.log(session.getChatHistory());
    });

    ipcMain.on("onResize", async (event, data) => {
        responseWindow.setBounds({ height: data + 40 });
    });

    ipcMain.on("quit", () => {
        for (const browserWindow of BrowserWindow.getAllWindows()) {
            browserWindow.close();
        }
    });

    // ipcMain.on('onMicStreamReady', (event, stream) => {
    //     console.log("mic stream ready");
    //     // console.log(stream);
    //     // Use the stream here, e.g., create an audio element
    //     // const audio = new Audio();
    //     // audio.srcObject = stream;
    //     // audio.play();
    // });

    // ipcMain.on('onMicStream', (event, audio) => {
    //     // console.log("got mic stream");
    //     // console.log(audio);
    //     // console.log(stream);
    //     // Use the stream here, e.g., create an audio element
    //     // const audio = new Audio();
    //     // audio.srcObject = stream;
    //     // audio.play();
    //     // console.log(url.slice(5));
    //     transcribe_audio(audio);
    // });

};

const registerNativeThemeEventListeners = (allBrowserWindows: BrowserWindow[]) => {
    nativeTheme.addListener("updated", () => {
        for (const browserWindow of allBrowserWindows) {
            browserWindow.webContents.send("nativeThemeChanged");
        }
    });
};

const createStartupBrowserWindow = (): BrowserWindow => {
    const preloadScriptFilePath = path.join(__dirname, "..", "dist-preload", "index.js");

    return new BrowserWindow({
        autoHideMenuBar: true,
        backgroundMaterial: "mica",
        // backgroundMaterial: "acrylic",
        // backgroundMaterial: "auto",
        // backgroundMaterial: "none",
        // backgroundMaterial: "tabbed",
        vibrancy: "header",
        frame: false,
        // transparent: true,
        webPreferences: {
            preload: preloadScriptFilePath,
            devTools: false,
        },
        icon: path.join(__dirname, "..", "build", "app-icon-dark.png"),

        width: 1024,
        // height: 1000,
        height: screen.getPrimaryDisplay().bounds.height * 0.3,
        // height: 39,
        // height: 512,
        // minWidth: 1024,
        // minHeight: 80,

        // resizable: true,
        // maxHeight: 39,

        maxHeight: screen.getPrimaryDisplay().bounds.height * 0.7,
        center: true,
        show: false,
        // skipTaskbar: true
    });
};

if (!fs.existsSync(path.join(app.getPath("userData"), ".firstrun"))) {
    // fs.writeFileSync(path.join(app.getPath("userData"), ".firstrun"), "");
    app.whenReady().then(() => {
        startupWindow = createStartupBrowserWindow();
        if (process.env.VITE_DEV_SERVER_URL) {
            startupWindow.loadURL(path.join(process.env.VITE_DEV_SERVER_URL, "startup.html"));
        } else {
            startupWindow.loadURL(path.resolve(__dirname, "..", "dist-renderer", "startup.html"));
        }
        startupWindow.webContents.on("did-finish-load", () => {
            startupWindow.show();
        });
        ipcMain.on("selectLocalModelFromStartup", async () => {
            const x = await dialog.showOpenDialog({
                title: "Select Model",
                filters: [{ name: "GGUF Models", extensions: ["gguf"] }],
                properties: ["openFile"],
            });
            // settings.localModelPath = x.filePaths[0];
            startupWindow.webContents.send("updateLocalModel", x.filePaths[0]);
        });
        ipcMain.on("saveAndCloseStartup", (event, data) => {
            fs.writeFileSync(path.join(app.getPath("userData"), ".firstrun"), "");
            if (startupWindow != null) {
                startupWindow.hide();
                startupWindow = null;
                // console.log(url);
                settings.useAPI = data[0];
                settings.url = data[1];
                settings.localModelPath = data[2];
                writeSettings();
                // for (const browserWindow of BrowserWindow.getAllWindows()) {
                // browserWindow.webContents.send('newUrl', data[1]);
                // browserWindow.webContents.send('newUseAPI', data[0]);
                // }

                if (data[0] == false && session == undefined) {
                    loadLLAMA();
                } else if (data[0] == true) {
                    if (client == undefined) {
                        loadAPI();
                    } else {
                        client.baseURL = settings.url;
                    }
                }
            }
        });
    });
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on("second-instance", () => {
        if (promptWindow == null) {
            promptWindow = createBrowserWindow();

            promptWindow.webContents.on("did-finish-load", () => {
                promptWindow.webContents.send("newUrl", settings.url);
                promptWindow.webContents.send("newUseAPI", settings.useAPI);
                // promptWindow.webContents.send("getMicStream", transcriber.processor.feature_extractor.config.sampling_rate);
            });
            promptWindow.on("show", () => {
                promptWindow.webContents.send("focusPrompt");
            });
            loadFileOrUrl(promptWindow);
            registerIpcEventListeners();
        } else {
            promptWindow.show();
            promptWindow.webContents.send("onClearPrompt");
            // promptWindow.webContents.send("getMicStream", transcriber.processor.feature_extractor.config.sampling_rate);
        }

        openSettings();
    });

    app.whenReady().then(() => {
        if (!globalShortcut.isRegistered("Super+/")) {
            globalShortcut.register("Super+/", () => {
                // console.log('Super+/ is pressed')
                if (promptWindow == null) {
                    promptWindow = createBrowserWindow();

                    // promptWindow.webContents.on('did-finish-load', () => {
                    //     promptWindow.webContents.send('newUrl', settings.url);
                    //     promptWindow.webContents.send('newUseAPI', settings.useAPI);
                    // });
                    promptWindow.webContents.on("did-finish-load", () => {
                        promptWindow.webContents.send("newUrl", settings.url);
                        promptWindow.webContents.send("newUseAPI", settings.useAPI);
                        // promptWindow.webContents.send("getMicStream", transcriber.processor.feature_extractor.config.sampling_rate);
                    });
                    promptWindow.on("show", () => {
                        promptWindow.webContents.send("focusPrompt");
                    });
                    loadFileOrUrl(promptWindow);
                    // registerIpcEventListeners();
                } else {
                    promptWindow.show();
                    promptWindow.webContents.send("onClearPrompt");
                    // promptWindow.webContents.send("getMicStream", transcriber.processor.feature_extractor.config.sampling_rate);
                }
            });
        }

        registerIpcEventListeners();

        if (tray == null) {
            // tray = new Tray(nativeImage.createFromPath(path.join(__dirname, "..", "build", "app-icon-dark.png")))
            tray = new Tray(path.join(__dirname, "..", "build", "app-icon-dark.png"));

            const contextMenu = Menu.buildFromTemplate([
                // { label: 'Item1', type: 'radio' },
                // { label: 'Item2', type: 'radio' },
                // { label: 'Item3', type: 'radio', checked: true },
                // { label: 'Item4'},
                // {
                //     label: 'Menu Item 1',
                //     click: () => { console.log("clicked") }
                // },
                {
                    label: "ChatBox",
                    click: () => {
                        openChatbox();
                    },
                },
                {
                    label: "Settings",
                    click: () => {
                        openSettings();
                    },
                },
                { type: "separator" },
                {
                    label: "Shutdown",
                    role: "quit",
                    // click: () => {
                    //     for (const browserWindow of BrowserWindow.getAllWindows()) {
                    //         browserWindow.close()
                    //     }
                    // }
                },
            ]);

            tray.setContextMenu(contextMenu);

            tray.setToolTip("OmniVerse");
            tray.setTitle("OmniVerse");

            tray.on("click", () => {
                if (promptWindow == null) {
                    promptWindow = createBrowserWindow();

                    promptWindow.webContents.on("did-finish-load", () => {
                        promptWindow.webContents.send("newUrl", settings.url);
                        promptWindow.webContents.send("newUseAPI", settings.useAPI);
                        // promptWindow.webContents.send("getMicStream", transcriber.processor.feature_extractor.config.sampling_rate);
                    });
                    promptWindow.on("show", () => {
                        promptWindow.webContents.send("focusPrompt");
                    });
                    loadFileOrUrl(promptWindow);
                    registerIpcEventListeners();
                } else {
                    promptWindow.show();
                    promptWindow.webContents.send("onClearPrompt");
                    // promptWindow.webContents.send("getMicStream", transcriber.processor.feature_extractor.config.sampling_rate);
                }
            });
        }

        // const mainWindow = createBrowserWindow();
        // mainWindow.webContents.on('did-finish-load', () => {
        //     // const settings = readSettings();
        //     mainWindow.webContents.send('newUrl', settings.url);
        //     mainWindow.webContents.send('newUseAPI', settings.useAPI);
        // });
        // loadFileOrUrl(mainWindow);
        // registerIpcEventListeners();
        registerNativeThemeEventListeners(BrowserWindow.getAllWindows());

        // mainWindow.fullScreen
        // mainWindow.setFullScreen(flag)
        // mainWindow.shadow
        // mainWindow.setHasShadow
        // win.setOverlayIcon(overlay, description)
        // win.setAppDetails(options)
        // win.setIgnoreMouseEvents(ignore[, options])
    });
}

// (async () => {
//     await app.whenReady();

//     if(!globalShortcut.isRegistered('Super+/')) {
//         globalShortcut.register('Super+/', () => {
//             console.log('Super+/ is pressed')
//             if(promptWindow == null) {
//                 promptWindow = createBrowserWindow();
//                 promptWindow.webContents.on('did-finish-load', () => {
//                     promptWindow.webContents.send('newUrl', settings.url);
//                     promptWindow.webContents.send('newUseAPI', settings.useAPI);
//                 });
//                 loadFileOrUrl(promptWindow);
//                 registerIpcEventListeners();
//             } else {
//                 promptWindow.show()
//             }
//         })
//     } else {
//         readSettings();
//         if(settingsWindow == null) {
//             settingsWindow = createSettingsBrowserWindow();
//             // mainWindow.setContentSize(1024, 40)
//             // settingsWindow.setSize(512, 1024);
//             if (process.env.VITE_DEV_SERVER_URL) {
//                 settingsWindow.loadURL(path.join(process.env.VITE_DEV_SERVER_URL, "settings.html"));

//             } else {
//                 // settingsWindow.loadFile(path.join(__dirname, "..", "src", "renderer", "settings.html"));
//                 // settingsWindow.loadFile(path.join(__dirname, "..", "settings.html"));
//                 // settingsWindow.loadFile(path.join(__dirname, "..", "dist-renderer", "settings.html"));
//                 settingsWindow.loadURL(path.resolve(__dirname, "..", "dist-renderer", "settings.html"));
//                 // settingsWindow.loadFile(path.join(__dirname, "../src/renderer/settings.html"));
//                 // settingsWindow.loadFile(path.join(__dirname, "..", "dist-renderer", "settings.html"));
//             }
//             // settingsWindow.on("")
//             settingsWindow.on("closed", () => {
//                 settingsWindow = null;
//             });

//             settingsWindow.webContents.on('did-finish-load', () => {
//                 // console.log(readSettings().value);
//                 // const settings = readSettings();
//                 // console.log("read:", settings);
//                 settingsWindow.webContents.send('newUrl', settings.url);
//                 settingsWindow.webContents.send('newUseAPI', settings.useAPI);
//                 // settingsWindow.webContents.send('newTempUrl', settings.value);
//             });
//         } else {
//             settingsWindow.show()
//         }
//     }

//     // const mainWindow = createBrowserWindow();
//     // mainWindow.webContents.on('did-finish-load', () => {
//     //     // const settings = readSettings();
//     //     mainWindow.webContents.send('newUrl', settings.url);
//     //     mainWindow.webContents.send('newUseAPI', settings.useAPI);
//     // });
//     // loadFileOrUrl(mainWindow);
//     // registerIpcEventListeners();
//     registerNativeThemeEventListeners(BrowserWindow.getAllWindows());

//     // mainWindow.fullScreen
//     // mainWindow.setFullScreen(flag)
//     // mainWindow.shadow
//     // mainWindow.setHasShadow
//     // win.setOverlayIcon(overlay, description)
//     // win.setAppDetails(options)
//     // win.setIgnoreMouseEvents(ignore[, options])

// })();

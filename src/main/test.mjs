import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: '',
    // baseURL: process.env.VITE_DEV_SERVER_URL
    baseURL: "http://localhost:8000/v1",
    // dangerouslyAllowBrowser: true
});




const sendPrompt = async () => {
    const chatCompletion = await client.chat.completions.create({
        messages: [
            { role: "system", content: "You are a helpful assistant. Answer concisely."},
            { role: 'user', content: "who was hitler?" }
        ],
        // model: 'ehartford_wizard-vicuna-7b-uncensored',
        stream: true,
        echo: true,
        // stop: ["</s>", "ASSISTANT:", "USER:"]
    });

    // console.log(chatCompletion.choices[0].message);
    for await (const part of chatCompletion) {
        console.log(part.choices[0]?.delta?.content || '');
    }




    // const chatPrompt = "whats 2+2?";
    // const messages = chatPrompt.split('\n').map(message => ({ role: 'user', content: message.trim() }));
    // const promptData = { messages: [{ role: 'user', content: "whats 2+2?" }], model: 'ehartford_wizard-vicuna-7b-uncensored', stream: true, slot_id: -1, stop: ["</s>", "ASSISTANT:", "USER:", "[END]"]}
    // const promptData = { messages: [{ role: 'user', content: "whats 2+2?" }], stream: true, slot_id: -1, stop: ["</s>", "ASSISTANT:", "USER:", "[END]"]}

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
};
sendPrompt();




// const sendPrompt = async () => {
//     const chatCompletion = await client.chat.completions.create({
//         messages: [
//             { role: "system", content: "You are a helpful assistant. Answer concisely."},
//             { role: 'user', content: "who was hitler?" }
//         ],
//         // model: 'ehartford_wizard-vicuna-7b-uncensored',
//         stream: true,
//         // echo: true,
//         // stop: ["</s>", "ASSISTANT:", "USER:"]
//     });

//     // console.log(chatCompletion.choices[0].message);
//     for await (const part of chatCompletion) {
//         console.log(part.choices[0]?.delta?.content || '');
//     }


// };
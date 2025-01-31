export class LLMPipeline {
    // NOTE: Replace this with your own task and model
    static task = 'text-generation';
    static model = 'onnx-community/Qwen2.5-1.5B-Instruct';
    static instance = null;

    // log_load(e) {
    //     console.log(e.progress)
    // }

    static async getInstance(progress_callback = (e)=>{console.log(e.progress)}) {
    // static async getInstance() {
        if (this.instance === null) {
            // Dynamically import the Transformers.js library

            console.log("loading transformers");
            // let { pipeline, env } = await import('@huggingface/transformers');
            let { pipeline } = await import('@huggingface/transformers');
            console.log("getting instance")
            
            
            // NOTE: Uncomment this to change the cache directory
            // env.cacheDir = './.cache';
            
            this.instance = await pipeline(this.task, this.model,  { dtype: "q4", progress_callback } );
            console.log("got instance")
        }

        return this.instance;
    }
}

// The run function is used by the `transformers:run` event handler.
// async function run(event, text) {
//     const classifier = await LLMPipeline.getInstance();
//     return await classifier(text);
// }

// async function getInstance() {
//     const instance = await LLMPipeline.getInstance();
//     return instance;
// }

// module.exports = {
//     run,
//     // getInstance
// }

// export {LLMPipeline};
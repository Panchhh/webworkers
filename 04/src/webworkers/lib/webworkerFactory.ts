import { WebWorkerMessageInput, WebWorkerMessageOutput, WorkerService } from './interfaces';

export const webWorkerFactory = (workerService: WorkerService) => {
    const log = (...args: any) => {
        console.log(`[WW] [${new Date().toISOString()}]`, ...args);
    };

    //log("Initializing");

    // Execution function
    const executeFn = async (funName: string, args: any[]) => {
        //log("Executing", funName, args);
        return workerService[funName](...args);
    }

    // onMessage callback
    onmessage = async function (e) {
        const inMessage = e.data as WebWorkerMessageInput;
        //log("inMessage", inMessage);

        const start = performance.now();

        let outMessage: WebWorkerMessageOutput;
        try {
            const output = await executeFn(inMessage.funName, inMessage.args);
            outMessage = { id: inMessage.id, output };
        } catch (e: any) {
            outMessage = { id: inMessage.id, output: null, error: e.message };
        }

        const end = performance.now();
        const timeElapsed = (end - start).toFixed(2);
        log(`time elapsed: ${timeElapsed}ms`);
        //log("outMessage", outMessage);
        postMessage(outMessage);
    };
}
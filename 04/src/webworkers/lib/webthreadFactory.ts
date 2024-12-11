import _ from "lodash";
import type { WebThread, WorkerService } from "./interfaces";
import { WebWorkerPool } from "./webworkerPool";


let webThread: WebThread<WorkerService>;
export function webThreadFactory<T extends WorkerService>(workerService: T, options: {
    readonly useUiThread?: boolean;
    readonly numWorkers?: number;
    readonly isMemoizeEnable?: boolean;
}): WebThread<T> {
    const useUiThread = options?.useUiThread ?? false;
    const numWorkers = options?.numWorkers ?? 1;
    const isMemoizeEnable = options?.isMemoizeEnable ?? false;

    // usare i webworker?
    const shouldUseWebWorker = typeof (Worker) !== "undefined" && !useUiThread;
    console.log(`[WebThread] factory() shouldUseWebWorker: ${shouldUseWebWorker}`);
    console.log(`[WebThread] factory() useUiThread: ${useUiThread}, numWorkers: ${numWorkers}, isMemoizeEnable: ${isMemoizeEnable}`);

    if (webThread != null) {
        throw new Error("[WebThreadFactory] Error - webThreadFactory must be initialized once");
    }

    let webWorkerPool: WebWorkerPool;
    if (shouldUseWebWorker) {
        webWorkerPool = new WebWorkerPool(numWorkers, { isMemoizeEnable });
    }

    // let webWorkerPool: WebWorkerClient;
    // if (shouldUseWebWorker) {
    //     webWorkerPool = new WebWorkerClient();
    // }

    webThread = {};
    _.forOwn(workerService, (fn, funName) => {
        webThread[funName] = (...args: any) => {
            if (shouldUseWebWorker) {
                return webWorkerPool.postMessage(funName, args);
            }
            else {
                return new Promise((accept, reject) => {
                    setTimeout(() => {
                        const start = performance.now();
                        try {
                            const result = fn(...args);
                            accept(result);
                        } catch (e) {
                            reject(e);
                        }
                        const end = performance.now();
                        const timeElapsed = (end - start).toFixed(2);
                        console.log(`[No-WW] time elapsed: ${timeElapsed}ms`);
                    });
                });
            }
        };
    });
    return webThread as WebThread<T>;
};
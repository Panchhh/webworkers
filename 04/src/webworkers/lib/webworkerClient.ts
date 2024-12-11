import { Dictionary } from "lodash";
import MyWorker from '../webworker?worker';
import { WebWorkerMessageInput, WebWorkerMessageOutput } from "./interfaces";

export class WebWorkerClient {

    private id: number = 0;
    private worker: Worker;
    private promises: Dictionary<{
        readonly accept: Function;
        readonly reject: Function;
    }> = {};

    public constructor() {
        this.worker = new MyWorker()
        this.worker.onmessage = (e) => {
            const message = e.data as WebWorkerMessageOutput;
            const promises = this.promises[message.id];
            if (message.error != null) {
                promises.reject(message.error);
            } else {
                promises.accept(message.output);
            }
            delete this.promises[message.id];
        };
    };

    public postMessage(funName: string, args: any[]) {
        const promise = new Promise((accept, reject) => {
            const thisPromiseId = this.id++;
            this.promises[thisPromiseId] = { accept, reject };
            this.worker.postMessage({ id: thisPromiseId, funName, args } as WebWorkerMessageInput);
        });
        return promise;
    }
};

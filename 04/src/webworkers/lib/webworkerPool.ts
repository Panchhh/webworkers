import _, { Dictionary, memoize } from "lodash";
import { WebWorkerClient } from "./webworkerClient";

interface WorkerTask {
    funName: string;
    args: any[];
    resolve: (value: any) => void;
    reject: (reason: any) => void;
}

export class WebWorkerPool {
    private workers: WebWorkerClient[] = [];
    private taskQueue: WorkerTask[] = [];
    private workerStatus: Dictionary<boolean> = {}; // true: busy, false: free
    private executeTask: (funName: string, args: any[]) => Promise<any>;

    private taskCounter = 0;
    private log = (...args: any) => {
        console.log(`[Pool] [${new Date().toISOString()}]`, ...args);
    };

    public constructor(numWorkers: number, options?: { readonly isMemoizeEnable?: boolean }) {
        const isMemoizeEnable = options?.isMemoizeEnable ?? false;
        this.log(`Initializing with ${numWorkers} workers, memoize: ${isMemoizeEnable}`);

        for (let i = 0; i < numWorkers; i++) {
            const worker = new WebWorkerClient();
            this.workers.push(worker);
            this.workerStatus[i] = false;
        }

        // Base execute function
        const execute = async (funName: string, args: any[]) => {
            const taskId = ++this.taskCounter;
            this.log(`Task #${taskId} - Creating new task: ${funName}`, /*args*/);

            return new Promise((resolve, reject) => {
                const task: WorkerTask = { funName, args, resolve, reject };
                this.taskQueue.push(task);
                this.log(`Task #${taskId} - Added to queue. Queue length: ${this.taskQueue.length}`);

                this.processNextTask();
            });
        };

        this.executeTask = isMemoizeEnable
            ? memoize(execute, (funName, args) => this.generateKey(funName, args))
            : execute;
    }

    private getAvailableWorkerIndex(): number {
        const key = _.findKey(this.workerStatus, status => status === false);
        const result = key !== undefined ? Number(key) : -1;
        this.log(`Looking for available worker:`, { workerStatuses: this.workerStatus, foundWorker: result });
        return result;
    }

    private processNextTask() {
        if (this.taskQueue.length === 0) {
            this.log(`No tasks in queue`);
            return;
        }

        const availableWorkerIndex = this.getAvailableWorkerIndex();
        if (availableWorkerIndex === -1) {
            this.log(`No available workers. Current queue length: ${this.taskQueue.length}`);
            return;
        }

        const nextTask = this.taskQueue.shift()!;
        this.workerStatus[availableWorkerIndex] = true;

        this.log(`Assigning task to worker ${availableWorkerIndex}:`, { function: nextTask.funName, /*args: nextTask.args*/ });

        const startTime = performance.now();

        this.workers[availableWorkerIndex]
            .postMessage(nextTask.funName, nextTask.args)
            .then(result => {
                const duration = (performance.now() - startTime).toFixed(2);
                this.log(`Worker ${availableWorkerIndex} completed task in ${duration}ms:`, { function: nextTask.funName, /* args: nextTask.args, result*/ });
                nextTask.resolve(result);
            })
            .catch(error => {
                this.log(`Worker ${availableWorkerIndex} failed:`, { function: nextTask.funName, /*args: nextTask.args,*/ error });
                nextTask.reject(error);
            })
            .finally(() => {
                this.workerStatus[availableWorkerIndex] = false;
                this.log(`Worker ${availableWorkerIndex} finished. Queue length: ${this.taskQueue.length}`);
                this.processNextTask();
            });
    }

    public async postMessage(funName: string, args: any[]): Promise<any> {
        this.log(`Received request:`, { function: funName, /* args*/ });
        return this.executeTask(funName, args);
    }


    private generateKey = (funName: string, args: any[]): string => {
        const SAMPLE_SIZE = 3;

        const processArg = (arg: any): string => {
            if (Array.isArray(arg)) {
                const len = arg.length;

                if (len <= SAMPLE_SIZE * 3) {
                    return `arr:${len}:${arg.join(',')}`;
                }

                const start = arg.slice(0, SAMPLE_SIZE);
                const mid = arg.slice(Math.floor(len / 2) - 1, Math.floor(len / 2) + 1);
                const end = arg.slice(-SAMPLE_SIZE);

                return `arr:${len}:${_.map(start, JSON.stringify)}-${_.map(mid, JSON.stringify)}-${_.map(end, JSON.stringify)}`;
            }
            return JSON.stringify(arg); //TODO: handle complex objects?
        };

        return `${funName}:${args.map(processArg).join('|')}`;
    };
}
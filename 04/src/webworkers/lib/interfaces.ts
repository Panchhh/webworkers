export interface WebWorkerMessageInput {
    readonly id: number;
    readonly funName: string;
    readonly args: any[];
}

export interface WebWorkerMessageOutput {
    readonly id: number;
    readonly output: any;
    readonly error?: any;
}


export interface WorkerService {
    [funName: string]: (...args: any) => any | Promise<any>;
};

export type WebThread<T extends WorkerService> = {
    [K in keyof T]: (...input: Parameters<T[K]>) => Promise<ReturnType<T[K]>>;
};
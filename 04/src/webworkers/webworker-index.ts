import { webThreadFactory } from "./lib/webthreadFactory";
import { myWorkerService } from "./worker-service";

// Setup webThread
// const cpuCores = navigator.hardwareConcurrency || 4;
// const numWorkers = cpuCores - 1;

const numWorkers = 1;

export const webThread = webThreadFactory(myWorkerService, {
    useUiThread: false,
    numWorkers: numWorkers,
    isMemoizeEnable: true
});
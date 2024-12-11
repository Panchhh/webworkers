
import { webWorkerFactory } from './lib/webworkerFactory';
import { myWorkerService } from './worker-service';

// Setup web worker
webWorkerFactory(myWorkerService);
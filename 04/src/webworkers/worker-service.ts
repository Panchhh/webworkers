import { calculateAggregatedTemperatures } from "../domain/business-logic/calculateAggregatedTemperatures";
import { WorkerService } from "./lib/interfaces";

/** 
 * Definizione del servizio del web worker.
 * Contiene i metodi che possono essere delegati al web worker
 */
export const myWorkerService: WorkerService = {
    calculateAggregatedTemperatures
};
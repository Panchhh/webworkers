import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { calculateAggregatedTemperatures } from "../../domain/business-logic/calculateAggregatedTemperatures";
import { Aggregation } from "../../domain/models/Aggregation";
import { IBounds } from "../../domain/models/IBounds";
import { MeasureAggregatedData } from "../../domain/models/MeasureAggregatedData";
import { MeasureData } from "../../domain/models/MeasureData";
import { Chart } from "./Chart";

interface TemperatureChartProps {
    dateRange: IBounds,
    selectedAggregation: Aggregation;
}

export const TemperatureChart = ({ dateRange, selectedAggregation }: TemperatureChartProps) => {
    const [measures, setMeasures] = useState<MeasureData[]>([]);

    useEffect(() => {
        fetch('./data.json')
            .then(response => response.json())
            .then(jsonData => {
                const data: MeasureData[] = _.map(jsonData, x => {
                    return {
                        value: x?.value,
                        timestamp: x?.timestamp,
                        sourceId: x?.sourceId
                    };
                });
                const filteredData = _.flatMap(_.times(300), () => data); //Aumentiamo un po' i dati
                setMeasures(filteredData);
            })
            .catch(error => console.error('Error loading data:', error));
    }, []);

    /* UseMemo */
    const aggregatedData: MeasureAggregatedData[] = useMemo(() => {
        return calculateAggregatedTemperatures(dateRange, selectedAggregation, measures);
    }, [measures, selectedAggregation, dateRange]);


    /* UseAsyncMemo */
    // const aggregatedData: MeasureAggregatedData[] | undefined = useAsyncMemo(async () => {
    //     return await webThread.calculateAggregatedTemperatures(dateRange, selectedAggregation, measures);
    // }, [measures, selectedAggregation, dateRange]);

    /* useAsyncMemoWithLoading */
    // const { data: aggregatedData, isLoading } = useAsyncMemoWithLoading(async () => {
    //     return webThread.calculateAggregatedTemperatures(dateRange, selectedAggregation, measures);
    // }, [measures, selectedAggregation, dateRange]);

    /* Parallel Executions disable memoization */
    // const { data: aggregatedData, isLoading } = useAsyncMemoWithLoading(async () => {
    //     const req = [
    //         webThread.calculateAggregatedTemperatures(dateRange, selectedAggregation, measures),
    //         webThread.calculateAggregatedTemperatures(dateRange, selectedAggregation, measures),
    //         webThread.calculateAggregatedTemperatures(dateRange, selectedAggregation, measures),
    //         webThread.calculateAggregatedTemperatures(dateRange, selectedAggregation, measures),
    //         webThread.calculateAggregatedTemperatures(dateRange, selectedAggregation, measures),
    //         webThread.calculateAggregatedTemperatures(dateRange, selectedAggregation, measures),
    //         webThread.calculateAggregatedTemperatures(dateRange, selectedAggregation, measures),
    //         //webThread.calculateAggregatedTemperatures(dateRange, selectedAggregation, measures.filter((_, i) => i > 100)),
    //     ];

    //     const res = await Promise.all(req);
    //     return res[0]; // Mostro solo il risultato del primo per semplicità
    // }, [measures, selectedAggregation, dateRange]);

    return (
        <Chart aggregatedData={aggregatedData} isLoading={false} />
    );
}
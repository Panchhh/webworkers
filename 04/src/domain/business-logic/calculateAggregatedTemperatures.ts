import dayjs from "dayjs";
import _ from "lodash";
import { Aggregation, getIntervalHours } from "../models/Aggregation";
import { IBounds } from "../models/IBounds";
import { MeasureAggregatedData } from "../models/MeasureAggregatedData";
import { MeasureData } from "../models/MeasureData";

export const calculateAggregatedTemperatures = (
    bounds: IBounds,
    aggregation: Aggregation,
    data: MeasureData[]
): MeasureAggregatedData[] => {

    const filteredData = data.filter(item => {
        const timestamp = dayjs(item.timestamp);
        return timestamp.isAfter(bounds.startDate) && timestamp.isBefore(bounds.endDate);
    });

    const intervalHours = getIntervalHours(aggregation);

    const groupedData = _.groupBy(filteredData, (item) => {
        const timestamp = dayjs(item.timestamp);

        if (aggregation === Aggregation.DAY) {
            return timestamp.startOf('day').toISOString();
        }

        const hourOfDay = timestamp.hour();
        const intervalIndex = Math.floor(hourOfDay / intervalHours);
        const startHour = intervalIndex * intervalHours;

        return timestamp
            .startOf('day')
            .add(startHour, 'hour')
            .toISOString();
    });

    // Calculate aggregations for each group
    const result = Object.entries(groupedData).map(([timestamp, values]): MeasureAggregatedData => {
        const temperatures = values.map(v => v.value);

        return {
            timestamp,
            avg: _.round(_.mean(temperatures), 2),
            min: _.min(temperatures) ?? 0,
            max: _.max(temperatures) ?? 0,
            count: temperatures.length
        };
    });

    return _.sortBy(result, ['timestamp']);
};
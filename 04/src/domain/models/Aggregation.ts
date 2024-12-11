export enum Aggregation {
    DAY = 0,
    HOUR_1 = 1,
    HOUR_6 = 2,
    HOUR_3 = 3,
    HOUR_12 = 4,
};

export const getIntervalHours = (agg: Aggregation): number => {
    switch (agg) {
        case Aggregation.DAY:
            return 24;
        case Aggregation.HOUR_12:
            return 12;
        case Aggregation.HOUR_6:
            return 6;
        case Aggregation.HOUR_3:
            return 3;
        case Aggregation.HOUR_1:
        default:
            return 1;
    }
};
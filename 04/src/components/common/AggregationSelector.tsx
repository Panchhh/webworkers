import { Select } from 'antd';
import { Aggregation } from '../../domain/models/Aggregation';

interface AggregationSelectorProps {
    value: Aggregation;
    onChange: (value: Aggregation) => void;
}

export const AggregationSelector = ({ value, onChange }: AggregationSelectorProps) => {
    const aggregationOptions = [
        { value: Aggregation.HOUR_1, label: "1 Hour" },
        { value: Aggregation.HOUR_3, label: "3 Hours" },
        { value: Aggregation.HOUR_6, label: "6 Hours" },
        { value: Aggregation.HOUR_12, label: "12 Hours" },
        { value: Aggregation.DAY, label: "Day" },
    ];

    return (
        <Select
            style={{ width: 200 }}
            value={value}
            onChange={onChange}
            options={aggregationOptions}
            placeholder="Select aggregation"
        />
    );
};
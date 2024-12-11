import { useState } from 'react';
import { Aggregation } from '../domain/models/Aggregation';

import { Card, Space } from 'antd';
import _ from 'lodash';
import { IBounds } from '../domain/models/IBounds';
import { AggregationSelector } from './common/AggregationSelector';
import { DateRangeSelector } from './common/DateRangeSelector';
import { TemperatureChart } from './common/TemperatureChar';

const startingBounds: IBounds = {
    startDate: '2024-10-12T00:00:00.000Z',
    endDate: '2024-12-04T13:40:00.538Z'
};

const defaultAggregation = Aggregation.DAY;

export const TemperatureDashboard = () => {
    const [selectedAggregation, setSelectedAggregation] = useState<Aggregation>(defaultAggregation);
    const [dateRange, setDateRange] = useState<IBounds>(startingBounds);

    return (
        <Card title={"Temperature dashboard"}>
            <Space direction="horizontal" size={16} style={{ marginBottom: 16 }}>
                <DateRangeSelector
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    onChange={setDateRange}
                />
                <AggregationSelector
                    value={selectedAggregation}
                    onChange={setSelectedAggregation}
                />
            </Space>

            {_.times(1, key => <TemperatureChart key={key} dateRange={dateRange} selectedAggregation={selectedAggregation} />)}

        </Card>
    );
};
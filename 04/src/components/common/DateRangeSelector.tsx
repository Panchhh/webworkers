import { DatePicker } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs, { Dayjs } from 'dayjs';
import { IBounds } from '../../domain/models/IBounds';

const { RangePicker } = DatePicker;

interface DateRangeSelectorProps {
    startDate: string;
    endDate: string;
    onChange: (bounds: IBounds) => void;
}

export const DateRangeSelector = ({ startDate, endDate, onChange }: DateRangeSelectorProps) => {
    const dateRange: [Dayjs, Dayjs] = [
        dayjs(startDate),
        dayjs(endDate)
    ];

    const handleChange: RangePickerProps['onChange'] = (dates) => {
        if (dates && dates[0] && dates[1]) {
            onChange({
                startDate: dates[0].startOf('day').toISOString(),
                endDate: dates[1].endOf('day').toISOString()
            } as IBounds);
        }
    };

    return (
        <RangePicker
            value={dateRange}
            onChange={handleChange}
            style={{ width: 300 }}
            allowClear={false}
            showTime={false}
        />
    );
};
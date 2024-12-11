import dayjs from "dayjs";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MeasureAggregatedData } from "../../domain/models/MeasureAggregatedData";
import { LoadingOverlay } from "./LoadingOverlay";

interface ChartProps {
    aggregatedData: MeasureAggregatedData[] | undefined
    isLoading: boolean;
}

export const Chart = ({ aggregatedData, isLoading }: ChartProps) => {
    return (
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <LoadingOverlay isLoading={isLoading} />
            <ResponsiveContainer>
                <LineChart
                    data={aggregatedData}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="timestamp"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tickFormatter={(value) => dayjs(value).format('DD/MM')}
                    />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip
                        labelFormatter={(value) => dayjs(value).format('DD/MM/YYYY HH:mm')}
                    />
                    <Line
                        type="monotone"
                        dataKey="avg"
                        stroke="#1890ff"
                        name="Average"
                        dot={false}
                        isAnimationActive={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="max"
                        stroke="#52c41a"
                        name="Maximum"
                        dot={false}
                        isAnimationActive={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="min"
                        stroke="#faad14"
                        name="Minimum"
                        dot={false}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
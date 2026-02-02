import React, {useEffect} from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';
import { Log } from '@/models/interfaces';

interface PastWeekChartProps {
  logs: Log[];
  baseLabel: string;
  baseValue: number;
  reachLabel: string;
  reachValue: number;
  unit: string;
}

const PastWeekChart: React.FC<PastWeekChartProps> = ({ logs, baseLabel, baseValue, reachLabel, reachValue, unit }) => {
    const [last7DaysState, setLast7DaysState] = React.useState<{ date: Date; day: string; value: number }[]>([]);
    const ReferenceLineLabel: React.FC<{ value: string }> = ({ value }) => (
        <p className='font-bold'>{value}</p>
    );

    useEffect(() => {
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(today.getDate() - (6 - i));
            return {
            date,
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            value: 0
            };
        });

        if (logs && logs.length > 0) {
            logs.forEach(log => {
            const logDate = new Date(log.date);
            logDate.setHours(0, 0, 0, 0); // Normalize log date to midnight
            const diffTime = today.setHours(0, 0, 0, 0) - logDate.getTime(); // Compare from midnight to midnight
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 7 && diffDays >= 0) {
                last7Days[6 - diffDays].value += log.value;
            }
            });
        }

        setLast7DaysState(last7Days);
    }
    , [logs]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={last7DaysState}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name={unit} fill="#8884d8" />
                <ReferenceLine y={baseValue} label={<ReferenceLineLabel value={baseLabel}/>} strokeWidth="2" stroke="green" isFront={true}/>
                <ReferenceLine y={reachValue} label={<ReferenceLineLabel value={reachLabel}/>} strokeWidth="2" stroke="gold" isFront={true}/>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default PastWeekChart;
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Log } from '@/models/interfaces';

interface ProgressChartProps {
  logs: Log[];
  type: string;
  baseLabel: string;
  baseValue: number;
  reachLabel: string;
  reachValue: number;
  countFrequency: "" | "day" | "week";
  startDate: Date;
  endDate: Date;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ logs, type, baseLabel, baseValue, reachLabel, reachValue, countFrequency, startDate, endDate }) => {
  // Calculate the number of days, weeks, or months in the session
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const weeks = Math.ceil(days / 7);
  const months = Math.ceil(days / 30);

  // Adjust base and reach values based on countFrequency
  let adjustedBaseValue = baseValue;
  let adjustedReachValue = reachValue;
  switch (countFrequency) {
    case "day":
      adjustedBaseValue *= days;
      adjustedReachValue *= days;
      break;
    case "week":
      adjustedBaseValue *= weeks;
      adjustedReachValue *= weeks;
      break;
  }

  // Transform logs into data suitable for the chart
  let data: { date: string, value: number }[] = [];
  switch (type) {
    case "countUp":
      data = logs.reduce((acc, log) => {
        const date = new Date(log.date).toLocaleDateString();
        const existingEntry = acc.find(entry => entry.date === date);
        if (existingEntry) {
          existingEntry.value += log.value;
        } else {
          acc.push({ date, value: log.value });
        }
        return acc;
      }, [] as { date: string, value: number }[]);
      break;
    case "stepUp":
      data = logs.reduce((acc, log) => {
        const date = new Date(log.date).toLocaleDateString();
        const existingEntry = acc.find(entry => entry.date === date);
        if (existingEntry) {
          existingEntry.value += 1;
        } else {
          acc.push({ date, value: 1 });
        }
        return acc;
      }, [] as { date: string, value: number }[]);
      break;
    // Add cases for other goal types as needed
  }

  // Create a running total for the log values
  let runningTotal = 0;
  const cumulativeData = data.map(entry => {
    runningTotal += entry.value;
    return { ...entry, cumulativeValue: runningTotal };
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={cumulativeData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" domain={[start.toLocaleDateString(), end.toLocaleDateString()]} allowDataOverflow/>
        <YAxis domain={[0, (adjustedReachValue + Math.ceil(.10 * adjustedReachValue))]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="cumulativeValue" stroke="#8884d8" name="Progress" />
        <ReferenceLine y={adjustedBaseValue} label={baseLabel} stroke="red" strokeDasharray="3 3" />
        <ReferenceLine y={adjustedReachValue} label={reachLabel} stroke="green" strokeDasharray="3 3" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProgressChart;
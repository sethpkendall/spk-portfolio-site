import React from 'react';
import { Goal, Log } from '@/models/interfaces';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type SessionProgressChartProps = {
    goals: Goal[];
    startDate: Date;
    endDate: Date;
};

const processGoalDataForChart = (goals: Goal[], dateRangePointTotals: {[key:string]:number}) => {
    goals.forEach(goal => {
        if (goal.countFrequency === 'day') {
            const summedLogValueByDay = {} as {[key:string]:number};
            // for each day, calculate the total value of logs
            (goal.logs as Log[])?.forEach((log) => {
                const logDate = new Date(log.date).toLocaleDateString();
                if (!summedLogValueByDay[logDate]) {
                    summedLogValueByDay[logDate] = 0;
                }
                summedLogValueByDay[logDate] += log.value;
            });
            const pointTotalsPerDay = {} as {[key:string]:number};
            // assign points based on log values
            Object.keys(summedLogValueByDay).forEach((date) => {
                const logValue = summedLogValueByDay[date];
                if (logValue >= goal.reachValue) {
                    if (!pointTotalsPerDay[date]) {
                        pointTotalsPerDay[date] = 0;
                    }
                    pointTotalsPerDay[date] += 10;
                } else if (logValue >= goal.baseValue) {
                    if (!pointTotalsPerDay[date]) {
                        pointTotalsPerDay[date] = 0;
                    }
                    pointTotalsPerDay[date] += goal.basePoints;
                }
            });
            Object.keys(dateRangePointTotals).forEach((date) => {
                if( !pointTotalsPerDay[date]) {
                    dateRangePointTotals[date] += 0;
                } else {
                    dateRangePointTotals[date] += (pointTotalsPerDay[date]/7);
                }
            });
        } else if (goal.countFrequency === 'week') {
            // Get all the date keys sorted chronologically
            const allDates = Object.keys(dateRangePointTotals)
                .map(dateStr => new Date(dateStr))
                .sort((a, b) => a.getTime() - b.getTime());

            // Iterate through the dates in chunks of 7 (weeks)
            for (let i = 0; i < allDates.length; i += 7) {
                const weekDates = allDates.slice(i, i + 7);
                if (weekDates.length === 0) continue;

                // Get the string representations for lookup
                const weekDateStrings = weekDates.map(d => d.toLocaleDateString());

                // Filter logs that fall within this week
                const logsForWeek = (goal.logs as Log[])?.filter(log => {
                    const logDateStr = new Date(log.date).toLocaleDateString();
                    return weekDateStrings.includes(logDateStr);
                }) || [];

                // Sum log values for the week
                const summedLogValues = logsForWeek.reduce((sum, log) => sum + log.value, 0);

                // Assign points to each day in the week
                let points = 0;
                if (summedLogValues >= goal.reachValue) {
                    points = 10;
                } else if (summedLogValues >= goal.baseValue) {
                    points = goal.basePoints;
                }

                // Add the weekly points to each day in the week
                weekDateStrings.forEach(dateStr => {
                    dateRangePointTotals[dateStr] += points;
                });
            }
        }
    });
}

export default function SessionProgressChart({goals,startDate,endDate}:SessionProgressChartProps): JSX.Element{
    // Generate the full date range from startDate to endDate
    const dateRange = [] as string[];
    const totalDuration = endDate.getTime() - startDate.getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    // Populate dateRange by day
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dateRange.push(new Date(d).toLocaleDateString());
    }
    // Create point totals for each date in the range
    const dateRangePointTotals = {} as {[key:string]:number};
    for (let item of dateRange) {
        dateRangePointTotals[item] = 0;
    }

    processGoalDataForChart(goals, dateRangePointTotals);

    // Transform dateRangePointTotals into data suitable for the chart
    let cumulativeTotal = 0;
    const chartData = Object.keys(dateRangePointTotals).map(date => {
        cumulativeTotal += dateRangePointTotals[date];
        return {
        date,
        points: (Math.round(cumulativeTotal * 10) / 10)
        };
    });

  // Format x-axis labels
  const formatXAxis = (tickItem: string) => {
    if (tickItem.includes('-')) {
      return tickItem.split('-')[1].trim();
    }
    return tickItem;
  };

    return (
        <div className="sessionProgressChartParent m-4 flex">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatXAxis} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="points" stroke="#8884d8" name="Points" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
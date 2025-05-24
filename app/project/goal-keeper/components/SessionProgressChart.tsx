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
            Object.keys(dateRangePointTotals).forEach((dateRange) => {
                const dateRangeDailyPointValues = [] as number[];
                const dateRangeStrings = [] as string[];
                const [startDateStr, endDateStr] = dateRange.split(' - ');
                // Parse the dateRange string
                if (startDateStr === endDateStr) {
                    // This is a single day
                    dateRangeStrings.push(dateRange);
                } else {
                    // This is a week range
                    
                    const startOfRange = new Date(startDateStr);
                    const endOfRange = new Date(endDateStr);
                    
                    // Loop through each day in the range
                    for (let day = new Date(startOfRange); day <= endOfRange; day.setDate(day.getDate() + 1)) {
                        const dayString = day.toLocaleDateString();
                        dateRangeStrings.push(dayString);
                    }
                }
                dateRangeStrings.forEach((date) => {
                    const pointTotal = pointTotalsPerDay[date] || 0;
                    dateRangeDailyPointValues.push(pointTotal);
                });
                const dateRangeAverage = dateRangeDailyPointValues.reduce((sum, value) => sum + value, 0) / dateRangeDailyPointValues.length;
                const dateRangeAverageRounded = Math.round(dateRangeAverage * 10) / 10;
                dateRangePointTotals[dateRange] += dateRangeAverageRounded;
            });
        } else if (goal.countFrequency === 'week') {
            const summedlogValueByWeek = {} as {[key:string]:number};
            // for each week, calculate the total value of logs
            Object.keys(dateRangePointTotals).forEach(weekRange => {
                const [startOfWeek, endOfWeek] = weekRange.split(' - ').map(date => new Date(date));
                // filter down to relevant logs
                const logsForWeek = (goal.logs as Log[])?.filter(log => {
                    const logDate = new Date(log.date);
                    return logDate >= startOfWeek && logDate <= endOfWeek;
                }) || [];
                // sum weekly log values
                const summedLogValues = logsForWeek.reduce((sum, log) => sum + log.value, 0);
                // instantiate weekRange key if not defined
                if(!summedlogValueByWeek[weekRange]){
                    summedlogValueByWeek[weekRange] = 0;
                }
                // assign points based on log values
                if (summedLogValues >= goal.reachValue) {
                    summedlogValueByWeek[weekRange] += 10;
                } else if (summedLogValues >= goal.baseValue) {
                    summedlogValueByWeek[weekRange] += goal.basePoints;
                }
            });
            Object.keys(summedlogValueByWeek).forEach((date) => {
                const logValue = summedlogValueByWeek[date];
                if (logValue >= goal.reachValue) {
                    dateRangePointTotals[date] += 10;
                } else if (logValue >= goal.baseValue) {
                    dateRangePointTotals[date] += goal.basePoints;
                }
            });
        }
    });
}

export default function SessionProgressChart({goals,startDate,endDate}:SessionProgressChartProps): JSX.Element{
    // determine data point groupings based on session length
    // Generate the full date range from startDate to endDate
    const dateRange = [] as string[];
    const totalDuration = endDate.getTime() - startDate.getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;

    if (totalDuration <= 31 * oneDay) {
        // Populate dateRange by day
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            dateRange.push(new Date(d).toLocaleDateString());
        }
    } else {
        // Populate dateRange by week
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
            const startOfWeek = new Date(d);
            const endOfWeek = new Date(d);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            if (endOfWeek > endDate) endOfWeek.setTime(endDate.getTime());
            dateRange.push(`${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`);
        }
    }
    // calculate points for each dateRange entry
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
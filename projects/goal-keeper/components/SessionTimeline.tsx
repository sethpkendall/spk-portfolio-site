import React, { useEffect, useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

type SessionTimelineProps = {
    startDate: Date;
    endDate: Date;
};

export default function SessionTimeline({ startDate, endDate }: SessionTimelineProps): JSX.Element {
    const [progress, setProgress] = useState(0);
    const [showDate, setShowDate] = useState(false);

    useEffect(() => {
        const calculatedProgress = calculateProgress(startDate, endDate);
        setProgress(calculatedProgress);
        if (calculatedProgress > 10) { // Show date if progress bar is more than 10% wide
            setShowDate(true);
        }
    }, [startDate, endDate]);

    const calculateProgress = (startDate: Date, endDate: Date): number => {
        const now = new Date();
        if (now < startDate) return 0;
        if (now > endDate) return 100;
        const totalDuration = endDate.getTime() - startDate.getTime();
        const elapsedDuration = now.getTime() - startDate.getTime();
        return (elapsedDuration / totalDuration) * 100;
    };

    // Generate the full date range from startDate to endDate
    const dateRange = [];
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

    return (
        <div className="m-4 p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Timeline</h2>
            <div className="flex justify-between mb-2 text-gray-600">
                <span>{startDate.toLocaleDateString()}</span>
                <span>{endDate.toLocaleDateString()}</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full overflow-hidden h-6 relative">
                <div
                    id="timeline-progress"
                    className="bg-blue-500 h-6 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${progress}%` }}
                >
                    {showDate && (
                        <span className="absolute right-0 pr-2 text-white text-sm opacity-0 transition-opacity duration-1000 ease-out" style={{ opacity: progress > 10 ? 1 : 0 }}>
                            {new Date().toLocaleDateString()}
                        </span>
                    )}
                </div>
                <div className="absolute top-0 left-0 w-full h-6 flex">
                    {dateRange.map((date, index) => {
                        const segmentWidth = totalDuration <= 31 * oneDay ? (oneDay / totalDuration) * 100 : (oneWeek / totalDuration) * 100;
                        return (
                            <TooltipProvider key={date}>
                                <Tooltip>
                                    <TooltipTrigger style={{ width: `${segmentWidth}%` }}>
                                        <div className="h-6 bg-transparent hover:bg-gray-400 border-r border-gray-500 transition-all duration-300"></div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <span className="text-sm text-gray-700">{date}</span>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
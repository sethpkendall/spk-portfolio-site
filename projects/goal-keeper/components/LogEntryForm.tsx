import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { gkDB } from '@/models/db';
import { Log } from '@/models/interfaces';


type LogEntryFormProps = {
    goalType: "stepUp" | "stepDown" | "countUp" | "countDown" | "";
    goalId: number | undefined;
    goalUnit: string;
    logs?: Log[];
    addedLogs?: number[];
    setAddedLogs?: (logIds: number[]) => void;
};

export default function LogEntryForm({goalType, goalId, goalUnit, logs, addedLogs, setAddedLogs}:LogEntryFormProps): JSX.Element{
    const [countUpInputState, setCountUpInputState] = useState<number>(0);
    const [logIdsState, setLogIdsState] = useState<number[]>([]);

    useEffect(() => {
        if (logs && logs.length > 0) {
            const logIds = logs.map(log => log.id || 0);
            setLogIdsState(logIds);
        }
    }, [logs]);

    const handleSubmit = async () => {
        if (goalType === "countUp") {
            const logEntry = {
                date: new Date(),
                value: countUpInputState,
            };
            const logId = await gkDB.logs.add(logEntry);
            if (setAddedLogs && addedLogs) {
                setAddedLogs([...addedLogs, logId]);
            }
            if (goalId) {
                gkDB.goals.update(goalId, {
                    logs: [...(logIdsState || []), logId],
                });
            }
            if(countUpInputState){
                setCountUpInputState(0);
            }
        } else if (goalType === "stepUp") {
            const logEntry = {
                date: new Date(),
                value: 1,
            };
            const logId = await gkDB.logs.add(logEntry);
            if (setAddedLogs && addedLogs) {
                setAddedLogs([...addedLogs, logId]);
            }
            if (goalId) {
                gkDB.goals.update(goalId, {
                    logs: [...(logIdsState || []), logId],
                });
            }
        }
    };
            
    return (
        <div className="logEntryParent flex space-x-2">
            {goalType === "stepUp" && (
                <div className="logEntryContent m-4 p-4 w-full">
                    <div className="logEntryForm">
                        <button onClick={()=>handleSubmit()} type="button" className="w-full text-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500">Log progress</button>
                    </div>
                </div>
            )}
            {goalType === "countUp" && (
                <div className="logEntryContent mt-4 w-full">
                    <div className="logEntryForm flex flex-row items-center gap-2">
                        <Input
                            type="number"
                            className="flex-1"
                            value={countUpInputState}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value)) {
                                    setCountUpInputState(value);
                                }
                            }}
                        />
                        { countUpInputState > 0 && (
                            <button 
                                onClick={()=>handleSubmit()} 
                                type="button" 
                                className="whitespace-nowrap rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 hover:cursor-pointer"
                            >
                                {`Log ${goalUnit}`}
                            </button>
                        )}

                        { countUpInputState === 0 && (
                            <button
                                type="button" 
                                className="whitespace-nowrap rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-white shadow-sm text-gray-100 hover:cursor-default"
                            >
                                {`Log ${goalUnit}`}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
import React from 'react';
import { Session, Goal } from '@/models/interfaces';
import SessionProgressChart from './SessionProgressChart';

type SessionDetailsProps = {
    session: Session;
};

export default function SessionDetails({session}:SessionDetailsProps): JSX.Element{
    return (
        <div className="sessionDetailsParent m-4 flex flex-col md:flex-row">
           <div className="sessionDetailsContent mr-4 p-4 bg-white shadow-md rounded-lg">
                <h2 className="text-lg font-bold">{session.title}</h2>
                <div className="sessionRewardDetailsParent">
                    <div className="sessionRewardDetailsRow flex justify-between">
                        <p>{session.baseReward}</p>
                        <p>{session.baseRewardValue}</p>
                    </div>
                    <div className="sessionRewardDetailsRow flex justify-between">
                        <p>{session.reachReward}</p>
                        <p>{session.reachRewardValue}</p>
                    </div>
                </div>
           </div>
           <div className="sessionDetailsGraph mt-4 md:mt-0 md:ml-4 p-4 bg-white shadow-md rounded-lg flex-1">
                <h2 className="text-lg font-bold">Overall session progress</h2>
                <SessionProgressChart
                    goals={session.goals as Goal[]}
                    startDate={session.startDate}
                    endDate={session.endDate}
                />
           </div>
        </div>
    );
};
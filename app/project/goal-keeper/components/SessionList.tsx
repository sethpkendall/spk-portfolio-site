import React, { useEffect, useState } from 'react';
import { useLiveQuery } from "dexie-react-hooks";
import { gkDB } from '@/models/db';
import { Session } from '@/models/interfaces';
import SessionDetail from './SessionDetail';

const SessionList: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    useLiveQuery(async () => {
        // store all meals in state
        const allMeals = await gkDB.sessions.toArray();
        setSessions(allMeals);
    });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sessions</h2>
      {sessions.map(session => (
        <SessionDetail key={session.id} session={session} />
      ))}
    </div>
  );
};

export default SessionList;
import React, { useEffect, useState } from 'react';
import { useLiveQuery } from "dexie-react-hooks";
import { gkDB } from '@/models/db';
import { Session, Goal, Log } from '@/models/interfaces';
import SessionDetail from './SessionDetail';

const SessionList: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useLiveQuery(async () => {
    // Fetch all sessions
    const allSessions = await gkDB.sessions.toArray();

    // Fetch goals and logs for each session
    const sessionsWithDetails = await Promise.all(allSessions.map(async (session) => {
      const goals = await gkDB.goals.where('id').anyOf(session.goals || []).toArray();
      const goalsWithLogs = await Promise.all(goals.map(async (goal) => {
        const logs = await gkDB.logs.where('id').anyOf(goal.logs || []).toArray();
        return { ...goal, logs };
      }));
      return { ...session, goals: goalsWithLogs };
    }));

    setSessions(sessionsWithDetails);
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
"use client"
import { useEffect,useState } from 'react';
import { createPortal } from 'react-dom';
// data fetching
import { useLiveQuery } from "dexie-react-hooks";
import { gkDB } from '@/models/db';
//components
import SessionPicker from './components/SessionPicker';
import SessionViewer from './components/SessionViewer';
import AddGoalModal from "./components/AddGoalModal";
import AddSessionModal from "./components/AddSessionModal";
//types
import { Session as GoalKeeperSession } from '@/models/interfaces';

export default function GoalKeeper() {
  const [sessions, setSessions] = useState<GoalKeeperSession[]>([]);
  const [addedGoals, setAddedGoals] = useState<number[]>([]);
  const [addedLogs, setAddedLogs] = useState<number[]>([]);
  const [selectedSession, setSelectedSession] = useState<GoalKeeperSession | null>(null);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  
  useLiveQuery(async () => {
    // Fetch all sessions
    const allSessions = await gkDB.sessions.toArray();
  
    // Fetch goals and logs for each session
    const sessionsWithDetails = await Promise.all(allSessions.map(async (session) => {
      const goals = await gkDB.goals.where('id').anyOf(session.goals as number[] || []).toArray();
      const goalsWithLogs = await Promise.all(goals.map(async (goal) => {
        const logs = await gkDB.logs.where('id').anyOf(goal.logs as number[] || []).toArray();
        return { ...goal, logs };
      }));
      return { ...session, goals: goalsWithLogs };
    }));
  
    setSessions(sessionsWithDetails);
  },[addedGoals,addedLogs]);

  useEffect(() => {
    // if sessions has been updated and a selectedSession exists, update the selectedSession
    if (selectedSession) {
      const updatedSession = sessions.find(session => session.id === selectedSession.id);
      if (updatedSession) {
        setSelectedSession(updatedSession);
      }
    }
  }, [sessions]);
  
  return ( 
    <div className="goalKeeperParent container mx-auto px-5">
      <SessionPicker
        sessions={sessions}
        selectedSession={selectedSession}
        setSelectedSession={setSelectedSession}
        toggleAddSessionModal={() => setShowAddSessionModal(!showAddSessionModal)}
      />
      {selectedSession && (
        <SessionViewer session={selectedSession} setShowAddGoalModal={setShowAddGoalModal} addedLogs={addedLogs} setAddedLogs={setAddedLogs}/>
      )}
      {showAddGoalModal && createPortal(
        <AddGoalModal
          setShowModal={setShowAddGoalModal}
          selectedSession={selectedSession}
          addedGoals={addedGoals}
          setAddedGoals={setAddedGoals}
        />,
        document.body
      )}
      {showAddSessionModal && createPortal(
        <AddSessionModal
          setShowModal={setShowAddSessionModal}
          sessions={sessions}
          setSelectedSession={setSelectedSession}
        />,
        document.body
      )}
    </div>
  );
  }
  
import React, {useEffect, useState} from 'react';
import { Goal,Log,Session } from '@/models/interfaces';
import GoalCard from './GoalCard';
import SessionTimeline from './SessionTimeline';
import SessionDetails from './SessionDetails';
import GoalPicker from './GoalPicker';

type SessionViewerProps = {
  session: Session;
  setShowAddGoalModal: (show: boolean) => void;
  addedLogs?: number[];
  setAddedLogs?: (logIds: number[]) => void;
};

const SessionViewer: React.FC<SessionViewerProps> = ({ session, setShowAddGoalModal, addedLogs, setAddedLogs }) => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedGoalLogs, setSelectedGoalLogs] = useState<Log[]>([]);
  useEffect(() => {
    if (selectedGoal) {
      const logs = (selectedGoal?.logs as Log[]) || [];
      setSelectedGoalLogs(logs);
    }
  }, [addedLogs]);

  return (
    <div className="mb-4">
      <SessionTimeline 
        startDate={session.startDate}
        endDate={session.endDate}
      /> 
      <GoalPicker 
        goals={session.goals}
        selectedGoal={selectedGoal}
        setSelectedGoal={setSelectedGoal}
        setShowAddGoalModal={setShowAddGoalModal}
      />
      {(session.goals && selectedGoal) && (
        <GoalCard 
          key={selectedGoal.id}
          goal={selectedGoal}
          logs={((session?.goals).filter((goal): goal is Goal => typeof goal !== 'number').find((goal) => goal.id === selectedGoal.id)?.logs as Log[]) || []}
          type={selectedGoal.type}
          unit={selectedGoal.unit}
          startDate={session.startDate} 
          endDate={session.endDate}
          addedLogs={addedLogs}
          setAddedLogs={setAddedLogs} 
        />
      )}
      {!selectedGoal && (
        <SessionDetails 
            session={session}
        />
      )}
    </div>
  );
};

export default SessionViewer;
import React from 'react';
import { Session } from '@/models/interfaces';
import GoalCard from './GoalCard';

const SessionDetail: React.FC<{ session: Session }> = ({ session }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold">{session.title}</h3>
      <p>Start Date: {session.startDate.toString()}</p>
      <p>End Date: {session.endDate.toString()}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {session.goals?.map(goal => (
          <GoalCard key={goal.id} {...goal} />
        ))}
      </div>
    </div>
  );
};

export default SessionDetail;
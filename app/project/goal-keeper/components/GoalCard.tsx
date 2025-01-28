import React from 'react';
import { Goal } from '@/models/interfaces';

const GoalCard: React.FC<Goal> = ({ title, type, baseValue, reachValue }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <h2 className="text-lg font-bold">{title}</h2>
      <p>Type: {type}</p>
      <p>Base Value: {baseValue}</p>
      <p>Reach Value: {reachValue}</p>
    </div>
  );
};

export default GoalCard;
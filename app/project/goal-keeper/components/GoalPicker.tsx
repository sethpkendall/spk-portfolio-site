import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Goal } from '@/models/interfaces';
import { Plus, X } from 'lucide-react';

type GoalPickerProps = {
    goals: Goal[] | number[] | undefined;
    selectedGoal: Goal | null;
    setSelectedGoal: (goal: Goal | null) => void;
    setShowAddGoalModal: (show: boolean) => void;
};

export default function GoalPicker({goals, selectedGoal, setSelectedGoal, setShowAddGoalModal}:GoalPickerProps): JSX.Element{

    const handleValueChange = (goal: Goal) => {
        setSelectedGoal(goal);
    };

    const handleClearSelection = () => {
        setSelectedGoal(null);
    };

    const handleAddGoalClick = () => {
        setShowAddGoalModal(true);
    };

    return (
        <div id="goalPickerParent" className="m-4 flex space-x-2">
            {goals.map(goal => (
                <Badge
                    key={goal.id}
                    variant={selectedGoal?.id === goal.id ? 'default' : 'outline'}
                    onClick={() => handleValueChange(goal)}
                    className={`cursor-pointer transition-transform duration-300 ${
                        selectedGoal?.id === goal.id ? 'scale-110 shadow-lg' : 'scale-100'
                    }`}
                >
                    {goal.title}
                </Badge>
            ))}
            {selectedGoal && (
                <Badge
                    variant="default"
                    onClick={handleClearSelection}
                    className="cursor-pointer flex items-center space-x-1"
                >
                    <X className="h-4 w-4" />
                </Badge>
            )}
            <Badge
                variant="default"
                onClick={handleAddGoalClick}
                className="cursor-pointer flex items-center space-x-1"
            >
                <Plus className="h-4 w-4" />
            </Badge>
        </div>
    );
};
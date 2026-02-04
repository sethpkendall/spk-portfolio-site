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
        <div
            id="goalPickerParent"
            className="m-4 flex flex-wrap space-x-2 space-y-0 sm:space-x-2 sm:space-y-0 gap-y-2 sm:gap-y-0"
        >
            {Array.isArray(goals) && goals.map(goal => {
                // Support both Goal[] and number[] for goals prop
                if (typeof goal === "number") {
                    // If goal is a number, skip rendering (or handle as needed)
                    return null;
                }
                return (
                    <Badge
                        key={goal.id}
                        variant={selectedGoal?.id === goal.id ? 'default' : 'outline'}
                        onClick={() => handleValueChange(goal)}
                        className={`cursor-pointer transition-transform duration-300 ${
                            selectedGoal?.id === goal.id ? 'scale-110 shadow-lg' : 'scale-100'
                        } px-2 py-1 text-sm sm:px-3 sm:py-2 sm:text-base`}
                    >
                        {goal.title}
                    </Badge>
                );
            })}
            {selectedGoal && (
                <Badge
                    variant="default"
                    onClick={handleClearSelection}
                    className="cursor-pointer flex items-center space-x-1 px-2 py-1 text-sm sm:px-3 sm:py-2 sm:text-base"
                >
                    <X className="h-4 w-4" />
                </Badge>
            )}
            <Badge
                variant="default"
                onClick={handleAddGoalClick}
                className="cursor-pointer flex items-center space-x-1 px-2 py-1 text-sm sm:px-3 sm:py-2 sm:text-base"
            >
                <Plus className="h-4 w-4" />
            </Badge>
        </div>
    );
};
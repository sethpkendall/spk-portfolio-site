import React, {useEffect, useState} from 'react';
import StepUpIcon from './../media/StepUpIcon';
import StepDownIcon from './../media/StepDownIcon';
import CountUpIcon from './../media/CountUpIcon';
import CountDownIcon from './../media/CountDownIcon';
// components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
// database
import { gkDB } from '@/models/db';
import { Session as GoalKeeperSession, Goal } from '@/models/interfaces';

type AddGoalModalProps = {
    setShowModal: (showModal:boolean) => void;
    selectedSession: GoalKeeperSession | null;
    addedGoals: number[];
    setAddedGoals: (addedGoals:number[]) => void;
    goalToEdit?: Goal;
    isEditMode?: boolean; 
};

export default function AddGoalModal({setShowModal, selectedSession, addedGoals, setAddedGoals, goalToEdit, isEditMode}: AddGoalModalProps): JSX.Element {
    const [formState, setFormState] = useState({
        title: goalToEdit?.title || '',
        type: (goalToEdit?.type as "stepUp" | "stepDown" | "countUp" | "countDown" | "") || '',
        unit: (goalToEdit?.unit as "hours"  | "minutes" | "miles" | "kilometers" | "ounces" | "pounds" | "kilograms" | "calories" | "times" | "workouts" | "") || '',
        basePoints: goalToEdit?.basePoints ?? 5,
        baseValue: goalToEdit?.baseValue ?? 0,
        reachValue: goalToEdit?.reachValue ?? 0,
        countFrequency: (goalToEdit?.countFrequency as "day" | "week" | "") || '',
    });
    const [goalTypeLabelState, setGoalTypeLabelState] = useState<string>(goalToEdit ? (goalToEdit.type === 'countUp' ? 'Sum Up' : goalToEdit.type === 'stepUp' ? 'Count Up' : goalToEdit.type === 'countDown' ? 'Deduct Values' : goalToEdit.type === 'stepDown' ? 'Count Down' : 'Select Goal Type') : 'Select Goal Type');
    const [goalTypeDescriptionState, setGoalTypeDescriptionState] = useState<string>(goalToEdit ? (goalToEdit.type === 'countUp' ? 'Record progress by summing logged amounts' : goalToEdit.type === 'stepUp' ? 'Record progress by counting up to a target' : goalToEdit.type === 'countDown' ? 'Track usage by subtracting logged amounts' : goalToEdit.type === 'stepDown' ? 'Track progress by counting down.' : 'There are 2 types of goals to track.') : 'There are 2 types of goals to track.');
    const [feedbackMsgState, setFeedbackMsgState] = useState<string | null>(null);
    const [formInputErrorState, setFormInputErrorState] = useState<string[]>([]);

    useEffect(() => {
        if (goalToEdit) {
            setFormState({
                title: goalToEdit.title || '',
                type: (goalToEdit.type as "stepUp" | "stepDown" | "countUp" | "countDown" | "") || '',
                unit: (goalToEdit.unit as "hours"  | "minutes" | "miles" | "kilometers" | "ounces" | "pounds" | "kilograms" | "calories" | "times" | "workouts" | "") || '',
                basePoints: goalToEdit.basePoints ?? 5,
                baseValue: goalToEdit.baseValue ?? 0,
                reachValue: goalToEdit.reachValue ?? 0,
                countFrequency: (goalToEdit.countFrequency as "day" | "week" | "") || '',
            });
        }
    }, [goalToEdit]);

    const handleTypeChange = (value: "stepUp" | "stepDown" | "countUp" | "countDown" | "") => {
        if(formInputErrorState.includes('type')){
            setFormInputErrorState(formInputErrorState.filter(error => error !== 'type'));
        }
        switch(value) {
            case 'stepUp':
            setGoalTypeLabelState('Count Up');
            setGoalTypeDescriptionState('Record progress by counting up to a target');
            break;
            case 'stepDown':
            setGoalTypeLabelState('Count Down');
            setGoalTypeDescriptionState('Track progress by counting down.');
            break;
            case 'countUp':
            setGoalTypeLabelState('Sum Up');
            setGoalTypeDescriptionState('Record progress by summing logged amounts');
            break;
            case 'countDown':
            setGoalTypeLabelState('Deduct Values');
            setGoalTypeDescriptionState('Track usage by subtracting logged amounts');
            break;
        }
        setFormState({ ...formState, type: value });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if(formInputErrorState.includes(e.target.name)){
            setFormInputErrorState(formInputErrorState.filter(error => error !== e.target.name));
        }
        const { name, value } = e.target;
        setFormState(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

    const submitGoal = async () => {
        if(!validateAddGoal()) {
            setFeedbackMsgState("Please fill all required fields.");
            setTimeout(()=>setFeedbackMsgState(null),3000);
            return;
        }
        if (isEditMode && goalToEdit && goalToEdit.id != undefined) {
            // Update existing goal
            await gkDB.goals.update(goalToEdit.id, {
                title: formState.title.trim(),
                type: formState.type as "stepUp" | "stepDown" | "countUp" | "countDown" | "",
                unit: formState.unit as "" | "hours" | "minutes" | "miles" | "kilometers" | "ounces" | "pounds" | "kilograms" | "calories" | "times" | "workouts",
                baseLabel: "Base Goal",
                baseValue: Number(formState.baseValue),
                basePoints: Number(formState.basePoints),
                reachLabel: "Reach Goal",
                reachValue: Number(formState.reachValue),
                countFrequency: formState.countFrequency as "day" | "week" | ""
            });
            // Recalculate session reward values if session and goals exist
            if (selectedSession && selectedSession.goals) {
                const diffTime = selectedSession ? Math.abs(selectedSession.endDate.getTime() - selectedSession.startDate.getTime()) : 0;
                const sessionLengthWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
                let baseRewardValue = 0;
                let reachRewardValue = 0;
                // Use updated values for the edited goal
                const updatedGoals = (selectedSession.goals as Goal[]).map((g) => {
                    if (typeof g === 'number') return g;
                    if (g.id === goalToEdit.id) {
                        return {
                            ...g,
                            basePoints: Number(formState.basePoints),
                        };
                    }
                    return g;
                });
                updatedGoals.forEach((g) => {
                    if (typeof g !== 'number') {
                        baseRewardValue += (g.basePoints * sessionLengthWeeks);
                        reachRewardValue += (10 * sessionLengthWeeks);
                    }
                });
                gkDB.sessions.update(selectedSession.id as number, {
                    baseRewardValue,
                    reachRewardValue,
                });
            }
            // Reset modal state to ensure fresh info next time
            setFormState({
                title: '',
                type: '',
                unit: '',
                basePoints: 5,
                baseValue: 0,
                reachValue: 0,
                countFrequency: '',
            });
            setGoalTypeLabelState('Select Goal Type');
            setGoalTypeDescriptionState('There are 2 types of goals to track.');
            setShowModal(false);
            return;
        }
        const goalId = await gkDB.goals.add({
            title: formState.title.trim(),
            type: formState.type as "stepUp" | "stepDown" | "countUp" | "countDown" | "",
            unit: formState.unit as "" | "hours" | "minutes" | "miles" | "kilometers" | "ounces" | "pounds" | "kilograms" | "calories" | "times" | "workouts",
            baseLabel: "Base Goal",
            baseValue: Number(formState.baseValue),
            reachLabel: "Reach Goal",
            reachValue: Number(formState.reachValue),
            countFrequency: formState.countFrequency as "day" | "week" | "",
            basePoints: Number(formState.basePoints),
        });
        let sessionGoals: number[] = [];
        if(selectedSession?.goals){
            sessionGoals = (selectedSession.goals as Goal[]).map((goal: Goal) => goal.id as number);
        }
        // recalculate the baseRewardValue and reachRewardValue with newly added goal
        const diffTime = selectedSession ? Math.abs(selectedSession.endDate.getTime() - selectedSession.startDate.getTime()) : 0;
        // get total session length in weeks
        const sessionLengthWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
        // calculate the baseRewardValue and reachRewardValue based on the number of weeks
        let baseRewardValue = formState.basePoints;
        let reachRewardValue = 10;
        (selectedSession?.goals as Goal[] | undefined)?.forEach((value: Goal) => {
            baseRewardValue += (value.basePoints * sessionLengthWeeks);
            reachRewardValue += (10 * sessionLengthWeeks);
        });
        gkDB.sessions.update(selectedSession?.id as number, {
            goals: [...(sessionGoals || []), goalId],
            baseRewardValue: baseRewardValue,
            reachRewardValue: reachRewardValue
        });
        setAddedGoals([...addedGoals, goalId as number]);
        setShowModal(false);
    };

    const validateAddGoal = () => {
        const errors:string[] = [];
        Object.keys(formState).forEach((key)=>{
            if(!formState[key as keyof typeof formState]){
                errors.push(key);
            }
        });
        setFormInputErrorState(errors);
        if(errors.length > 0){
            return false;
        } else {
            return true;
        }
    };

    return (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50" aria-hidden="true"></div>
            <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
                <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-white px-4 pt-5 sm:p-6 sm:pb-0">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 sm:mx-0 sm:h-10 sm:w-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-goal"><path d="M12 13V2l8 4-8 4"/><path d="M20.561 10.222a9 9 0 1 1-12.55-5.29"/><path d="M8.002 9.997a5 5 0 1 0 8.9 2.02"/></svg>
                                </div>
                                <div className="w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Add Goal for {selectedSession?.title}</h3>
                                    <div className="mt-2">
                                    <form>
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                        type="text"
                                        className={`mb-4 ${formInputErrorState.includes('title') ? 'border-red-500' : ''}`}
                                        name="title"
                                        value={formState.title}
                                        onChange={handleChange}
                                        />
                                        <Label className="align-center" htmlFor="title">{goalTypeLabelState}</Label>
                                        <div className={`goalTypeParent flex flex-row gap-4`}>
                                            <Button
                                                type="button"
                                                className={`flex-1 ${formState.type === 'countUp' ? 'bg-gray-100 text-white' : ''} ${formInputErrorState.includes('type') ? 'border border-red-500' : ''}`}
                                                variant="ghost"
                                                onClick={() => handleTypeChange('countUp')}
                                            >
                                                <CountUpIcon />
                                            </Button>
                                            <Button
                                                type="button"
                                                className={`flex-1 ${formState.type === 'stepUp' ? 'bg-gray-100 text-white' : ''} ${formInputErrorState.includes('type') ? 'border border-red-500' : ''}`}
                                                variant="ghost"
                                                onClick={() => handleTypeChange('stepUp')}
                                            >
                                                <StepUpIcon />
                                            </Button>
                                            {/* <Button
                                                type="button"
                                                className={`flex-1 ${formState.type === 'countDown' ? 'bg-gray-100 text-white' : ''} ${formInputErrorState.includes('type') ? 'border border-red-500' : ''}`}
                                                variant="ghost"
                                                onClick={() => handleTypeChange('countDown')}
                                            >
                                                <CountDownIcon />
                                            </Button>
                                            <Button
                                                type="button"
                                                className={`flex-1 ${formState.type === 'stepDown' ? 'bg-gray-100 text-white' : ''} ${formInputErrorState.includes('type') ? 'border border-red-500' : ''}`}
                                                variant="ghost"
                                                onClick={() => handleTypeChange('stepDown')}
                                            >
                                                <StepDownIcon />
                                            </Button> */}
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4">{goalTypeDescriptionState}</p>
                                        <Label htmlFor='unit'>Unit</Label>
                                        <Select name='unit' onValueChange={(value) => {
                                            if(formInputErrorState.includes('unit')){
                                                setFormInputErrorState(formInputErrorState.filter(error => error !== 'unit'));
                                            }
                                            setFormState({...formState, unit: value as any})
                                        }}>
                                            <SelectTrigger className={`w-full mb-4 ${formInputErrorState.includes('unit') ? 'border-red-500' : ''}`}>
                                                <SelectValue placeholder="Select a unit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="minutes">Minutes</SelectItem>
                                                <SelectItem value="hours">Hours</SelectItem>
                                                <SelectItem value="miles">Miles</SelectItem>
                                                <SelectItem value="kilometers">Kilometers</SelectItem>
                                                <SelectItem value="ounces">Ounces</SelectItem>
                                                <SelectItem value="pounds">Pounds</SelectItem>
                                                <SelectItem value="kilograms">Kilograms</SelectItem>
                                                <SelectItem value="calories">Calories</SelectItem>
                                                <SelectItem value="times">Times</SelectItem>
                                                <SelectItem value="workouts">Workouts</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Label htmlFor="baseValue">Base Goal Value</Label>
                                        <Input
                                            type="number"
                                            name="baseValue"
                                            value={formState.baseValue}
                                            className={`${formInputErrorState.includes('baseValue') ? 'border-red-500' : ''} mb-4`}
                                            onChange={handleChange}
                                        />
                                        <Label htmlFor="reachValue">Reach Goal Value</Label>
                                        <Input
                                            type="number"
                                            name="reachValue"
                                            value={formState.reachValue}
                                            className={`${formInputErrorState.includes('reachValue') ? 'border-red-500' : ''} mb-4`}
                                            onChange={handleChange}
                                        />
                                        <Label htmlFor="basePoints">Base Goal Points</Label>
                                        <div className='basePointSliderParent my-4'>
                                            <p className='currentBasePoints text-center mb-4'>{`${formState.basePoints*10}%`}</p>
                                            <Slider
                                                name="basePoints"
                                                defaultValue={[formState.basePoints]}
                                                onValueChange={(value) => setFormState({...formState, basePoints: value[0]})}
                                                min={1}
                                                max={9}
                                                step={1}
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4">How much credit should the base goal be worth compared to the reach goal?</p>
                                        <Label htmlFor="countFrequency">Count Frequency</Label>
                                        <div className='flex flex-row gap-4 mb-4'>
                                            <Button
                                                type="button"
                                                className={`flex-1 ${formState.countFrequency === 'day' ? 'bg-gray-100' : ''} ${formInputErrorState.includes('countFrequency') ? 'border border-red-500' : ''}`}
                                                variant="ghost"
                                                onClick={() => {
                                                    if(formInputErrorState.includes('countFrequency')){
                                                        setFormInputErrorState(formInputErrorState.filter(error => error !== 'countFrequency'));
                                                    }
                                                    setFormState({ ...formState, countFrequency: 'day' })
                                                }}
                                            >
                                                Day
                                            </Button>
                                            <Button
                                                type="button"
                                                className={`flex-1 ${formState.countFrequency === 'week' ? 'bg-gray-100' : ''} ${formInputErrorState.includes('countFrequency') ? 'border border-red-500' : ''}`}
                                                variant="ghost"
                                                onClick={() => {
                                                    if(formInputErrorState.includes('countFrequency')){
                                                        setFormInputErrorState(formInputErrorState.filter(error => error !== 'countFrequency'));
                                                    }
                                                    setFormState({ ...formState, countFrequency: 'week' })
                                                }}
                                            >
                                                Week
                                            </Button>
                                            {/* <Button
                                                type="button"
                                                className={`flex-1 ${formState.countFrequency === 'month' ? 'bg-gray-100' : ''} ${formInputErrorState.includes('countFrequency') ? 'border border-red-500' : ''}`}
                                                variant="ghost"
                                                onClick={() => {
                                                    if(formInputErrorState.includes('countFrequency')){
                                                        setFormInputErrorState(formInputErrorState.filter(error => error !== 'countFrequency'));
                                                    }
                                                    setFormState({ ...formState, countFrequency: 'month' })
                                                }}
                                            >
                                                Month
                                            </Button> */}
                                        </div>
                                    </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="addGoalFeedback min-h-[44px]">
                            {feedbackMsgState && <p className="text-red-500 font-bold text-sm text-center p-3">{feedbackMsgState}</p>}
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button onClick={()=>submitGoal()} type="button" className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">Submit</button>
                            <button onClick={()=>setShowModal(false)} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
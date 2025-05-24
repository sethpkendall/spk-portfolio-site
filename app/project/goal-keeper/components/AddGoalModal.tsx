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
import { Session as GoalKeeperSession } from '@/models/interfaces';

type AddGoalModalProps = {
    setShowModal: (showModal:boolean) => void;
    selectedSession: GoalKeeperSession | null;
    addedGoals: number[];
    setAddedGoals: (addedGoals:number[]) => void;
};

export default function AddGoalModal({setShowModal, selectedSession, addedGoals, setAddedGoals}:AddGoalModalProps): JSX.Element{
    const [formState, setFormState] = useState({
            title: '',
            type: '' as "stepUp" | "stepDown" | "countUp" | "countDown" | "",
            unit: '' as "hours"  | "minutes" | "miles" | "kilometers" | "ounces" | "pounds" | "kilograms" | "calories" | "times" | "workouts" | "",
            baseLabel: '',
            basePoints: 5,
            baseValue: 0,
            reachLabel: '',
            reachValue: 0,
            countFrequency: '' as "day" | "week" | ""
        });
    const [goalTypeLabelState, setGoalTypeLabelState] = useState<string>('Select Goal Type');
    const [goalTypeDescriptionState, setGoalTypeDescriptionState] = useState<string>('There are 2 types of goals to track.');
    const [feedbackMsgState, setFeedbackMsgState] = useState<string | null>(null);
    const [formInputErrorState, setFormInputErrorState] = useState<string[]>([]);

    useEffect(() => {}, [formState]);

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
        if(!valildateAddGoal()) {
            setFeedbackMsgState("Please fill all required fields.");
            setTimeout(()=>setFeedbackMsgState(null),3000);
            return;
        }
        const goalId = await gkDB.goals.add({
            title: formState.title.trim(),
            type: formState.type,
            unit: formState.unit,
            baseLabel: formState.baseLabel,
            baseValue: Number(formState.baseValue),
            reachLabel: formState.reachLabel,
            reachValue: Number(formState.reachValue),
            countFrequency: formState.countFrequency,
            basePoints: formState.basePoints,
        });
        let sessionGoals: number[] = [];
        if(selectedSession?.goals){
            sessionGoals = selectedSession.goals.map(goal=>goal.id);
        }
        gkDB.sessions.update(selectedSession?.id as number, {
            goals: [...(sessionGoals || []), goalId]
        });
        setAddedGoals([...addedGoals, goalId]);
        setShowModal(false);
    };

    const valildateAddGoal = () => {
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
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
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
                                            <SelectTrigger className={`w-full ${formInputErrorState.includes('unit') ? 'border-red-500' : ''}`}>
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
                                        <div className='goalValuesParent flex flex-col gap-2 mb-4'>
                                            <div className="baseRow flex flex-row items-center gap-4">
                                                <div className="labelSection flex-grow">
                                                    <Label htmlFor="baseLabel">Base Goal</Label>
                                                    <Input
                                                        type="text"
                                                        name="baseLabel"
                                                        value={formState.baseLabel}
                                                        className={`${formInputErrorState.includes('baseLabel') ? 'border-red-500' : ''}`}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="valueSection w-1/4">
                                                    <Label htmlFor="baseValue">Value</Label>
                                                    <Input
                                                        type="number"
                                                        name="baseValue"
                                                        value={formState.baseValue}
                                                        className={`${formInputErrorState.includes('baseValue') ? 'border-red-500' : ''}`}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="reachRow flex flex-row items-center gap-4">
                                                <div className="labelSection flex-grow">
                                                    <Label htmlFor="reachLabel">Reach Goal</Label>
                                                    <Input
                                                        type="text"
                                                        name="reachLabel"
                                                        value={formState.reachLabel}
                                                        className={`${formInputErrorState.includes('reachLabel') ? 'border-red-500' : ''}`}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="valueSection w-1/4">
                                                    <Label htmlFor="reachValue">Value</Label>
                                                    <Input
                                                        className=''
                                                        type="number"
                                                        name="reachValue"
                                                        value={formState.reachValue}
                                                        className={`${formInputErrorState.includes('reachValue') ? 'border-red-500' : ''}`}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
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
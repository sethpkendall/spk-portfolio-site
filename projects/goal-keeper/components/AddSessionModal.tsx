import React, {useEffect, useState} from 'react';
// components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/datepicker';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
//   } from "@/components/ui/select"
//types
// database
import { gkDB } from '@/models/db';
import { Session as GoalKeeperSession } from '@/models/interfaces';

type AddSessionModalProps = {
    setShowModal: (showModal:boolean) => void;
    sessions: GoalKeeperSession[];
    setSelectedSession: (session: GoalKeeperSession | null) => void;
};

export default function AddSessionModal({setShowModal, sessions, setSelectedSession}:AddSessionModalProps): JSX.Element{
    const [formState, setFormState] = useState({
        title:'' as string,
        startDate:new Date() as Date,
        endDate:new Date() as Date,
        baseReward:'' as string,
        reachReward:'' as string,
    });
    const [feedbackMsgState, setFeedbackMsgState] = useState<string | null>(null);
    const [formInputErrorState, setFormInputErrorState] = useState<string[]>([]);
    const [startDate, setStartDate] = React.useState<Date>(new Date());
    const [sessionLength, setSessionLength] = useState<number>(1);
    const [addedSessionId, setAddedSessionId] = useState<number | null>(null);

    // close window and set active if new session has been created
    useEffect(() => {
        if(addedSessionId){
            const selected = sessions.find(session => session.id !== undefined && session.id === addedSessionId);
            setSelectedSession(selected || null)
            setShowModal(false);
        }
    }, [sessions]);

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

    const submitSession = async () => {
        if(!validateAddSession()) {
            setFeedbackMsgState("Please fill all required fields.");
            setTimeout(()=>setFeedbackMsgState(null),3000);
            return;
        }
        const sessionEndDate = new Date(startDate);
        sessionEndDate.setDate(sessionEndDate.getDate() + (sessionLength * 7));
        const sessionId = await gkDB.sessions.add({
            title: formState.title.trim(),
            startDate: startDate || new Date(),
            endDate: sessionEndDate,
            baseReward: formState.baseReward,
            reachReward: formState.reachReward,
            baseRewardValue: 0,
            reachRewardValue: 0,
        });
        setAddedSessionId(sessionId);
    };

    const validateAddSession = () => {
        const errors:string[] = [];
        Object.keys(formState).forEach((key)=>{
            if(!formState[key as keyof typeof formState]){
                errors.push(key);
            }
        });
        if(!startDate){
            errors.push('startDate');
        }
        if(!sessionLength || sessionLength < 1){
            errors.push('sessionLength');
        }
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
                                    <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Add Session</h3>
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
                                        <Label htmlFor="startDate">Start Date</Label>
                                        <div className='block mb-4'>
                                            <DatePicker
                                            className={`mb-4 w-full ${formInputErrorState.includes('startDate') || formInputErrorState.includes('endDate') ? 'border-red-500' : ''}`}
                                            date={startDate}
                                            setDate={(date: Date | undefined) => date && setStartDate(date)}
                                            disabledDate={new Date()}
                                            />
                                        </div>
                                        <Label htmlFor="sessionLength">Session Length (Weeks)</Label>
                                        <Input
                                            type="number"
                                            className={`mb-4 ${formInputErrorState.includes('sessionLength') ? 'border-red-500' : ''}`}
                                            name="sessionLength"
                                            step="1"
                                            min="1"
                                            onChange={(e) => {
                                                setSessionLength(parseInt(e.target.value));
                                            }}
                                            value={sessionLength}
                                        />
                                        <Label htmlFor="baseReward">Base Reward</Label>
                                        <Input
                                            type="text"
                                            className={`mb-4 ${formInputErrorState.includes('baseReward') ? 'border-red-500' : ''}`}
                                            name="baseReward"
                                            value={formState.baseReward}
                                            onChange={handleChange}
                                        />
                                        <Label htmlFor="reachReward">Reach Reward</Label>
                                        <Input
                                            type="text"
                                            className={`mb-4 ${formInputErrorState.includes('reachReward') ? 'border-red-500' : ''}`}
                                            name="reachReward"
                                            value={formState.reachReward}
                                            onChange={handleChange}
                                        />
                                    </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="addGoalFeedback min-h-[44px]">
                            {feedbackMsgState && <p className="text-red-500 font-bold text-sm text-center p-3">{feedbackMsgState}</p>}
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button onClick={()=>submitSession()} type="button" className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">Submit</button>
                            <button onClick={()=>setShowModal(false)} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
import React, { useState } from 'react';
import { gkDB } from '@/models/db';
import { Session as GoalKeeperSession } from '@/models/interfaces';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

type SessionPickerProps = {
    sessions: GoalKeeperSession[];
    selectedSession: GoalKeeperSession | null;
    setSelectedSession: (session: GoalKeeperSession | null) => void;
    toggleAddSessionModal: () => void;
};

export default function SessionPicker({sessions, selectedSession, setSelectedSession, toggleAddSessionModal}:SessionPickerProps): JSX.Element{
    const handleValueChange = (value: string) => {
        const selected = sessions.find(session => session.id !== undefined && session.id === parseInt(value));
        if (selected) {
            setSelectedSession(selected);
        } else if (value === "0") {
            // Open the modal to add a new session
            toggleAddSessionModal();
        }
    };
    
    return (
        <div className="mb-4 md:m-4 w-full md:w-auto">
            <Select value={selectedSession?.id?.toString()} onValueChange={handleValueChange}>
                <SelectTrigger className="md:w-[260px]">
                    <SelectValue placeholder="Select a Goal Keeper session" />
                </SelectTrigger>
                <SelectContent>
                    {sessions.map((session) => (
                        <SelectItem key={session.id?.toString()} value={session.id?.toString() || ""}>
                            {session.title}
                        </SelectItem>
                    ))}
                    <SelectItem key="0" value="0">
                            + Add New Session
                        </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};
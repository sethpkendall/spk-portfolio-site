import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import {format, localeFormat} from 'light-date';


type WeekPagerProps = {
    shownWeek: Date;
    setShownWeek: (value:Date) => void;
};


export default function WeekPager ({shownWeek,setShownWeek}:WeekPagerProps): JSX.Element{
    const shownWeekEnd = new Date(new Date(shownWeek).setDate(shownWeek.getDate() + 6));
    const priorWeekStart = new Date(new Date(shownWeek).setDate(shownWeek.getDate() - 7));
    const nextWeekStart = new Date(new Date(shownWeek).setDate(shownWeek.getDate() + 7));

    return (
        <div>
            <p>{localeFormat(shownWeek,"{MMMM}")} {format(shownWeek,"{dd}")} - {format(shownWeekEnd, "{dd}")}</p>
            <Button className='slate-600' onClick={()=>setShownWeek(priorWeekStart)}>
                <ChevronLeftCircle/>
            </Button>
            
            <Button className="slate-600" onClick={()=>setShownWeek(nextWeekStart)}>
                <ChevronRightCircle/>
            </Button>
        </div>
    );
};
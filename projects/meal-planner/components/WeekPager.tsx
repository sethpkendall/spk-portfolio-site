import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {format, localeFormat} from 'light-date';


type WeekPagerProps = {
    shownWeek: Date;
    setShownWeek: (value:Date) => void;
};


export default function WeekPager ({shownWeek,setShownWeek}:WeekPagerProps): JSX.Element{
    const shownWeekEnd = new Date(new Date(shownWeek).setDate(shownWeek.getDate() + 6));
    const priorWeekStart = new Date(new Date(shownWeek).setDate(shownWeek.getDate() - 7));
    const nextWeekStart = new Date(new Date(shownWeek).setDate(shownWeek.getDate() + 7));

    const pagerDateRange = () => {
        let dateRangeString = localeFormat(shownWeek,"{MMMM}");
        dateRangeString = dateRangeString.concat(` ${format(shownWeek,"{dd}")} - `);
        if (shownWeek.getMonth() !== shownWeekEnd.getMonth()) {
            dateRangeString = dateRangeString.concat(`${localeFormat(shownWeekEnd,"{MMMM}")} `);
        }
        dateRangeString = dateRangeString.concat(format(shownWeekEnd, "{dd}"));
        return dateRangeString;
    }

    return (
        <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
            <Button variant="outline" size="sm" onClick={()=>setShownWeek(priorWeekStart)} aria-label="Previous week">
                <ChevronLeft className="h-4 w-4"/>
            </Button>
            <div className="text-center">
                <p className="text-xs font-semibold uppercase text-slate-500">Meal plan</p>
                <p className="font-bold text-slate-900">{pagerDateRange()}</p>
            </div>
            <Button variant="outline" size="sm" onClick={()=>setShownWeek(nextWeekStart)} aria-label="Next week">
                <ChevronRight className="h-4 w-4"/>
            </Button>
        </div>
    );
}

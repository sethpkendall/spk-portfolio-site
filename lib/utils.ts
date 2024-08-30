import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWeekDateStrings(startDate:Date){
    let currentDate;
    let currentDateString;
    let weekDateStrings = [];
    for (let i = 0; i < 7; i++) {
      currentDate = new Date(new Date().setDate(startDate.getDate() + i));
      currentDateString = `${currentDate.getMonth()+1}-${currentDate.getDate()}-${currentDate.getFullYear()}`
      weekDateStrings.push(currentDateString);
    }
    return weekDateStrings;
}

// export function getInitialShownWeek() {
//     const intialSunday = new Date(new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).setHours(0,0,0,0))
//     const initialSundayString:string = `${intialSunday.getMonth()+1}-${intialSunday.getDate()}-${intialSunday.getFullYear()}`;
//     return intialSunday;
//   }
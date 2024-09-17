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

export function getWeekdayString(date:Date){
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays[date.getDay()];
}

export function getDayAndDate(date:string){
    const dateArray = date.split('-');
    return `${getWeekdayString(new Date(date))}, ${dateArray[0]}/${dateArray[1]}`;
}
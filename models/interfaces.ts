export interface Meal {
    id?:number;
    title:string;
    date?:Date;
    type:string;
    foods?:Food[];
}

export interface Food {
    id?:number;
    title:string;
}

export interface Recipe {
    mealId:number;
    foodId:number;
}

export interface Session {
    id?:number;
    startDate:Date;
    endDate:Date;
    goals?:Goal[];
    baseReward:string;
    baseRewardValue:number;
    reachReward:string;
    reachRewardValue:number;
}

export interface Goal {
    id?:number;
    label:string;
    type: "stepUp" | "stepDown" | "countUp" | "countDown";
    baseLabel:string;
    baseValue:number;
    reachLabel:string;
    reachValue:number;
    countFrequency:"day" | "week" | "month" | "year";
    Logs?:Log[];
}

export interface Log {
    id?:number;
    value:number;
}
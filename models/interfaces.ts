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
    title:string;
    startDate:Date;
    endDate:Date;
    goals?:Goal[]|number[]|undefined;
    baseReward:string;
    baseRewardValue:number;
    reachReward:string;
    reachRewardValue:number;
}

export interface Goal {
    id?:number;
    title:string;
    type: "stepUp" | "stepDown" | "countUp" | "countDown" | "";
    unit: "hours"  | "minutes" | "miles" | "kilometers" | "ounces" | "pounds" | "kilograms" | "calories" | "times" | "workouts" | "";
    baseLabel:string;
    baseValue:number;
    basePoints:number;
    reachLabel:string;
    reachValue:number;
    countFrequency:"day" | "week" | "";
    logs?:Log[]|number[];
}

export interface Log {
    id?:number;
    date:Date;
    value:number;
}
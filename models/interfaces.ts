export interface Meal {
    id?:number;
    title:string;
    date:Date;
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
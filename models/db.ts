import Dexie, { type Table } from 'dexie';
import { populate } from './populate';
import { Meal, Food, Recipe } from './interfaces';

// interface Day {
//     id?:number;
//     title:string;
//     date:Date;
// }


export class MealPlannerDB extends Dexie {
    // days!: Table<Day, number>
    meals!: Table<Meal, number>
    foods!: Table<Food, number>
    recipes!: Table<Recipe, number>
    constructor() {
        super('MealPlannerDB');
        this.version(3).stores({
            // days: '++id, title, date',
            meals: '++id, title, date',
            foods:'++id, title',
            recipes: 'mealId, foodId'
        });
    }
}

export const db = new MealPlannerDB();

db.on('populate', populate);

export function resetDatabase() {
    return db.transaction('rw', db.meals, db.foods, db.recipes, async () => {
        await Promise.all(db.tables.map(table => table.clear()));
        await populate();
    });
}
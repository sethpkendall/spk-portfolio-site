import Dexie, { type Table } from 'dexie';
// import { populate } from './populate';
import { Meal, Food, Recipe, Session, Goal, Log } from './interfaces';


export class MealPlannerDB extends Dexie {
    meals!: Table<Meal, number>
    foods!: Table<Food, number>
    recipes!: Table<Recipe, number>
    constructor() {
        super('MealPlannerDB');
        this.version(3).stores({
            meals: '++id, title, date',
            foods:'++id, title',
            recipes: 'mealId, foodId'
        });
    }
}

export const mpDB = new MealPlannerDB();

export class GoalKeeperDB extends Dexie {
    sessions!: Table<Session, number>
    goasl!: Table<Goal, number>
    logs!: Table<Log, number>
    constructor() {
        super('GoalKeeperDB');
        this.version(3).stores({
            sessions: '++id, title, date',
            goasl:'++id, title',
            logs: 'mealId, foodId'
        });
    }
}

export const gkDB = new GoalKeeperDB();

// db.on('populate', populate);

export function resetDatabase() {
    return mpDB.transaction('rw', mpDB.meals, mpDB.foods, mpDB.recipes, async () => {
        await Promise.all(mpDB.tables.map(table => table.clear()));
        // await populate();
    });
}
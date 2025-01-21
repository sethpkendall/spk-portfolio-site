import Dexie, { type Table } from 'dexie';
import { gkPopulate, mpPopulate } from './populate';
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
    goals!: Table<Goal, number>
    logs!: Table<Log, number>
    constructor() {
        super('GoalKeeperDB');
        this.version(3).stores({
            sessions: '++id, title, startDate, endDate, goals, baseReward, baseRewardValue, reachReward, reachRewardValue',
            goals: '++id, title, type, baseLabel, baseValue, reachLabel, reachValue, countFrequency, logs',
            logs: '++id, value'
        });
    }
}

export const gkDB = new GoalKeeperDB();

// mpDB.on('populate', mpPopulate);
gkDB.on('populate', gkPopulate);

export function resetDatabase() {
    return mpDB.transaction('rw', mpDB.meals, mpDB.foods, mpDB.recipes, async () => {
        await Promise.all(mpDB.tables.map(table => table.clear()));
        await mpPopulate();
    });
}
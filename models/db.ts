import Dexie, { type Table } from 'dexie';
import { gkPopulate, mpPopulate } from './populate';
import { Meal, Food, Recipe, Session, Goal, Log, Aquarium, Inhabitant, ActivityType, ActivityLog, EquipmentItem } from './interfaces';


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
            goals: '++id, title, type, unit, baseLabel, baseValue, basePoints, reachLabel, reachValue, countFrequency, logs',
            logs: '++id, value'
        });
    }
}

export const gkDB = new GoalKeeperDB();

// ── Aquarium Manager DB ───────────────────────────────────────

export class AquariumManagerDB extends Dexie {
    aquariums!: Table<Aquarium, number>;
    inhabitants!: Table<Inhabitant, number>;
    activityTypes!: Table<ActivityType, number>;
    activityLogs!: Table<ActivityLog, number>;
    equipment!: Table<EquipmentItem, number>;

    constructor() {
        super('AquariumManagerDB');
        this.version(1).stores({
            aquariums: '++id, name',
            inhabitants: '++id, aquariumId, name, species',
            activityTypes: '++id, aquariumId, label',
            activityLogs: '++id, aquariumId, activityTypeId, date',
            equipment: '++id, aquariumId, label, inUse',
        });
    }
}

export const amDB = new AquariumManagerDB();

// mpDB.on('populate', mpPopulate);
// gkDB.on('populate', gkPopulate);
// resetDatabase();    

// export function resetDatabase() {
    // return mpDB.transaction('rw', mpDB.meals, mpDB.foods, mpDB.recipes, async () => {
    //     await Promise.all(mpDB.tables.map(table => table.clear()));
    //     await mpPopulate();
    // });
//     return amDB.transaction('rw', amDB.aquariums, amDB.inhabitants, amDB.activityTypes, amDB.activityLogs, amDB.equipment, async () => {
//         await Promise.all(amDB.tables.map(table => table.clear()));
//         await gkPopulate();
//     });
// }
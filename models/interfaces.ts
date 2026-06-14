export interface Meal {
    id?:number;
    title:string;
    date?:Date;
    type:string;
    instructions?: string;
    ingredients?: MealIngredient[];
}

export interface Food {
    id?:number;
    title:string;
    normalizedTitle?: string;
}

export interface Recipe {
    id?: number;
    mealId:number;
    foodId:number;
    quantity?: number;
    unit?: string;
    sortOrder?: number;
}

export interface MealIngredient {
    recipeId?: number;
    foodId?: number;
    title: string;
    normalizedTitle?: string;
    quantity: number;
    unit: string;
    sortOrder?: number;
}

export interface GroceryListItem {
    id?: number;
    weekStart: string;
    sourceKey?: string;
    foodId?: number;
    title: string;
    normalizedTitle: string;
    quantity?: number;
    unit?: string;
    checked: boolean;
    removed?: boolean;
    isFreeform: boolean;
    createdAt: Date;
    updatedAt: Date;
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

// ── Aquarium Manager ──────────────────────────────────────────

export interface Aquarium {
    id?: number;
    name: string;
    imageUrl: string;          // URL or data-URI for the aquarium photo
}

export interface Inhabitant {
    id?: number;
    aquariumId: number;
    name: string;
    species: string;
    imageUrl: string;
}

export interface ActivityType {
    id?: number;
    aquariumId: number;
    label: string;             // e.g. "Feeding", "Water Change", "Filter Cleaning"
    icon?: string;              // lucide icon name stored as string
    defaultReminderDays?: number; // default reminder period used when quick-logging
}

export interface ActivityLog {
    id?: number;
    aquariumId: number;
    activityTypeId: number;
    date: Date;
    notes: string;
    reminderDays: number;      // 0 = no reminder; days until activity is due again
}

export interface EquipmentItem {
    id?: number;
    aquariumId: number;
    label: string;
    count: number;
    description: string;
    firstUsedDate: Date;
    inUse: boolean;
}

// ── Pomodoro Timer ────────────────────────────────────────────

export interface PomodoroSession {
    id?: number;
    completedAt: Date;
    durationMinutes: number;
    type: 'work' | 'shortBreak' | 'longBreak';
}

export interface PomodoroSettings {
    id?: number;
    workMinutes: number;
    shortBreakMinutes: number;
    longBreakMinutes: number;
    skipCountsAsCompleted?: boolean;
    autoContinue?: boolean;
}

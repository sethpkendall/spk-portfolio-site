"use client"

import * as React from "react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Meal } from "@/models/interfaces"

type MealComboboxProps = {
    commandInputValue: string;
    setCommandInputValue: (commandInputValue:string) => void;
    selectedMeal: Meal | null;
    setSelectedMeal: (selectedMeal:boolean) => void;
    submitMeal: (typedValue:string) => void;
    meals: {label: string, value: Meal}[];
};

export function MealCombobox({ meals, selectedMeal, setSelectedMeal, submitMeal, commandInputValue, setCommandInputValue }: MealComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {selectedMeal ? <>{selectedMeal.label}</> : <>+ Pick a meal</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-white p-0" align="start">
            <Command>
                <CommandInput value={commandInputValue} onValueChange={setCommandInputValue} placeholder="Filter meal..." />
                <CommandList>
                    <CommandEmpty className="flex justify-items-end">
                    <button onClick={()=>submitMeal(commandInputValue)} type="button" className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">Add New Meal</button>
                    </CommandEmpty>
                    <CommandGroup>
                    {meals.map((meal) => (
                        <CommandItem
                        key={meal.value.id}
                        value={meal.value}
                        onSelect={(value) => {
                            setSelectedMeal(meals.find((meal) => meal.label === value) || null);
                            setOpen(false);
                        }}
                        >
                        {meal.label}
                        </CommandItem>
                    ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedMeal ? <>{selectedMeal.label}</> : <>+ Set status</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
            <Command>
                <CommandInput placeholder="Filter meal..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                    {meals.map((meal,test) => (
                        <CommandItem
                        key={meal.value.id}
                        value={meal.value}
                        onSelect={(value) => {
                            console.log(value);
                        }}
                        >
                        {meal.label}
                        </CommandItem>
                    ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

// function MealList({
//   setOpen,
//   setSelectedMeal,
//   meals
// }: {
//   setOpen: (open: boolean) => void
//   setSelectedMeal: (meal: Meal | null) => void
//   meals: {label: string, value: Meal}[]
// }) {
//   return (
    
//   )
// }

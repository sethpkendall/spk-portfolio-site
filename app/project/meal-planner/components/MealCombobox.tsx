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
    addNewText: string;
    commandInputValue: string;
    setCommandInputValue: (commandInputValue:string) => void;
    selectedMeal: {label: string, value: Meal} | null;
    setSelectedMeal: (selectedMeal:{label: string, value: Meal}|null) => void;
    submitMeal: (typedValue:string) => void;
    meals: {label: string, value: Meal}[];
};

export function MealCombobox({ addNewText, meals, selectedMeal, setSelectedMeal, submitMeal, commandInputValue, setCommandInputValue }: MealComboboxProps) {
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
                <CommandInput value={commandInputValue} onValueChange={setCommandInputValue} placeholder="Filter meal or add new..." />
                <CommandList>
                    <CommandEmpty className="flex justify-center items-center p-2">
                    <button onClick={()=>submitMeal(commandInputValue)} type="button" className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">{addNewText}</button>
                    </CommandEmpty>
                    <CommandGroup>
                    {meals.map((meal) => (
                        <CommandItem
                        key={meal.value.id}
                        value={meal.value.title}
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
          {selectedMeal ? <>{selectedMeal.label}</> : <>+ Pick Meal</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
            <Command>
                <CommandInput value={commandInputValue} onValueChange={setCommandInputValue} placeholder="Filter meal or add new..." />
                <CommandList>
                  <CommandEmpty className="flex justify-center items-center p-2">
                  <button onClick={()=>submitMeal(commandInputValue)} type="button" className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">{addNewText}</button>
                  </CommandEmpty>
                    <CommandGroup>
                    {meals.map((meal,test) => (
                        <CommandItem
                        key={meal.value.id}
                        value={meal.value.title}
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
        </div>
      </DrawerContent>
    </Drawer>
  )
}
"use client";

import { useCallback, useEffect, useState } from "react";
import { Meal } from "@/models/interfaces";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { localeFormat } from "light-date";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MealCard from "./MealCard";
import { MEAL_TYPES } from "./mealPlannerData";
import { WeekMealState } from "./types";

type MealCarouselProps = {
  meals: WeekMealState;
  onAdd: (dayString: string, mealType: string) => void;
  onEdit: (meal: Meal) => void;
  weekDateStrings: string[];
};

export default function MealCarousel({
  meals,
  onAdd,
  onEdit,
  weekDateStrings,
}: MealCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentDay, setCurrentDay] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const syncCarouselState = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return;
    setCurrentDay(carouselApi.selectedScrollSnap());
    setCanScrollPrev(carouselApi.canScrollPrev());
    setCanScrollNext(carouselApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!api) return;

    syncCarouselState(api);
    api.on("select", syncCarouselState);
    api.on("reInit", syncCarouselState);

    return () => {
      api.off("select", syncCarouselState);
      api.off("reInit", syncCarouselState);
    };
  }, [api, syncCarouselState]);

  const activeDayString = weekDateStrings[currentDay] ?? weekDateStrings[0];

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => api?.scrollPrev()}
          disabled={!canScrollPrev}
          aria-label="Previous day"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="min-w-0 text-center">
          <p className="text-sm font-bold text-slate-900">
            {localeFormat(new Date(activeDayString), "{EEEE}")}, {localeFormat(new Date(activeDayString), "{MMM}")}{" "}
            {activeDayString.split("-")[1]}
          </p>
          <div className="mt-2 flex justify-center gap-1" aria-label={`Day ${currentDay + 1} of ${weekDateStrings.length}`}>
            {weekDateStrings.map((dayString, index) => (
              <button
                key={dayString}
                type="button"
                className={`h-1.5 rounded-full transition-all ${
                  index === currentDay ? "w-5 bg-blue-500" : "w-1.5 bg-slate-300"
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to day ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => api?.scrollNext()}
          disabled={!canScrollNext}
          aria-label="Next day"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Carousel setApi={setApi} opts={{ align: "start" }} className="w-full">
      <CarouselContent>
        {weekDateStrings.map((dayString) => {
          const currDayMealData = meals[dayString];
          if (!currDayMealData) return null;

          return (
            <CarouselItem key={dayString}>
              <div className="space-y-3">
                {MEAL_TYPES.map((mealType) => (
                  <div key={`${dayString}-${mealType}`}>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{mealType}</p>
                    <MealCard
                      dayString={dayString}
                      meal={currDayMealData[mealType]}
                      mealType={mealType}
                      onAdd={onAdd}
                      onEdit={onEdit}
                    />
                  </div>
                ))}
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      </Carousel>

      <p className="mt-3 text-center text-xs text-slate-500">
        {canScrollNext || canScrollPrev ? "Swipe or use the arrows to view more days" : "Current day"}
      </p>
    </div>
  );
}

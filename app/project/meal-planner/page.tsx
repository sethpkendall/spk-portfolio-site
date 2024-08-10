"use client"
import { useEffect } from 'react';
import Link from "next/link";

export default async function MealPlanner({params}:params) {
  useEffect(() => {
    console.log('test useEffect ran');
  }, []);

  return ( 
    <div className="container mx-auto px-5">
      <h2 className="mb-20 mt-8 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        .
      </h2>
      <div>
        <h1 className="mb-12 text-center text-4xl font-bold leading-tight tracking-tighter md:text-left md:text-5xl md:leading-none lg:text-6xl">
            Meal Planner Tool
        </h1>
      </div>
      <div className="mealPlannerRoot">
      </div>
    </div>
  );
}

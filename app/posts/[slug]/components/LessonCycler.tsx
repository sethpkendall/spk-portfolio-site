"use client";
import {useEffect, useState} from "react";
export default function LessonCycler({ lessons }: { lessons: string[] }) {
    const [currentLesson, setCurrentLesson] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentLesson((currentLesson + 1) % lessons.length);
      }, 5000);
      return () => clearInterval(interval);
    }, [currentLesson]);
    return (
        <div className="mb-24">
            <h2 className="text-4xl font-bold tracking-tighter leading-tight">
            Lessons
            </h2>
            <ul className="mt-8">
            {lessons.map((lesson, i) => (
                <li key={i} className="mb-4">
                <h3 className={`text-2xl font-bold transition-opacity duration-500 ${currentLesson === i ? "opacity-100" : "opacity-40"}`}>{lesson}</h3>
                </li>
            ))}
            </ul>
      </div>
    );
  }
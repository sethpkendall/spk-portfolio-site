"use client"
//hooks
import { useState } from 'react';
//components
import SessionList from './components/SessionList';
//types
import { Session } from '@/models/interfaces';

export default function GoalKeeper() {
    
    return ( 
      <div className="container mx-auto px-5">
        <SessionList />
      </div>
    );
  }
  
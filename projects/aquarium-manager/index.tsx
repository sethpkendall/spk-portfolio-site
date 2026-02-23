"use client"
import { useState, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { amDB } from '@/models/db';
import type { Aquarium, ActivityType } from '@/models/interfaces';
import { seedExampleData, clearExampleData, isExampleDataLoaded } from './exampleData';
// components
import AquariumHeader from './components/AquariumHeader';
import InhabitantList from './components/InhabitantList';
import ActivityDashboard from './components/ActivityDashboard';
import EquipmentInventory from './components/EquipmentInventory';
import SetupWizard from './components/SetupWizard';
import AddInhabitantModal from './components/AddInhabitantModal';
import AddActivityTypeModal from './components/AddActivityTypeModal';
import LogActivityModal from './components/LogActivityModal';
import AddEquipmentModal from './components/AddEquipmentModal';

type Tab = 'activities' | 'equipment';

export default function AquariumManager() {
  const [activeTab, setActiveTab] = useState<Tab>('activities');
  const [showSetup, setShowSetup] = useState(false);
  const [showAddInhabitant, setShowAddInhabitant] = useState(false);
  const [showAddActivityType, setShowAddActivityType] = useState(false);
  const [showLogActivity, setShowLogActivity] = useState(false);
  const [showAddEquipment, setShowAddEquipment] = useState(false);

  const [isExample, setIsExample] = useState(() => isExampleDataLoaded());
  const [seeding, setSeeding] = useState(false);
  const seedingRef = useRef(false);

  const aquariums = useLiveQuery(() => amDB.aquariums.toArray());
  const aquarium = aquariums?.[0] ?? null; // single-aquarium for now

  // Seed example data on very first visit (no aquariums in DB and no flag yet).
  // Also handle the case where localStorage flag is stale (DB was cleared manually).
  useEffect(() => {
    if (aquariums && aquariums.length === 0 && !seedingRef.current) {
      // Clear stale flag if DB was emptied externally
      if (isExampleDataLoaded()) {
        localStorage.removeItem('am-example-data');
        setIsExample(false);
      }
      seedingRef.current = true;
      setSeeding(true);
      seedExampleData()
        .then(() => {
          setIsExample(true);
          setSeeding(false);
          seedingRef.current = false;
        })
        .catch((err) => {
          console.error('Example data seeding failed:', err);
          setSeeding(false);
          seedingRef.current = false;
        });
    }
  }, [aquariums]);

  const handleSetupComplete = async () => {
    if (isExample) {
      await clearExampleData();
      setIsExample(false);
    }
    setShowSetup(false);
  };

  const handleCreateOwn = () => {
    setShowSetup(true);
  };

  const handleQuickLog = async (activityType: ActivityType) => {
    if (!aquarium?.id || !activityType.id) return;
    // Use local midnight so date is consistent with modal-logged entries
    const now = new Date();
    const localMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    await amDB.activityLogs.add({
      aquariumId: aquarium.id,
      activityTypeId: activityType.id,
      date: localMidnight,
      notes: '',
      reminderDays: activityType.defaultReminderDays ?? 0,
    });
  };

  if (aquariums === undefined || seeding) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="aquariumManagerParent relative container mx-auto px-4 pb-10 max-w-4xl" style={{ minHeight: 400 }}>
      {/* ── Setup wizard (first run) ────────────────────── */}
      {showSetup && (
        <SetupWizard onComplete={handleSetupComplete} />
      )}

      {aquarium && (
        <>
          {/* ── Header: title + aquarium image ──────────── */}
          <AquariumHeader
            aquarium={aquarium}
            isExample={isExample}
            onCreateOwn={handleCreateOwn}
          />

          {/* ── Inhabitants ─────────────────────────────── */}
          <InhabitantList
            aquariumId={aquarium.id!}
            onAdd={() => setShowAddInhabitant(true)}
          />

          {/* ── Tab bar ─────────────────────────────────── */}
          <div className="flex gap-2 mt-8 mb-4 border-b border-border">
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'activities'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Activities
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'equipment'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Equipment
            </button>
          </div>

          {/* ── Tab content ─────────────────────────────── */}
          {activeTab === 'activities' && (
            <ActivityDashboard
              aquariumId={aquarium.id!}
              onAddType={() => setShowAddActivityType(true)}
              onLogActivity={() => setShowLogActivity(true)}
              onQuickLog={handleQuickLog}
            />
          )}
          {activeTab === 'equipment' && (
            <EquipmentInventory
              aquariumId={aquarium.id!}
              onAdd={() => setShowAddEquipment(true)}
            />
          )}

          {/* ── Modals ──────────────────────────────────── */}
          {showAddInhabitant && (
            <AddInhabitantModal
              aquariumId={aquarium.id!}
              onClose={() => setShowAddInhabitant(false)}
            />
          )}
          {showAddActivityType && (
            <AddActivityTypeModal
              aquariumId={aquarium.id!}
              onClose={() => setShowAddActivityType(false)}
            />
          )}
          {showLogActivity && (
            <LogActivityModal
              aquariumId={aquarium.id!}
              onClose={() => setShowLogActivity(false)}
            />
          )}
          {showAddEquipment && (
            <AddEquipmentModal
              aquariumId={aquarium.id!}
              onClose={() => setShowAddEquipment(false)}
            />
          )}
        </>
      )}
    </div>
  );
}

"use client"
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { amDB } from '@/models/db';
import { Plus, CalendarPlus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ActivityLog, ActivityType } from '@/models/interfaces';

interface ActivityDashboardProps {
  aquariumId: number;
  onAddType: () => void;
  onLogActivity: () => void;
  onQuickLog: (activityType: ActivityType) => void;
}

/** Return how many days ago a Date was */
function daysAgo(date: Date): number {
  const ms = Date.now() - new Date(date).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

/** True when the activity is overdue based on its reminder period */
function isOverdue(log: ActivityLog): boolean {
  if (!log.reminderDays || log.reminderDays <= 0) return false;
  return daysAgo(log.date) >= log.reminderDays;
}

/** Number of days until the activity is next due (negative = overdue) */
function daysUntilDue(log: ActivityLog): number | null {
  if (!log.reminderDays || log.reminderDays <= 0) return null;
  return log.reminderDays - daysAgo(log.date);
}

const PAGE_SIZE = 10;

export default function ActivityDashboard({ aquariumId, onAddType, onLogActivity, onQuickLog }: ActivityDashboardProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const activityTypes = useLiveQuery(
    () => amDB.activityTypes.where('aquariumId').equals(aquariumId).toArray(),
    [aquariumId]
  );

  const activityLogs = useLiveQuery(
    async () => {
      const logs = await amDB.activityLogs.where('aquariumId').equals(aquariumId).sortBy('date');
      return logs.reverse(); // newest first
    },
    [aquariumId]
  );

  // Build a map of latest log per activity type
  const latestByType = new Map<number, ActivityLog>();
  activityLogs?.forEach((log) => {
    if (!latestByType.has(log.activityTypeId)) {
      latestByType.set(log.activityTypeId, log);
    }
  });

  const typeMap = new Map<number, ActivityType>();
  activityTypes?.forEach((t) => typeMap.set(t.id!, t));

  return (
    <div>
      {/* ── Action buttons ──────────────────────────────── */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <Button size="sm" className="am-3d-btn am-3d-btn--sm am-3d-btn--primary" onClick={onLogActivity}>
          <CalendarPlus className="h-4 w-4 mr-1" /> Log Activity
        </Button>
        <Button size="sm" variant="outline" className="am-3d-btn am-3d-btn--sm" onClick={onAddType}>
          <Plus className="h-4 w-4 mr-1" /> New Activity Type
        </Button>
      </div>

      {/* ── Status cards: one per activity type ─────────── */}
      {activityTypes && activityTypes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {activityTypes.map((type) => {
            const latest = latestByType.get(type.id!);
            const overdue = latest ? isOverdue(latest) : false;
            return (
              <Card
                key={type.id}
                role="button"
                tabIndex={0}
                onClick={() => onQuickLog(type)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onQuickLog(type); }}
                className={`am-3d-btn cursor-pointer select-none border-border
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                  ${
                  overdue
                    ? 'am-3d-btn--overdue bg-destructive border-destructive text-destructive-foreground hover:brightness-110'
                    : 'hover:border-primary/50'
                }`}
              >
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {type.label}
                    {overdue && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-white/60 text-white bg-white/20">
                        <AlertTriangle className="h-3 w-3 mr-0.5" /> Overdue
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className={`px-4 pb-4 pt-0 text-xs ${overdue ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {latest ? (
                    <>
                      Last: {new Date(latest.date).toLocaleDateString()} ({daysAgo(latest.date)}d ago)
                      {(() => {
                        const effectiveReminder = latest.reminderDays > 0
                          ? latest.reminderDays
                          : (type.defaultReminderDays ?? 0);
                        if (effectiveReminder <= 0) return null;
                        const remaining = effectiveReminder - daysAgo(latest.date);
                        return (
                          <span className="ml-1">
                            · {remaining > 0
                              ? `due in ${remaining}d`
                              : remaining === 0
                                ? 'due today'
                                : `overdue by ${Math.abs(remaining)}d`}
                          </span>
                        );
                      })()}
                    </>
                  ) : (
                    'No entries yet'
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Recent activity log ─────────────────────────── */}
      <h3 className="text-sm font-semibold mb-2">Recent Activity</h3>
      {(!activityLogs || activityLogs.length === 0) ? (
        <p className="text-sm text-muted-foreground">No activities logged yet.</p>
      ) : (
        <>
          <div className="space-y-2 pr-1">
            {activityLogs.slice(0, visibleCount).map((log) => {
              const type = typeMap.get(log.activityTypeId);
              return (
                <div
                  key={log.id}
                  className="flex items-start justify-between rounded-md border px-3 py-2 text-sm my-1"
                >
                  <div>
                    <span className="font-medium">{type?.label ?? 'Unknown'}</span>
                    {log.notes && (
                      <p className="text-xs text-muted-foreground mt-0.5">{log.notes}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground ml-2">
                    {new Date(log.date).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
          {visibleCount < activityLogs.length && (
            <div className="flex justify-center mt-3">
              <Button
                size="sm"
                variant="ghost"
                className="am-3d-btn am-3d-btn--ghost"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              >
                Show more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

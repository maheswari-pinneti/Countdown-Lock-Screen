import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/AppContext';
import { notificationService, NotificationLogEntry, ReminderItem } from '../../services/notificationService';
import { soundEngine } from '../../services/soundEngine';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Icon } from '../../components/common/Icon';

export const NotificationsPage: React.FC = () => {
  const { experiences, settings, updateSettings } = useAppStore();
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    notificationService.getPermission()
  );
  const [logs, setLogs] = useState<NotificationLogEntry[]>(notificationService.getLogs());
  const [testSent, setTestSent] = useState(false);

  // Sync logs periodically or when updated
  useEffect(() => {
    setLogs(notificationService.getLogs());
  }, []);

  const handleRequestPermission = async () => {
    soundEngine.playKeyClick();
    const result = await notificationService.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      soundEngine.playSuccessChime();
      notificationService.notify('OFFER MODE Notifications Active', {
        body: 'You will receive timely alerts for your career milestones and deadlines.',
      });
      setLogs(notificationService.getLogs());
    }
  };

  const handleSendTestNotification = () => {
    soundEngine.playSuccessChime();
    notificationService.notify('Target Locked: OFFER MODE Alert', {
      body: 'Your countdown is running. Stay disciplined and hit today’s milestones!',
    });
    setTestSent(true);
    setLogs(notificationService.getLogs());
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleClearLogs = () => {
    soundEngine.playKeyClick();
    notificationService.clearLogs();
    setLogs([]);
  };

  // Build upcoming reminder queue from active experiences
  const upcomingReminders: ReminderItem[] = experiences.flatMap((exp) => {
    const list: ReminderItem[] = [
      {
        id: `exp-${exp.id}`,
        trackId: exp.id,
        trackName: exp.name,
        title: `Target Offer Date: ${exp.targetCompany}`,
        dueDate: exp.targetOfferDate,
        time: exp.deadlineTime || '18:00',
        type: exp.id === 'interview' ? 'interview' : 'milestone',
      },
    ];

    exp.milestones
      .filter((m) => !m.completed)
      .slice(0, 2)
      .forEach((m) => {
        list.push({
          id: `m-${m.id}`,
          trackId: exp.id,
          trackName: exp.name,
          title: m.title,
          dueDate: m.deadline,
          type: 'milestone',
        });
      });

    return list;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Alerts & Reminders
            </span>
            <Badge
              label={permission === 'granted' ? 'ENABLED' : 'NEEDS PERMISSION'}
              variant={permission === 'granted' ? 'cyan' : 'amber'}
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Web Notifications & Scheduled Reminders
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Receive native browser notifications and scheduled deadline reminders as you approach key career targets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={handleSendTestNotification}
            iconLeft="Bell"
          >
            {testSent ? 'Alert Dispatched!' : 'Send Test Notification'}
          </Button>
        </div>
      </div>

      {/* Grid: Permission Card & Browser Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Permission Status Card */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400">
                <Icon name="Bell" className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Browser Permission Status</h3>
                <span className="text-xs text-zinc-400">
                  {permission === 'granted'
                    ? 'Granted — Full browser alerts enabled'
                    : permission === 'denied'
                    ? 'Denied — Please allow notifications in Chrome settings'
                    : permission === 'unsupported'
                    ? 'Unsupported in this environment'
                    : 'Not Requested Yet'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-zinc-800">
            {permission !== 'granted' && (
              <Button
                variant="secondary"
                onClick={handleRequestPermission}
                className="w-full justify-center"
              >
                Request Browser Notification Access
              </Button>
            )}

            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-400 leading-relaxed">
              <strong>Status:</strong> {permission.toUpperCase()}
              <p className="mt-1">
                Chrome displays alerts when tabs are open or in the background. If permission is denied, adjust site permissions via the padlock icon in the URL bar.
              </p>
            </div>
          </div>
        </Card>

        {/* Technical Guidance & Privacy */}
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
              <Icon name="Shield" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Privacy & Local Execution</h3>
              <span className="text-xs text-zinc-400">100% Client-Side Engine</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-zinc-400 leading-relaxed">
            <p>
              • All countdown calculations and reminder triggers execute entirely in your local browser window.
            </p>
            <p>
              • Zero telemetry, zero analytics, zero external network queries. Your goal deadlines and interview notes never leave this device.
            </p>
            <p>
              • Sound chimes synchronize with alerts when enabled in <span className="text-zinc-200 font-semibold">Settings</span>.
            </p>
          </div>
        </Card>
      </div>

      {/* Upcoming Reminders Active Queue */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Icon name="Clock" className="w-4 h-4 text-cyan-400" />
              <span>Upcoming Scheduled Alerts & Deadlines</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Auto-monitored targets across your 5 active career modules
            </p>
          </div>
          <Badge label={`${upcomingReminders.length} Active`} variant="cyan" />
        </div>

        <div className="divide-y divide-zinc-800/80">
          {upcomingReminders.map((item) => (
            <div
              key={item.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {item.trackName} • Due: {item.dueDate} {item.time ? `@ ${item.time}` : ''}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300">
                  {item.type.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* In-App Notification History Log */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Icon name="Activity" className="w-4 h-4 text-emerald-400" />
              <span>Notification Dispatch History</span>
            </h3>
            <p className="text-xs text-zinc-400">Past notifications sent during your sessions</p>
          </div>

          {logs.length > 0 && (
            <button
              onClick={handleClearLogs}
              className="text-xs text-zinc-400 hover:text-rose-400 transition-colors"
            >
              Clear Log
            </button>
          )}
        </div>

        {logs.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            No past notifications yet. Click "Send Test Notification" above to test.
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/80 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-zinc-200">{log.title}</div>
                  {log.body && <div className="text-zinc-400 text-[11px] mt-0.5">{log.body}</div>}
                </div>
                <span className="text-[10px] text-zinc-500 font-mono whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

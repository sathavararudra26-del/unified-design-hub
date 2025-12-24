import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2, Zap, Clock, Target } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import AppLayout from '@/components/layout/AppLayout';

export default function Analytics() {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const { tasks, userProgress } = useAppStore();

  const stats = useMemo(() => {
    const now = new Date();
    const periodDays = period === 'week' ? 7 : 30;
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - periodDays);

    const periodTasks = tasks.filter(t => {
      if (!t.completed_date) return false;
      const completedDate = new Date(t.completed_date);
      return completedDate >= startDate;
    });

    const tasksCompleted = periodTasks.length;
    const xpEarned = periodTasks.reduce((sum, t) => sum + (t.xp || 0), 0);
    const focusMinutes = periodTasks.reduce((sum, t) => sum + (t.duration || 0), 0);
    const completionRate = tasks.length > 0
      ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
      : 0;

    return {
      tasksCompleted,
      xpEarned,
      focusMinutes,
      completionRate,
      avgTasksPerDay: Math.round((tasksCompleted / periodDays) * 10) / 10,
      avgXpPerDay: Math.round(xpEarned / periodDays)
    };
  }, [tasks, period]);

  const categoryBreakdown = useMemo(() => {
    const completed = tasks.filter(t => t.completed);
    const categories = ['Work', 'Personal', 'Health', 'Learning'] as const;
    return categories.map(cat => ({
      name: cat,
      count: completed.filter(t => t.category === cat).length,
      percentage: completed.length > 0
        ? Math.round((completed.filter(t => t.category === cat).length / completed.length) * 100)
        : 0
    }));
  }, [tasks]);

  const difficultyBreakdown = useMemo(() => {
    const completed = tasks.filter(t => t.completed);
    const difficulties = ['Easy', 'Medium', 'Hard', 'Elite'] as const;
    return difficulties.map(diff => ({
      name: diff,
      count: completed.filter(t => t.difficulty === diff).length,
      xp: completed.filter(t => t.difficulty === diff).reduce((sum, t) => sum + (t.xp || 0), 0)
    }));
  }, [tasks]);

  const heatmapData = useMemo(() => {
    const weeks = 12;
    const data: { date: string; count: number; xp: number }[][] = [];
    const now = new Date();

    for (let w = weeks - 1; w >= 0; w--) {
      const weekData: { date: string; count: number; xp: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(now);
        date.setDate(date.getDate() - (w * 7 + (6 - d)));
        const dateStr = date.toISOString().split('T')[0];
        const dayTasks = tasks.filter(t => t.completed_date === dateStr);
        weekData.push({
          date: dateStr,
          count: dayTasks.length,
          xp: dayTasks.reduce((sum, t) => sum + (t.xp || 0), 0)
        });
      }
      data.push(weekData);
    }
    return data;
  }, [tasks]);

  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-muted';
    if (count === 1) return 'bg-success/30';
    if (count <= 3) return 'bg-success/50';
    if (count <= 5) return 'bg-success/70';
    return 'bg-success';
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground mt-1">Review your productivity trends.</p>
          </div>
          <div className="p-2 bg-card border border-border rounded-full shadow-card hidden md:flex">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        <div className="mb-8">
          <div className="inline-flex p-1 bg-muted rounded-lg">
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                period === 'week' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                period === 'month' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              This Month
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border p-4 rounded-2xl shadow-card"
          >
            <div className="p-2 bg-muted rounded-lg w-fit mb-3">
              <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tasks Done</p>
            <h4 className="text-xl font-bold mt-0.5">{stats.tasksCompleted}</h4>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">{stats.avgTasksPerDay}/day avg</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border p-4 rounded-2xl shadow-card"
          >
            <div className="p-2 bg-xp-muted rounded-lg w-fit mb-3">
              <Zap className="w-5 h-5 text-xp" />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">XP Earned</p>
            <h4 className="text-xl font-bold mt-0.5">{stats.xpEarned}</h4>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">{stats.avgXpPerDay}/day avg</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border p-4 rounded-2xl shadow-card"
          >
            <div className="p-2 bg-level-muted rounded-lg w-fit mb-3">
              <Clock className="w-5 h-5 text-level" />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Focus Time</p>
            <h4 className="text-xl font-bold mt-0.5">{formatFocusTime(stats.focusMinutes)}</h4>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">Deep work sessions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border p-4 rounded-2xl shadow-card"
          >
            <div className="p-2 bg-success-muted rounded-lg w-fit mb-3">
              <Target className="w-5 h-5 text-success" />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Completion</p>
            <h4 className="text-xl font-bold mt-0.5">{stats.completionRate}%</h4>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">Task success rate</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border p-6 rounded-2xl shadow-card mb-8"
        >
          <h3 className="font-bold mb-4">Activity Heatmap</h3>
          <div className="overflow-x-auto">
            <div className="flex gap-1 min-w-fit">
              {heatmapData.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      className={`w-4 h-4 rounded-sm ${getCellColor(day.count)} transition-all hover:scale-110 cursor-pointer`}
                      title={`${day.date}: ${day.count} tasks, ${day.xp} XP`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted" />
              <div className="w-3 h-3 rounded-sm bg-success/30" />
              <div className="w-3 h-3 rounded-sm bg-success/50" />
              <div className="w-3 h-3 rounded-sm bg-success/70" />
              <div className="w-3 h-3 rounded-sm bg-success" />
            </div>
            <span>More</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border p-6 rounded-2xl shadow-card"
          >
            <h3 className="font-bold mb-4">By Category</h3>
            <div className="space-y-4">
              {categoryBreakdown.map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{cat.name}</span>
                    <span className="text-xs text-muted-foreground">{cat.count} tasks</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card border border-border p-6 rounded-2xl shadow-card"
          >
            <h3 className="font-bold mb-4">By Difficulty</h3>
            <div className="space-y-4">
              {difficultyBreakdown.map((diff) => (
                <div key={diff.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      diff.name === 'Elite' ? 'bg-elite-muted text-elite' :
                      diff.name === 'Hard' ? 'bg-hard-muted text-hard' :
                      diff.name === 'Medium' ? 'bg-medium-muted text-medium' :
                      'bg-easy-muted text-easy'
                    }`}>
                      {diff.name}
                    </span>
                    <span className="text-sm text-muted-foreground">{diff.count} tasks</span>
                  </div>
                  <div className="flex items-center gap-1 text-xp">
                    <Zap className="w-3.5 h-3.5" />
                    <span className="text-sm font-bold">{diff.xp}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-primary text-primary-foreground p-6 rounded-2xl"
        >
          <h3 className="font-bold mb-4">All-Time Stats</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-primary-foreground/60 text-sm">Total XP</p>
              <p className="text-2xl font-extrabold text-xp">{userProgress.total_xp}</p>
            </div>
            <div>
              <p className="text-primary-foreground/60 text-sm">Tasks Completed</p>
              <p className="text-2xl font-extrabold">{userProgress.total_tasks_completed}</p>
            </div>
            <div>
              <p className="text-primary-foreground/60 text-sm">Focus Time</p>
              <p className="text-2xl font-extrabold">{formatFocusTime(userProgress.total_focus_minutes)}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}

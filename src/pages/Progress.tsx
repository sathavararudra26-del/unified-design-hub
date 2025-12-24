import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Flame, CheckCircle2, Clock, Trophy, Gift, X, Calendar, Target, Award, Shield, Bell } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import AppLayout from '@/components/layout/AppLayout';

const XP_PER_LEVEL = 500;

const ALL_BADGES = [
  { id: 'early-bird', label: 'Early Bird', icon: Zap, description: 'Complete a task before 7 AM' },
  { id: 'focused-session', label: 'Deep Focus', icon: Clock, description: '60+ minutes of focus' },
  { id: 'streak-master', label: 'Consistent', icon: Flame, description: 'Maintain a 7-day streak' },
  { id: 'task-crusher', label: 'Crusher', icon: Target, description: 'Complete 100 total tasks' },
  { id: 'top-performer', label: 'Elite', icon: Trophy, description: 'Reach Level 20' },
  { id: 'reward-seeker', label: 'Achiever', icon: Award, description: 'Redeem 10 rewards' },
  { id: 'night-owl', label: 'Night Owl', icon: Clock, description: 'Focus after 11 PM' },
  { id: 'social-butterfly', label: 'Connector', icon: Bell, description: 'Interact with 5 friends' },
  { id: 'mega-focus', label: 'Zen Master', icon: Zap, description: '4 hours of focus in one day' },
  { id: 'perfect-week', label: 'God Mode', icon: Calendar, description: 'Complete all goals for 7 days' },
  { id: 'budget-king', label: 'Thrifty', icon: Gift, description: 'Save 5000 XP without spending' },
  { id: 'iron-will', label: 'Unstoppable', icon: Shield, description: 'Maintain a 30-day streak' }
];

const MILESTONES = [
  { xp: 100, label: 'First Steps', reward: 'Complete your first task' },
  { xp: 500, label: 'Getting Started', reward: 'Reach Level 2' },
  { xp: 1000, label: 'Momentum', reward: 'Unlock custom rewards' },
  { xp: 2500, label: 'On Fire', reward: 'Reach Level 5' },
  { xp: 5000, label: 'Dedicated', reward: 'Reach Level 10' },
  { xp: 10000, label: 'Legendary', reward: 'Reach Level 20' },
  { xp: 25000, label: 'Master', reward: 'Reach Level 50' },
  { xp: 50000, label: 'Grandmaster', reward: 'Reach Level 100' }
];

export default function Progress() {
  const { userProgress, rewards } = useAppStore();

  const xp = userProgress.total_xp;
  const level = userProgress.current_level;
  const streak = userProgress.current_streak;
  const longestStreak = userProgress.longest_streak;
  const tasksCompleted = userProgress.total_tasks_completed;
  const focusMinutes = userProgress.total_focus_minutes;
  const earnedBadges = userProgress.earned_badges;
  const rewardsRedeemed = rewards.filter(r => r.is_unlocked).length;

  const xpProgress = ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;
  const xpToNextLevel = XP_PER_LEVEL - (xp % XP_PER_LEVEL);

  const badges = useMemo(() => {
    return ALL_BADGES.map(badge => ({
      ...badge,
      unlocked: earnedBadges.includes(badge.id)
    }));
  }, [earnedBadges]);

  const currentMilestone = MILESTONES.find(m => xp < m.xp);
  const milestoneProgress = currentMilestone
    ? (xp / currentMilestone.xp) * 100
    : 100;

  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Progress</h1>
            <p className="text-muted-foreground mt-1">Track your journey to mastery.</p>
          </div>
          <div className="p-2 bg-card border border-border rounded-full shadow-card hidden md:flex">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-primary-foreground p-8 rounded-3xl mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-xp/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative flex items-center justify-between mb-6">
            <div>
              <p className="text-primary-foreground/60 text-sm font-medium">Current Level</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-6xl font-black text-xp">{level}</span>
                <span className="text-primary-foreground/40 font-medium">/ ∞</span>
              </div>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="w-24 h-24 bg-xp rounded-3xl flex items-center justify-center rotate-12 shadow-glow-lg"
            >
              <Trophy className="w-12 h-12 text-xp-foreground" />
            </motion.div>
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-2 text-sm">
              <span className="text-primary-foreground/60">Progress to Level {level + 1}</span>
              <span className="font-bold">{xp % XP_PER_LEVEL} / {XP_PER_LEVEL} XP</span>
            </div>
            <div className="w-full h-4 bg-primary-foreground/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-xp to-xp rounded-full"
              />
            </div>
            <p className="text-primary-foreground/40 text-sm mt-2">{xpToNextLevel} XP to go</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border p-5 rounded-2xl shadow-card"
          >
            <div className="p-2 bg-xp-muted rounded-xl w-fit mb-3">
              <Zap className="w-5 h-5 text-xp" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total XP</p>
            <h4 className="text-2xl font-extrabold mt-1">{xp.toLocaleString()}</h4>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border p-5 rounded-2xl shadow-card"
          >
            <div className="p-2 bg-streak-muted rounded-xl w-fit mb-3">
              <Flame className="w-5 h-5 text-streak" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Current Streak</p>
            <h4 className="text-2xl font-extrabold mt-1">{streak} days</h4>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border p-5 rounded-2xl shadow-card"
          >
            <div className="p-2 bg-success-muted rounded-xl w-fit mb-3">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tasks Done</p>
            <h4 className="text-2xl font-extrabold mt-1">{tasksCompleted}</h4>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border p-5 rounded-2xl shadow-card"
          >
            <div className="p-2 bg-level-muted rounded-xl w-fit mb-3">
              <Clock className="w-5 h-5 text-level" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Focus Time</p>
            <h4 className="text-2xl font-extrabold mt-1">{formatFocusTime(focusMinutes)}</h4>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border p-6 rounded-2xl shadow-card mb-8"
        >
          <h3 className="font-bold mb-4">Milestones</h3>

          {currentMilestone && (
            <div className="mb-6 p-4 bg-xp-muted rounded-xl border border-xp/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xp-foreground">{currentMilestone.label}</span>
                <span className="text-sm text-xp-foreground">{xp.toLocaleString()} / {currentMilestone.xp.toLocaleString()} XP</span>
              </div>
              <div className="w-full h-2 bg-xp/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-xp rounded-full transition-all duration-500"
                  style={{ width: `${milestoneProgress}%` }}
                />
              </div>
              <p className="text-sm text-xp-foreground mt-2">{currentMilestone.reward}</p>
            </div>
          )}

          <div className="grid md:grid-cols-4 gap-3">
            {MILESTONES.map((milestone, i) => {
              const isCompleted = xp >= milestone.xp;
              const isCurrent = currentMilestone?.xp === milestone.xp;

              return (
                <div
                  key={i}
                  className={`p-4 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-success-muted border-success/20'
                      : isCurrent
                        ? 'bg-xp-muted border-xp/20'
                        : 'bg-muted border-border'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                    )}
                    <span className={`font-bold ${isCompleted ? 'text-success' : ''}`}>
                      {milestone.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{milestone.xp.toLocaleString()} XP</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border p-6 rounded-2xl shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Badges</h3>
            <span className="text-sm text-muted-foreground">
              {badges.filter(b => b.unlocked).length} / {badges.length} unlocked
            </span>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {badges.map((badge) => {
              const IconComponent = badge.icon;
              return (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.05 }}
                  className={`flex flex-col items-center p-4 rounded-2xl transition-all cursor-pointer ${
                    badge.unlocked
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <div className={`p-3 rounded-xl mb-2 ${badge.unlocked ? 'bg-xp/20' : 'bg-background'}`}>
                    <IconComponent className={`w-6 h-6 ${badge.unlocked ? 'text-xp' : 'text-muted-foreground'}`} />
                  </div>
                  <span className="text-xs font-bold text-center">{badge.label}</span>
                  {badge.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-success mt-1" />
                  ) : (
                    <X className="w-3 h-3 text-muted-foreground mt-1" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 grid md:grid-cols-2 gap-4"
        >
          <div className="bg-primary text-primary-foreground p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-6 h-6 text-streak" />
              <span className="text-primary-foreground/60 font-medium">Longest Streak</span>
            </div>
            <p className="text-3xl font-extrabold">{longestStreak} days</p>
          </div>

          <div className="bg-primary text-primary-foreground p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="w-6 h-6 text-elite" />
              <span className="text-primary-foreground/60 font-medium">Rewards Redeemed</span>
            </div>
            <p className="text-3xl font-extrabold">{rewardsRedeemed}</p>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}

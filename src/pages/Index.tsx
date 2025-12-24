import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, Flame, CheckCircle2, Plus, X, Clock, Calendar } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import LevelUpNotification from '@/components/shared/LevelUpNotification';
import AppLayout from '@/components/layout/AppLayout';

const XP_PER_LEVEL = 500;

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};

const isToday = (dateStr: string) => {
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
};

interface TaskFormData {
  title: string;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Elite';
  category: 'Work' | 'Personal' | 'Health' | 'Learning';
  due_date: string;
}

const TaskModal = ({ isOpen, onClose, onAddTask }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAddTask: (data: TaskFormData) => void;
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    duration: 30,
    difficulty: 'Medium',
    category: 'Work',
    due_date: new Date().toISOString().split('T')[0]
  });

  const multipliers = { Easy: 1, Medium: 2, Hard: 4, Elite: 8 };
  const calculatedXP = Math.round(formData.duration * multipliers[formData.difficulty]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onAddTask(formData);
    setFormData({
      title: '',
      duration: 30,
      difficulty: 'Medium',
      category: 'Work',
      due_date: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-primary/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-card w-full max-w-md rounded-4xl overflow-hidden shadow-2xl"
      >
        <div className="px-8 pt-8 pb-4 flex justify-between items-center">
          <h2 className="text-2xl font-extrabold tracking-tight">New Task</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
          <div>
            <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2 ml-1">
              Task Title
            </label>
            <input
              autoFocus
              className="w-full px-6 py-4 bg-muted border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-base font-semibold"
              placeholder="What's the focus?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2 ml-1">
                Duration (Min)
              </label>
              <input
                type="number"
                className="w-full px-6 py-3.5 bg-muted border border-border rounded-2xl focus:outline-none text-sm font-bold"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2 ml-1">
                Due Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3.5 bg-muted border border-border rounded-2xl focus:outline-none text-sm font-bold"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-3 ml-1">
              Difficulty
            </label>
            <div className="flex gap-2">
              {(['Easy', 'Medium', 'Hard', 'Elite'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty: d })}
                  className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all ${
                    formData.difficulty === d
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-3 ml-1">
              Category
            </label>
            <div className="flex gap-2">
              {(['Work', 'Personal', 'Health', 'Learning'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: c })}
                  className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all ${
                    formData.category === c
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-xp-muted px-4 py-2 rounded-full">
              <Zap className="w-4 h-4 text-xp fill-xp" />
              <span className="text-sm font-black text-xp-foreground">+{calculatedXP} XP</span>
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:opacity-90 transition-opacity"
            >
              Create Task
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  
  const { tasks, userProgress, addTask, completeTask } = useAppStore();

  const todayTasks = useMemo(() => {
    return tasks.filter(t => !t.completed && isToday(t.due_date));
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(t => !t.completed && t.due_date > today).slice(0, 5);
  }, [tasks]);

  const recentlyCompleted = useMemo(() => {
    return tasks.filter(t => t.completed).slice(0, 3);
  }, [tasks]);

  const level = userProgress.current_level;
  const xp = userProgress.total_xp;
  const streak = userProgress.current_streak;
  const xpProgress = ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;

  const handleCompleteTask = (taskId: string) => {
    const result = completeTask(taskId);
    if (result.leveledUp) {
      setNewLevel(result.newLevel);
      setShowLevelUp(true);
    }
  };

  const handleAddTask = (taskData: TaskFormData) => {
    addTask(taskData);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <AnimatePresence>
          {showLevelUp && (
            <LevelUpNotification level={newLevel} onClose={() => setShowLevelUp(false)} />
          )}
          {isModalOpen && (
            <TaskModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onAddTask={handleAddTask}
            />
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Stay focused, earn rewards.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full shadow-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Task</span>
          </motion.button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border p-5 rounded-3xl shadow-card"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-xp-muted rounded-xl">
                <Zap className="w-5 h-5 text-xp fill-xp" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total XP</p>
            <h4 className="text-2xl font-extrabold mt-1">{xp}</h4>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border p-5 rounded-3xl shadow-card"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-level-muted rounded-xl">
                <Trophy className="w-5 h-5 text-level" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Level</p>
            <h4 className="text-2xl font-extrabold mt-1">{level}</h4>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border p-5 rounded-3xl shadow-card"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-streak-muted rounded-xl">
                <Flame className="w-5 h-5 text-streak" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Streak</p>
            <h4 className="text-2xl font-extrabold mt-1">{streak} days</h4>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border p-5 rounded-3xl shadow-card"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-success-muted rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Today</p>
            <h4 className="text-2xl font-extrabold mt-1">{todayTasks.length} tasks</h4>
          </motion.div>
        </div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-primary text-primary-foreground p-6 rounded-3xl mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-primary-foreground/60 text-sm font-medium">Level {level} Progress</p>
              <h3 className="text-2xl font-extrabold">{xp % XP_PER_LEVEL} / {XP_PER_LEVEL} XP</h3>
            </div>
            <div className="w-16 h-16 bg-xp rounded-2xl flex items-center justify-center rotate-12">
              <span className="text-2xl font-black text-xp-foreground">{level}</span>
            </div>
          </div>
          <div className="w-full h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-xp rounded-full"
            />
          </div>
          <p className="text-primary-foreground/60 text-sm mt-2">{XP_PER_LEVEL - (xp % XP_PER_LEVEL)} XP until next level</p>
        </motion.div>

        {/* Today's Tasks */}
        <div className="mb-8">
          <h2 className="text-xl font-extrabold mb-4">Today's Focus</h2>
          {todayTasks.length === 0 ? (
            <div className="bg-card border border-border p-8 rounded-3xl text-center">
              <div className="w-16 h-16 bg-muted rounded-3xl mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-bold mb-2">No tasks for today</h3>
              <p className="text-muted-foreground text-sm mb-4">Add a task to get started!</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full"
              >
                Add Task
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card border border-border p-4 rounded-2xl shadow-card flex items-center gap-4"
                >
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="w-8 h-8 rounded-full border-2 border-border hover:border-success hover:bg-success-muted transition-colors flex items-center justify-center"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold">{task.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.duration}m
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        task.difficulty === 'Elite' ? 'bg-elite-muted text-elite' :
                        task.difficulty === 'Hard' ? 'bg-hard-muted text-hard' :
                        task.difficulty === 'Medium' ? 'bg-medium-muted text-medium' :
                        'bg-easy-muted text-easy'
                      }`}>
                        {task.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xp">
                    <Zap className="w-4 h-4 fill-xp" />
                    <span className="text-sm font-bold">{task.xp}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        {upcomingTasks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-extrabold mb-4">Upcoming</h2>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card border border-border p-4 rounded-2xl shadow-card flex items-center gap-4"
                >
                  <div className="p-2 bg-muted rounded-xl">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{task.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatDate(task.due_date)}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xp">
                    <Zap className="w-4 h-4 fill-xp" />
                    <span className="text-sm font-bold">{task.xp}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Completed */}
        {recentlyCompleted.length > 0 && (
          <div>
            <h2 className="text-xl font-extrabold mb-4">Recently Completed</h2>
            <div className="space-y-3">
              {recentlyCompleted.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card border border-border p-4 rounded-2xl shadow-card flex items-center gap-4 opacity-60"
                >
                  <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold line-through">{task.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Completed {task.completed_date}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xp">
                    <Zap className="w-4 h-4 fill-xp" />
                    <span className="text-sm font-bold">+{task.xp}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Clock, Zap, CheckCircle2, Trash2, Edit2 } from 'lucide-react';
import { useAppStore, Task } from '@/stores/appStore';
import LevelUpNotification from '@/components/shared/LevelUpNotification';
import AppLayout from '@/components/layout/AppLayout';

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

interface TaskFormData {
  title: string;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Elite';
  category: 'Work' | 'Personal' | 'Health' | 'Learning';
  due_date: string;
}

const TaskModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editTask 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (data: TaskFormData, taskId?: string) => void;
  editTask?: Task | null;
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: editTask?.title || '',
    duration: editTask?.duration || 30,
    difficulty: editTask?.difficulty || 'Medium',
    category: editTask?.category || 'Work',
    due_date: editTask?.due_date || new Date().toISOString().split('T')[0]
  });

  const multipliers = { Easy: 1, Medium: 2, Hard: 4, Elite: 8 };
  const calculatedXP = Math.round(formData.duration * multipliers[formData.difficulty]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData, editTask?.id);
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
        className="bg-card w-full max-w-md rounded-4xl overflow-hidden shadow-2xl"
      >
        <div className="px-6 pt-6 pb-4 flex justify-between items-center">
          <h2 className="text-xl font-extrabold">{editTask ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Title</label>
            <input
              autoFocus
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              placeholder="Task name..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Duration</label>
              <input
                type="number"
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none font-medium"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Due Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none font-medium"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Difficulty</label>
            <div className="grid grid-cols-4 gap-2">
              {(['Easy', 'Medium', 'Hard', 'Elite'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty: d })}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
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
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {(['Work', 'Personal', 'Health', 'Learning'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: c })}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
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
          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-xp-muted px-4 py-2 rounded-full">
              <Zap className="w-4 h-4 text-xp fill-xp" />
              <span className="text-sm font-bold text-xp-foreground">+{calculatedXP} XP</span>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              {editTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);

  const { tasks, addTask, updateTask, deleteTask, completeTask } = useAppStore();

  const handleSaveTask = (taskData: TaskFormData, taskId?: string) => {
    if (taskId) {
      updateTask(taskId, taskData);
    } else {
      addTask(taskData);
    }
    setEditingTask(null);
  };

  const handleCompleteTask = (taskId: string) => {
    const result = completeTask(taskId);
    if (result.leveledUp) {
      setNewLevel(result.newLevel);
      setShowLevelUp(true);
    }
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'completed') return tasks.filter(t => t.completed);
    if (filter === 'pending') return tasks.filter(t => !t.completed);
    return tasks;
  }, [tasks, filter]);

  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    filteredTasks.forEach(task => {
      const date = task.due_date || 'No Date';
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(task);
    });
    return Object.entries(grouped).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime());
  }, [filteredTasks]);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <AnimatePresence>
          {showLevelUp && <LevelUpNotification level={newLevel} onClose={() => setShowLevelUp(false)} />}
          {isModalOpen && (
            <TaskModal
              isOpen={isModalOpen}
              onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
              onSave={handleSaveTask}
              editTask={editingTask}
            />
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground mt-1">Manage all your focus sessions.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Task</span>
          </motion.button>
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { key: 'all' as const, label: 'All' },
            { key: 'pending' as const, label: 'Pending' },
            { key: 'completed' as const, label: 'Completed' }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === f.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filteredTasks.length === 0 ? (
          <div className="bg-card border border-border p-12 rounded-3xl text-center">
            <div className="w-20 h-20 bg-muted rounded-3xl mx-auto mb-4 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-6">Create your first task to get started!</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full"
            >
              Create Task
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {tasksByDate.map(([date, dateTasks]) => (
              <div key={date}>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
                  {date === 'No Date' ? date : formatDate(date)}
                </h3>
                <div className="space-y-3">
                  {dateTasks.map(task => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-card border border-border p-5 rounded-2xl shadow-card ${
                        task.completed ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <button
                            onClick={() => !task.completed && handleCompleteTask(task.id)}
                            disabled={task.completed}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                              task.completed
                                ? 'bg-success-muted border-success'
                                : 'border-border hover:border-success hover:bg-success-muted'
                            }`}
                          >
                            {task.completed && <CheckCircle2 className="w-5 h-5 text-success" />}
                          </button>
                          <div className="flex-1">
                            <h3 className={`font-bold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </h3>
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
                              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                                {task.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xp mr-2">
                            <Zap className="w-4 h-4 fill-xp" />
                            <span className="text-sm font-bold">{task.xp}</span>
                          </div>
                          {!task.completed && (
                            <>
                              <button
                                onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4 text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

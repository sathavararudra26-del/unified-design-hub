import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Elite';
  category: 'Work' | 'Personal' | 'Health' | 'Learning';
  xp: number;
  due_date: string;
  completed: boolean;
  completed_date?: string;
  created_date: string;
}

export interface Reward {
  id: string;
  title: string;
  xp_cost: number;
  is_unlocked: boolean;
  redeemed_date?: string;
  created_date: string;
}

export interface UserProgress {
  total_xp: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
  total_tasks_completed: number;
  total_focus_minutes: number;
  earned_badges: string[];
  last_active_date: string;
}

interface AppState {
  tasks: Task[];
  rewards: Reward[];
  userProgress: UserProgress;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'created_date' | 'completed' | 'xp'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => { leveledUp: boolean; newLevel: number };
  
  // Reward actions
  addReward: (reward: Omit<Reward, 'id' | 'created_date' | 'is_unlocked'>) => void;
  redeemReward: (id: string) => boolean;
  deleteReward: (id: string) => void;
  
  // Progress actions
  updateStreak: () => void;
  addBadge: (badgeId: string) => void;
}

const XP_PER_LEVEL = 500;

const calculateXP = (duration: number, difficulty: string): number => {
  const multipliers: Record<string, number> = { Easy: 1, Medium: 2, Hard: 4, Elite: 8 };
  return Math.round(duration * (multipliers[difficulty] || 1));
};

const generateId = () => Math.random().toString(36).substring(2, 15);

const getToday = () => new Date().toISOString().split('T')[0];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: [],
      rewards: [],
      userProgress: {
        total_xp: 0,
        current_level: 1,
        current_streak: 0,
        longest_streak: 0,
        total_tasks_completed: 0,
        total_focus_minutes: 0,
        earned_badges: [],
        last_active_date: getToday(),
      },

      addTask: (taskData) => {
        const xp = calculateXP(taskData.duration, taskData.difficulty);
        const newTask: Task = {
          ...taskData,
          id: generateId(),
          xp,
          completed: false,
          created_date: new Date().toISOString(),
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...updates,
                  xp: updates.duration || updates.difficulty
                    ? calculateXP(
                        updates.duration ?? task.duration,
                        updates.difficulty ?? task.difficulty
                      )
                    : task.xp,
                }
              : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
      },

      completeTask: (id) => {
        const state = get();
        const task = state.tasks.find((t) => t.id === id);
        if (!task || task.completed) return { leveledUp: false, newLevel: state.userProgress.current_level };

        const newXP = state.userProgress.total_xp + task.xp;
        const currentLevel = state.userProgress.current_level;
        const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
        const leveledUp = newLevel > currentLevel;

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, completed: true, completed_date: getToday() }
              : t
          ),
          userProgress: {
            ...state.userProgress,
            total_xp: newXP,
            current_level: newLevel,
            total_tasks_completed: state.userProgress.total_tasks_completed + 1,
            total_focus_minutes: state.userProgress.total_focus_minutes + task.duration,
            last_active_date: getToday(),
          },
        }));

        return { leveledUp, newLevel };
      },

      addReward: (rewardData) => {
        const newReward: Reward = {
          ...rewardData,
          id: generateId(),
          is_unlocked: false,
          created_date: new Date().toISOString(),
        };
        set((state) => ({ rewards: [newReward, ...state.rewards] }));
      },

      redeemReward: (id) => {
        const state = get();
        const reward = state.rewards.find((r) => r.id === id);
        if (!reward || reward.is_unlocked) return false;
        if (state.userProgress.total_xp < reward.xp_cost) return false;

        set((state) => ({
          rewards: state.rewards.map((r) =>
            r.id === id ? { ...r, is_unlocked: true, redeemed_date: getToday() } : r
          ),
          userProgress: {
            ...state.userProgress,
            total_xp: state.userProgress.total_xp - reward.xp_cost,
          },
        }));
        return true;
      },

      deleteReward: (id) => {
        set((state) => ({ rewards: state.rewards.filter((r) => r.id !== id) }));
      },

      updateStreak: () => {
        const state = get();
        const today = getToday();
        const lastActive = state.userProgress.last_active_date;
        
        const todayDate = new Date(today);
        const lastActiveDate = new Date(lastActive);
        const diffDays = Math.floor(
          (todayDate.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        let newStreak = state.userProgress.current_streak;
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }

        set((state) => ({
          userProgress: {
            ...state.userProgress,
            current_streak: newStreak,
            longest_streak: Math.max(state.userProgress.longest_streak, newStreak),
            last_active_date: today,
          },
        }));
      },

      addBadge: (badgeId) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            earned_badges: state.userProgress.earned_badges.includes(badgeId)
              ? state.userProgress.earned_badges
              : [...state.userProgress.earned_badges, badgeId],
          },
        }));
      },
    }),
    {
      name: 'focusflow-storage',
    }
  )
);

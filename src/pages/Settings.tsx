import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Globe, Bell, Palette, Download, Shield, Crown, 
  LogOut, X, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import AppLayout from '@/components/layout/AppLayout';

const PRO_FEATURES = [
  'Unlimited tasks & projects',
  'Advanced data analytics',
  'Dynamic reward multipliers',
  'Streak protection (1 freeze/mo)',
  'Full Dark Mode experience',
  'Priority email support'
];

const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Profile', desc: 'Your account information' },
      { icon: Globe, label: 'Language', desc: 'English (US)' }
    ]
  },
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', desc: 'Task reminders and activity alerts', toggle: true, defaultChecked: true },
      { icon: Palette, label: 'Appearance', desc: 'Dark mode is a Pro feature', toggle: true, defaultChecked: false, disabled: true }
    ]
  },
  {
    title: 'Data & Security',
    items: [
      { icon: Download, label: 'Export Data', desc: 'Download a JSON backup', action: 'export' },
      { icon: Shield, label: 'Privacy', desc: 'Manage visibility settings' }
    ]
  }
];

const UpgradeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative bg-card w-full max-w-md rounded-2xl shadow-2xl p-6"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">Choose a Plan</h3>
            <p className="text-sm text-muted-foreground">Supercharge your productivity.</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="space-y-4 py-2">
          <div className="p-4 border-2 border-level rounded-xl bg-level-muted flex justify-between items-center">
            <div>
              <p className="text-sm font-bold">Annual Pro</p>
              <p className="text-xs text-muted-foreground">$39.99 / year</p>
            </div>
            <div className="bg-level text-level-foreground text-[10px] px-2 py-1 rounded-full font-bold uppercase">Save 33%</div>
          </div>
          <div className="p-4 border border-border rounded-xl flex justify-between items-center">
            <div>
              <p className="text-sm font-bold">Monthly Pro</p>
              <p className="text-xs text-muted-foreground">$4.99 / month</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-level hover:opacity-90 text-level-foreground py-3 rounded-xl font-bold transition-opacity"
          >
            Proceed to Checkout
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Settings() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    Notifications: true,
    Appearance: false
  });

  const { tasks, rewards, userProgress } = useAppStore();

  const handleExport = () => {
    const data = {
      progress: userProgress,
      tasks: tasks,
      rewards: rewards,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        <AnimatePresence>
          {showUpgradeModal && <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />}
        </AnimatePresence>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-primary rounded-2xl p-6 mb-10 text-primary-foreground shadow-xl"
        >
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-level/10 rounded-full blur-3xl" />

          <div className="relative flex items-center gap-4 mb-6">
            <div className="p-3 bg-primary-foreground/10 backdrop-blur rounded-xl">
              <Crown className="w-6 h-6 text-level" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Productivity Pro</h3>
              <p className="text-sm text-primary-foreground/60">Unlock your full potential</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-sm text-primary-foreground/80">
            {PRO_FEATURES.map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-level" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowUpgradeModal(true)}
            className="w-full bg-level hover:opacity-90 text-level-foreground py-3 rounded-xl font-bold transition-all shadow-lg shadow-level/20"
          >
            Upgrade Now — $4.99/mo
          </button>
        </motion.div>

        <div className="space-y-8">
          {SETTINGS_SECTIONS.map((section, si) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * si }}
            >
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                {section.title}
              </h3>
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
                {section.items.map((item, ii) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between p-4 ${
                        ii < section.items.length - 1 ? 'border-b border-border' : ''
                      } ${item.disabled ? 'opacity-60' : 'hover:bg-muted'} transition-colors cursor-pointer`}
                      onClick={() => {
                        if (item.action === 'export') handleExport();
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-xl">
                          <IconComponent className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>

                      {item.toggle ? (
                        <button
                          disabled={item.disabled}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!item.disabled) {
                              setToggleStates(prev => ({
                                ...prev,
                                [item.label]: !prev[item.label]
                              }));
                            }
                          }}
                          className={`relative w-12 h-7 rounded-full transition-colors ${
                            toggleStates[item.label] ? 'bg-primary' : 'bg-muted'
                          } ${item.disabled ? 'cursor-not-allowed' : ''}`}
                        >
                          <div
                            className={`absolute top-1 w-5 h-5 bg-card rounded-full shadow transition-transform ${
                              toggleStates[item.label] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 bg-muted rounded-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
              U
            </div>
            <div>
              <p className="font-bold">User</p>
              <p className="text-sm text-muted-foreground">user@example.com</p>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 pt-8 border-t border-border">
          <button
            className="w-full flex items-center justify-center gap-2 border border-destructive/20 text-destructive hover:bg-destructive/10 py-3 rounded-xl font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <p className="text-center text-[10px] text-muted-foreground mt-4">Version 2.4.0 — FocusFlow</p>
        </div>
      </div>
    </AppLayout>
  );
}

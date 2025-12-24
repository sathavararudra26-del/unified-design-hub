import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Gift, Zap, CheckCircle2, Trash2, X } from 'lucide-react';
import { useAppStore, Reward } from '@/stores/appStore';
import AppLayout from '@/components/layout/AppLayout';

const RewardForm = ({ onSave, onCancel }: { onSave: (data: { title: string; xp_cost: number }) => void; onCancel: () => void }) => {
  const [title, setTitle] = useState('');
  const [xpCost, setXpCost] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !xpCost) return;
    onSave({ title, xp_cost: parseInt(xpCost) });
    setTitle('');
    setXpCost('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card border-2 border-dashed border-border p-6 rounded-2xl mb-6"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Reward Name</label>
            <input
              type="text"
              placeholder="e.g. 15 min Break"
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">XP Cost</label>
            <div className="relative">
              <Zap className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="number"
                placeholder="500"
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                value={xpCost}
                onChange={(e) => setXpCost(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-opacity"
          >
            Create Reward
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const RewardCard = ({ 
  reward, 
  availableXP, 
  onRedeem, 
  onDelete 
}: { 
  reward: Reward; 
  availableXP: number; 
  onRedeem: (reward: Reward) => void; 
  onDelete: (id: string) => void;
}) => {
  const canAfford = availableXP >= reward.xp_cost;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-card border border-border rounded-2xl shadow-card overflow-hidden transition-all ${
        reward.is_unlocked ? 'opacity-60' : 'hover:border-muted-foreground/30 hover:shadow-md'
      }`}
    >
      <div className="p-5 flex items-start gap-4">
        <div className={`p-3 rounded-xl ${reward.is_unlocked ? 'bg-muted text-muted-foreground' : 'bg-muted text-foreground'}`}>
          <Gift className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{reward.title}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <Zap className={`w-4 h-4 ${reward.is_unlocked ? 'text-muted-foreground' : 'text-xp fill-xp'}`} />
            <span className={`text-sm font-bold ${reward.is_unlocked ? 'text-muted-foreground' : 'text-xp-foreground'}`}>
              {reward.xp_cost} XP
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {reward.is_unlocked ? (
            <span className="flex items-center gap-1 text-success text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Redeemed
            </span>
          ) : (
            <>
              <button
                onClick={() => onRedeem(reward)}
                disabled={!canAfford}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  canAfford
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                Redeem
              </button>
              <button
                onClick={() => onDelete(reward.id)}
                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </>
          )}
        </div>
      </div>
      {!reward.is_unlocked && !canAfford && (
        <div className="px-5 pb-4">
          <p className="text-xs text-destructive flex items-center gap-1">
            <X className="w-3 h-3" />
            Need {reward.xp_cost - availableXP} more XP
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default function Rewards() {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'available' | 'redeemed'>('available');

  const { rewards, userProgress, addReward, redeemReward, deleteReward } = useAppStore();

  const availableXP = userProgress.total_xp;

  const filteredRewards = filter === 'redeemed'
    ? rewards.filter(r => r.is_unlocked)
    : rewards.filter(r => !r.is_unlocked);

  const totalRedeemed = rewards.filter(r => r.is_unlocked).length;
  const totalSpent = rewards.filter(r => r.is_unlocked).reduce((sum, r) => sum + r.xp_cost, 0);

  const handleRedeem = (reward: Reward) => {
    redeemReward(reward.id);
  };

  const suggestedRewards = [
    { title: '15 min Break', xp_cost: 100 },
    { title: 'Favorite Snack', xp_cost: 250 },
    { title: 'Episode of TV Show', xp_cost: 500 }
  ];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Rewards</h1>
            <p className="text-muted-foreground mt-1">Redeem your hard-earned XP.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Reward</span>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-primary-foreground p-6 rounded-3xl mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/60 text-sm font-medium">Available XP</p>
              <div className="flex items-center gap-2 mt-1">
                <Zap className="w-8 h-8 text-xp fill-xp" />
                <span className="text-4xl font-extrabold">{availableXP}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary-foreground/60 text-sm">{totalRedeemed} rewards redeemed</p>
              <p className="text-primary-foreground/60 text-sm">{totalSpent} XP spent</p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <RewardForm
              onSave={(data) => { addReward(data); setShowForm(false); }}
              onCancel={() => setShowForm(false)}
            />
          )}
        </AnimatePresence>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('available')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filter === 'available'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            Available ({rewards.filter(r => !r.is_unlocked).length})
          </button>
          <button
            onClick={() => setFilter('redeemed')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filter === 'redeemed'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            Redeemed ({totalRedeemed})
          </button>
        </div>

        {filteredRewards.length === 0 ? (
          <div className="bg-card border border-border p-12 rounded-3xl text-center">
            <div className="w-20 h-20 bg-muted rounded-3xl mx-auto mb-4 flex items-center justify-center">
              <Gift className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              {filter === 'redeemed' ? 'No redeemed rewards yet' : 'No rewards available'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {filter === 'redeemed'
                ? 'Complete tasks to earn XP and redeem rewards!'
                : 'Create custom rewards to motivate yourself.'}
            </p>
            {filter === 'available' && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full"
              >
                Create Reward
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {filteredRewards.map(reward => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  availableXP={availableXP}
                  onRedeem={handleRedeem}
                  onDelete={deleteReward}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {rewards.filter(r => !r.is_unlocked).length === 0 && filter === 'available' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h3 className="font-bold mb-4">Suggested Rewards</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {suggestedRewards.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => addReward(suggestion)}
                  className="bg-muted border border-border p-4 rounded-2xl text-left hover:border-muted-foreground/30 hover:bg-card transition-all"
                >
                  <h4 className="font-medium">{suggestion.title}</h4>
                  <div className="flex items-center gap-1 mt-1 text-xp">
                    <Zap className="w-3 h-3" />
                    <span className="text-sm font-bold">{suggestion.xp_cost} XP</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}

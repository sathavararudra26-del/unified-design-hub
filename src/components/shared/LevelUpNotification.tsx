import { motion } from 'framer-motion';
import Icon from './Icon';

interface LevelUpNotificationProps {
  level: number;
  onClose: () => void;
}

const LevelUpNotification = ({ level, onClose }: LevelUpNotificationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", damping: 15 }}
        className="text-center text-primary-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            repeatDelay: 1
          }}
          className="w-32 h-32 bg-xp rounded-4xl flex items-center justify-center mx-auto mb-8 shadow-glow-lg"
        >
          <Icon name="Trophy" className="w-16 h-16 text-xp-foreground" />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-medium text-primary-foreground/70 uppercase tracking-widest mb-2"
        >
          Level Up!
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-8xl font-black mb-4"
        >
          {level}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-primary-foreground/60 text-lg mb-8"
        >
          Keep crushing it!
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="px-8 py-4 bg-primary-foreground text-primary font-bold rounded-full"
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default LevelUpNotification;

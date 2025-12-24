import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ListChecks, BarChart3, TrendingUp, Gift, Settings, Zap } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/tasks', icon: ListChecks, label: 'Tasks' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/progress', icon: TrendingUp, label: 'Progress' },
  { path: '/rewards', icon: Gift, label: 'Rewards' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border flex-col p-4 z-50">
        <div className="flex items-center gap-3 px-4 py-4 mb-6">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">FocusFlow</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-border">
          <div className="px-4 py-3">
            <p className="text-xs text-muted-foreground">FocusFlow v2.4.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 pb-24 md:pb-8">
        {children}
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center gap-1 px-3 py-2"
              >
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full"
                  />
                )}
                <IconComponent
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;

import React from 'react';
import { Home, FolderOpen, Wrench, Settings } from 'lucide-react';
import { ScreenType } from '../../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  // If the user is on an immersive editor like Scanner, Crop, or Edit PDF, we hide or allow easy return
  const isHidden = currentScreen === 'scanner' || currentScreen === 'crop';
  if (isHidden) return null;

  const navItems = [
    {
      id: 'home' as ScreenType,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'files' as ScreenType,
      label: 'Files',
      icon: FolderOpen,
    },
    {
      id: 'tools' as ScreenType,
      label: 'Tools',
      icon: Wrench,
    },
    {
      id: 'settings' as ScreenType,
      label: 'Settings',
      icon: Settings,
    },
  ];

  // Active check (if on viewer or edit-pdf, files or tools might be relevant parent or none)
  const getIsActive = (id: ScreenType) => {
    if (id === 'home' && currentScreen === 'home') return true;
    if (id === 'files' && (currentScreen === 'files' || currentScreen === 'viewer')) return true;
    if (id === 'tools' && (currentScreen === 'tools' || currentScreen === 'edit-pdf' || currentScreen === 'qr-generator')) return true;
    if (id === 'settings' && currentScreen === 'settings') return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#fafafa]/90 backdrop-blur-xl border-t border-zinc-200/80 shadow-[0_-2px_12px_rgba(0,0,0,0.03)] transition-all">
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = getIsActive(item.id);
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[48px] transition-colors ${
                isActive ? 'text-zinc-950 font-bold' : 'text-zinc-500 hover:text-zinc-900 font-medium'
              }`}
            >
              <div
                className={`w-12 h-7 rounded-full flex items-center justify-center transition-all ${
                  isActive ? 'bg-zinc-200 text-zinc-950 shadow-sm' : 'text-zinc-500'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
      {/* Home Indicator Bar */}
      <div className="w-full flex justify-center pb-2 pt-0.5">
        <div className="w-32 h-1 bg-zinc-300 rounded-full" />
      </div>
    </nav>
  );
};

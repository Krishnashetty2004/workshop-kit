import React from 'react';
import { Rocket } from 'lucide-react';
import { Button } from '../ui/Button';
import { APP_CONFIG } from '../../lib/config';

interface HeaderProps {
  onDashboardClick?: () => void;
  showDashboard?: boolean;
}

export function Header({ onDashboardClick, showDashboard = true }: HeaderProps) {
  return (
    <header className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-purple-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">{APP_CONFIG.name}</span>
        </div>
        
        {showDashboard && onDashboardClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDashboardClick}
          >
            Dashboard
          </Button>
        )}
      </div>
    </header>
  );
}

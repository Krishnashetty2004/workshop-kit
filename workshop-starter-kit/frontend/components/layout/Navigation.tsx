import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface NavigationProps {
  onBack: () => void;
  title?: string;
  showBack?: boolean;
}

export function Navigation({ onBack, title, showBack = true }: NavigationProps) {
  return (
    <div className="flex items-center">
      {showBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      )}
      {title && (
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      )}
    </div>
  );
}

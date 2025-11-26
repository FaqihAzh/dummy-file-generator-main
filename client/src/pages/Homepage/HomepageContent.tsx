import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APPS, AppDefinition } from '../../lib/constants';

export const HomepageContent = () => {
  const navigate = useNavigate();

  const handleAppClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12 space-y-2">
          <p className="text-zinc-500 text-sm">Select a tool to get started</p>
        </div>

        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-6 p-8 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 shadow-2xl">
            {APPS.map((app) => (
              <AppIcon key={app.id} app={app} onClick={() => handleAppClick(app.path)} />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-xs text-zinc-600">
            Click an icon to open the tool
          </p>
        </div>
      </div>
    </div>
  );
};

const AppIcon: React.FC<{ app: AppDefinition; onClick: () => void }> = ({ app, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer flex flex-col items-center gap-3 transition-transform duration-200 hover:scale-110"
    >
      <div className={`
        relative w-20 h-20 rounded-2xl
        flex items-center justify-center
        transition-all duration-300
        bg-gradient-to-br ${getGradient(app.color)}
        shadow-lg group-hover:shadow-2xl
        ${isHovered ? 'ring-4 ring-white/20' : ''}
      `}>
        <app.icon className="h-10 w-10 text-white" />
        
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <span className={`
        text-xs font-medium text-zinc-400 group-hover:text-zinc-200
        transition-colors duration-200 max-w-[100px] text-center
      `}>
        {app.name}
      </span>

      {isHovered && (
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-zinc-800 text-zinc-100 text-xs px-3 py-2 rounded-lg shadow-xl border border-zinc-700 whitespace-nowrap">
            {app.description}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 border-l border-t border-zinc-700 rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
};

const getGradient = (color: string): string => {
  const gradients: Record<string, string> = {
    'text-blue-400': 'from-blue-500 to-blue-600',
    'text-emerald-400': 'from-emerald-500 to-emerald-600',
    'text-violet-400': 'from-violet-500 to-violet-600',
    'text-orange-400': 'from-orange-500 to-orange-600',
    'text-red-400': 'from-red-500 to-red-600',
    'text-cyan-400': 'from-cyan-500 to-cyan-600',
    'text-zinc-400': 'from-zinc-600 to-zinc-700',
  };
  
  return gradients[color] || 'from-zinc-600 to-zinc-700';
};

export default HomepageContent;
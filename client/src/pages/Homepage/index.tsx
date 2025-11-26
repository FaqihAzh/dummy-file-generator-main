import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui';
import { APPS, AppDefinition } from '../../lib/constants';

export const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredApps = APPS.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAppClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6 bg-zinc-950 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-zinc-400">Welcome back. Select a tool to begin your work.</p>
        </div>
        
        {/* Mobile Search (Hidden on desktop, visible on mobile) */}
        <div className="relative md:hidden w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-900 pl-9 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-all"
          />
        </div>
      </div>

      {filteredApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-zinc-900 p-4 mb-4">
              <Search className="h-8 w-8 text-zinc-600" />
            </div>
            <h3 className="text-lg font-medium text-zinc-300">No apps found</h3>
            <p className="text-zinc-500 mt-1">Try searching for something else.</p>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredApps.map((app) => (
            <AppWidget key={app.id} app={app} onClick={() => handleAppClick(app.path)} />
          ))}
        </div>
      )}
    </div>
  );
};

const AppWidget: React.FC<{ app: AppDefinition; onClick: () => void }> = ({ app, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-zinc-700 to-zinc-800 opacity-0 group-hover:opacity-100 transition duration-500 blur"></div>
      <Card className="relative h-full border-zinc-800 bg-zinc-900/90 hover:bg-zinc-900 transition-all duration-300 group-hover:-translate-y-1">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className={`rounded-lg p-2.5 bg-zinc-950 ring-1 ring-white/10 ${app.color}`}>
              <app.icon className="h-6 w-6" />
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowLeft className="h-4 w-4 rotate-180 text-zinc-500" />
            </div>
          </div>
          <div className="space-y-1 pt-4">
            <CardTitle className="text-lg">{app.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {app.description}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Homepage;

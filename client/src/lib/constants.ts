import React from 'react';
import { 
  Terminal, 
  Settings, 
  Database, 
  Globe, 
  ShieldCheck, 
  Users, 
  BarChart3, 
  FilePen
} from 'lucide-react';

export interface AppDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  path: string;
}

export const APPS: AppDefinition[] = [
  {
    id: 'dummy-file-generator',
    name: 'Dummy Generator',
    description: 'Generate high-fidelity dummy files for testing environments.',
    icon: FilePen,
    color: 'text-blue-400',
    path: '/dummy-file-generator'
  },
  {
    id: 'comments-crawler',
    name: 'Comments Crawler',
    description: 'Extract and analyze user comments from various platforms.',
    icon: Database,
    color: 'text-emerald-400',
    path: '/comments-crawler'
  },
  // {
  //   id: 'users',
  //   name: 'User Management',
  //   description: 'Administer user roles, permissions, and access controls.',
  //   icon: Users,
  //   color: 'text-violet-400',
  //   path: '/users'
  // },
  // {
  //   id: 'logs',
  //   name: 'System Logs',
  //   description: 'Inspect raw system logs, trace stacks, and debug errors.',
  //   icon: Terminal,
  //   color: 'text-orange-400',
  //   path: '/logs'
  // },
  // {
  //   id: 'security',
  //   name: 'Security Shield',
  //   description: 'Firewall rules, IP whitelisting, and threat detection.',
  //   icon: ShieldCheck,
  //   color: 'text-red-400',
  //   path: '/security'
  // },
  // {
  //   id: 'network',
  //   name: 'Network Topology',
  //   description: 'Visualize network nodes and manage routing tables.',
  //   icon: Globe,
  //   color: 'text-cyan-400',
  //   path: '/network'
  // },
  // {
  //   id: 'settings',
  //   name: 'Global Config',
  //   description: 'Application-wide variables and environment settings.',
  //   icon: Settings,
  //   color: 'text-zinc-400',
  //   path: '/settings'
  // }
];
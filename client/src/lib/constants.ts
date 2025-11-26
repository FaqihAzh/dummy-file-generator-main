import React from 'react';
import { 
  FilePen,
  Youtube
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
    name: 'File Generator',
    description: 'Generate high-fidelity dummy files for testing',
    icon: FilePen,
    color: 'text-blue-400',
    path: '/dummy-file-generator'
  },
  {
    id: 'youtube-crawler',
    name: 'YouTube Crawler',
    description: 'Extract comments from YouTube videos',
    icon: Youtube,
    color: 'text-red-400',
    path: '/youtube-crawler'
  }
];
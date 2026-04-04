export interface Link { target: string; via: string; dir: '→' | '←' | '↔'; msgs?: string[] }
export interface Fn { sig: string; desc: string }
export interface Module {
  label: string;
  layer: 'cl' | 'el' | 'api';
  role: string;
  fns: Fn[];
  links: Link[];
  notes?: string[];
}

import { clModules } from './archDataCL';
import { elModules } from './archDataEL';

export const modules: Record<string, Module> = {
  ...clModules,
  ...elModules,
};

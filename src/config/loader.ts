import { readFileSync, existsSync } from 'node:fs';
import { GLOBAL_CONFIG_FILE, getProjectConfigFile } from './paths.js';

export interface Config {
  globalInstructions: string;
  projectInstructions: string;
  combined: string;
}

export function loadConfig(): Config {
  let globalInstructions = '';
  let projectInstructions = '';

  if (existsSync(GLOBAL_CONFIG_FILE)) {
    globalInstructions = readFileSync(GLOBAL_CONFIG_FILE, 'utf-8').trim();
  }

  const projectFile = getProjectConfigFile();
  if (existsSync(projectFile)) {
    projectInstructions = readFileSync(projectFile, 'utf-8').trim();
  }

  const parts: string[] = [];
  if (globalInstructions) {
    parts.push('# Global Instructions\n\n' + globalInstructions);
  }
  if (projectInstructions) {
    parts.push('# Project Instructions\n\n' + projectInstructions);
  }

  return {
    globalInstructions,
    projectInstructions,
    combined: parts.join('\n\n---\n\n'),
  };
}

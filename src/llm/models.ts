export interface ModelInfo {
  id: string;
  name: string;
  contextWindow: number;
  maxOutputTokens: number;
  supportsTools: boolean;
  supportsVision: boolean;
  costPer1kInput: number;
  costPer1kOutput: number;
}

export const MODELS: Record<string, ModelInfo> = {
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    contextWindow: 128_000,
    maxOutputTokens: 16_384,
    supportsTools: true,
    supportsVision: true,
    costPer1kInput: 0.0025,
    costPer1kOutput: 0.01,
  },
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    contextWindow: 128_000,
    maxOutputTokens: 16_384,
    supportsTools: true,
    supportsVision: true,
    costPer1kInput: 0.00015,
    costPer1kOutput: 0.0006,
  },
  'o3': {
    id: 'o3',
    name: 'o3',
    contextWindow: 200_000,
    maxOutputTokens: 100_000,
    supportsTools: true,
    supportsVision: true,
    costPer1kInput: 0.01,
    costPer1kOutput: 0.04,
  },
  'o4-mini': {
    id: 'o4-mini',
    name: 'o4-mini',
    contextWindow: 200_000,
    maxOutputTokens: 100_000,
    supportsTools: true,
    supportsVision: true,
    costPer1kInput: 0.0011,
    costPer1kOutput: 0.0044,
  },
};

export function getModel(id: string): ModelInfo {
  const model = MODELS[id];
  if (!model) {
    throw new Error(`Unknown model: ${id}. Available: ${Object.keys(MODELS).join(', ')}`);
  }
  return model;
}

export function listModels(): ModelInfo[] {
  return Object.values(MODELS);
}

import type { Model } from './models.ts';
import type { Creator } from './creators.ts';
import type { Provider } from './providers.ts';

export interface ModelsData {
  creator: string;
  models: Model[];
}

export interface CreatorsData {
  creators: Record<string, Creator>;
}

export interface ProvidersData {
  providers: Provider[];
}

import type { Model } from './models';
import type { Creator } from './creators';
import type { Provider } from './providers';

export interface ModelsData {
  models: Model[];
}

export interface CreatorsData {
  creators: Record<string, Creator>;
}

export interface ProvidersData {
  providers: Provider[];
}

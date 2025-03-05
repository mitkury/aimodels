import type { Model } from './models';
import type { Provider } from './providers';
import type { Organization } from './organizations';

// Import pre-built data
import { models as prebuiltModels } from '../../dist/data';
import { providers as prebuiltProviders } from '../../dist/data';
import { organizations as prebuiltOrgs } from '../../dist/data';

// Re-export types
export type { Model, Provider, Organization };

// Re-export pre-built data
export const models: Record<string, Model> = prebuiltModels;
export const providers: Record<string, Provider> = prebuiltProviders;
export const organizations: Record<string, Organization> = prebuiltOrgs;

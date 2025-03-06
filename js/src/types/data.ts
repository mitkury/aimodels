import type { Model } from './models';
import type { Provider } from './providers';
import type { Organization } from './organizations';

// Import from the template file during development
// During build, this file will be replaced with actual data
import { models as prebuiltModels, providers as prebuiltProviders, organizations as prebuiltOrgs } from '../data/template.js';

// Re-export types
export type { Model, Provider, Organization };

// Re-export pre-built data
export const models: Record<string, Model> = prebuiltModels;
export const providers: Record<string, Provider> = prebuiltProviders;
export const organizations: Record<string, Organization> = prebuiltOrgs;

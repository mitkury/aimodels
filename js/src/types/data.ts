import type { Model } from './models';
import type { Provider } from './providers';
import type { Organization } from './organizations';

// Re-export types
export type { Model, Provider, Organization };

// Export empty objects - actual data will be loaded at runtime
export const models: Record<string, Model> = {};
export const providers: Record<string, Provider> = {};
export const organizations: Record<string, Organization> = {};

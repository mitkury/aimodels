import { ModelSource } from './types/modelSource';
import { ProviderSource } from './types/provider';
import { Organization } from './types/organization';

// Declare the exports from data.js
export const models: Record<string, ModelSource>;
export const providers: Record<string, ProviderSource>;
export const organizations: Record<string, Organization>; 
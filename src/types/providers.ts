import type { ModelPrice, ImagePrice } from './pricing';

export interface Provider {
  /** Provider identifier */
  id: string;
  /** Display name */
  name: string;
  /** Website URL */
  websiteUrl: string;
  /** API endpoint */
  apiUrl: string;
  /** Default model */
  defaultModel?: string;
  /** Whether this is a local provider */
  isLocal?: number;
  /** Model pricing */
  models: Record<string, ModelPrice | ImagePrice>;
}

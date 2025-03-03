import type { TokenBasedPricePerMillionTokens, ImagePrice } from './pricing.ts';

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
  models: Record<string, TokenBasedPricePerMillionTokens | ImagePrice>;
}

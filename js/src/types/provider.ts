import type { TokenBasedPricePerMillionTokens, ImagePrice } from './pricing';
import type { Organization } from './organization';

export interface ProviderSource {
  id: string;
  apiUrl: string;
  apiDocsUrl: string;
  pricing: Record<string, TokenBasedPricePerMillionTokens | ImagePrice>;
}

/** Provider-specific data */
export interface Provider extends Organization {
  /** Provider's API endpoint URL */
  apiUrl: string;
  
  /** Provider's API documentation URL */
  apiDocsUrl: string;
  
  /** Whether this is a local provider */
  isLocal?: number;
  
  /** Model pricing information */
  pricing: Record<string, TokenBasedPricePerMillionTokens | ImagePrice>;
}

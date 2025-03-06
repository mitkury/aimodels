import type { TokenBasedPricePerMillionTokens, ImagePrice } from './pricing';
import type { Creator } from './creators';

/** Provider-specific data */
export interface Provider extends Creator {
  /** Provider's API endpoint URL */
  apiUrl: string;
  
  /** Provider's API documentation URL */
  apiDocsUrl: string;
  
  /** Whether this is a local provider */
  isLocal?: number;
  
  /** Model pricing information */
  pricing: Record<string, TokenBasedPricePerMillionTokens | ImagePrice>;
}

/** Source data type (what's in JSON files) */
export interface SourceProvider {
  /** Provider identifier */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Provider's API endpoint URL */
  apiUrl: string;
  
  /** Provider's API documentation URL */
  apiDocsUrl: string;
  
  /** Model pricing information */
  pricing: Record<string, TokenBasedPricePerMillionTokens | ImagePrice>;
}

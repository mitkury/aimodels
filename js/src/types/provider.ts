import type { TokenBasedPricePerMillionTokens, ImagePrice } from './pricing';
import type { Organization } from './organization';

export interface ProviderModelsEntry {
  /** ID of the creator whose models are referenced (e.g. 'openai') */
  creator: string;

  /**
   * Either 'all' to include all models from this creator,
   * or an explicit list of model IDs.
   */
  include: 'all' | string[];

  /**
   * Optional list of model IDs from this creator to exclude when include is 'all'.
   */
  exclude?: string[];
}

export interface ProviderSource {
  id: string;
  apiUrl: string;
  apiDocsUrl: string;
  pricing: Record<string, TokenBasedPricePerMillionTokens | ImagePrice>;
  models?: ProviderModelsEntry[];
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

  /** Optional model mappings describing which creators' models this provider exposes */
  models?: ProviderModelsEntry[];
}

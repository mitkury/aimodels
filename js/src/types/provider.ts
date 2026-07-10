import type { TokenBasedPricePerMillionTokens, ImagePrice } from './pricing';

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

  /** Prefix added to canonical model IDs for this provider (for example `openai/`). */
  idPrefix?: string;

  /** Explicit canonical-to-provider model ID overrides. */
  idOverrides?: Record<string, string>;
}

export interface ProviderSource {
  id: string;
  name: string;
  apiUrl?: string;
  apiDocsUrl?: string;
  pricing: Record<string, TokenBasedPricePerMillionTokens | ImagePrice>;
  models?: ProviderModelsEntry[];
}

/** Public provider data, optionally enriched with organization metadata. */
export interface Provider extends ProviderSource {
  /** Organization website when the provider has a matching organization record. */
  websiteUrl?: string;

  /** Organization country when known. */
  country?: string;

  /** Organization founding year when known. */
  founded?: number;

  /** Whether this is a local provider */
  isLocal?: number;
}

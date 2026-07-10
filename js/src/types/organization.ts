/** Organization data as stored in the keyed source map. */
export interface OrganizationSource {
  /** Display name (e.g., "OpenAI", "Meta", "Anthropic") */
  name: string;
  
  /** Organization's main website URL */
  websiteUrl: string;
  
  /** Organization's country of origin */
  country: string;
  
  /** Year founded */
  founded: number;
}

/** Public organization data with its keyed identifier restored. */
export interface Organization extends OrganizationSource {
  /** Unique identifier (e.g., "openai", "meta", "anthropic") */
  id: string;
}

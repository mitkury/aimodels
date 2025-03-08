/** Core organization data */
export interface Creator {
  /** Unique identifier (e.g., "openai", "meta", "anthropic") */
  id: string;
  
  /** Display name (e.g., "OpenAI", "Meta", "Anthropic") */
  name: string;
  
  /** Organization's main website URL */
  websiteUrl: string;
  
  /** Organization's country of origin */
  country: string;
  
  /** Year founded */
  founded: number;
}
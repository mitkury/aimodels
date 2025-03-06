/** Price information for a model */
export interface ModelPrice {
  /** Price type (token, image, audio) */
  type: string;
  /** Price per million input tokens (for token-based models) */
  input?: number;
  /** Price per million output tokens (for token-based models) */
  output?: number;
  /** Price per image (for image-based models) */
  price?: number;
  /** Image size (for image-based models) */
  size?: string;
}

/** Source data types (what's in JSON files) */
export interface SourceOrganization {  
  /** Display name (e.g., "OpenAI", "Meta", "Anthropic") */
  name: string;
  
  /** Organization's main website URL */
  websiteUrl: string;
  
  /** Organization's country of origin */
  country: string;
  
  /** Year founded */
  founded: number;
}

/** API response type (what we return to users) */
export interface Organization extends SourceOrganization {
  /** Provider's API endpoint URL (if provider) */
  apiUrl?: string;
  
  /** Provider's API documentation URL (if provider) */
  apiDocsUrl?: string;
  
  /** Model pricing information (if provider) */
  pricing?: Record<string, ModelPrice>;
}

/** Provider extends SourceOrganization with provider-specific data */
export interface Provider extends SourceOrganization {
  /** Provider's API endpoint URL */
  apiUrl: string;
  
  /** Provider's API documentation URL */
  apiDocsUrl: string;
  
  /** Model pricing information */
  pricing: Record<string, ModelPrice>;
} 
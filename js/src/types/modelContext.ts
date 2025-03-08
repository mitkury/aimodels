export interface BaseContext {
  /** The type discriminator */
  type: string;
}

export interface TokenContext extends BaseContext {
  type: "token";
  /** Maximum input tokens the model can accept */
  total: number | null;
  /** Maximum tokens the model can generate in response */
  maxOutput: number | null;
  /** 
   * When set to 1, indicates the model can generate up to maxOutput tokens
   * regardless of input size (as long as input is within total limit).
   * When not set, available output tokens may be reduced based on input size.
   */
  outputIsFixed?: 1;
  /**
   * Extended capabilities beyond the standard model behavior.
   * This is a flexible object that can contain any properties or nested objects
   * related to model-specific extensions (e.g., reasoning, experimental features).
   */
  extended?: Record<string, any>;
}

export interface CharacterContext extends BaseContext {
  type: "character";
  /** Maximum input characters the model can accept */
  total: number | null;
  /** Maximum characters the model can generate in response */
  maxOutput: number | null;
}

export interface ImageContext extends BaseContext {
  type: "image";
  /** Maximum outputs per request */
  maxOutput: number;
  /** Available image sizes (e.g. "1024x1024") */
  sizes: string[];
  /** Available quality settings (e.g. "standard", "hd") */
  qualities: string[];
}

export interface AudioInputContext extends BaseContext {
  type: "audio-in";
  /** Maximum duration in seconds, null if unlimited */
  maxDuration?: number | null;
  /** Supported input formats */
  formats?: string[];
  /** Maximum file size in bytes */
  maxSize?: number | null;
}

export interface AudioOutputContext extends BaseContext {
  type: "audio-out";
  /** Maximum text length that can be converted to speech */
  maxInput?: number | null;
  /** Supported output formats */
  formats?: string[];
  /** Available voices */
  voices?: string[];
  /** Available quality settings */
  qualities?: string[];
}

export interface EmbeddingContext extends BaseContext {
  type: "embedding";
  /** Maximum input size */
  total: number;
  /** Unit of measurement for input */
  unit: "tokens" | "characters";
  /** Size of output embedding vectors */
  dimensions: number;
  /** Type of embeddings produced */
  embeddingType?: "text" | "image" | "audio" | "multimodal";
  /** Normalization of output vectors */
  normalized?: boolean;
}

export type ModelContext = 
  | TokenContext 
  | CharacterContext 
  | ImageContext 
  | AudioInputContext 
  | AudioOutputContext 
  | EmbeddingContext;
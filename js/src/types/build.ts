import type { Creator } from './creators.ts';
import type { Provider } from './providers.ts';
import type { Model } from './models.ts';

/** Build process configuration */
export interface BuildConfig {
  /** Source data directory */
  dataDir: string;
  /** Output directory */
  outputDir: string;
  /** Whether to validate data */
  validate: boolean;
}

/** Build process result */
export interface BuildResult {
  /** Built models */
  models: Record<string, Model>;
  /** Built providers */
  providers: Record<string, Provider>;
  /** Built creators */
  creators: Record<string, Creator>;
  /** Build errors */
  errors: BuildError[];
}

/** Build process error */
export interface BuildError {
  /** Error type */
  type: 'validation' | 'missing' | 'invalid' | 'merge';
  /** Error message */
  message: string;
  /** Error location */
  location?: string;
  /** Error details */
  details?: unknown;
}

/** Data validation result */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Validation errors */
  errors: ValidationError[];
}

/** Data validation error */
export interface ValidationError {
  /** Error type */
  type: 'schema' | 'relationship' | 'required' | 'format';
  /** Error message */
  message: string;
  /** Error path */
  path: string;
  /** Error value */
  value?: unknown;
}

/** Data merging result */
export interface MergeResult {
  /** Merged models */
  models: Record<string, Model>;
  /** Merged providers */
  providers: Record<string, Provider>;
  /** Merged creators */
  creators: Record<string, Creator>;
  /** Merge errors */
  errors: MergeError[];
}

/** Data merging error */
export interface MergeError {
  /** Error type */
  type: 'duplicate' | 'missing' | 'invalid' | 'conflict';
  /** Error message */
  message: string;
  /** Error location */
  location: string;
  /** Error details */
  details?: unknown;
} 
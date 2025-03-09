import { Capability } from "./capabilities";
import { ModelContext } from "./modelContext";

/**
 * Represents the raw model data exactly as it appears in the source files.
 * This is a direct representation of the JSON structure.
 */
export interface ModelSource {
  /** Unique identifier */
  id: string;
  /** Display name */
  name?: string;
  /** Model capabilities */
  capabilities?: Capability[];
  /** Available providers */
  providerIds?: string[];
  /** Context window information */
  context?: ModelContext;
  /** Organization that created this model */
  creatorId?: string;
  /** License type (e.g., "proprietary", "apache-2.0", "llama-2-community") */
  license?: string;
  /** Languages the model knows */
  languages?: string[];
  /** Alternative identifiers for this model */
  aliases?: string[];
  /** Base model ID this model extends */
  extends?: string;
  /** Properties that override the base model */
  overrides?: Partial<Omit<ModelSource, 'id' | 'extends' | 'overrides'>>;
} 
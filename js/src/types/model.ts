import { Capability } from "./capabilities";
import { ModelContext } from "./modelContext";

export interface Model {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Model capabilities */
  can: Capability[];
  /** Available providers */
  providers: string[];
  /** Context window information */
  context: ModelContext;
  /** Organization that created this model */
  creator: string;
  /** License type (e.g., "proprietary", "apache-2.0", "llama-2-community") */
  license: string;
  /** Languages the model knows */
  languages?: string[];
  /** Alternative identifiers for this model */
  aliases?: string[];
  /** Base model ID this model extends */
  extends?: string;
  /** Properties that override the base model */
  overrides?: Partial<Omit<Model, 'id' | 'extends' | 'overrides'>>;
}
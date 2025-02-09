/**
 * Defines all possible model capabilities
 */
export type Capability =
  | "chat"         // shortcut for "text-in" and "text-out"
  | "reason"       // when the model spends some tokens on reasoning before responding
  | "text-in"      // process text input
  | "text-out"     // output text
  | "img-in"       // understand images
  | "img-out"      // generate images
  | "sound-in"     // process audio input
  | "sound-out"    // generate audio/speech
  | "json-out"     // structured JSON output
  | "function-out" // function calling
  | "vectors-out"  // output vector embeddings


/**
 * Defines all possible model capabilities
 */
export type Capability =
  | "chat"         // shortcut for "txt-in" and "txt-out"
  | "reason"       // when the model spends some tokens on reasoning before responding
  | "txt-in"       // process text input
  | "txt-out"      // output text
  | "img-in"       // understand images
  | "img-out"      // generate images
  | "audio-in"     // process audio input
  | "audio-out"    // generate audio/speech
  | "video-in"     // process video input
  | "video-out"    // generate video
  | "json-out"     // structured JSON output
  | "fn-out"       // function calling
  | "vec-out"      // output vector embeddings


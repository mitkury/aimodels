import { z } from 'zod';

export const CapabilitySchema = z.enum([
  'chat',
  'reason',
  'txt-in',
  'txt-out',
  'img-in',
  'img-out',
  'audio-in',
  'audio-out',
  'json-out',
  'fn-out',
  'vec-out',
  'video-out',
]);

export type Capability = z.infer<typeof CapabilitySchema>;
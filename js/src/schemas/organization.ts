import { z } from 'zod';

export const OrganizationSchema = z.object({
  name: z.string(),
  websiteUrl: z.string().url(),
  country: z.string().min(2).max(3),
  founded: z.number().int().min(1000).max(3000),
});

export const OrganizationsMapSchema = z.record(z.string(), OrganizationSchema);

export type Organization = z.infer<typeof OrganizationSchema>;
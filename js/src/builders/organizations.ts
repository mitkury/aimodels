import type { Organization, SourceOrganization } from '../types/organizations';

// Import organization data from root data directory
import orgsData from '@data/orgs.json' with { type: 'json' };

/**
 * Validates a source organization object to ensure it has all required fields
 * @param raw The raw organization data to validate
 * @returns The validated organization
 * @throws Error if the data is invalid
 */
export function validateOrganization(raw: unknown): SourceOrganization {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Organization data must be an object');
  }

  const org = raw as Record<string, unknown>;

  // Validate required string fields
  const stringFields = ['id', 'name', 'websiteUrl', 'country'];
  for (const field of stringFields) {
    if (typeof org[field] !== 'string') {
      throw new Error(`Organization ${field} must be a string`);
    }
  }

  // Validate founded field is a number
  if (typeof org.founded !== 'number') {
    throw new Error('Organization founded must be a number');
  }

  // Create a properly typed object
  const validatedOrg: SourceOrganization = {
    id: org.id as string,
    name: org.name as string,
    websiteUrl: org.websiteUrl as string,
    country: org.country as string,
    founded: org.founded as number
  };

  return validatedOrg;
}

/**
 * Builds all organizations from the data directory
 * @returns Array of all organizations
 */
export function buildAllOrganizations(): Organization[] {
  try {
    // Process organizations - orgsData is an object, not an array
    return Object.entries(orgsData).map(([id, orgData]) => {
      const org = orgData as SourceOrganization;
      return {
        id: org.id || id,
        name: org.name,
        websiteUrl: org.websiteUrl,
        country: org.country,
        founded: org.founded
      };
    });
  } catch (error) {
    console.error('Error building organizations:', error);
    return [];
  }
}

/**
 * Builds the full organizations data structure.
 */
export function buildOrganizationsData(): Record<string, Organization> {
  const organizations = buildAllOrganizations();
  return Object.fromEntries(organizations.map(org => [org.id, org]));
} 
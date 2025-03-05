import { ModelCollection } from './models';
import type { Model, Provider, Organization } from './data';

describe('ModelCollection', () => {
  let collection: ModelCollection;

  beforeEach(() => {
    collection = new ModelCollection();
  });

  describe('getProviders', () => {
    it('should return all unique providers from models', () => {
      const providers = collection.getProviders();
      expect(providers).toBeInstanceOf(Array);
      expect(providers.length).toBeGreaterThan(0);
      expect(providers[0]).toHaveProperty('id');
      expect(providers[0]).toHaveProperty('name');
      expect(providers[0]).toHaveProperty('apiUrl');
      expect(providers[0]).toHaveProperty('pricing');
    });

    it('should not include duplicate providers', () => {
      const providers = collection.getProviders();
      const providerIds = providers.map(p => p.id);
      const uniqueIds = new Set(providerIds);
      expect(providerIds.length).toBe(uniqueIds.size);
    });
  });

  describe('getCreators', () => {
    it('should return all unique creators from models', () => {
      const creators = collection.getCreators();
      expect(creators).toBeInstanceOf(Array);
      expect(creators.length).toBeGreaterThan(0);
      expect(creators[0]).toHaveProperty('id');
      expect(creators[0]).toHaveProperty('name');
      expect(creators[0]).toHaveProperty('websiteUrl');
      expect(creators[0]).toHaveProperty('country');
      expect(creators[0]).toHaveProperty('founded');
    });

    it('should not include duplicate creators', () => {
      const creators = collection.getCreators();
      const creatorIds = creators.map(c => c.id);
      const uniqueIds = new Set(creatorIds);
      expect(creatorIds.length).toBe(uniqueIds.size);
    });
  });

  describe('getProvider', () => {
    it('should return a provider by ID', () => {
      const provider = collection.getProvider('openai');
      expect(provider).toBeDefined();
      expect(provider?.id).toBe('openai');
      expect(provider).toHaveProperty('name');
      expect(provider).toHaveProperty('apiUrl');
      expect(provider).toHaveProperty('pricing');
    });

    it('should return undefined for non-existent provider', () => {
      const provider = collection.getProvider('non-existent');
      expect(provider).toBeUndefined();
    });
  });

  describe('getCreator', () => {
    it('should return a creator by ID', () => {
      const creator = collection.getCreator('openai');
      expect(creator).toBeDefined();
      expect(creator?.id).toBe('openai');
      expect(creator).toHaveProperty('name');
      expect(creator).toHaveProperty('websiteUrl');
      expect(creator).toHaveProperty('country');
      expect(creator).toHaveProperty('founded');
    });

    it('should return undefined for non-existent creator', () => {
      const creator = collection.getCreator('non-existent');
      expect(creator).toBeUndefined();
    });
  });

  describe('getProvidersForModel', () => {
    it('should return providers for a specific model', () => {
      const providers = collection.getProvidersForModel('gpt-4');
      expect(providers).toBeInstanceOf(Array);
      expect(providers.length).toBeGreaterThan(0);
      expect(providers[0]).toHaveProperty('id');
      expect(providers[0]).toHaveProperty('name');
      expect(providers[0]).toHaveProperty('apiUrl');
      expect(providers[0]).toHaveProperty('pricing');
    });

    it('should return empty array for non-existent model', () => {
      const providers = collection.getProvidersForModel('non-existent');
      expect(providers).toEqual([]);
    });
  });

  describe('getCreatorForModel', () => {
    it('should return creator for a specific model', () => {
      const creator = collection.getCreatorForModel('gpt-4');
      expect(creator).toBeDefined();
      expect(creator?.id).toBe('openai');
      expect(creator).toHaveProperty('name');
      expect(creator).toHaveProperty('websiteUrl');
      expect(creator).toHaveProperty('country');
      expect(creator).toHaveProperty('founded');
    });

    it('should return undefined for non-existent model', () => {
      const creator = collection.getCreatorForModel('non-existent');
      expect(creator).toBeUndefined();
    });
  });
}); 
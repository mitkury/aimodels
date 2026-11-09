#!/usr/bin/env node
// Writes the JavaScript package's resolved catalog as JSON so the Rust tests
// can check that both packages expose the same data.
//
// Usage (after building the JavaScript package in js/):
//   node rust/scripts/export-js-catalog.mjs rust/target/js-catalog.json

import { writeFileSync } from 'node:fs';
import { models } from '../../js/dist/index.js';

const outputPath = process.argv[2];
if (!outputPath) {
  console.error('Usage: export-js-catalog.mjs <output.json>');
  process.exit(1);
}

const providerIdLookups = [];
const idLookups = {};

const exportedModels = models.map(model => {
  const providerIds = model.providerIds.map(provider => [provider, model.idFor(provider)]);
  for (const [provider, providerModelId] of providerIds) {
    providerIdLookups.push([
      provider,
      providerModelId,
      models.fromProviderId(provider, providerModelId)?.id ?? null,
    ]);
  }
  for (const key of [model.id, ...(model.aliases ?? [])]) {
    idLookups[key] = models.id(key)?.id ?? null;
  }

  return {
    id: model.id,
    name: model.name,
    creatorId: model.creatorId ?? null,
    capabilities: model.capabilities,
    context: model.context ?? null,
    license: model.license ?? null,
    languages: model.languages ?? null,
    aliases: model.aliases ?? [],
    releasedAt: model.releasedAt ?? null,
    extends: model.extends ?? null,
    providerIds,
  };
});

const minContext = {};
for (const size of [8000, 32000, 128000, 200000, 1000000]) {
  minContext[size] = models.withMinContext(size).map(model => model.id);
}

const catalog = {
  models: exportedModels,
  idLookups,
  providerIdLookups,
  minContext,
  providers: models.providers.map(provider => ({
    id: provider.id,
    name: provider.name,
    apiUrl: provider.apiUrl ?? null,
    apiDocsUrl: provider.apiDocsUrl ?? null,
    websiteUrl: provider.websiteUrl ?? null,
    country: provider.country ?? null,
    founded: provider.founded ?? null,
    pricing: Object.keys(provider.pricing ?? {}).sort(),
  })),
  activeProviders: models.activeProviders.map(provider => provider.id),
  organizations: models.organizations.map(org => ({ ...org })),
  creators: models.creators.map(org => org.id),
};

writeFileSync(outputPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Wrote ${exportedModels.length} models to ${outputPath}`);

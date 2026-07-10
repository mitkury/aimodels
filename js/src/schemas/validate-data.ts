import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ModelCollectionSchema } from './model';
import { ProviderSourceSchema } from './provider';
import { OrganizationsMapSchema } from './organization';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');
const rootDir = resolve(__dirname, '../../..');
const dataDir = resolve(rootDir, 'data');

function readJson(path: string) {
  const raw = readFileSync(path, 'utf-8');
  return JSON.parse(raw);
}

function logIssues(error: unknown) {
  try {
    // ZodError shape has `issues`, but avoid `any` here.
    const maybeIssues = (error as { issues?: unknown }).issues;
    console.error(JSON.stringify(maybeIssues ?? error, null, 2));
  } catch {
    console.error(error);
  }
}

function validateModelsDir() {
  const modelsDir = join(dataDir, 'models');
  const files = readdirSync(modelsDir).filter(f => extname(f) === '.json');
  let ok = true;
  for (const f of files) {
    const full = join(modelsDir, f);
    const data = readJson(full);
    const res = ModelCollectionSchema.safeParse(data);
    if (!res.success) {
      ok = false;
      console.error(`Schema validation failed for models file: ${f}`);
      logIssues(res.error);
    }
  }
  return ok;
}

function validateProvidersDir() {
  const providersDir = join(dataDir, 'providers');
  const files = readdirSync(providersDir).filter(f => extname(f) === '.json');
  let ok = true;
  for (const f of files) {
    const full = join(providersDir, f);
    const data = readJson(full);
    const res = ProviderSourceSchema.safeParse(data);
    if (!res.success) {
      ok = false;
      console.error(`Schema validation failed for provider file: ${f}`);
      logIssues(res.error);
    }
  }
  return ok;
}

function validateOrgsFile() {
  const orgsPath = join(dataDir, 'orgs.json');
  if (!existsSync(orgsPath)) return false;
  const data = readJson(orgsPath);
  const res = OrganizationsMapSchema.safeParse(data);
  if (!res.success) {
    console.error('Schema validation failed for orgs.json');
    logIssues(res.error);
    return false;
  }
  return true;
}

type RawModel = {
  id: string;
  aliases?: string[];
  extends?: string;
};

type RawModelCollection = {
  creator: string;
  models: RawModel[];
};

type RawProviderEntry = {
  creator: string;
  include: 'all' | string[];
  exclude?: string[];
  idPrefix?: string;
  idOverrides?: Record<string, string>;
};

type RawProvider = {
  id: string;
  models?: RawProviderEntry[];
};

function validateRelationships() {
  const orgs = readJson(join(dataDir, 'orgs.json')) as Record<string, unknown>;
  const modelFiles = readdirSync(join(dataDir, 'models')).filter(f => extname(f) === '.json');
  const providerFiles = readdirSync(join(dataDir, 'providers')).filter(f => extname(f) === '.json');
  const collections = modelFiles.map(file => ({
    file,
    data: readJson(join(dataDir, 'models', file)) as RawModelCollection,
  }));
  const providers = providerFiles.map(file => ({
    file,
    data: readJson(join(dataDir, 'providers', file)) as RawProvider,
  }));

  let ok = true;
  const fail = (message: string) => {
    ok = false;
    console.error(`Data relationship validation failed: ${message}`);
  };

  const creators = new Set(collections.map(collection => collection.data.creator));
  const modelsById = new Map<string, { creator: string; file: string; model: RawModel }>();

  for (const { file, data } of collections) {
    if (!orgs[data.creator]) {
      fail(`${file} references unknown creator '${data.creator}'`);
    }

    for (const model of data.models) {
      const existing = modelsById.get(model.id);
      if (existing) {
        fail(`duplicate model ID '${model.id}' in ${existing.file} and ${file}`);
      } else {
        modelsById.set(model.id, { creator: data.creator, file, model });
      }
    }
  }

  const identifiers = new Map<string, string>();
  for (const modelId of modelsById.keys()) identifiers.set(modelId, `model '${modelId}'`);

  for (const { model, file } of modelsById.values()) {
    if (model.extends && !modelsById.has(model.extends)) {
      fail(`${file} model '${model.id}' extends missing model '${model.extends}'`);
    }

    for (const alias of model.aliases ?? []) {
      const existing = identifiers.get(alias);
      if (existing) {
        fail(`identifier '${alias}' for model '${model.id}' collides with ${existing}`);
      } else {
        identifiers.set(alias, `alias of '${model.id}'`);
      }
    }
  }

  const visited = new Set<string>();
  const visiting = new Set<string>();
  const visitModel = (modelId: string, path: string[]) => {
    if (visited.has(modelId)) return;
    if (visiting.has(modelId)) {
      fail(`circular model inheritance: ${[...path, modelId].join(' -> ')}`);
      return;
    }

    visiting.add(modelId);
    const baseId = modelsById.get(modelId)?.model.extends;
    if (baseId && modelsById.has(baseId)) visitModel(baseId, [...path, modelId]);
    visiting.delete(modelId);
    visited.add(modelId);
  };
  for (const modelId of modelsById.keys()) visitModel(modelId, []);

  const providerIds = new Map<string, string>();
  for (const { file, data: provider } of providers) {
    const existingProvider = providerIds.get(provider.id);
    if (existingProvider) {
      fail(`duplicate provider ID '${provider.id}' in ${existingProvider} and ${file}`);
    } else {
      providerIds.set(provider.id, file);
    }

    const resolvedProviderIds = new Map<string, string>();
    for (const entry of provider.models ?? []) {
      if (!creators.has(entry.creator)) {
        fail(`${file} references unknown model creator '${entry.creator}'`);
        continue;
      }

      const creatorModels = [...modelsById.values()].filter(item => item.creator === entry.creator);
      const included = creatorModels.filter(({ model }) =>
        entry.include === 'all'
          ? !(entry.exclude ?? []).includes(model.id)
          : entry.include.includes(model.id)
      );

      for (const referencedId of [
        ...(Array.isArray(entry.include) ? entry.include : []),
        ...(entry.exclude ?? []),
        ...Object.keys(entry.idOverrides ?? {}),
      ]) {
        const referenced = modelsById.get(referencedId);
        if (!referenced) {
          fail(`${file} references missing model '${referencedId}'`);
        } else if (referenced.creator !== entry.creator) {
          fail(`${file} maps '${referencedId}' under the wrong creator '${entry.creator}'`);
        }
      }

      for (const { model } of included) {
        const resolvedId = entry.idOverrides?.[model.id] ?? `${entry.idPrefix ?? ''}${model.id}`;
        const existingModel = resolvedProviderIds.get(resolvedId);
        if (existingModel) {
          fail(
            `${file} resolves both '${existingModel}' and '${model.id}' to provider ID '${resolvedId}'`
          );
        } else {
          resolvedProviderIds.set(resolvedId, model.id);
        }
      }
    }
  }

  return ok;
}

function main() {
  let ok = true;
  ok &&= validateModelsDir();
  ok &&= validateProvidersDir();
  ok &&= validateOrgsFile();
  ok &&= validateRelationships();

  if (!ok) {
    console.error('❌ Data validation failed');
    process.exit(1);
  } else {
    console.log('✅ Data validation passed');
  }
}

main();

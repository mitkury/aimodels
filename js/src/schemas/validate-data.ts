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

function logIssues(error: any) {
  try {
    console.error(JSON.stringify(error.issues ?? error, null, 2));
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

function main() {
  let ok = true;
  ok &&= validateModelsDir();
  ok &&= validateProvidersDir();
  ok &&= validateOrgsFile();

  if (!ok) {
    console.error('❌ Data validation failed');
    process.exit(1);
  } else {
    console.log('✅ Data validation passed');
  }
}

main();
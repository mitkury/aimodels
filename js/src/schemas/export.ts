import { zodToJsonSchema } from 'zod-to-json-schema';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ModelCollectionSchema } from './model';
import { ProviderSourceSchema } from './provider';
import { OrganizationSchema } from './organization';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

function writeSchema(filename: string, schema: any) {
  writeFileSync(filename, JSON.stringify(schema, null, 2));
  console.log(`Wrote ${filename}`);
}

function main() {
  const root = resolve(__dirname, '../../..');
  const outDir = resolve(root, 'data/schemas');

  const modelJsonSchema = zodToJsonSchema(ModelCollectionSchema, {
    $refStrategy: 'none',
    target: 'jsonSchema2019-09',
    basePath: ['ModelCollection'],
  });
  writeSchema(resolve(outDir, 'model.json'), modelJsonSchema);

  const providerJsonSchema = zodToJsonSchema(ProviderSourceSchema, {
    $refStrategy: 'none',
    target: 'jsonSchema2019-09',
    basePath: ['Provider'],
  });
  writeSchema(resolve(outDir, 'provider.json'), providerJsonSchema);

  const orgJsonSchema = zodToJsonSchema(OrganizationSchema, {
    $refStrategy: 'none',
    target: 'jsonSchema2019-09',
    basePath: ['Organization'],
  });
  writeSchema(resolve(outDir, 'organization.json'), orgJsonSchema);
}

main();
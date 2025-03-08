#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync, readdirSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'module';
import { spawnSync } from 'node:child_process';

// Set up require for JSON imports
const require = createRequire(import.meta.url);

// Get current directory and project root
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const dataDir = join(rootDir, 'data');
const distDir = join(__dirname, 'dist');

// Define paths to data directories
const modelsDir = join(dataDir, 'models');
const providersDir = join(dataDir, 'providers');
const orgsFile = join(dataDir, 'orgs.json');

/**
 * Check if required directories exist
 */
function checkRequiredDirectories() {
  console.log('Checking required directories...');
  
  // Ensure dist directory exists
  if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true });
    console.log(`Created directory: ${distDir}`);
  }
  
  if (!existsSync(dataDir)) {
    console.error(`Error: Data directory not found at ${dataDir}`);
    console.error('Make sure you have the data directory in the project root.');
    process.exit(1);
  }
  
  // Check for specific required subdirectories
  const requiredSubdirs = ['models', 'providers'];
  for (const subdir of requiredSubdirs) {
    const fullPath = join(dataDir, subdir);
    if (!existsSync(fullPath)) {
      console.error(`Error: Required data subdirectory not found: ${fullPath}`);
      console.error(`Make sure the ${subdir} directory exists in the data directory.`);
      process.exit(1);
    }
  }
  
  // Check essential data file
  if (!existsSync(orgsFile)) {
    console.error(`Error: Essential data file not found: ${orgsFile}`);
    console.error('Make sure the orgs.json file exists.');
    process.exit(1);
  }
  
  console.log('✓ Data directory structure verified');
}

/**
 * Dynamically load all JSON files from a directory
 */
function loadJsonFilesFromDir(dir) {
  const files = readdirSync(dir);
  return files
    .filter(file => extname(file).toLowerCase() === '.json')
    .map(file => {
      const fullPath = join(dir, file);
      try {
        const data = require(fullPath);
        return data;
      } catch (error) {
        console.error(`Error loading ${fullPath}:`, error);
        return null;
      }
    })
    .filter(Boolean); // Remove any null entries from failed loads
}

/**
 * Build models data by dynamically loading all model JSON files
 */
function buildModelsData() {
  // Load all model data files
  const modelDataFiles = loadJsonFilesFromDir(modelsDir);
  console.log(`Found ${modelDataFiles.length} model collection files`);
  
  // Flatten all models into a single array
  const allModels = modelDataFiles.flatMap(data => 
    data.models.map(model => ({
      ...model,
      creator: data.creator
    }))
  );
  
  return allModels;
}

/**
 * Build providers data by dynamically loading all provider JSON files
 */
function buildProvidersData() {
  // Load all provider data files 
  const providerDataFiles = loadJsonFilesFromDir(providersDir);
  console.log(`Found ${providerDataFiles.length} provider files`);
  
  return {
    providers: providerDataFiles
  };
}

/**
 * Load organization data directly from orgs.json
 */
function buildOrganizationsData() {
  try {
    const orgsData = require(orgsFile);
    return orgsData;
  } catch (error) {
    console.error('Error loading organizations data:', error);
    return {};
  }
}

/**
 * Generate data for the package by dynamically loading JSON files
 */
function generateData() {
  console.log('Generating data for aimodels...');
  
  try {
    // Load data dynamically from source files
    const modelsArray = buildModelsData();
    const providersData = buildProvidersData();
    const organizations = buildOrganizationsData();
    
    // Convert models array to object with ID keys
    const modelsById = Object.fromEntries(
      modelsArray.map(model => [model.id, model])
    );
    
    // Extract providers array and convert to object with ID keys
    const providersById = Object.fromEntries(
      providersData.providers.map(provider => [provider.id, provider])
    );
    
    // Create the output data file
    const outputPath = join(distDir, 'data.js');
    
    // Format the data as a JS module
    const outputData = `// Generated by build process - do not edit directly
export const models = ${JSON.stringify(modelsById, null, 2)};
export const providers = ${JSON.stringify(providersById, null, 2)};
export const organizations = ${JSON.stringify(organizations, null, 2)};
`;
    
    // Write the data
    writeFileSync(outputPath, outputData);
    
    console.log(`Data successfully written to ${outputPath}`);
    console.log(`Generated data for ${modelsArray.length} models, ${providersData.providers.length} providers, and ${Object.keys(organizations).length} organizations`);
  } catch (error) {
    console.error('Error generating data:', error);
    throw error;
  }
}

/**
 * Copy the index.js file to the distribution directory
 */
function copyIndexFile() {
  console.log('Copying index.js to distribution directory...');
  
  // Look for src directory inside the js directory instead of at the root
  const srcIndexPath = join(__dirname, 'src/index.js');
  const distIndexPath = join(distDir, 'index.js');
  
  try {
    copyFileSync(srcIndexPath, distIndexPath);
    console.log(`✓ Copied ${srcIndexPath} to ${distIndexPath}`);
  } catch (error) {
    console.error(`Error copying index.js: ${error.message}`);
    throw error;
  }
}

/**
 * Compile TypeScript files using tsup
 */
function compileTypeScript() {
  console.log('Compiling TypeScript files...');
  
  const tsupPath = join(__dirname, 'node_modules/.bin/tsup');
  const srcFile = join(__dirname, 'src/aimodels.ts');
  
  // Check if tsup is available
  if (!existsSync(tsupPath)) {
    console.error(`Error: tsup not found at ${tsupPath}`);
    console.error('Make sure you have installed the package dependencies.');
    throw new Error('tsup not found');
  }
  
  // Run tsup to compile the TypeScript file
  const result = spawnSync(tsupPath, [
    srcFile,
    '--format', 'esm',
    '--dts',
    '--outDir', distDir  // Specify the output directory as the root dist directory
  ], {
    stdio: 'inherit',
    encoding: 'utf-8'
  });
  
  if (result.error) {
    console.error('Error running tsup:', result.error);
    throw result.error;
  }
  
  if (result.status !== 0) {
    console.error(`tsup exited with status code ${result.status}`);
    throw new Error(`tsup failed with status code ${result.status}`);
  }
  
  console.log('✓ TypeScript compilation completed');
}

/**
 * Main build function
 */
async function main() {
  console.log('Starting build process...');
  
  try {
    checkRequiredDirectories();
    generateData();
    copyIndexFile();
    compileTypeScript();
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
}); 
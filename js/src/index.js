/**
 * IMPORTANT: This file is copied as-is into the dist directory by the build script.
 * It serves as the main entry point for the package, importing data files that are
 * generated during the build process and adding them into the AIModels class.
 * 
 * DO NOT modify the imports or their paths, even if your IDE/linter complains,
 * as they are correct for the runtime environment, not the development environment.
 */

// Import the base library
import { AIModels } from './aimodels.js';

// Import the data (this file is generated during build)
import { models as modelData, providers as providerData, organizations as orgData } from './data.js';

// Create a new instance
const models = new AIModels();

// Add data to the instance
models.addData({
  models: modelData,
  providers: providerData,
  orgs: orgData
});

// Export the class, the singleton instance, and the organization data
export { AIModels, models };
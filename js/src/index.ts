// Import the data (this file is generated during build)
import { models as modelData, providers as providerData, organizations as orgData } from './data.js';

import { AIModels, models } from './aimodels.js';

// Add data to the static containers
AIModels.addStaticData({
  models: modelData,
  providers: providerData,
  orgs: orgData
});

// Export everything from the TypeScript modules
export * from './types/index.js';
export { AIModels, models }; 
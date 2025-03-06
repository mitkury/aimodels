// Import the base library
import { AIModels, creators } from './index.js';

// Import the data
import { models as modelData, providers as providerData, organizations as orgData } from './data.js';

// Inject the data into the static containers
AIModels.addData(modelData, providerData, orgData);

// Create a fresh instance with the loaded data
const models = new AIModels();

// Re-export everything
export { AIModels, models, creators };

// Optionally export the raw data if needed
export { modelData as rawModels, providerData, orgData }; 
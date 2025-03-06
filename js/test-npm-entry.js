// Import from npm-entry.js
import { models, AIModels } from './dist/npm-entry.js';

// Log model count
console.log('Models from npm-entry.js:', models.length);

// Import directly from data.js
import { models as rawModels } from './dist/data.js';

// Log raw model count
console.log('Raw models from data.js:', Object.keys(rawModels).length);

// Test AIModels.addData manually
const testModels = new AIModels();
console.log('Before add data:', testModels.length);
AIModels.addData(rawModels, {}, {});
console.log('After add data:', testModels.length); 
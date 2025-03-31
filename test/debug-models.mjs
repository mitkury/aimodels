// Test script to debug why gpt-4.5-preview isn't appearing in models.fromProvider("openai")
import { models } from '../js/dist/index.js';

// Get all OpenAI models
const openaiModels = models.fromProvider('openai');
console.log(`Found ${openaiModels.length} OpenAI models`);

// Check if gpt-4.5-preview exists at all
const all4_5Models = models.filter(m => m.id.includes('4.5'));
console.log('All models with "4.5" in their ID:');
console.log(all4_5Models.map(m => ({ 
  id: m.id, 
  name: m.name,
  providers: m.providers.map(p => p.id)
})));

// Check if the model exists in the raw data
console.log('\nChecking if gpt-4.5-preview exists in all models:');
const model = models.id('gpt-4.5-preview');
console.log(model ? 
  `Found model: ${model.id} with providers: ${model.providers.map(p => p.id).join(', ')}` : 
  'Model not found in collection');

// List all OpenAI models to see what's included
console.log('\nAll OpenAI models from fromProvider():');
const allOpenAIModels = openaiModels.map(m => m.id).sort();
console.log(allOpenAIModels);

// Check if gpt-4.5-preview is in the list
console.log('\nIs gpt-4.5-preview in the list of OpenAI models?', 
  allOpenAIModels.includes('gpt-4.5-preview') ? 'Yes' : 'No');

// Check all chat models
console.log('\nChecking all chat models:');
const chatModels = models.can('chat');
console.log(`Found ${chatModels.length} chat models`);
const chatModelIds = chatModels.map(m => m.id).sort();
console.log('\nIs gpt-4.5-preview in the list of chat models?', 
  chatModelIds.includes('gpt-4.5-preview') ? 'Yes' : 'No');

// Check OpenAI chat models
console.log('\nChecking OpenAI chat models:');
const openaiChatModels = models.fromProvider('openai').can('chat');
console.log(`Found ${openaiChatModels.length} OpenAI chat models`);
const openaiChatModelIds = openaiChatModels.map(m => m.id).sort();
console.log('OpenAI chat model IDs:', openaiChatModelIds);
console.log('\nIs gpt-4.5-preview in the list of OpenAI chat models?', 
  openaiChatModelIds.includes('gpt-4.5-preview') ? 'Yes' : 'No');

// Check GPT-4.5's capabilities
if (model) {
  console.log('\nCapabilities of gpt-4.5-preview:');
  // Check if the model has specific capabilities
  console.log('Has chat capability?', models.id('gpt-4.5-preview').can('chat'));
  console.log('Raw capabilities:', Object.keys(model.capabilities || {}));
}

// Check what provider IDs are associated with gpt-4.5-preview
console.log('\nProviders for gpt-4.5-preview:');
if (model) {
  console.log('Raw providers array:', model.providers);
  console.log('Provider IDs:', model.providers.map(p => p.id));
  console.log('Is openai in providers?', model.providers.some(p => p.id === 'openai'));
}

// Look at the raw data for the model
console.log('\nChecking data in providerIds property:');
const modelData = models.find(m => m.id === 'gpt-4.5-preview');
if (modelData) {
  console.log('Model found in collection');
  console.log('providerIds property:', modelData.providerIds);
  console.log('Is openai in providerIds?', modelData.providerIds.includes('openai'));
  console.log('Full model data:', JSON.stringify(modelData, null, 2));
}

# Model Data Maintenance Agent

## Purpose
Automated agent to keep AI model specifications current across multiple providers.

## Architecture
- **Provider-specific instances**: One agent per model creator (OpenAI, Anthropic, etc.)
- **Parent coordinator**: Orchestrates multiple agents and validates results
- **Input**: Provider documentation URLs, schemas, and existing model JSON files
- **Output**: Updated model specifications in JSON format

## Agent Capabilities
- Access documentation URLs
- Search the internet for model specifications
- Extract structured data from unstructured content
- Validate data against provided schemas
- Generate diffs between current and new data
- Return validated results to parent process

## Data Safety
- **Append-only operations**: Models cannot be deleted, only added or updated
- **Targeted updates**: Agents modify individual model entries rather than entire files
- **History preservation**: All model versions remain accessible through git history
- **Validation gates**: Multiple validation steps before changes are committed
- **Protected properties**: Certain critical fields require explicit confirmation to modify

## Workflow
1. Parent process initializes agents with required context
2. Create a new Git branch for the update session
3. Agent executes in a function-calling loop:
   - Fetch documentation from provided URLs
   - Search for additional information when needed
   - Extract model specifications
   - Validate against schema
   - Return structured results
4. Parent process validates final output
5. Changes are applied to model data files
6. On successful completion with changes:
   - Commit changes
   - Merge to main/staging branch
7. When no changes detected:
   - Commit report message
   - Leave branch unmerged for review
8. On failure or timeout:
   - Preserve work in progress
   - Log diagnostics
   - Allow manual intervention or re-run

## Error Handling
- Timeout detection for stuck agents (too many messages)
- Checkpointing to resume from last stable state
- Diagnostic information for manual review
- Re-run capability with different parameters or prompts

## Implementation
- Function-based agent API (fetch, search, validate, finish)
- Stateful to track current processing step
- Schema validation at both agent and parent levels
- Configuration per provider with relevant data sources
- Git operations integration
- Safety functions for model operations:
  - `addNewModel(modelData)`: Add a completely new model
  - `updateModelProperty(modelId, property, value)`: Update specific properties
  - `deprecateModel(provider, modelId, reason)`: Mark as deprecated rather than deleting
  - `diffModelChanges(provider, modelId, newData)`: Compare proposed changes with existing data

## Automation
- Single GitHub Actions workflow runs daily via cron schedule
- One parent process manages multiple provider agents in a single job
- Parallel processing of different providers where possible
- Consolidated report generation for all providers
- Unified notification system for failed runs or detected changes
- Single commit with all changes when successful

## Usage
```
npm run update-models --all
npm run update-models --provider=openai
npm run resume-update --provider=openai --branch=update-openai-2025-03
```

## Report Format
```json
{
  "runDate": "2025-03-18",
  "summary": {
    "providersAnalyzed": 5,
    "totalModelsAnalyzed": 108,
    "providersWithChanges": 1,
    "newModels": 2,
    "updatedModels": 3
  },
  "providers": [
    {
      "provider": "openai",
      "changesDetected": true,
      "modelsAnalyzed": 24,
      "newModels": 2,
      "updatedModels": 1,
      "status": "success"
    },
    {
      "provider": "anthropic",
      "changesDetected": false,
      "modelsAnalyzed": 6,
      "newModels": 0,
      "updatedModels": 0,
      "status": "success"
    }
  ],
  "status": "success",
  "message": "Updates found for OpenAI models"
}
``` 
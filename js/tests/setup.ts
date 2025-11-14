import dotenv from 'dotenv';

// Load environment variables from .env file at the repository root
dotenv.config();

// Helpful log so it's obvious in test output that env vars were loaded
// (Vitest only shows this once per run)
// eslint-disable-next-line no-console
console.log('Vitest: environment variables loaded from .env file');



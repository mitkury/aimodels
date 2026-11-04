import { describe, expect, it } from 'vitest';
import { models } from '../dist/index.js';

describe('November 2026 catalog refresh', () => {
  it.each([
    "gpt-6.1-terra",
    "gpt-6.1-sol",
    "gpt-6-sol",
    "gpt-6-luna",
    "claude-opus-5-5",
    "claude-sonnet-5-5",
    "claude-haiku-5-5",
    "gemini-nano-banana-2.1",
    "gemini-3.8-flash-tts",
    "gemini-3.8-flash-lite-tts",
    "google/embeddinggemma-2",
    "muse-wonder-1.0",
    "meta-models/Muse-Spark-Open-816B-A42B",
    "qwen3.8-omni-flash",
    "qwen-audio-3.1-realtime-plus",
    "embed-v5.0-pro",
    "embed-v5.0-fast",
    "rerank-v5.0-pro",
    "rerank-v5.0-fast",
    "MiniMax-M3.1-Flash",
    "mistral-large-4",
    "nvidia/nemotron-3.5-super-vl-120b-a12b",
    "nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB",
    "nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16",
    "mimo-v2.6-pro",
    "mimo-v2.6-flash",
    "mimo-v2.6-pro-ultraspeed",
    "grok-4.7",
    "grok-voice-3.0",
    "grok-voice-transcribe-2.0",
    "amazon.nova-2-5-sonic",
    "step-5-preview",
    "kimi-k3.1-pro",
    "glm-5.3-flashx"
  ])('exposes canonical model %s', (id) => {
    expect(models.id(id)?.id).toBe(id);
  });

  it.each([
    ["gpt-6.1-terra", "openrouter", "openai/gpt-6.1-terra"],
    ["gpt-6.1-sol", "openrouter", "openai/gpt-6.1-sol"],
    ["gpt-6-sol", "openrouter", "openai/gpt-6-sol"],
    ["gpt-6-luna", "openrouter", "openai/gpt-6-luna"],
    ["claude-opus-5-5", "openrouter", "anthropic/claude-opus-5.5"],
    ["claude-sonnet-5-5", "openrouter", "anthropic/claude-sonnet-5.5"],
    ["claude-haiku-5-5", "openrouter", "anthropic/claude-haiku-5.5"],
    ["gemini-4-argon", "openrouter", "google/gemini-4-argon"],
    ["gemini-nano-banana-2.1", "openrouter", "google/gemini-nano-banana-2.1"],
    ["muse-wonder-1.0", "openrouter", "meta/muse-wonder"],
    ["meta-models/Muse-Spark-Open-816B-A42B", "openrouter", "meta/muse-spark-open"],
    ["qwen3.8-omni-flash", "openrouter", "qwen/qwen3.8-omni-flash"],
    ["MiniMax-M3.1-Flash", "openrouter", "minimax/minimax-m3.1-flash"],
    ["mistral-large-4", "openrouter", "mistralai/mistral-large-4-0"],
    ["nvidia/nemotron-3.5-super-vl-120b-a12b", "openrouter", "nvidia/nemotron-3.5-super-vl"],
    ["mimo-v2.6-pro", "openrouter", "xiaomi/mimo-v2.6-pro"],
    ["mimo-v2.6-flash", "openrouter", "xiaomi/mimo-v2.6-flash"],
    ["mimo-v2.6-pro-ultraspeed", "openrouter", "xiaomi/mimo-v2.6-pro-ultraspeed"],
    ["grok-4.7", "openrouter", "x-ai/grok-4.7"],
    ["step-5-preview", "openrouter", "stepfun/step-5-preview"],
    ["kimi-k3.1-pro", "openrouter", "moonshotai/kimi-k3.1-pro"],
    ["glm-5.3-flashx", "openrouter", "z-ai/glm-5.3-flashx"],
    ["claude-opus-5-5", "bedrock", "anthropic.claude-opus-5-5"],
    ["claude-sonnet-5-5", "bedrock", "anthropic.claude-sonnet-5-5"],
    ["claude-haiku-5-5", "bedrock", "anthropic.claude-haiku-5-5"]
  ])('round-trips %s on %s', (id, provider, route) => {
    const model = models.id(id);
    expect(model).toBeDefined();
    expect(model?.idFor(provider)).toBe(route);
    expect(models.fromProviderId(provider, route)).toBe(model);
  });

  it.each([
    ["google/embeddinggemma-2", "google"],
    ["meta-models/Muse-Spark-Open-816B-A42B", "meta"],
    ["nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB", "nvidia"],
    ["nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16", "nvidia"],
    ["mimo-v2.5-pro", "xiaomi"],
    ["mimo-v2.5", "xiaomi"]
  ])('does not advertise %s on %s', (id, provider) => {
    expect(models.id(id)).toBeDefined();
    expect(models.id(id)?.idFor(provider)).toBeUndefined();
  });

  it.each([
    ["gpt-6.1-terra", 1050000, 128000],
    ["claude-haiku-5-5", 1000000, 128000],
    ["gemini-3.8-flash-tts", 8192, 16384],
    ["gemini-nano-banana-2.1", 131072, 32768],
    ["qwen-audio-3.1-realtime-plus", 262144, 16384],
    ["step-5-preview", 1000000, 64000],
    ["kimi-k3.1-pro", 1048576, 1048576],
    ["amazon.nova-2-5-sonic", 256000, 64000],
    ["nvidia/nemotron-3.5-super-vl-120b-a12b", 262144, null]
  ] as const)('preserves serving limits for %s', (id, total, maxOutput) => {
    expect(models.id(id)?.context).toEqual({ type: 'token', total, maxOutput });
  });

  it('moves the Grok rolling alias without losing the old model', () => {
    expect(models.id('grok-voice-latest')).toBe(models.id('grok-voice-3.0'));
    expect(models.id('grok-voice-think-fast-2.0')?.id).toBe('grok-voice-think-fast-2.0');
    expect(models.id('grok-voice-3.0')?.releasedAt).toBe('2026-10-14');
  });

  it('keeps documented alternate selectors and independent release dates', () => {
    expect(models.id('kimi-k3.1-pro-highspeed')).toBe(models.id('kimi-k3.1-pro'));
    expect(models.id('mistral-large-4-0')).toBe(models.id('mistral-large-4'));
    expect(models.id('kimi-k3.1-pro')?.releasedAt).toBeUndefined();
    expect(models.id('gpt-6.1-terra')?.releasedAt).toBe('2026-10-26');
    expect(models.id('gpt-6-sol')?.releasedAt).toBe('2026-09-22');
  });

  it('distinguishes proprietary API models from licensed open weights', () => {
    expect(models.id('muse-wonder-1.0')?.license).toBe('proprietary');
    expect(models.id('meta-models/Muse-Spark-Open-816B-A42B')?.license).toBe('muse-model');
    expect(models.id('mistral-large-4')?.license).toBe('mistral-ecosystem');
    expect(models.id('MiniMax-M3.1-Flash')?.license).toBe('minimax-community');
    expect(models.id('step-5-preview')?.license).toBe('stepfun-model-1.0');
    expect(models.id('kimi-k3.1-pro')?.license).toBe('proprietary');
  });

  it('does not confuse omni understanding, speech synthesis, and embeddings', () => {
    expect(models.id('qwen3.8-omni-flash')?.canHear()).toBe(true);
    expect(models.id('qwen3.8-omni-flash')?.canSpeak()).toBe(false);
    expect(models.id('gemini-3.8-flash-tts')?.canSpeak()).toBe(true);
    expect(models.id('gemini-3.8-flash-tts')?.canChat()).toBe(false);
    expect(models.id('google/embeddinggemma-2')?.context).toMatchObject({
      type: 'embedding', total: 8192, dimensions: 768
    });
    expect(models.id('embed-v5.0-fast')?.context).toEqual({
      type: 'embedding', total: 128000, dimensions: 2048, embeddingType: 'multimodal'
    });
  });
});

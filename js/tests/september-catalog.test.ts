import { describe, expect, it } from 'vitest';
import { models } from '../dist/index.js';

describe('September 2026 catalog additions', () => {
  it.each([
    "gpt-6-astra",
    "gpt-image-2.5-sunburst",
    "gpt-image-2.5-flare",
    "claude-fable-5-1",
    "claude-mythos-5-1",
    "gemini-3.8-flash",
    "gemini-3.5-transcribe",
    "gemini-3.5-transcribe-live",
    "gemini-omni-1.1-flash",
    "lyria-3.5",
    "muse-spark-1.3",
    "muse-image-1.0",
    "muse-voice-transcribe-1.0",
    "qwen3.8-max",
    "qwen3.8-max-0902",
    "qwen3.8-flash",
    "Qwen/Qwen3.8-27B",
    "Qwen/Qwen3.8-Flash-Next",
    "deepseek-v4-flash-vision-exp",
    "glm-5.3",
    "glm-5.3-flash",
    "hy4-preview",
    "parse-v5.0",
    "CohereLabs/North-Micro-Vision-Instruct",
    "MiniMax-H3-Max",
    "grok-imagine-image-2.0",
    "mistral-ocr-4-1",
    "stepaudio-2.5-chat",
    "stepaudio-2.5-realtime",
    "stepaudio-2.5-tts",
    "stepaudio-2.5-asr"
  ])('includes canonical model %s', (id) => {
    expect(models.id(id)?.id).toBe(id);
  });

  it.each([
    ["gpt-6-astra", "openrouter", "openai/gpt-6-astra"],
    ["claude-fable-5-1", "openrouter", "anthropic/claude-fable-5.1"],
    ["gemini-3.8-flash", "openrouter", "google/gemini-3.8-flash"],
    ["muse-spark-1.3", "meta", "muse-spark-1.3"],
    ["muse-spark-1.3", "openrouter", "meta/muse-spark-1.3"],
    ["Qwen/Qwen3.8-27B", "openrouter", "qwen/qwen3.8-27b"],
    ["qwen3.8-max-0902", "openrouter", "qwen/qwen3.8-max-0902"],
    ["qwen3.8-flash", "qwen", "qwen3.8-flash"],
    ["deepseek-v4-flash-vision-exp", "tencent", "deepseek/deepseek-v4-flash-vision-exp"],
    ["glm-5.3", "openrouter", "z-ai/glm-5.3"],
    ["glm-5.3-flash", "tencent", "glm-5.3-flash"],
    ["hy4-preview", "openrouter", "tencent/hy4-preview"],
    ["parse-v5.0", "cohere", "parse-v5.0"]
  ])('translates %s on %s', (id, provider, providerId) => {
    const model = models.id(id);
    expect(model?.idFor(provider)).toBe(providerId);
    expect(models.fromProviderId(provider, providerId)).toBe(model);
  });

  it.each([
    ["Qwen/Qwen3.8-27B", "qwen"],
    ["Qwen/Qwen3.8-2.4T-A95B", "qwen"],
    ["Qwen/Qwen3.8-Flash-Next", "qwen"],
    ["CohereLabs/North-Micro-Vision-Instruct", "cohere"],
    ["meta-models/Muse-Glimmer-30B", "meta"],
    ["claude-mythos-5-1", "openrouter"],
    ["qwen3.8-max-preview", "openrouter"],
    ["Qwen/Qwen3.8-Flash-Next", "openrouter"],
    ["gpt-image-2.5-sunburst", "openrouter"],
    ["gemini-3.5-transcribe", "openrouter"]
  ])('does not invent availability for %s on %s', (id, provider) => {
    const model = models.id(id);
    expect(model).toBeDefined();
    expect(model?.idFor(provider)).toBeUndefined();
  });

  it.each([
    ["gpt-6-astra", "token", 1050000, 128000],
    ["gemini-3.8-flash", "token", 1048576, 65536],
    ["deepseek-v4-flash-vision-exp", "token", 1000000, 384000],
    ["glm-5.3-flash", "token", 1000000, 128000],
    ["hy4-preview", "token", 1048576, 65536],
    ["gemini-3.5-transcribe", "audio-in", 3600, null],
    ["gemini-3.5-transcribe-live", "audio-in", null, null],
    ["stepaudio-2.5-tts", "character", 1000, null],
    ["CohereLabs/North-Micro-Vision-Instruct", "token", 8192, null],
    ["Qwen/Qwen3.8-Flash-Next", "token", 262144, null]
  ] as const)('preserves limits and units for %s', (id, type, total, maxOutput) => {
    expect(models.id(id)?.context).toEqual({ type, total, maxOutput });
  });

  it.each([
    ["glm-5.3", "glm-5.3"],
    ["glm-5.3-flash", "mit"],
    ["Qwen/Qwen3.8-27B", "apache-2.0"],
    ["Qwen/Qwen3.8-Flash-Next", "qwen-community-1.0"],
    ["muse-spark-1.3", "proprietary"]
  ])('preserves the license of %s', (id, license) => {
    expect(models.id(id)?.license).toBe(license);
  });

  it.each([
    ["gpt-image-2.5-sunburst-2026-09-08", "gpt-image-2.5-sunburst"],
    ["gpt-image-2.5-flare-2026-09-08", "gpt-image-2.5-flare"],
    ["muse-spark-1.3-contributor", "muse-spark-1.3"],
    ["mistral-ocr-latest", "mistral-ocr-4-1"],
    ["kimi-k2.7-code-highspeed", "kimi-k2.7-code"]
  ])('resolves alias %s without duplicating a model', (alias, id) => {
    expect(models.id(alias)?.id).toBe(id);
    expect(models.filter(model => model.id === alias)).toHaveLength(0);
  });

  it('does not copy unrelated modality or tool capabilities', () => {
    expect(models.id('muse-spark-1.3')?.canHear()).toBe(false);
    expect(models.id('glm-5.3')?.canSee()).toBe(false);
    expect(models.id('glm-5.3-flash')?.canSee()).toBe(true);
    expect(models.id('deepseek-v4-flash-vision-exp')?.canSee()).toBe(true);
    for (const id of ['parse-v5.0', 'mistral-ocr-4-1']) {
      expect(models.id(id)?.canChat()).toBe(false);
      expect(models.id(id)?.canCallFunctions()).toBe(false);
    }
    expect(models.id('parse-v5.0')?.canOutputJSON()).toBe(false);
    expect(models.id('mistral-ocr-4-1')?.canOutputJSON()).toBe(true);
  });

  it('preserves evidenced dates and leaves unverified dates unset', () => {
    expect(models.id('gpt-6-astra')?.releasedAt).toBe('2026-09-03');
    expect(models.id('claude-mythos-5-1')?.releasedAt).toBe('2026-09-01');
    expect(models.id('mistral-ocr-4-1')?.releasedAt).toBe('2026-07-16');
    expect(models.id('qwen3.8-max-0902')?.releasedAt).toBeUndefined();
    expect(models.id('Qwen/Qwen3.8-Flash-Next')?.releasedAt).toBeUndefined();
  });
});

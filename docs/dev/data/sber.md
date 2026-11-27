# Sber

- [Sber company history](https://www.sberbank.com/about)
- [GigaChat 4 release](https://giga.chat/blog/posts/gigachat-4)
- [GigaChat 4 model collection](https://huggingface.co/collections/ai-sage/gigachat-4)
- [GigaChat API model selection](https://developers.sber.ru/docs/ru/gigachat/models)
- [Kandinsky release](https://www.sberbank.ru/ru/sberpress/all/article?blockID=1303&lang=ru&newsID=04e81e59-e42a-4bce-b4bd-7400fc372b26&regionID=77&type=NEWS)

## November 27, 2026 audit

Sber released GigaChat 4 weights on November 26. The instruct models have
1,048,576-token windows and document conversation, reasoning mode and native
function calling. The base checkpoints document raw text completion.
The 708B models use MIT and the 37B models use Sber's
Noncommercial License for Individuals 1.0.

- [708B instruct weight upload](https://huggingface.co/ai-sage/GigaChat4-708B-A41B/commit/33095e38814d755dc5d7a14b65052176bc2a4741)
- [708B base card](https://huggingface.co/ai-sage/GigaChat4-708B-A41B-base)
- [37B instruct weight upload](https://huggingface.co/ai-sage/GigaChat4-37B-A4B/commit/1bf9a4b2b8d7d0f970e48d6458be77d49e07bcfc)
- [37B base card](https://huggingface.co/ai-sage/GigaChat4-37B-A4B-base)

The November 26 Kandinsky release includes two MIT-licensed super-resolution
checkpoints. [ImageSR](https://huggingface.co/kandinskylab/Kandinsky-ImageSR-2.0)
produces a single image at configurable dimensions. Its separately bundled
VAE uses Apache 2.0. The [video model's upstream release notes](https://github.com/kandinskylab/kandinsky-video-sr)
link to the [distilled Diffusers checkpoint](https://huggingface.co/kandinskylab/Kandinsky-6.0-VSR-2.0-distilled2steps-Diffusers)
for video-to-video upscaling. Sber's release describes Kandinsky 6.5 image and
video generation in its products. The public API docs did not establish
selectors for GigaChat 4 or Kandinsky 6.5.

# Amazon Web Services

Official sources:

- Amazon Nova 2 overview:
  https://docs.aws.amazon.com/nova/latest/nova2-userguide/what-is-nova-2.html
- Nova 2 Lite model card:
  https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-2-lite.html
- Nova 2 Sonic model card:
  https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-2-sonic.html
- Nova 2 inference IDs:
  https://docs.aws.amazon.com/nova/latest/nova2-userguide/core-inference.html
- Nova 2 tool use:
  https://docs.aws.amazon.com/nova/latest/nova2-userguide/using-tools.html

Amazon develops Nova and exposes it through Amazon Bedrock. The direct
Bedrock model IDs are canonical; geographic and global inference profile IDs
are routing identifiers, not model aliases.

Nova Multimodal Embeddings uses the direct Bedrock ID
`amazon.nova-2-multimodal-embeddings-v1:0`. Its
[request schema](https://docs.aws.amazon.com/nova/latest/userguide/embeddings-schema.html)
establishes 3,072 default dimensions (256, 384, and 1,024 are also supported),
with text, image, audio, and video inputs. The
[Bedrock card](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-amazon-nova-multimodal-embeddings.html)
establishes an October 28, 2025 launch and active availability. This older
omission was added on November 4, 2026 after verifying the missing dimensions.
The service card and request schema describe text limits with different units,
and asynchronous segmentation accepts larger media, so no single context
ceiling or normalization guarantee is recorded.

## November 2, 2026 audit

The [Nova 2.5 Sonic model card](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-2-5-sonic.html)
establishes the exact ID `amazon.nova-2-5-sonic` (no guessed version suffix),
October 5 launch, 256K context, 64K output, text/speech input and output, and
tool use. It uses InvokeModelWithBidirectionalStream, not Converse or Chat
Completions. Catalog availability does not imply every wrapper adapter supports
that speech protocol.

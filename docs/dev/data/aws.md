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

Nova Multimodal Embeddings is documented as callable, but its embedding
dimensions are not stated on the overview page. Do not add it until a
first-party source establishes the dimensions required by the catalog schema.

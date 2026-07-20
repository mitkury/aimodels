# How to architect

Keep the system easy to explain and small enough for one maintainer or AI agent
to hold in working memory.

AIModels has one catalog and two package implementations:

```text
data/ -> JavaScript package
      -> Python package
      -> downstream consumers
```

Do not create another source of truth for model identity, provider availability,
pricing, or organization metadata. Prefer validation at the data boundary over
repair logic in each consumer.

When behavior is public, keep JavaScript and Python equivalent unless the
difference is intentional and documented.

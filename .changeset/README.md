# Changesets

This folder is managed by [Changesets](https://github.com/changesets/changesets).

When you make a change that should be released, add a changeset:

```sh
npm run changeset
```

Pick the bump type (patch / minor / major) and write a short summary. Commit
the generated file in `.changeset/` with your PR. On merge to `main`, the
release workflow opens a "Version Packages" PR that consumes the changesets,
bumps the version, and updates `CHANGELOG.md`; merging that PR publishes to npm.

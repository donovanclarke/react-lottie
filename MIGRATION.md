# Migration Guide

## v1 → v2

v2 is a ground-up rewrite around React Hooks. The headline changes:

### Requires React 16.8+

The library is now hooks-based. The peer dependency is `react >= 16.8.0`.
Support for React 0.14 / 15 has been dropped.

### Imports are named (no default export)

v1 exposed the component as a default export:

```js
// v1
import Lottie from "react-lottie-wrapper";
```

v2 exposes named exports instead:

```js
// v2
import { Lottie } from "react-lottie-wrapper";
```

### `Lottie` is now the hooks component; the class lives on as `ReactLottie`

| v1                                  | v2                                                |
| ----------------------------------- | ------------------------------------------------- |
| `Lottie` (class component, default) | `Lottie` (hooks component, **recommended**)       |
| —                                   | `ReactLottie` (the legacy class, **deprecated**)  |
| —                                   | `ReactLottieWithRef` (legacy class via `forwardRef`) |

If you depended on the class component's behavior, switch to `ReactLottie`.
New code should use `Lottie`.

### `isClickToPauseDisabled` now behaves as documented

In v1 the click-to-pause logic was inverted (clicking did nothing unless the
feature was disabled). In v2, click-to-pause is **on by default** and
`isClickToPauseDisabled` turns it off, as the name implies.

## What's new in 2.1

These are additive — no action required to upgrade from 2.0.

- **Bundled TypeScript types** — no separate `@types/...` needed. Exported
  types: `LottieProps`, `LottieOptions`, `LottieEventListener`, `LottieRef`.
- **Imperative ref API** — pass a `ref` to call `play()`, `pause()`, `stop()`,
  `setSpeed()`, `setDirection()`, `goToAndStop()`, `goToAndPlay()`,
  `playSegments()`, `getDuration()`, or reach the underlying `animation`.

  ```tsx
  import { useRef } from "react";
  import { Lottie, LottieRef } from "react-lottie-wrapper";

  const ref = useRef<LottieRef>(null);
  // ...
  <Lottie ref={ref} options={options} />;
  // ref.current?.play();
  ```

- **Keyboard support** — when click-to-pause is enabled, the animation
  toggles on `Enter` / `Space` and exposes `role="button"`.

### Deprecations

- **`ReactLottie` and `ReactLottieWithRef` (the class-based API) are deprecated
  as of 2.1 and will be removed in v3.** They now emit a one-time
  development-only console warning and are marked `@deprecated` (so editors and
  `tsc` flag their use). Migrate to the hooks-based `Lottie` export — it covers
  the same props and adds an imperative `ref`.

### Note on `eventListeners`

`eventListeners` is read when the animation is created or when its identity
changes. If you pass a custom array, memoize it (e.g. `useMemo`) so it keeps a
stable identity across renders.

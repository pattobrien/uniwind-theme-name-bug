# Uniwind ThemeName Type Bug Reproduction

This repository reproduces the bug described in [uniwind issue #244](https://github.com/uni-stack/uniwind/issues/244).

## The Bug

When using TypeScript's `moduleSuffixes` option (common in React Native projects), the `ThemeName` type is not properly resolved because `config.native.d.ts` does not re-export it.

This causes `useUniwind()` to return an error-typed value for the `theme` property, breaking type safety.

## How to Reproduce

1. Clone this repo and install dependencies:

```bash
pnpm install
```

2. Run TypeScript to see the errors:

```bash
pnpm tsc --noEmit
```

You should see errors like:

```
app/_layout.tsx(21,25): error TS7053: Element implicitly has an 'any' type because expression of type 'ThemeName' can't be used to index type 'Record<"light" | "dark", NativeTheme>'.
```

## Root Cause

The issue is in the type declaration files:

**`dist/module/core/config/config.d.ts`** correctly exports `ThemeName`:
```typescript
export { type ThemeName } from './config.common';
```

**`dist/module/core/config/config.native.d.ts`** is **missing** this export.

When `moduleSuffixes: [".ios", ".android", ".native", ""]` is set in `tsconfig.json`, TypeScript resolves `./config` to `config.native.d.ts` instead of `config.d.ts`. Since `config.native.d.ts` doesn't export `ThemeName`, the type becomes unresolved.

## Key Files

- `tsconfig.json` - Contains the `moduleSuffixes` option that triggers the bug
- `app/_layout.tsx` - Demonstrates the type error when using `useUniwind()`

## Environment

- uniwind: 1.2.2
- TypeScript: ~5.9.2
- React Native: 0.81.5
- Expo: ~54.0.29

## Suggested Fix

Add the missing export to `config.native.d.ts`:

```diff
  import { Insets } from 'react-native';
  import { CSSVariables, GenerateStyleSheetsCallback } from '../types';
  import { ThemeName, UniwindConfigBuilder as UniwindConfigBuilderBase } from './config.common';
+ export { type ThemeName } from './config.common';
  declare class UniwindConfigBuilder extends UniwindConfigBuilderBase {
      // ...
  }
  export declare const Uniwind: UniwindConfigBuilder;
- export {};
```

## Workaround

Remove `moduleSuffixes` from `tsconfig.json`, or don't include `.native` in the suffixes array. However, this may break other platform-specific type resolution in React Native projects.

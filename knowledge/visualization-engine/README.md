# Universal Knowledge Visualization Engine

This directory stores the working standard for restructuring blog authoring around deterministic, interactive knowledge visualization.

## Source

- Canonical plan: [universal-knowledge-visualization-engine-v7-final.md](./universal-knowledge-visualization-engine-v7-final.md)
- Status: v7 final, no v8 planning track.
- Immediate goal: scaffold Steps 1-8 in code before extending the architecture discussion.

## Core Rule

AI describes meaning. Code decides pixels.

AI-authored content should describe:

- concept
- prerequisites
- learning path
- scene intent
- semantic objects
- state changes
- timeline intent
- invariants

AI-authored content must not generate:

- raw SVG
- arbitrary HTML or JavaScript
- CSS styles
- SVG path data
- pixel coordinates
- 3D coordinates
- camera or lighting values
- shader code
- remote URLs, iframes, or event handlers

## Blog Authoring Direction

Future technical posts should be written as a combination of prose plus validated scene manifests, not hand-authored visual snippets.

Each visual explanation should start from:

1. Concept card
2. Scene list
3. Object + State + Transition + Timeline model
4. Template-based layout
5. Invariant list
6. Static fallback
7. Deterministic interactive runtime

The authoring model should avoid per-article one-off SVGs and one-off coordinate systems. Reusable components, templates, tokens, schemas, and validators should carry the visual quality.

## MVP Scope

Only deterministic 2D runtime is in scope first.

Build first:

1. Scene schema and Zod validation
2. Design tokens and token lint
3. Component adapter contract
4. Static renderer for KV Cache
5. Concept-card invariant DSL
6. Timeline compiler
7. Motion transitions through visible state derivation
8. Scene controls

Do not build yet:

- AI authoring loop
- repair loop
- HyperFrames export
- parametric simulation
- scene3d
- generic SVG generator
- arbitrary HTML renderer
- Motion Canvas integration
- Three.js renderer

## Determinism Contract

The runtime target is:

```txt
visibleState = f(scene, compiledTimeline, timestampMs)
```

Required behavior:

- play
- pause
- step
- scrub
- replay
- jump to timestamp
- reduced-motion
- static fallback

Forbidden in adapters and render components:

- component-owned timers
- requestAnimationFrame hidden state
- Date.now
- Math.random
- mutable animation state outside the compiled timeline
- component-owned easing

## First Proof Scene

The first proof scene should be KV Cache.

Target:

- layout: `title-split-caption`
- animation model: `states`
- component focus: `MemoryStack`
- transition: append KV block
- invariant focus:
  - `preserve_existing_ids`
  - `append_only`
  - `monotonic_non_decreasing_count`

Primary success condition:

```txt
The user can scrub the KV Cache scene to any timestamp,
and the same visual state is reproduced deterministically every time.
```

## Expansion Path

After Steps 1-8 work:

1. Call Stack with `top_only_push_pop`
2. Domain registry and domain validators
3. Merkle Tree with `tree_shape`
4. Visual regression tests
5. AI authoring and repair loop
6. Closed-form 2D simulation modules
7. Scene3D registry proof

## Implementation Reminder

For any future blog/Viz work in this repo, prefer this workflow:

1. Read the canonical v7 plan.
2. Identify the exact article route and concept.
3. Draft a concept card and scene manifest before UI code.
4. Keep AI output semantic only.
5. Use registered components/templates/tokens for rendering.
6. Validate schema, invariants, timeline compilation, and deterministic scrubbing.
7. Verify static fallback, reduced motion, and responsive layout.

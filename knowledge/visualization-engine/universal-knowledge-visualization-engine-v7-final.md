# Universal Knowledge Visualization Engine — Final Implementation Plan

## 0. Status

이 문서는 최종 설계 기준이다.

더 이상 v8 문서를 만들지 않는다.

이제 목표는 문서 토론이 아니라 **Step 1~8을 실제 코드로 스캐폴딩하는 것**이다.

```txt
문서 기준: v7 final
추가 메모: simulation은 closed_form / integrated를 구분한다.
MVP: deterministic 2D runtime만 구현한다.
```

---

# 1. Project Goal

블로그 안에서 추상적인 지식을 안정적이고 인터랙티브하며 시각적으로 세련된 HTML 애니메이션으로 설명하는 엔진을 만든다.

대상 도메인:

```txt
AI / LLM / Transformer
Cryptography
Blockchain
Computer Science
Code Execution
University-level Mathematics
Topology
Physics
Chemistry
```

이 엔진은 그래프 생성기가 아니다.

목표는 다음을 시각화하는 것이다.

```txt
Object + State + Transition + Timeline
```

즉, 보이지 않는 내부 상태와 변화 과정을 눈으로 이해할 수 있게 만든다.

---

# 2. Core Philosophy

## 2.1 AI가 담당하는 것

AI는 의미만 기술한다.

```txt
concept
prerequisite
learning path
scene intent
semantic objects
state changes
timeline intent
```

## 2.2 코드가 담당하는 것

코드는 모든 실행 가능한 시각화를 책임진다.

```txt
layout
pixels
component rendering
animation execution
state interpolation
timeline compilation
geometry
camera
lighting
simulation
validation
fallback
design tokens
```

## 2.3 AI가 절대 생성하지 않는 것

```txt
raw SVG
large HTML
arbitrary JavaScript
CSS style
SVG path data
pixel coordinates
3D coordinates
Three.js code
camera values
lighting values
shader code
remote URL
iframe
event handlers
```

핵심 규칙:

```txt
AI describes meaning.
Code decides pixels.
```

---

# 3. Why Previous SVG Generation Broke

이전 방식에서 SVG가 깨진 이유는 SVG 자체가 문제가 아니라, AI가 너무 많은 저수준 책임을 맡았기 때문이다.

문제 요소:

```txt
x/y 좌표
width/height
path data
label placement
text overflow
object overlap
camera
lighting
absolute layout
```

실제 원인:

```txt
AI was responsible for pixels.
```

최종 구조에서는 AI에게 픽셀, 좌표, path, camera, lighting을 절대 맡기지 않는다.

---

# 4. Architecture

```txt
Input
  article / paper / code / concept

↓

AI: Learning Plan
  core concept
  prerequisites
  learning path
  scene list
  concept card

↓

AI: Scene Manifest
  objects
  layout template
  states
  timeline
  invariants
  no coordinates

↓

Code: Schema Validation
  Zod discriminated union

↓

Code: Domain Validation
  validate all states
  validate all transitions
  validate invariants

↓

Code: Timeline Compiler
  timeline → compiled segments

↓

Code: Visible State Derivation
  visibleState = f(scene, compiledTimeline, timestamp)

↓

Code: Layout Resolution
  scene template / graph layout / static fallback

↓

Code: Rendering
  React components
  CSS tokens
  Motion-driven transitions

↓

Blog
  MDX component

↓

Later
  AI authoring repair loop
  parametric simulation
  scene3d
  HyperFrames video export
```

---

# 5. Non-Goals

MVP에서 만들지 않는다.

```txt
generic SVG generator
PowerPoint clone
free-form diagram generator
video editor
runtime AI diagram generator
AI-generated arbitrary HTML renderer
AI-generated Three.js renderer
3D engine
HyperFrames export
parametric physics engine
```

MVP에서 만드는 것:

```txt
validated scene engine
component-based renderer
deterministic timeline compiler
state-transition visualizer
design-token based visual system
blog-integrated static/interactive scene runtime
```

---

# 6. Scene Model

모든 장면은 다음 모델을 따른다.

```txt
Object + State + Transition + Timeline
```

## 6.1 Object

객체는 정적 의미를 가진다.

예:

```txt
MemoryStack
TokenBox
GPUBox
CallStack
MerkleTree
HashNode
CaptionBox
TitleBox
```

## 6.2 Props

`props`는 정적 설정만 가진다.

```txt
label
capacity
orientation
title
static description
color role
```

## 6.3 States

`states`는 모든 가변 데이터를 가진다.

```txt
blocks
frames
txs
nodes
edges
matrix values
highlighted ids
current step
```

## 6.4 Important Rule

```txt
props = static configuration
states = mutable data
```

가변 데이터는 props에 넣지 않는다.

---

# 7. Keyed Items

모든 collection item은 안정적인 `id`를 가진다.

나쁜 예:

```json
["Token 1 KV", "Token 2 KV"]
```

좋은 예:

```json
[
  { "id": "kv1", "label": "Token 1 KV" },
  { "id": "kv2", "label": "Token 2 KV" }
]
```

이유:

```txt
React key 안정성
FLIP animation
state diff
scrub determinism
중복 label 대응
중간 삽입/삭제 대응
```

---

# 8. Scene Manifest Example

```json
{
  "schema_version": "v7",
  "scene_id": "kv_cache_004",
  "title": "K/V가 KV Cache 메모리에 저장된다",
  "domain": "ai",
  "level": "beginner",
  "animation_model": "states",

  "objects": [
    {
      "id": "title_001",
      "type": "TitleBox",
      "props": {
        "text": "KV Cache는 이전 계산을 저장하는 메모리 공간입니다"
      }
    },
    {
      "id": "gpu_001",
      "type": "GPUBox",
      "props": {
        "label": "GPU"
      }
    },
    {
      "id": "memory_001",
      "type": "MemoryStack",
      "props": {
        "label": "KV Cache",
        "capacity": 6
      }
    },
    {
      "id": "caption_001",
      "type": "CaptionBox",
      "props": {
        "text": "새 토큰이 생성될 때마다 K/V가 캐시에 추가됩니다."
      }
    }
  ],

  "layout": {
    "template": "title-split-caption",
    "slots": {
      "title": "title_001",
      "left": "gpu_001",
      "right": "memory_001",
      "caption": "caption_001"
    }
  },

  "initial_state": "initial",

  "states": [
    {
      "id": "initial",
      "objects": {
        "memory_001": {
          "blocks": [
            { "id": "kv1", "label": "Token 1 KV" },
            { "id": "kv2", "label": "Token 2 KV" },
            { "id": "kv3", "label": "Token 3 KV" }
          ]
        }
      }
    },
    {
      "id": "after_append",
      "objects": {
        "memory_001": {
          "blocks": [
            { "id": "kv1", "label": "Token 1 KV" },
            { "id": "kv2", "label": "Token 2 KV" },
            { "id": "kv3", "label": "Token 3 KV" },
            { "id": "kv4", "label": "Token 4 KV" }
          ]
        }
      }
    }
  ],

  "timeline": [
    {
      "id": "intro_title",
      "at": 0,
      "action": "fadeIn",
      "target": "title_001",
      "duration": 0.4,
      "easing": "standard"
    },
    {
      "id": "intro_gpu",
      "at": "with:prev",
      "action": "fadeIn",
      "target": "gpu_001",
      "duration": 0.4,
      "easing": "standard"
    },
    {
      "id": "highlight_memory",
      "at": "after:prev",
      "action": "highlight",
      "target": "memory_001",
      "duration": 0.5,
      "easing": "emphasized"
    },
    {
      "id": "append_kv",
      "at": "after:prev",
      "action": "transitionState",
      "to": "after_append",
      "duration": 0.6,
      "easing": "standard"
    }
  ],

  "invariants": [
    {
      "type": "preserve_existing_ids",
      "object": "memory_001",
      "collection": "blocks"
    },
    {
      "type": "append_only",
      "object": "memory_001",
      "collection": "blocks"
    },
    {
      "type": "monotonic_non_decreasing_count",
      "object": "memory_001",
      "collection": "blocks"
    }
  ]
}
```

---

# 9. Layout Strategy

## 9.1 Scene Template First

일반 장면은 named scene template을 사용한다.

```txt
title-stack-caption
title-split-caption
title-graph-caption
title-flow-caption
title-canvas-caption
title-3d-caption
```

MVP에서는 2D template만 구현한다.

```txt
title-stack-caption
title-split-caption
title-graph-caption
```

## 9.2 Relation 사용 금지

일반 배치를 `right_of`, `below`, `inside` 같은 pairwise relation으로 만들지 않는다.

relation은 다음 경우에만 허용한다.

```txt
graph edge
secondary hint
domain-specific relation
```

표준 배치는 scene template의 slot이 담당한다.

## 9.3 Layout Cycle Rule

잘못된 규칙:

```txt
graph cycle 없음
```

올바른 규칙:

```txt
layout dependency cycle 없음
```

content graph cycle은 도메인/컴포넌트가 허용하면 가능하다.

예:

```txt
state machine
feedback loop
network graph
mutual recursion
chemical reaction cycle
peer-to-peer network
```

Merkle Tree는 tree shape이 필요하므로 cycle을 거부한다.

---

# 10. Time Model

시간은 두 종류로 나눈다.

## 10.1 Discrete Progress

이산 상태 전이에 사용한다.

```ts
progress: number // 0..1
```

대상:

```txt
MemoryStack
CallStack
Queue
Mempool
MerkleTree state
MatrixGrid state
```

사용 방식:

```ts
interpolate(from, to, progress)
```

## 10.2 Physical Simulation Time

연속 물리/시뮬레이션/3D에 사용한다.

```ts
simTime: number // seconds or domain-specific unit
```

대상:

```txt
projectile_motion
wave_motion
particle_motion
electric_field
molecule vibration
orbital animation
3D parametric surface
```

사용 방식:

```ts
sampleAt({ params, simTime })
```

## 10.3 Important Rule

```txt
Normalized progress는 discrete transition에만 사용한다.
Physical simulation은 simTime을 사용한다.
```

---

# 11. Easing Rule

easing은 timeline compiler/runtime만 소유한다.

컴포넌트는 easing을 모른다.

## 11.1 Discrete Transition

```ts
rawLocalT = clamp((now - startMs) / durationMs, 0, 1)
progress = applyEasing(segment.easing, rawLocalT)
visibleState = adapter.interpolate(fromState, toState, progress)
```

## 11.2 Component Rule

```txt
interpolate는 이미 easing이 적용된 progress만 받는다.
interpolate 내부에서 easing을 적용하지 않는다.
interpolate는 MotionTokens를 받지 않는다.
```

이중 easing을 방지한다.

---

# 12. Timeline Compiler

Scene timeline은 반드시 compiled timeline으로 변환한다.

```txt
scene timeline
  ↓
CompiledTimeline
  ↓
CompiledSegment[]
  ↓
timestamp lookup
  ↓
visible state
```

## 12.1 CompiledSegment

```ts
type CompiledSegment = {
  id: string;
  startMs: number;
  endMs: number;
  action: string;
  target?: string;
  fromStateId?: string;
  toStateId?: string;
  easing: EasingToken;
  group?: string;
};
```

## 12.2 Timeline Syntax

```txt
at: 0
at: "after:prev"
at: "with:prev"
at: "after:group:<id>"
```

## 12.3 Compile Rules

```txt
after:prev
  startMs = previousSegment.endMs

with:prev
  startMs = previousSegment.startMs

after:group:<id>
  startMs = max(endMs of all segments in group)
```

`prev`는 항상 직전 단일 segment를 의미한다.

## 12.4 transitionState Rule

Scene JSON의 `transitionState`는 `to`만 가진다.

```json
{
  "action": "transitionState",
  "to": "after_append"
}
```

compiler가 내부적으로 `from`을 계산한다.

---

# 13. Animation Actions

## 13.1 Data-changing Actions

```txt
transitionState
  discrete state snapshot transition
  uses progress 0..1

runSimulation
  parametric / physical 2D simulation
  uses simTime

runScene3D
  3D simulation or parametric 3D scene
  uses simTime
```

MVP에서는 `transitionState`만 구현한다.

`runSimulation`, `runScene3D`는 타입 정의와 미래 확장 메모만 둔다.

## 13.2 Emphasis Actions

데이터를 바꾸지 않는 강조 액션:

```txt
fadeIn
fadeOut
highlight
pulse
focus
dim
connect
disconnect
focusObject
orbitTo
```

강조 액션은 상태를 변경하지 않는다.

---

# 14. Deterministic Runtime

런타임은 항상 다음 순수 모델을 따른다.

```txt
visibleState = f(scene, compiledTimeline, timestampMs)
```

지원해야 하는 동작:

```txt
play
pause
step
scrub
replay
jump to timestamp
reduced-motion
static fallback
video export later
```

금지:

```txt
component-owned timers
requestAnimationFrame inside component state
Date.now inside component adapter
Math.random inside component adapter
hidden mutable animation state
```

---

# 15. Component Adapter Contract

```ts
type DiscreteComponentAdapter<Props, State> = {
  id: string;

  propsSchema: ZodSchema<Props>;
  stateSchema: ZodSchema<State>;

  render(input: {
    props: Props;
    state: State;
    tokens: DesignTokens;
  }): ReactNode;

  diff?(from: State, to: State): VisualDiff[];

  interpolate?(input: {
    from: State;
    to: State;
    progress: number;
    diff: VisualDiff[];
  }): State;

  fallback?(input: {
    props: Props;
    state: State;
    tokens: DesignTokens;
  }): ReactNode;
};
```

## 15.1 Rules

```txt
diff must be pure.
diff output order must be deterministic.
interpolate must be pure.
interpolate receives already-eased progress.
render must not mutate state.
render must not call Date.now or Math.random.
```

## 15.2 Deterministic Diff Ordering

```txt
1. Preserve target collection order when possible.
2. For unordered collections, sort by stable id.
3. For graph edges, sort by source id, target id, edge id.
```

---

# 16. Simulation Module Contract

MVP에서는 simulation을 구현하지 않는다.

하지만 타입은 준비한다.

```ts
type SimulationModule<Params, State> = {
  id: string;

  paramsSchema: ZodSchema<Params>;
  stateSchema: ZodSchema<State>;

  timeModel: "closed_form" | "integrated";

  sampleAt(input: {
    params: Params;
    simTime: number;
  }): State;

  invariants?(params: Params): ValidationResult;

  defaultPosterFrame?: "start" | "mid" | "end";
};
```

## 16.1 Time Model

```txt
closed_form:
  sampleAt(simTime)가 O(1) random access 가능.
  scrub 자유.
  MVP 이후 첫 simulation은 closed_form만 허용.

integrated:
  0 → simTime 적분 필요.
  scrub을 위해 fixed timestep, deterministic seed, precomputed frame cache 필요.
  MVP에서는 금지.
```

## 16.2 MVP Rule

```txt
MVP simulation은 closed_form만 허용한다.
integrated simulation은 caching 설계 후 도입한다.
```

---

# 17. Scene3D Module Contract

MVP에서는 구현하지 않는다.

3D는 다음 원칙으로만 미래 확장한다.

```txt
z축이 정보를 담으면 3D.
장식이면 2D.
```

AI는 3D 좌표, camera, lighting을 생성하지 않는다.

```ts
type Scene3DModule<Params, State> = {
  id: string;

  paramsSchema: ZodSchema<Params>;
  stateSchema: ZodSchema<State>;

  sampleAt(input: {
    params: Params;
    simTime: number;
  }): State;

  render(input: {
    state: State;
    tokens: DesignTokens;
    cameraPreset: CameraPreset;
  }): ReactNode;

  cameraPresets: Record<string, CameraPreset>;

  invariants?(params: Params): ValidationResult;

  defaultPosterFrame?: "start" | "mid" | "end";
};
```

허용 camera:

```txt
front
side
top
isometric
overview
bond_angle
```

금지:

```json
{
  "camera": { "x": 1.2, "y": 3.4, "z": 5.6 }
}
```

---

# 18. Concept Card

Learning Plan은 concept card를 포함한다.

```json
{
  "topic": "KV Cache",
  "core_idea": "previous K/V tensors are reused during decoding",
  "what_changes": [
    "new K/V entries are appended per generated token"
  ],
  "what_does_not_change": [
    "previous K/V entries are reused, not recomputed"
  ],
  "common_misconceptions": [
    "KV Cache stores generated text directly",
    "KV Cache reduces memory usage"
  ]
}
```

Concept card는 단순 prompt 힌트가 아니다.

기계 검증 가능한 invariant로 컴파일해야 한다.

---

# 19. Invariant DSL

AI가 arbitrary validation code를 만들면 안 된다.

허용된 invariant DSL만 사용한다.

초기 invariant:

```txt
preserve_existing_ids
append_only
remove_only
monotonic_non_decreasing_count
monotonic_non_increasing_count
top_only_push_pop
value_range
mod_range
tree_shape
dag_shape
required_object_present
required_transition_present
forbidden_transition
```

## 19.1 KV Cache Example

```json
{
  "invariants": [
    {
      "type": "preserve_existing_ids",
      "object": "memory_001",
      "collection": "blocks"
    },
    {
      "type": "append_only",
      "object": "memory_001",
      "collection": "blocks"
    },
    {
      "type": "monotonic_non_decreasing_count",
      "object": "memory_001",
      "collection": "blocks"
    }
  ]
}
```

검증 의미:

```txt
기존 KV block id가 사라지면 실패.
기존 KV block이 새 id로 replace되면 실패.
block 개수가 줄어들면 실패 또는 경고.
```

## 19.2 Call Stack Example

```json
{
  "type": "top_only_push_pop",
  "object": "call_stack_001",
  "collection": "frames"
}
```

## 19.3 Merkle Tree Example

```json
{
  "type": "tree_shape",
  "object": "merkle_001",
  "root": "root_001"
}
```

---

# 20. Domain Validation

Domain correctness는 authoring/build time에 실행한다.

사용자 런타임에서 검사하지 않는다.

검증 대상:

```txt
all states
all transitions
all invariants
all simulation params
all graph inputs
all 3D scene specs
```

## 20.1 Domain Validator Contract

```ts
type DomainValidator<Scene> = {
  id: string;

  validateScene?(scene: Scene): ValidationResult;

  validateState?(input: {
    scene: Scene;
    stateId: string;
    state: unknown;
  }): ValidationResult;

  validateTransition?(input: {
    scene: Scene;
    fromStateId: string;
    toStateId: string;
    from: unknown;
    to: unknown;
  }): ValidationResult;

  negativeFixtures?: MisconceptionFixture[];
};
```

## 20.2 Examples

```txt
Call Stack:
  pop cannot happen before push.
  return must remove top frame only.

Merkle Tree:
  pairing order must be valid.
  root must be derived from child hashes.
  cycles are forbidden.

Finite Field:
  values must stay inside modulus.

Molecule:
  formula must be parsed.
  geometry must come from registered model/data.

Physics:
  motion must come from registered simulation.

Topology:
  deformation must not imply tearing/gluing unless explicitly explained.
```

---

# 21. Design Token Layer

시각적 세련됨은 per-scene tweaking이 아니라 design token에서 나온다.

## 21.1 Token Categories

```txt
color
type
space
radius
border
shadow
motion
theme
domain accent
semantic state color
```

## 21.2 CSS Variable Example

```css
.visual-card {
  background: var(--viz-surface);
  color: var(--viz-text-primary);
  border-radius: var(--viz-radius-lg);
  padding: var(--viz-space-6);
}
```

## 21.3 Token Lint

금지:

```txt
hardcoded color
hardcoded spacing
hardcoded radius
hardcoded shadow
hardcoded duration
hardcoded easing
```

나쁜 예:

```css
background: #111827;
padding: 23px;
border-radius: 17px;
```

허용 예외:

```txt
Math.PI
bond angle constants
simulation time step constants
normalization constants
geometry segment count
physical constants
```

예외는 simulation/domain math module 내부에만 허용한다.

3D material color도 token을 써야 한다.

---

# 22. Reduced Motion

모든 장면은 reduced-motion을 지원한다.

## 22.1 Discrete Scene

`transitionState`는 target state를 즉시 렌더한다.

```txt
from: initial
to: after_append

reduced motion:
  show after_append directly
```

## 22.2 Simulation Scene

`runSimulation`은 poster frame을 렌더한다.

기본값:

```txt
posterFrame = end
```

허용값:

```txt
start
mid
end
```

```txt
start = sampleAt(from_t)
mid   = sampleAt((from_t + to_t) / 2)
end   = sampleAt(to_t)
```

MVP에서는 simulation이 없으므로 타입과 규칙만 둔다.

## 22.3 Scene3D

3D는 poster frame + fixed cameraPreset을 보여준다.

orbit animation 없음.

---

# 23. SSR / Hydration

Next.js 블로그에서 사용할 것을 전제로 한다.

규칙:

```txt
Static fallback can render on server.
Interactive animation runs on client.
3D/WebGL must be dynamically imported with SSR disabled.
Video export must not run inside normal page render.
```

컴포넌트 구조:

```txt
<VisualSceneStatic />
<VisualSceneInteractive />
```

MDX에서는 static fallback을 먼저 보여주고, hydration 후 interactive version으로 enhance한다.

---

# 24. Security Rules

AI output은 untrusted다.

스키마 allowlist만 렌더한다.

금지 필드:

```txt
html
script
style
svgPath
eventHandler
remoteUrl
iframe
shader
threeCode
coordinates
camera
lighting
```

텍스트는 escape한다.

미디어는 trusted local asset registry에서만 로드한다.

---

# 25. Package Structure

```txt
src/visualization/
  schema/
    scene.ts
    objects.ts
    states.ts
    timeline.ts
    invariants.ts

  registry/
    componentRegistry.ts
    templateRegistry.ts
    domainRegistry.ts
    simulationRegistry.ts
    scene3dRegistry.ts

  compiler/
    validateScene.ts
    compileTimeline.ts
    deriveVisibleState.ts
    diffState.ts
    validateInvariants.ts
    resolveLayout.ts

  runtime/
    VisualScene.tsx
    VisualSceneStatic.tsx
    VisualSceneInteractive.tsx
    SceneControls.tsx
    ReducedMotionProvider.tsx

  components/
    base/
      TitleBox.tsx
      CaptionBox.tsx
    ai/
      GPUBox.tsx
      MemoryStack.tsx
      TokenBox.tsx
    code/
      StackFrame.tsx
      FunctionBox.tsx
    graph/
      HashNode.tsx
      GraphEdge.tsx

  templates/
    TitleSplitCaption.tsx
    TitleStackCaption.tsx
    TitleGraphCaption.tsx

  tokens/
    tokens.css
    tokens.ts

  fixtures/
    kv-cache-004.json

  tests/
    schema.test.ts
    timelineCompiler.test.ts
    deriveVisibleState.test.ts
    invariants.test.ts
    staticRenderer.test.tsx
```

---

# 26. MVP Scope

MVP에서는 deterministic 2D runtime만 만든다.

구현하지 않는 것:

```txt
AI authoring
repair loop
HyperFrames export
parametric simulation
scene3d
Motion Canvas
Three.js
arbitrary SVG generation
arbitrary HTML rendering
```

## 26.1 MVP Topic 1: KV Cache

```txt
layout: title-split-caption
animation_model: states
goal: MemoryStack append transition
```

Scenes:

```txt
1. Token enters the model
2. Token becomes embedding
3. Attention creates K/V
4. K/V is stored in cache
5. Next token reuses previous K/V
6. KV Cache grows and consumes memory
```

MVP에서는 먼저 1개 scene fixture만 구현해도 된다.

## 26.2 Later MVP Topic 2: Call Stack

```txt
layout: title-stack-caption
animation_model: states
goal: push/pop transition
```

## 26.3 Later MVP Topic 3: Merkle Tree

```txt
layout: title-graph-caption
animation_model: states
goal: graph layout + tree invariant
```

---

# 27. Implementation Order

## Step 1: Scene Schema + Zod Validation

구현:

```txt
schema_version
scene_id
domain
level
objects
layout template
states
initial_state
timeline
invariants
```

검증:

```txt
object id unique
object type allowlist
props schema match
state id unique
initial_state valid
timeline target valid
transitionState.to valid
no forbidden fields
```

---

## Step 2: Design Tokens + Token Lint

구현:

```txt
tokens.css
tokens.ts
color/type/space/radius/shadow/motion tokens
```

규칙:

```txt
visualization components must use tokens only.
no hardcoded colors/spacings/durations.
```

---

## Step 3: Component Adapter Contract

구현:

```txt
render
diff
interpolate
fallback
```

규칙:

```txt
diff pure
diff deterministic
interpolate pure
interpolate receives eased progress
no component-owned timers
```

---

## Step 4: Static Renderer for KV Cache

구현 컴포넌트:

```txt
TitleBox
CaptionBox
GPUBox
MemoryStack
TokenBox if needed
TitleSplitCaption template
VisualSceneStatic
```

AI 생성 없이 hand-written scene JSON fixture 사용.

---

## Step 5: Concept Card Invariant DSL

초기 구현:

```txt
preserve_existing_ids
append_only
monotonic_non_decreasing_count
top_only_push_pop
required_object_present
required_transition_present
```

KV Cache에 적용:

```txt
previous KV block IDs must be preserved.
MemoryStack block count must not decrease.
KV Cache scene appends, not replaces.
```

---

## Step 6: Timeline Compiler

구현:

```txt
at: number
after:prev
with:prev
group
after:group:<id>
duration
easing token
transitionState
CompiledSegment[]
```

규칙:

```txt
after:prev uses immediate previous segment end.
with:prev uses immediate previous segment start.
after:group:<id> waits for all grouped segments.
transitionState specifies only to.
compiler resolves from internally.
```

---

## Step 7: Motion Transitions

구현:

```txt
visibleState = f(scene, compiledTimeline, timestampMs)
```

For transitionState:

```txt
compute rawLocalT
apply easing in runtime
pass eased progress to component.interpolate
render interpolated state
```

금지:

```txt
component-owned animation timers
component-owned easing
hidden mutable animation state
```

---

## Step 8: Scene Controls

구현:

```txt
play
pause
step
scrub
replay
reduced-motion
```

성공 기준:

```txt
scrub bar를 아무 위치로 이동해도 항상 같은 visible state가 나온다.
```

---

## Step 9: Call Stack

MVP Step 1~8 성공 후 구현.

```txt
stack push/pop
top_only_push_pop invariant
TitleStackCaption template
```

---

## Step 10: Domain Registry + Domain Validators

```txt
domainRegistry.ts
validateState
validateTransition
validateScene
```

---

## Step 11: Merkle Tree

```txt
graph layout
HashNode
GraphEdge
tree_shape invariant
Merkle domain validator
```

---

## Step 12: Visual Regression Tests

```txt
static render screenshot
interactive state screenshot
reduced-motion screenshot
mobile responsive screenshot
```

---

## Step 13: AI Authoring + Repair Loop

Step 1~12 이후 구현.

```txt
generate scene
validate schema
validate domain
compile timeline
render preview
if invalid:
  send validation errors + original scene to AI
repair only invalid scene
max repair attempts: 2
manual review after failure
```

---

## Step 14: Parametric 2D Registry Proof

MVP 이후.

첫 simulation은 반드시 closed_form만 사용.

예:

```txt
projectile_motion
simple_harmonic_wave
```

금지:

```txt
n-body
collision with integration
stateful particle simulation
```

integrated simulation은 캐싱 설계 후 도입.

---

## Step 15: Scene3D Registry Proof

MVP 이후.

예:

```txt
H2O molecule
CH4 molecule
torus surface
mobius strip
```

AI는 module id + params만 선택한다.

---

# 28. Tests

필수 테스트:

```txt
schema validation tests
timeline compiler tests
deriveVisibleState tests
invariant tests
component adapter purity tests
static renderer smoke tests
reduced-motion tests
scene controls tests
token lint tests
visual regression tests
responsive render tests
```

## 28.1 Acceptance Tests

```txt
1. Same timestamp always returns same visible state.
2. Scrubbing directly to 50% equals playing to 50%.
3. Replaying from start produces same states.
4. after:prev compiles correctly.
5. with:prev compiles correctly.
6. after:group:<id> waits for all group segments.
7. Easing is applied once, only by compiler/runtime.
8. Component interpolate receives eased progress only.
9. MemoryStack append preserves previous IDs.
10. KV Cache invariant fails if old KV blocks disappear.
11. Static renderer works without client animation.
12. Reduced-motion renders target state.
13. Schema rejects arbitrary HTML/script/style/SVG path.
14. Token lint rejects hardcoded visual constants.
15. VisualSceneStatic renders on server.
```

---

# 29. Tech Stack

```txt
Next.js
React
TypeScript
Tailwind CSS
Motion
Zod
MDX
Playwright
```

Later:

```txt
Dagre / ELK
Canvas
React Three Fiber
Three.js
HyperFrames
Motion Canvas
```

MVP에서는 graph/3D/export를 우선 구현하지 않는다.

---

# 30. Final Rules

우선순위 순:

```txt
1. AI describes meaning. Code owns pixels, layout, animation execution, geometry, camera, lighting, and simulation.

2. Static renderer first. Animation second. AI authoring later.

3. Discrete transitions use progress 0..1.

4. Physical / parametric / 3D simulations use simTime.

5. Easing is owned only by the Timeline Compiler / runtime.

6. Components receive already-eased progress and must not apply easing.

7. visibleState = f(scene, compiledTimeline, timestampMs)

8. diff and interpolate must be pure and deterministic.

9. Mutable data lives in states. Props are static configuration.

10. Data changes happen through transitionState.

11. Emphasis verbs do not mutate data.

12. Concept cards compile into machine-checkable invariants when possible.

13. Standard scenes use scene templates. Relations are graph edges or secondary hints only.

14. Layout dependency cycles are forbidden. Content graph cycles are component/domain-specific.

15. Design quality comes from tokens, not per-scene tweaking.

16. Token lint applies to 2D and 3D rendering. Only simulation/domain math constants are exempt.

17. MVP simulation must be closed_form only. Integrated simulation requires cache design later.

18. Never execute AI-generated HTML, JS, SVG path, shader, Three.js, coordinates, camera, or lighting.

19. Prove deterministic KV Cache rendering first.

20. Do not continue architecture discussion before Step 1~8 are scaffolded in code.
```

---

# 31. Codex Task Summary

Implement only Step 1~8.

Do not implement AI authoring, repair loop, HyperFrames, parametric simulation, scene3d, arbitrary SVG, or arbitrary HTML rendering.

Primary success condition:

```txt
The user can scrub the KV Cache scene to any timestamp,
and the same visual state is reproduced deterministically every time.
```

If this works, the rest of the system can be extended safely.

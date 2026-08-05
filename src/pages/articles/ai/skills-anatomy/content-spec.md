# Agent Skill reconstruction

## Reader outcome

The reader should distinguish three independent axes:

- Skill: reusable procedural context and bundled resources
- Tool: callable capability with an input/output contract
- Plugin/package: installation and distribution unit

A Skill match or loaded `SKILL.md` must never be described as an authorization
grant.

## Running case

An invoice-processing Skill is discovered from metadata, loaded on demand,
reads a reference template, proposes an external write, and reaches the
host-owned policy/approval/executor/effect-evidence gates.

## Hidden transfer check

The reader should be able to diagnose a community Skill that contains a risky
script while the input PDF contains injected text and a network timeout makes
the external effect ambiguous. The correct diagnosis must separate:

1. package admission and audit,
2. document data from instructions,
3. Skill procedure from tool capability,
4. policy approval from model proposal,
5. idempotent retry from effect verification.

## Source boundary

Use the open Agent Skills specification for required fields and bundle shape.
Describe discovery, activation, sharing, and runtime behavior as client or
surface specific. Do not generalize Claude API, Claude Code, or other clients
into one registry hierarchy.

## Viz proof

`SkillLifecycleLab` must show progressive disclosure and the still-closed
permission boundary:

catalog metadata -> activation -> body load -> resource load -> action gates ->
effect evidence.

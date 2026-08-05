# Robot system verification, validation and qualification report

## 1. Why this node was added

The robotics path already explained perception, localization, planning, control, ROS 2, embedded timing, motor drives, power, braking, safety, actuators, structures and tribology. Each subsystem could be calculated or tested, but there was no owner for the final question: which exact robot configuration is proven to perform which mission, under which conditions, with which remaining uncertainty?

This is a concept gap rather than a missing-paper gap. The new node joins mission and ODD, measurable requirements, interface budgets, hazards, verification and validation, test pedigree, environment, reliability, AI TEVV, configuration control and field monitoring into one release argument.

## 2. Minimum-floor and source decision

The branch stops at probability and statistics, signals and systems, the robot top-down map and the existing subsystem evidence articles. It does not walk backward through the history of systems engineering or every cited standard.

The standalone source-article budget is zero. NASA, NIST, DLA and ISO material is used as embedded primary guidance with an explicit scope boundary. Reconstructing each handbook or standard as another visible article would add reading volume without adding the capability required by the next two public nodes.

Across category pages, concept articles remain visible. `paper-*`, `research-*` and `reference-*` articles remain searchable and directly reachable, but are hidden by default inside `선택 원문 근거`. This preserves auditability without presenting optional evidence as mandatory curriculum.

## 3. Private transfer gate

A private 50-premise release case drove coverage. It combines an indoor/outdoor mobile manipulator, people, wet floors, ramps, payload, AI perception, ROS 2, braking and environmental exposure. The public article does not print that problem. Instead, every premise maps to prose, a formula, a causal lab, an evidence boundary or a release gate.

The gate checks whether a reader can detect:

- vague needs and an undefined operating domain;
- missing units, owners, timing budgets and interface contracts;
- hazard/control confusion, dependent safety channels and copied risk scores;
- verification/validation and qualification/acceptance confusion;
- copied environmental levels, missing transition tests and lost test pedigree;
- false reliability claims from zero failures or dependent repetitions;
- offline AI metrics presented as closed-loop system safety;
- stale evidence after hardware, firmware, model or threshold changes;
- release dashboards that hide assumptions, waivers and residual risk.

## 4. Public reconstruction

The article follows twelve causal chapters:

1. mission, ConOps and ODD;
2. atomic requirements and budgets;
3. traceability and interface ownership;
4. hazard chains and risk reduction;
5. FMEA, fault trees and common cause;
6. verification, validation and evidence methods;
7. the unit-to-full-robot evidence ladder;
8. life-cycle environmental tailoring;
9. reliability, independence and confidence;
10. AI/autonomy TEVV;
11. configuration, anomaly and regression control;
12. release cases and field feedback.

It contains 24 KaTeX equations and 24 adjacent FormulaNotes. Long stop-time and verified-requirement relations are split into aligned causal rows instead of being shrunk or clipped on a 360-pixel screen. Formula annotations explain the operation in Korean, while the note states units, assumptions and what the equation cannot prove.

## 5. Viz reconstruction

Twelve mechanism-specific labs replace a repeated box-arrow pattern. Controls change the ODD envelope, requirement budget, trace graph, hazard controls, failure logic, evidence method, test level, environment sequence, reliability confidence, AI scenario distribution, regression impact or release conclusion.

Mobile inspection exposed a structural problem: plot titles and data labels occupied the same SVG coordinate space. `PlotFrame` now gives the title a real HTML header band and reserves the SVG body for the plot. Mobile plots use stable height and readable effective text, right-edge labels use explicit anchors and long graph labels are shortened rather than scaled into illegibility.

## 6. Connected repairs

The source-floor policy intentionally changed category behavior, so older power, braking and isolation tests were updated to assert the new contract: concepts visible, sources hidden by default, sources revealed after explicit expansion.

The common formula QA test was also updated for the current math-fit DOM. A remaining 360-pixel TIDA formula fell to a 0.71 scale; its timing budget and evidence intersection were split into aligned rows. The repaired formula scales are at least 0.93 on that viewport.

## 7. Verification and deployment

- Focused system-qualification suite: 7/7 passed locally.
- Connected floor, ODE, contact and system suite: 39/39 passed locally.
- Updated source-policy regression set: 36/36 passed locally.
- Formula suite: 4/4 passed locally.
- Full Playwright suite: 147/147 passed locally in 50.5 seconds.
- Public focused suite: 32/32 passed in 24.0 seconds.
- Production build passed in 19.34 seconds; the existing large-chunk warning remains.
- `cm-blog.service` is active after the 23:35:49 KST restart.
- New article, Robotics category and TIDA source routes return HTTP 200 publicly.

Repository-wide TypeScript checking still reports pre-existing diagnostics in unrelated older article Viz/spec files. No system-qualification, floor-policy or TIDA file is reported.

Public routes:

- <https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/robot-system-verification-validation-qualification>
- <https://heru.ragdoll-bigeye.ts.net/lab/blog/ai?sub=robotics>
- <https://heru.ragdoll-bigeye.ts.net/lab/blog/ai?sub=ai-foundations>

## 8. Replay with small models

A 4B model receives one premise, one exact primary-source slice, one requirement/hazard/evidence relationship, one Korean-annotated equation, one counterexample, one Viz state transition and one browser assertion. It must not decide curriculum scope or promote another historical source.

A 9B model may reconstruct one full causal chapter. Its packet includes the reader misconception, four to six source claims, a calculation boundary, a failure example, a Viz state machine, a premise subset and QA invariants.

The orchestrator retains ODD scope, severe-hazard decisions, standard applicability, source budget, cross-chapter identity, legal/conformance disclaimers, contradiction repair, browser QA and deployment. Critics explicitly attack average-only evidence, dependent samples, copied environmental levels, qualification/acceptance confusion, offline-to-system transfer and stale configuration.

## Artifacts

- Floor policy: `knowledge/authoring/foundation-floor-policy.md`
- Content spec: `src/pages/articles/ai/content-specs/robot-system-verification-validation-qualification.md`
- Article: `src/pages/articles/ai/robot-system-verification-validation-qualification.tsx`
- Viz: `src/pages/articles/ai/robot-system-verification-validation-qualification/viz/SystemQualificationLabs.tsx`
- QA: `tests/system-qualification-qa.spec.ts`
- Machine replay record: `knowledge/authoring/runs/2026-07-19-robot-system-qualification.json`

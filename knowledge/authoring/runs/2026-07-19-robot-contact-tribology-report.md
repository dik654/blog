# Robot Contact, Tribology, Lubrication, Wear and Seals authoring report

## 1. Why this layer was selected

The actuator milestone produced bearing loads, gear torque, speed, duty and temperature, but it still treated friction, grease, bearing life and sealing as catalog constants. That left no causal route from a local contact to cold-start drag, film collapse, debris, backlash growth or ingress damage.

The missing chain was therefore:

`contact pair -> local load/curvature -> pressure/deformation -> roughness/kinematics -> viscosity/film/supply -> friction/heat -> damage/debris -> seal/ingress -> staged evidence`

This is a concept layer, not a list of lubricant terms. Each chapter has to change a diagnosis or release decision.

## 2. Depth gate before public prose

A private outdoor quadruped shoulder-joint failure combined 52 premises. It mixed a strain-wave reducer, crossed-roller and input bearings, short oscillation, high-speed recovery, cold start, thermal soak, water ingress, dark debris, fretting, asymmetric contact tracks and one inadequate housing-temperature sensor.

The public article does not print this as a quiz. The scenario was used as a coverage audit: after reading the article, a reader must be able to separate each contact, compute a bounded pressure/film state, identify assumption failures, distinguish wear mechanisms and propose the next measurement or rig.

## 3. Source reconstruction and stopping decision

Four complete primary artifacts were inspected:

- Hamrock and Dowson, NASA TP-1342 (1978), all 26 pages: four film regimes, dimensionless groups, minimum-film equations and regime maps.
- Jones, NASA SP-8063 (1971), all 79 pages: friction components, five wear modes, lubrication choices, environment and test logic.
- Zaretsky, NASA TM-102575 (1990), all 12 pages: bearing geometry, operating-temperature viscosity, starvation, roughness and first-order life interpretation.
- Broitman et al., SKF RTD / Coatings 2023: complete official JATS XML, 14 original TIFF figures and nine tables. Publisher HTML/PDF returned 403, so the official publisher artifact was used rather than snippets.

Only two became standalone source pages. Hamrock-Dowson is the domain floor because equation identity and the four-regime map create a capability the concept article cannot honestly compress. SKF 2023 is the current evidence source because its three-rig ladder, adverse variants and test-condition-specific torque claims change production experiment design. NASA SP-8063 and Zaretsky remain embedded evidence. Hertz, Reynolds and Barus antecedents are cite-only; tracing further backward adds provenance, not a new executable premise.

## 4. Critical scientific repair

An early implementation combined the reduced coefficient `3.42` with exponents and groups from a different Hamrock-Dowson equation family. The result looked plausible and rendered correctly, but its identity was invalid.

The repair returned to the complete paper and preserved equation 26 as one unit:

`3.63 U^0.68 G^0.49 W^-0.073 (1 - exp(-0.68 k))`

The paper-specific relation `E' = 2E*`, minimum versus central film, and elliptical versus line-contact families are now explicit. This failure is important for small-model replay: formula coefficients, exponents, definitions and source equation number must travel in one immutable packet.

## 5. Resulting narrative and Viz grammar

The twelve causal labs follow the physical chain:

1. Inventory gear, rolling, seal and fit contacts.
2. Reshape a Hertz contact patch with load, radius and modulus.
3. Compare nominal area with roughness-scale real contact and running-in.
4. Derive entrainment, sliding, SRR, spin, reversal and dwell.
5. Move viscosity with temperature and pressure.
6. Build wedge pressure and traverse the four film regimes.
7. Calculate bounded minimum film and compare it with composite roughness.
8. Remove the fully flooded assumption through grease supply and starvation.
9. Close the friction-power-temperature-viscosity-film feedback loop.
10. Separate rating life, surface distress and wear mechanisms.
11. Trade seal drag against exclusion and contamination feedback.
12. Connect symptoms to single-contact, component and full-joint evidence.

Each lab uses the geometry appropriate to its mechanism: contact ellipses, rough profiles, speed vectors, viscosity curves, regime maps, inlet menisci, feedback loops and evidence ladders. Controls change geometry, metrics and the decision sentence. Color alone is never counted as interaction. Decorative continuous animation remains deferred until the full curriculum prose is stable.

## 6. Formula and responsive contract

The concept article contains 24 display equations and 24 adjacent FormulaNotes. Each source reconstruction contains six equations and six notes. Korean labels inside KaTeX state why an operation is present; notes preserve units, assumptions, source family and what the result does not prove.

Long expressions are split by causal role before scaling. All tested pages have zero document overflow, inner Viz scroll, raw LaTeX and English-only equation annotations at 360, 390, 768 and 1440 pixels. All twelve concept labs and both source mechanisms change a visible state.

## 7. Verification and deployment

- The connected actuator, structure, fracture, composite, tribology, floor and ODE regression passed 100/100 locally.
- The focused public suite passed 32/32 in 26.7 seconds.
- The production build passed; the existing large-chunk warning remains.
- Repository-wide TypeScript still reports pre-existing errors in unrelated articles; no contact, tribology, ODE or floor-policy file appears in the diagnostics.
- `cm-blog.service` was explicitly restarted at 22:49 KST.
- The concept, Hamrock-Dowson source, SKF source and robotics category return HTTP 200.

Public routes:

- <https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/robot-contact-tribology-lubrication-wear>
- <https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/paper-hamrock-dowson-film-regimes-1978>
- <https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/research-skf-bearing-conversion-layers-2023>

## 8. Replay with 4B and 9B models

A 4B packet owns one premise, one exact source slice, one equation identity, one Korean annotation set, one counterexample, one Viz transition and one assertion. It may not search while writing, combine formula families, lose the viscosity reference state, turn lambda into a failure oracle or generalize SKF percentages.

A 9B packet owns one complete causal section or one source evidence state. It receives prerequisites, four to six page-bound claims, state and unit conventions, derivation order, author intent, evidence type, non-transfer boundary, Viz contract and a critic checklist.

The orchestrator retains source identity, complete-artifact checks, private problem construction, premise coverage, cross-section symbols, source budget, conflict repair, screenshot criticism, connected regression and deployment. The adjacent JSON records each `observed -> inference -> decision -> verification` transition.

## Artifacts

- Content spec: `src/pages/articles/ai/content-specs/robot-contact-tribology-lubrication-wear.md`
- Concept article: `src/pages/articles/ai/robot-contact-tribology-lubrication-wear.tsx`
- Concept Viz: `src/pages/articles/ai/robot-contact-tribology-lubrication-wear/viz/TribologyLabs.tsx`
- Source specs: `src/pages/articles/ai/paper-spine/robotTribologySpecs.tsx`
- Source Viz: `src/pages/articles/ai/paper-spine/viz/TribologySourceLabs.tsx`
- QA: `tests/contact-tribology-qa.spec.ts`
- Machine ledger: `knowledge/authoring/runs/2026-07-19-robot-contact-tribology.json`

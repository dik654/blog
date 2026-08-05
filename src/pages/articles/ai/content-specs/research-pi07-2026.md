# π0.7 source reconstruction content spec

## Reader question

How can one general-purpose robot model learn from demonstrations, failed rollouts,
RL-specialist experience, human video, and multiple robot bodies without averaging
their incompatible strategies into a weak policy?

## Scope decision

- Current primary source: Physical Intelligence, `π0.7`, 2026-04-16.
- Required lineage inside this article:
  - π0.5 contributes the semantic subtask hierarchy.
  - π*0.6 contributes autonomous and RL-specialist rollout data.
  - MEM contributes compressed short-term visual history.
  - BAGEL initializes the separate 14B world model that generates visual subgoals.
- These predecessors remain source history, not mandatory standalone articles.
- Canonical reproducible floor: the separate OpenVLA 2024 reconstruction.
- Stop before the full history of VLMs, diffusion, flow matching, robot control, or
  world models. Link only the minimum internal foundations needed to calculate or
  challenge the paper.

## Private transfer question

A new mobile manipulator has four cameras, a 50 Hz controller, mixed demonstrations
from experts and beginners, failed autonomous episodes, and a new appliance task with
no action-level demonstrations. Design the minimum training and runtime contract that:

1. preserves useful bad-state coverage without imitating low-quality actions;
2. distinguishes what to do from how well and how quickly to do it;
3. uses language coaching and generated visual subgoals without claiming guaranteed
   zero-shot task mastery;
4. survives 80 ms inference latency without replaying stale actions;
5. separates evidence for seen-task dexterity, cross-embodiment transfer, and
   compositional generalization.

The published prose must provide every inference needed to answer this question, but
must not print the question as an exercise.

## Narrative sections

### 1. The failure of a task-only prompt

- Begin with two visually identical trajectories that use different speed, quality,
  mistakes, or control modes.
- Explain why behavior cloning with only a task label cannot know which behavior mode
  should be reproduced.
- Introduce context as a data disambiguation contract, not decorative prompting.

### 2. Observation, context, and action path

- Input: up to four camera views, up to six history frames per view, proprioception.
- Context: task, semantic subtask, multi-view visual subgoal, speed, quality, mistake,
  control mode.
- Blocks: Gemma 3 4B VLM, MEM-style video encoder, 860M flow-matching action expert.
- Name and cite π0.5 at the semantic-subtask sentence, MEM at the history encoder,
  and BAGEL at the separate subgoal-world-model sentence.
- Output: 50-step continuous action chunk.
- Explain block-causal attention and knowledge insulation only to the depth needed to
  trace gradients and runtime inputs.

### 3. Why mixed-quality data becomes usable

- Label low-quality demonstrations, failures, interventions, and autonomous rollouts.
- Explain metadata dropout and component dropout as the reason subsets of the prompt
  remain usable at test time.
- Separate distillation of π*0.6 specialist experience from online RL.
- Use the mixed-quality data ablation and the diverse-20-percent ablation as evidence.

### 4. Runtime is an asynchronous control loop

- High-level policy emits semantic subtasks.
- A separate BAGEL-initialized 14B world model emits multi-view subgoals; it is not
  part of the approximately 5B π0.7 policy parameter count.
- Refresh the subgoal on semantic change or every four seconds.
- VLA uses five denoising steps, predicts 50 actions, executes 15 or 25, and overlaps
  inference with real-time action chunking.
- Explain that 38 ms H100 inference is longer than one 50 Hz control tick and therefore
  requires chunking and latency-aware training rather than a faster-model slogan.

### 5. Evidence and claim boundary

- Seen dexterous tasks: compare one generalist with π*0.6 and π0.6 specialists.
- Prompt/evaluation-data ablations: show metadata and autonomous evaluation data both
  matter, especially for throughput.
- Instruction following, cross-embodiment transfer, coaching, and held-out task suites
  answer different questions.
- State the paper's own boundary: seen tasks often exceed 90%, while unseen tasks or
  unseen task-robot combinations are roughly 60-80%.
- State that the authors cannot prove every test behavior is absent from a very large,
  diverse training mixture.

## Formula plan

1. Conditional action-chunk objective.
   - Annotate recent observations, multimodal context, and 50-step action chunk in
     Korean inside KaTeX.
   - Note that the flow expert optimizes a tractable flow-matching objective rather
     than a closed-form action likelihood.
2. Classifier-free guidance direction.
   - Split conditional score and guidance correction into separate aligned lines.
   - Explain why increasing beta can strengthen the desired mode and why it can also
   push actions outside the demonstrated distribution.
   - Attribute classifier-free guidance as a reused method rather than a π0.7
     invention and keep its reported application scope to episode metadata.
3. Latency budget.
   - Show `50 Hz -> 20 ms/tick`, compare it with 38 ms inference, and explain why RTC
     and partial chunk execution are necessary.

Every display formula gets a Korean FormulaNote with operation, symbol, assumption, and
failure boundary. No raw LaTeX and no formula should need horizontal scrolling.

## Prose-to-viz plan

### Prompt contract lab

- Controls: metadata on/off, autonomous evaluation data on/off, subgoal on/off.
- State derived output: data rows that remain distinguishable, usable behavior mode,
  and the paper-supported ablation verdict.
- Goal: show why “more data” and “more context” must be paired.

### Runtime cadence lab

- Controls: inference delay 38/80/240 ms and executed chunk 15/25 steps.
- State derived output: elapsed controller ticks, stale-action margin, subgoal refresh,
  and whether RTC coverage is exceeded.
- Goal: connect transformer latency to a physical closed loop.

### Evidence boundary lab

- Controls: seen dexterity, instruction following, cross-embodiment, compositional task.
- State derived output: evaluation unit, intervention, comparison, supported claim,
  and unsupported stronger claim.
- Goal: prevent one impressive video from becoming a universal generalization claim.

## Source anchors

- Official paper PDF:
  `https://www.pi.website/download/pi07.pdf`
- Official research page:
  `https://www.pi.website/blog/pi07`
- Lineage sources:
  `https://www.pi.website/download/pi05.pdf` and
  `https://www.pi.website/download/pistar06.pdf`
- The article must cite sections III-VII, IX, X, and appendix B-D directly.

## Acceptance

- Article registry and Robot AI current source point to the article.
- Prose appears before every lab.
- Three labs change visible, semantic output.
- FormulaNote count equals display formula count.
- At 390, 768, and 1440 px: no document or lab overflow, no clipped labels, minimum
  visible lab text 12 px, and no formula scale below 0.8.
- The private transfer question can be answered from the article without opening the
  paper.

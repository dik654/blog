# OpenVLA 2024 source reconstruction content spec

## Reader question

What is the smallest open and reproducible vision-language-action system that turns one
camera image and one language instruction into physical robot commands, and which
system effects are invisible to its offline token loss?

## Scope decision

- Canonical source: OpenVLA, 2024.
- Own the paper's architecture, action tokenization, data mixture, training receipt,
  real-robot evidence, efficient adaptation, quantization, and limitations.
- Do not turn the article into an Open X-Embodiment history or an LLM serving tutorial.
- Use π0.7 as the next current source, not as evidence for OpenVLA's claims.

## Private transfer question

An OpenVLA checkpoint has 95% action-token accuracy on logged data. An int8 deployment
uses less memory but succeeds less often than bfloat16, while int4 recovers much of the
success. Determine whether the failure comes from quantization error, control cadence,
data preprocessing, or action representation, and design a closed-loop reproduction
that can distinguish them.

## Narrative sections

### 1. One image and one sentence become robot tokens

- Trace SigLIP and DINOv2 image features, two-layer projector, Llama 2 7B, action-token
  output, de-tokenization, and controller execution.
- Define VLA by the input-output contract before model names.

### 2. Continuous actions are quantized per dimension

- Clamp each action dimension to its training 1st-99th percentile range.
- Divide the interval into 256 uniform bins.
- Replace the 256 least-used Llama vocabulary entries with action tokens.
- Train next-token cross entropy on action-token positions only.
- Include one numeric quantize/dequantize receipt and state the resolution/outlier
  tradeoff.

### 3. The data mixture is part of the model

- Filter to manipulation datasets with a third-person camera and single-arm
  end-effector control.
- Reuse Octo mixture weights.
- Explain why DROID was used at 10% and removed for the final third.
- Explain Bridge no-op cleaning and the RT-2-X second-most-likely action workaround.
- Separate model architecture differences from data curation differences.

### 4. Real-robot evidence and adaptation

- 170 Bridge rollouts and 60 Google rollouts, paired initial conditions.
- OpenVLA is comparable to RT-2-X on the Google robot and better on Bridge, but the
  comparison includes different dataset sizes, visual backbones, and cleaning.
- Explain full fine-tuning, LoRA rank 32/64, trainable parameter and GPU-memory receipt.
- Keep narrow single-instruction tasks versus diverse language-conditioned tasks
  separate.

### 5. Quantization exposes the closed-loop boundary

- Show bfloat16/int8/int4 memory and Bridge success.
- Show that int8 reached only 1.2 Hz on A5000 versus a 5 Hz data/controller regime,
  while int4 reached 3 Hz.
- Use appendix blocking-control follow-up to show comparable policy quality when
  cadence is equalized.
- End with the paper's limitations: single image, no proprioceptive/history input,
  no action chunking, insufficient 50 Hz throughput, typically below 90% reliability.

## Formula plan

1. Per-dimension quantization and de-quantization.
   - Mark it as an implementation reconstruction from the paper's textual rule and
     official `ActionTokenizer`: 256 edges, 255 centers, `np.digitize`, final-index
     clipping, and reversed `vocab_size - index` token IDs.
   - Include a numeric example with range `[-1, 1]` and action `0.25`.
2. Action-position cross entropy.
   - Explain that non-action language positions do not contribute to this loss.
3. Closed-loop cadence.
   - Convert 1.2, 3, and 5 Hz to action-update intervals and show why an offline token
     metric cannot see the changed physical dynamics.

## Prose-to-viz plan

### Action token lab

- Slider for a continuous action and selector for a normal versus outlier-heavy range.
- State derived output: clipped value, bin index, replacement token, reconstructed
  action, and absolute error.

### Control cadence lab

- Precision control for bfloat16/int8/int4 and blocking/non-blocking execution.
- State derived output: VRAM, model frequency, interval, paper rollout success, and
  whether cadence is a confound.
- The blocking setting must show the appendix result rather than reusing the
  non-blocking result.

### Evidence receipt lab

- Select Bridge, Google, adaptation, or quantization.
- State derived output: trials, comparison unit, supported claim, and caveat.

## Source anchors

- Paper: `https://arxiv.org/abs/2406.09246`
- Official project/code: `https://openvla.github.io`
- Required paper locations: sections 3.1-3.5, 5.1-5.4, 6, appendices C and D.

## Acceptance

- Robot AI canonical source points to this article.
- FormulaNote count equals display formula count.
- At 390, 768, and 1440 px: no internal horizontal scroll, formula scale at least 0.8,
  no clipped control labels, and minimum lab text 12 px.
- The article distinguishes token accuracy, policy prediction quality, control cadence,
  and rollout success without collapsing them into one metric.

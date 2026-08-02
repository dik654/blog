# Top-down current-source Claude 영수증 감사

- Track: 20
- 역할 할당: 203
- 고유 article: 137
- Main current-hash ACCEPT: 36
- Closure current-hash ACCEPT: 4
- 우선 검토 역할: 199
- 전체 AI article: 304
- 전체 AI closure current-hash ACCEPT: 11
- 전체 AI closure 재검토 대상: 293

## 판정 규칙

- `completed + strict_valid + source_hash_stable`인 Claude receipt만 읽는다.
- Receipt가 기록한 SHA-256과 현재 파일 SHA-256이 같아야 한다.
- 같은 hash의 최신 판정이 `ACCEPT`여야 통과한다.
- 여러 파일을 묶은 최신 판정이 `REVISE`이면 개별 결함으로 단정하지 않고 `REVIEW_REQUIRED`로 둔다.
- Main 글과 로컬 Viz·section import closure를 별도로 판정한다.
- HTTP 500, timeout, empty result, old hash와 headerless 결과는 제외한다.

## 우선 검토

1. `ai-agents` · current · `agent-runtime-current-first` — main DRIFT, closure DRIFT
2. `computer-vision` · current · `vision-system-contracts` — main UNVERIFIED, closure UNVERIFIED
3. `document-ai` · current · `document-structure-assembly` — main DRIFT, closure DRIFT
4. `efficient-inference-on-device` · current · `on-device-llm-runtime` — main UNVERIFIED, closure UNVERIFIED
5. `generative-models` · current · `dit-flow-matching-evaluation` — main UNVERIFIED, closure UNVERIFIED
6. `knowledge-systems` · current · `research-codar-2026` — main UNVERIFIED, closure UNVERIFIED
7. `llm-architecture` · current · `llm-architecture-gallery` — main DRIFT, closure DRIFT
8. `llm-data-engine` · current · `llm-pretraining-scaling` — main DRIFT, closure DRIFT
9. `llm-disaggregated-serving` · current · `llm-disaggregated-serving` — main DRIFT, closure DRIFT
10. `llm-interpretability` · current · `llm-interpretability-frontier` — main DRIFT, closure DRIFT
11. `llm-post-training` · current · `reasoning-post-training-frontier` — main DRIFT, closure DRIFT
12. `multimodal-foundation-models` · current · `multimodal-foundation-models-current` — main UNVERIFIED, closure UNVERIFIED
13. `nlp-attention` · current · `llm-architecture-gallery` — main DRIFT, closure DRIFT
14. `open-image-video` · current · `open-image-video-models` — main DRIFT, closure DRIFT
15. `reinforcement-learning` · current · `rl-decision-system-contracts` — main UNVERIFIED, closure UNVERIFIED
16. `robot-ai` · current · `research-pi07-2026` — main ACCEPT, closure PARTIAL
17. `speech-audio` · current · `realtime-duplex-voice-systems` — main DRIFT, closure DRIFT
18. `time-series` · current · `time-series-forecasting-evaluation` — main UNVERIFIED, closure UNVERIFIED
19. `time-series-anomaly` · current · `time-series-anomaly-detection` — main UNVERIFIED, closure UNVERIFIED
20. `world-model-physical-ai` · current · `world-model-physical-ai` — main DRIFT, closure DRIFT
21. `ai-agents` · canonical · `paper-react-2022` — main UNVERIFIED, closure UNVERIFIED
22. `computer-vision` · canonical · `deformable-detr` — main DRIFT, closure DRIFT
23. `document-ai` · canonical · `paper-donut-2021` — main DRIFT, closure DRIFT
24. `efficient-inference-on-device` · canonical · `on-device-llm-runtime` — main UNVERIFIED, closure UNVERIFIED
25. `generative-models` · canonical · `diffusion-models` — main ACCEPT, closure PARTIAL
26. `knowledge-systems` · canonical · `paper-rag-2020` — main UNVERIFIED, closure UNVERIFIED
27. `llm-architecture` · canonical · `paper-transformer-2017` — main ACCEPT, closure PARTIAL
28. `llm-data-engine` · canonical · `paper-chinchilla-2022` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
29. `llm-disaggregated-serving` · canonical · `llm-disaggregated-serving` — main DRIFT, closure DRIFT
30. `llm-interpretability` · canonical · `paper-transformer-circuits-2021` — main UNVERIFIED, closure UNVERIFIED
31. `llm-post-training` · canonical · `rlhf` — main DRIFT, closure DRIFT
32. `multimodal-foundation-models` · canonical · `paper-janus-2024` — main ACCEPT, closure PARTIAL
33. `nlp-attention` · canonical · `paper-transformer-2017` — main ACCEPT, closure PARTIAL
34. `open-image-video` · canonical · `diffusion-models` — main ACCEPT, closure PARTIAL
35. `reinforcement-learning` · canonical · `paper-ppo-2017` — main DRIFT, closure DRIFT
36. `robot-ai` · canonical · `paper-openvla-2024` — main DRIFT, closure DRIFT
37. `speech-audio` · canonical · `paper-moshi-2024` — main DRIFT, closure REVIEW_REQUIRED
38. `time-series` · canonical · `paper-deepar-2017` — main UNVERIFIED, closure UNVERIFIED
39. `world-model-physical-ai` · canonical · `paper-vjepa2-2025` — main DRIFT, closure DRIFT
40. `ai-agents` · concept · `agent-devlog-patterns` — main UNVERIFIED, closure UNVERIFIED
41. `ai-agents` · concept · `agent-evaluation-trace` — main ACCEPT, closure PARTIAL
42. `ai-agents` · concept · `computer-use-agent-runtime` — main ACCEPT, closure PARTIAL
43. `ai-agents` · concept · `llm-harness` — main DRIFT, closure DRIFT
44. `ai-agents` · concept · `multi-agent-implementation` — main DRIFT, closure DRIFT
45. `ai-agents` · concept · `prompt-injection-defense` — main DRIFT, closure DRIFT
46. `ai-agents` · concept · `skills-anatomy` — main UNVERIFIED, closure UNVERIFIED
47. `computer-vision` · concept · `object-detection-systems` — main UNVERIFIED, closure UNVERIFIED
48. `computer-vision` · concept · `vision-promptable-segmentation-tracking` — main DRIFT, closure DRIFT
49. `computer-vision` · concept · `vision-representation-encoders-current` — main MISSING_REGISTRY, closure MISSING_REGISTRY
50. `document-ai` · concept · `html-table-structure-reconstruction` — main DRIFT, closure DRIFT
51. `document-ai` · concept · `ocr-document-ai-map` — main DRIFT, closure DRIFT
52. `document-ai` · concept · `olmocr-2` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
53. `document-ai` · concept · `paddleocr-vl` — main DRIFT, closure DRIFT
54. `efficient-inference-on-device` · concept · `efficient-inference-on-device` — main ACCEPT, closure PARTIAL
55. `efficient-inference-on-device` · concept · `quantization` — main ACCEPT, closure PARTIAL
56. `generative-models` · concept · `gan` — main UNVERIFIED, closure UNVERIFIED
57. `generative-models` · concept · `vae` — main UNVERIFIED, closure UNVERIFIED
58. `knowledge-systems` · concept · `knowledge-compiler` — main ACCEPT, closure PARTIAL
59. `knowledge-systems` · concept · `knowledge-ir-evidence-lineage` — main ACCEPT, closure PARTIAL
60. `knowledge-systems` · concept · `knowledge-source-ingestion` — main ACCEPT, closure PARTIAL
61. `knowledge-systems` · concept · `rag-pipeline` — main DRIFT, closure DRIFT
62. `llm-architecture` · concept · `llm-architecture-dense-transformers` — main ACCEPT, closure PARTIAL
63. `llm-architecture` · concept · `llm-architecture-hybrid-linear` — main ACCEPT, closure PARTIAL
64. `llm-architecture` · concept · `llm-architecture-kv-long-context` — main DRIFT, closure DRIFT
65. `llm-architecture` · concept · `llm-architecture-sparse-moe` — main ACCEPT, closure PARTIAL
66. `llm-architecture` · concept · `transformer-architecture` — main UNVERIFIED, closure UNVERIFIED
67. `llm-data-engine` · concept · `llm-data-engine` — main ACCEPT, closure PARTIAL
68. `llm-data-engine` · concept · `tokenizer` — main UNVERIFIED, closure UNVERIFIED
69. `llm-disaggregated-serving` · concept · `vllm-paged-attention` — main ACCEPT, closure PARTIAL
70. `llm-disaggregated-serving` · concept · `vllm-scheduler` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
71. `llm-disaggregated-serving` · concept · `vllm-serving` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
72. `llm-interpretability` · concept · `llm-interpretability-readouts` — main UNVERIFIED, closure UNVERIFIED
73. `llm-interpretability` · concept · `sparse-autoencoder` — main UNVERIFIED, closure UNVERIFIED
74. `llm-interpretability` · concept · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
75. `llm-post-training` · concept · `post-training-rlvr` — main ACCEPT, closure PARTIAL
76. `multimodal-foundation-models` · concept · `dit-flow-matching-evaluation` — main UNVERIFIED, closure UNVERIFIED
77. `multimodal-foundation-models` · concept · `multimodal-fusion-interleaved-context` — main UNVERIFIED, closure UNVERIFIED
78. `multimodal-foundation-models` · concept · `multimodal-unified-generation-objectives` — main UNVERIFIED, closure UNVERIFIED
79. `multimodal-foundation-models` · concept · `multimodal-visual-tokenization` — main UNVERIFIED, closure UNVERIFIED
80. `multimodal-foundation-models` · concept · `video-long-context-memory` — main UNVERIFIED, closure UNVERIFIED
81. `nlp-attention` · concept · `attention-theory` — main ACCEPT, closure PARTIAL
82. `nlp-attention` · concept · `lstm` — main UNVERIFIED, closure UNVERIFIED
83. `nlp-attention` · concept · `tokenizer` — main UNVERIFIED, closure UNVERIFIED
84. `nlp-attention` · concept · `transformer-architecture` — main UNVERIFIED, closure UNVERIFIED
85. `nlp-attention` · concept · `word2vec` — main UNVERIFIED, closure UNVERIFIED
86. `open-image-video` · concept · `image-model-runtime` — main ACCEPT, closure PARTIAL
87. `open-image-video` · concept · `open-model-finetuning-theory` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
88. `open-image-video` · concept · `open-model-workflow-parameters` — main ACCEPT, closure PARTIAL
89. `open-image-video` · concept · `video-model-runtime` — main DRIFT, closure DRIFT
90. `reinforcement-learning` · concept · `reasoning-post-training-frontier` — main DRIFT, closure DRIFT
91. `reinforcement-learning` · concept · `rl-imitation-offline-learning` — main DRIFT, closure DRIFT
92. `reinforcement-learning` · concept · `rl-model-based-world-models` — main ACCEPT, closure PARTIAL
93. `reinforcement-learning` · concept · `rl-pomdp-state-estimation` — main ACCEPT, closure PARTIAL
94. `reinforcement-learning` · concept · `rl-ppo-continuous-control` — main DRIFT, closure DRIFT
95. `reinforcement-learning` · concept · `rl-safe-constrained-learning` — main DRIFT, closure DRIFT
96. `robot-ai` · concept · `rl-imitation-offline-learning` — main DRIFT, closure DRIFT
97. `speech-audio` · concept · `audio-representation-neural-codecs` — main DRIFT, closure DRIFT
98. `speech-audio` · concept · `native-speech-generation` — main DRIFT, closure DRIFT
99. `speech-audio` · concept · `speech-recognition-objectives` — main DRIFT, closure DRIFT
100. `time-series` · concept · `arima` — main UNVERIFIED, closure UNVERIFIED
101. `time-series` · concept · `time-features` — main UNVERIFIED, closure UNVERIFIED
102. `time-series` · concept · `transformer-architecture` — main UNVERIFIED, closure UNVERIFIED
103. `time-series-anomaly` · concept · `ecod` — main UNVERIFIED, closure UNVERIFIED
104. `time-series-anomaly` · concept · `time-features` — main UNVERIFIED, closure UNVERIFIED
105. `world-model-physical-ai` · concept · `action-conditioned-world-dynamics` — main DRIFT, closure DRIFT
106. `world-model-physical-ai` · concept · `predictive-world-representations` — main DRIFT, closure DRIFT
107. `world-model-physical-ai` · concept · `world-model-planning-closed-loop` — main DRIFT, closure DRIFT
108. `ai-agents` · foundation · `agentic-patterns` — main ACCEPT, closure PARTIAL
109. `ai-agents` · foundation · `context-engineering` — main ACCEPT, closure PARTIAL
110. `ai-agents` · foundation · `mcp-protocol` — main UNVERIFIED, closure UNVERIFIED
111. `ai-agents` · foundation · `prompt-engineering` — main UNVERIFIED, closure UNVERIFIED
112. `ai-agents` · foundation · `xml-prompting` — main UNVERIFIED, closure UNVERIFIED
113. `computer-vision` · foundation · `clip-vision-language-model` — main UNVERIFIED, closure UNVERIFIED
114. `computer-vision` · foundation · `cnn` — main UNVERIFIED, closure UNVERIFIED
115. `computer-vision` · foundation · `linear-algebra-tensors` — main DRIFT, closure REVIEW_REQUIRED
116. `computer-vision` · foundation · `resnet` — main UNVERIFIED, closure UNVERIFIED
117. `computer-vision` · foundation · `signals-systems-convolution` — main DRIFT, closure DRIFT
118. `computer-vision` · foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
119. `computer-vision` · foundation · `vision-transformer` — main UNVERIFIED, closure UNVERIFIED
120. `document-ai` · foundation · `clip-vision-language-model` — main UNVERIFIED, closure UNVERIFIED
121. `document-ai` · foundation · `post-training-rlvr` — main ACCEPT, closure PARTIAL
122. `document-ai` · foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
123. `efficient-inference-on-device` · foundation · `linear-algebra-tensors` — main DRIFT, closure REVIEW_REQUIRED
124. `efficient-inference-on-device` · foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
125. `generative-models` · foundation · `calculus-computational-graphs` — main DRIFT, closure REVIEW_REQUIRED
126. `generative-models` · foundation · `differential-equations-phase-plane-numerical-integration` — main ACCEPT, closure PARTIAL
127. `generative-models` · foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
128. `knowledge-systems` · foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
129. `knowledge-systems` · foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
130. `llm-architecture` · foundation · `calculus-computational-graphs` — main DRIFT, closure REVIEW_REQUIRED
131. `llm-architecture` · foundation · `differential-equations-phase-plane-numerical-integration` — main ACCEPT, closure PARTIAL
132. `llm-architecture` · foundation · `linear-algebra-tensors` — main DRIFT, closure REVIEW_REQUIRED
133. `llm-architecture` · foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
134. `llm-architecture` · foundation · `signals-systems-convolution` — main DRIFT, closure DRIFT
135. `llm-data-engine` · foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
136. `llm-data-engine` · foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
137. `llm-disaggregated-serving` · foundation · `linear-algebra-tensors` — main DRIFT, closure REVIEW_REQUIRED
138. `llm-disaggregated-serving` · foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
139. `llm-interpretability` · foundation · `linear-algebra-tensors` — main DRIFT, closure REVIEW_REQUIRED
140. `llm-interpretability` · foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
141. `llm-interpretability` · foundation · `transformer-architecture` — main UNVERIFIED, closure UNVERIFIED
142. `llm-post-training` · foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
143. `llm-post-training` · foundation · `rl-ppo-continuous-control` — main DRIFT, closure DRIFT
144. `llm-post-training` · foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
145. `multimodal-foundation-models` · foundation · `clip-vision-language-model` — main UNVERIFIED, closure UNVERIFIED
146. `multimodal-foundation-models` · foundation · `diffusion-models` — main ACCEPT, closure PARTIAL
147. `multimodal-foundation-models` · foundation · `transformer-architecture` — main UNVERIFIED, closure UNVERIFIED
148. `multimodal-foundation-models` · foundation · `vae` — main UNVERIFIED, closure UNVERIFIED
149. `multimodal-foundation-models` · foundation · `vision-transformer` — main UNVERIFIED, closure UNVERIFIED
150. `nlp-attention` · foundation · `linear-algebra-tensors` — main DRIFT, closure REVIEW_REQUIRED
151. `nlp-attention` · foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
152. `open-image-video` · foundation · `dit-flow-matching-evaluation` — main UNVERIFIED, closure UNVERIFIED
153. `open-image-video` · foundation · `linear-algebra-tensors` — main DRIFT, closure REVIEW_REQUIRED
154. `open-image-video` · foundation · `signals-systems-convolution` — main DRIFT, closure DRIFT
155. `reinforcement-learning` · foundation · `calculus-computational-graphs` — main DRIFT, closure REVIEW_REQUIRED
156. `reinforcement-learning` · foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
157. `reinforcement-learning` · foundation · `rl-mdp-bellman` — main DRIFT, closure DRIFT
158. `reinforcement-learning` · foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
159. `robot-ai` · foundation · `linear-algebra-tensors` — main DRIFT, closure REVIEW_REQUIRED
160. `robot-ai` · foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
161. `robot-ai` · foundation · `signals-systems-convolution` — main DRIFT, closure DRIFT
162. `speech-audio` · foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
163. `speech-audio` · foundation · `signals-systems-convolution` — main DRIFT, closure DRIFT
164. `time-series` · foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
165. `time-series` · foundation · `signals-systems-convolution` — main DRIFT, closure DRIFT
166. `time-series` · foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
167. `time-series-anomaly` · foundation · `signals-systems-convolution` — main DRIFT, closure DRIFT
168. `time-series-anomaly` · foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
169. `world-model-physical-ai` · foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
170. `world-model-physical-ai` · foundation · `rl-mdp-bellman` — main DRIFT, closure DRIFT
171. `world-model-physical-ai` · foundation · `robot-camera-geometry-calibration` — main DRIFT, closure DRIFT
172. `ai-agents` · implementation · `claw-permissions` — main ACCEPT, closure PARTIAL
173. `ai-agents` · implementation · `claw-policy-engine` — main UNVERIFIED, closure UNVERIFIED
174. `ai-agents` · implementation · `claw-recovery` — main UNVERIFIED, closure DRIFT
175. `ai-agents` · implementation · `claw-subagent-orchestration` — main UNVERIFIED, closure DRIFT
176. `ai-agents` · implementation · `claw-telemetry` — main UNVERIFIED, closure DRIFT
177. `ai-agents` · implementation · `claw-tool-system` — main DRIFT, closure DRIFT
178. `computer-vision` · implementation · `image-classification-pipeline` — main UNVERIFIED, closure UNVERIFIED
179. `document-ai` · implementation · `ocr-runtime-evaluation` — main DRIFT, closure DRIFT
180. `efficient-inference-on-device` · implementation · `compression-pipeline` — main UNVERIFIED, closure UNVERIFIED
181. `generative-models` · implementation · `image-model-runtime` — main ACCEPT, closure PARTIAL
182. `knowledge-systems` · implementation · `knowledge-research-watcher` — main DRIFT, closure DRIFT
183. `llm-architecture` · implementation · `research-deepseek-v3-2-2025` — main ACCEPT, closure PARTIAL
184. `llm-architecture` · implementation · `training-pipeline` — main ACCEPT, closure PARTIAL
185. `llm-disaggregated-serving` · implementation · `llm-serving-ops` — main DRIFT, closure DRIFT
186. `llm-disaggregated-serving` · implementation · `observability-aiops` — main DRIFT, closure DRIFT
187. `llm-interpretability` · implementation · `llm-circuit-analysis` — main DRIFT, closure DRIFT
188. `llm-post-training` · implementation · `open-r1` — main ACCEPT, closure PARTIAL
189. `multimodal-foundation-models` · implementation · `janus-pro-multimodal-runtime` — main UNVERIFIED, closure UNVERIFIED
190. `nlp-attention` · implementation · `training-pipeline` — main ACCEPT, closure PARTIAL
191. `open-image-video` · implementation · `animation-production-workflow` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
192. `open-image-video` · implementation · `open-model-community-workflows` — main ACCEPT, closure PARTIAL
193. `reinforcement-learning` · implementation · `open-r1` — main ACCEPT, closure PARTIAL
194. `robot-ai` · implementation · `robot-system-verification-validation-qualification` — main ACCEPT, closure PARTIAL
195. `speech-audio` · implementation · `efficient-inference-on-device` — main ACCEPT, closure PARTIAL
196. `time-series` · implementation · `lstm-timeseries` — main UNVERIFIED, closure UNVERIFIED
197. `time-series-anomaly` · implementation · `time-series-anomaly-detection` — main UNVERIFIED, closure UNVERIFIED
198. `world-model-physical-ai` · implementation · `robot-motion-planning` — main ACCEPT, closure PARTIAL
199. `world-model-physical-ai` · implementation · `robot-system-verification-validation-qualification` — main ACCEPT, closure PARTIAL

## Track별 상태

### knowledge-systems

- 기준 시점: 2026-07-31
- current · `research-codar-2026` — main UNVERIFIED, closure UNVERIFIED
- canonical · `paper-rag-2020` — main UNVERIFIED, closure UNVERIFIED
- concept · `knowledge-compiler` — main ACCEPT, closure PARTIAL
- concept · `knowledge-source-ingestion` — main ACCEPT, closure PARTIAL
- concept · `knowledge-ir-evidence-lineage` — main ACCEPT, closure PARTIAL
- concept · `rag-pipeline` — main DRIFT, closure DRIFT
- foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
- foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
- implementation · `knowledge-research-watcher` — main DRIFT, closure DRIFT

### robot-ai

- 기준 시점: 2026-07-27
- current · `research-pi07-2026` — main ACCEPT, closure PARTIAL
- canonical · `paper-openvla-2024` — main DRIFT, closure DRIFT
- concept · `robot-ai-top-down` — main ACCEPT, closure ACCEPT
- concept · `rl-imitation-offline-learning` — main DRIFT, closure DRIFT
- foundation · `linear-algebra-tensors` — main DRIFT, closure REVIEW_REQUIRED
- foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
- foundation · `signals-systems-convolution` — main DRIFT, closure DRIFT
- implementation · `robot-system-verification-validation-qualification` — main ACCEPT, closure PARTIAL

### llm-architecture

- 기준 시점: 2026-07-20
- current · `llm-architecture-gallery` — main DRIFT, closure DRIFT
- canonical · `paper-transformer-2017` — main ACCEPT, closure PARTIAL
- concept · `transformer-architecture` — main UNVERIFIED, closure UNVERIFIED
- concept · `llm-architecture-dense-transformers` — main ACCEPT, closure PARTIAL
- concept · `llm-architecture-kv-long-context` — main DRIFT, closure DRIFT
- concept · `llm-architecture-sparse-moe` — main ACCEPT, closure PARTIAL
- concept · `llm-architecture-hybrid-linear` — main ACCEPT, closure PARTIAL
- foundation · `linear-algebra-tensors` — main DRIFT, closure REVIEW_REQUIRED
- foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
- foundation · `calculus-computational-graphs` — main DRIFT, closure REVIEW_REQUIRED
- foundation · `signals-systems-convolution` — main DRIFT, closure DRIFT
- foundation · `differential-equations-phase-plane-numerical-integration` — main ACCEPT, closure PARTIAL
- implementation · `research-deepseek-v3-2-2025` — main ACCEPT, closure PARTIAL
- implementation · `training-pipeline` — main ACCEPT, closure PARTIAL

### multimodal-foundation-models

- 기준 시점: 2026-07-27
- current · `multimodal-foundation-models-current` — main UNVERIFIED, closure UNVERIFIED
- canonical · `paper-janus-2024` — main ACCEPT, closure PARTIAL
- concept · `multimodal-fusion-interleaved-context` — main UNVERIFIED, closure UNVERIFIED
- concept · `video-long-context-memory` — main UNVERIFIED, closure UNVERIFIED
- concept · `multimodal-visual-tokenization` — main UNVERIFIED, closure UNVERIFIED
- concept · `multimodal-unified-generation-objectives` — main UNVERIFIED, closure UNVERIFIED
- concept · `dit-flow-matching-evaluation` — main UNVERIFIED, closure UNVERIFIED
- foundation · `transformer-architecture` — main UNVERIFIED, closure UNVERIFIED
- foundation · `vision-transformer` — main UNVERIFIED, closure UNVERIFIED
- foundation · `clip-vision-language-model` — main UNVERIFIED, closure UNVERIFIED
- foundation · `vae` — main UNVERIFIED, closure UNVERIFIED
- foundation · `diffusion-models` — main ACCEPT, closure PARTIAL
- implementation · `janus-pro-multimodal-runtime` — main UNVERIFIED, closure UNVERIFIED

### llm-post-training

- 기준 시점: 2026-07-31
- current · `reasoning-post-training-frontier` — main DRIFT, closure DRIFT
- canonical · `rlhf` — main DRIFT, closure DRIFT
- concept · `post-training-rlvr` — main ACCEPT, closure PARTIAL
- foundation · `rl-ppo-continuous-control` — main DRIFT, closure DRIFT
- foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
- foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
- implementation · `open-r1` — main ACCEPT, closure PARTIAL

### llm-interpretability

- 기준 시점: 2026-07-29
- current · `llm-interpretability-frontier` — main DRIFT, closure DRIFT
- canonical · `paper-transformer-circuits-2021` — main UNVERIFIED, closure UNVERIFIED
- concept · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
- concept · `llm-interpretability-readouts` — main UNVERIFIED, closure UNVERIFIED
- concept · `sparse-autoencoder` — main UNVERIFIED, closure UNVERIFIED
- foundation · `transformer-architecture` — main UNVERIFIED, closure UNVERIFIED
- foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
- foundation · `linear-algebra-tensors` — main DRIFT, closure REVIEW_REQUIRED
- implementation · `llm-circuit-analysis` — main DRIFT, closure DRIFT

### generative-models

- 기준 시점: 2026-07-20
- current · `dit-flow-matching-evaluation` — main UNVERIFIED, closure UNVERIFIED
- canonical · `diffusion-models` — main ACCEPT, closure PARTIAL
- concept · `vae` — main UNVERIFIED, closure UNVERIFIED
- concept · `gan` — main UNVERIFIED, closure UNVERIFIED
- foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
- foundation · `differential-equations-phase-plane-numerical-integration` — main ACCEPT, closure PARTIAL
- foundation · `calculus-computational-graphs` — main DRIFT, closure REVIEW_REQUIRED
- implementation · `image-model-runtime` — main ACCEPT, closure PARTIAL

### open-image-video

- 기준 시점: 2026-07-28
- current · `open-image-video-models` — main DRIFT, closure DRIFT
- canonical · `diffusion-models` — main ACCEPT, closure PARTIAL
- concept · `image-model-runtime` — main ACCEPT, closure PARTIAL
- concept · `krea-2-foundation-model` — main ACCEPT, closure ACCEPT
- concept · `ideogram-4-typography-layout` — main ACCEPT, closure ACCEPT
- concept · `video-model-runtime` — main DRIFT, closure DRIFT
- concept · `open-model-workflow-parameters` — main ACCEPT, closure PARTIAL
- concept · `open-model-finetuning-theory` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
- foundation · `dit-flow-matching-evaluation` — main UNVERIFIED, closure UNVERIFIED
- foundation · `linear-algebra-tensors` — main DRIFT, closure REVIEW_REQUIRED
- foundation · `signals-systems-convolution` — main DRIFT, closure DRIFT
- implementation · `open-model-community-workflows` — main ACCEPT, closure PARTIAL
- implementation · `animation-production-workflow` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED

### computer-vision

- 기준 시점: 2026-07-31
- current · `vision-system-contracts` — main UNVERIFIED, closure UNVERIFIED
- canonical · `deformable-detr` — main DRIFT, closure DRIFT
- concept · `vision-promptable-segmentation-tracking` — main DRIFT, closure DRIFT
- concept · `object-detection-systems` — main UNVERIFIED, closure UNVERIFIED
- concept · `vision-representation-encoders-current` — main MISSING_REGISTRY, closure MISSING_REGISTRY
- foundation · `clip-vision-language-model` — main UNVERIFIED, closure UNVERIFIED
- foundation · `vision-transformer` — main UNVERIFIED, closure UNVERIFIED
- foundation · `signals-systems-convolution` — main DRIFT, closure DRIFT
- foundation · `cnn` — main UNVERIFIED, closure UNVERIFIED
- foundation · `resnet` — main UNVERIFIED, closure UNVERIFIED
- foundation · `linear-algebra-tensors` — main DRIFT, closure REVIEW_REQUIRED
- foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
- implementation · `image-classification-pipeline` — main UNVERIFIED, closure UNVERIFIED

### document-ai

- 기준 시점: 2026-07-22
- current · `document-structure-assembly` — main DRIFT, closure DRIFT
- canonical · `paper-donut-2021` — main DRIFT, closure DRIFT
- concept · `ocr-document-ai-map` — main DRIFT, closure DRIFT
- concept · `paddleocr-vl` — main DRIFT, closure DRIFT
- concept · `olmocr-2` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
- concept · `html-table-structure-reconstruction` — main DRIFT, closure DRIFT
- foundation · `clip-vision-language-model` — main UNVERIFIED, closure UNVERIFIED
- foundation · `post-training-rlvr` — main ACCEPT, closure PARTIAL
- foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
- implementation · `ocr-runtime-evaluation` — main DRIFT, closure DRIFT

### nlp-attention

- 기준 시점: 2026-07-20
- current · `llm-architecture-gallery` — main DRIFT, closure DRIFT
- canonical · `paper-transformer-2017` — main ACCEPT, closure PARTIAL
- concept · `tokenizer` — main UNVERIFIED, closure UNVERIFIED
- concept · `word2vec` — main UNVERIFIED, closure UNVERIFIED
- concept · `lstm` — main UNVERIFIED, closure UNVERIFIED
- concept · `attention-theory` — main ACCEPT, closure PARTIAL
- concept · `transformer-architecture` — main UNVERIFIED, closure UNVERIFIED
- foundation · `linear-algebra-tensors` — main DRIFT, closure REVIEW_REQUIRED
- foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
- implementation · `training-pipeline` — main ACCEPT, closure PARTIAL

### reinforcement-learning

- 기준 시점: 2026-07-31
- current · `rl-decision-system-contracts` — main UNVERIFIED, closure UNVERIFIED
- canonical · `paper-ppo-2017` — main DRIFT, closure DRIFT
- concept · `rl-ppo-continuous-control` — main DRIFT, closure DRIFT
- concept · `rl-imitation-offline-learning` — main DRIFT, closure DRIFT
- concept · `rl-model-based-world-models` — main ACCEPT, closure PARTIAL
- concept · `rl-pomdp-state-estimation` — main ACCEPT, closure PARTIAL
- concept · `rl-safe-constrained-learning` — main DRIFT, closure DRIFT
- concept · `reasoning-post-training-frontier` — main DRIFT, closure DRIFT
- foundation · `rl-mdp-bellman` — main DRIFT, closure DRIFT
- foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
- foundation · `calculus-computational-graphs` — main DRIFT, closure REVIEW_REQUIRED
- foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
- implementation · `open-r1` — main ACCEPT, closure PARTIAL

### time-series

- 기준 시점: 2026-07-31
- current · `time-series-forecasting-evaluation` — main UNVERIFIED, closure UNVERIFIED
- canonical · `paper-deepar-2017` — main UNVERIFIED, closure UNVERIFIED
- concept · `time-features` — main UNVERIFIED, closure UNVERIFIED
- concept · `arima` — main UNVERIFIED, closure UNVERIFIED
- concept · `transformer-architecture` — main UNVERIFIED, closure UNVERIFIED
- foundation · `signals-systems-convolution` — main DRIFT, closure DRIFT
- foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
- foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
- implementation · `lstm-timeseries` — main UNVERIFIED, closure UNVERIFIED

### time-series-anomaly

- 기준 시점: 2026-07-31
- current · `time-series-anomaly-detection` — main UNVERIFIED, closure UNVERIFIED
- concept · `time-features` — main UNVERIFIED, closure UNVERIFIED
- concept · `ecod` — main UNVERIFIED, closure UNVERIFIED
- foundation · `signals-systems-convolution` — main DRIFT, closure DRIFT
- foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
- implementation · `time-series-anomaly-detection` — main UNVERIFIED, closure UNVERIFIED

### llm-data-engine

- 기준 시점: 2026-07-22
- current · `llm-pretraining-scaling` — main DRIFT, closure DRIFT
- canonical · `paper-chinchilla-2022` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
- concept · `llm-data-engine` — main ACCEPT, closure PARTIAL
- concept · `tokenizer` — main UNVERIFIED, closure UNVERIFIED
- foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
- foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
- implementation · `llm-pretraining-run` — main ACCEPT, closure ACCEPT

### efficient-inference-on-device

- 기준 시점: 2026-07-23
- current · `on-device-llm-runtime` — main UNVERIFIED, closure UNVERIFIED
- canonical · `on-device-llm-runtime` — main UNVERIFIED, closure UNVERIFIED
- concept · `efficient-inference-on-device` — main ACCEPT, closure PARTIAL
- concept · `quantization` — main ACCEPT, closure PARTIAL
- foundation · `linear-algebra-tensors` — main DRIFT, closure REVIEW_REQUIRED
- foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
- implementation · `compression-pipeline` — main UNVERIFIED, closure UNVERIFIED

### llm-disaggregated-serving

- 기준 시점: 2026-07-22
- current · `llm-disaggregated-serving` — main DRIFT, closure DRIFT
- canonical · `llm-disaggregated-serving` — main DRIFT, closure DRIFT
- concept · `vllm-serving` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
- concept · `vllm-paged-attention` — main ACCEPT, closure PARTIAL
- concept · `vllm-scheduler` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
- foundation · `linear-algebra-tensors` — main DRIFT, closure REVIEW_REQUIRED
- foundation · `statistics-generalization` — main REVIEW_REQUIRED, closure REVIEW_REQUIRED
- implementation · `llm-serving-ops` — main DRIFT, closure DRIFT
- implementation · `observability-aiops` — main DRIFT, closure DRIFT

### speech-audio

- 기준 시점: 2026-07-23
- current · `realtime-duplex-voice-systems` — main DRIFT, closure DRIFT
- canonical · `paper-moshi-2024` — main DRIFT, closure REVIEW_REQUIRED
- concept · `native-speech-generation` — main DRIFT, closure DRIFT
- concept · `speech-recognition-objectives` — main DRIFT, closure DRIFT
- concept · `audio-representation-neural-codecs` — main DRIFT, closure DRIFT
- foundation · `signals-systems-convolution` — main DRIFT, closure DRIFT
- foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
- implementation · `efficient-inference-on-device` — main ACCEPT, closure PARTIAL

### world-model-physical-ai

- 기준 시점: 2026-07-21
- current · `world-model-physical-ai` — main DRIFT, closure DRIFT
- canonical · `paper-vjepa2-2025` — main DRIFT, closure DRIFT
- concept · `predictive-world-representations` — main DRIFT, closure DRIFT
- concept · `action-conditioned-world-dynamics` — main DRIFT, closure DRIFT
- concept · `world-model-planning-closed-loop` — main DRIFT, closure DRIFT
- foundation · `robot-camera-geometry-calibration` — main DRIFT, closure DRIFT
- foundation · `probability-information-theory` — main DRIFT, closure REVIEW_REQUIRED
- foundation · `rl-mdp-bellman` — main DRIFT, closure DRIFT
- implementation · `robot-motion-planning` — main ACCEPT, closure PARTIAL
- implementation · `robot-system-verification-validation-qualification` — main ACCEPT, closure PARTIAL

### ai-agents

- 기준 시점: 2026-07-25
- current · `agent-runtime-current-first` — main DRIFT, closure DRIFT
- canonical · `paper-react-2022` — main UNVERIFIED, closure UNVERIFIED
- concept · `skills-anatomy` — main UNVERIFIED, closure UNVERIFIED
- concept · `llm-harness` — main DRIFT, closure DRIFT
- concept · `computer-use-agent-runtime` — main ACCEPT, closure PARTIAL
- concept · `multi-agent-implementation` — main DRIFT, closure DRIFT
- concept · `prompt-injection-defense` — main DRIFT, closure DRIFT
- concept · `agent-evaluation-trace` — main ACCEPT, closure PARTIAL
- concept · `agent-devlog-patterns` — main UNVERIFIED, closure UNVERIFIED
- foundation · `prompt-engineering` — main UNVERIFIED, closure UNVERIFIED
- foundation · `xml-prompting` — main UNVERIFIED, closure UNVERIFIED
- foundation · `mcp-protocol` — main UNVERIFIED, closure UNVERIFIED
- foundation · `context-engineering` — main ACCEPT, closure PARTIAL
- foundation · `agentic-patterns` — main ACCEPT, closure PARTIAL
- implementation · `claw-tool-system` — main DRIFT, closure DRIFT
- implementation · `claw-permissions` — main ACCEPT, closure PARTIAL
- implementation · `claw-subagent-orchestration` — main UNVERIFIED, closure DRIFT
- implementation · `claw-policy-engine` — main UNVERIFIED, closure UNVERIFIED
- implementation · `claw-telemetry` — main UNVERIFIED, closure DRIFT
- implementation · `claw-recovery` — main UNVERIFIED, closure DRIFT

JSON 보고서에는 file hash, receipt queue, attempt와 불일치 closure가 포함되어 있다.

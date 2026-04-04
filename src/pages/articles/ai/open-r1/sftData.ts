export const sftSteps = [
  {
    label: '1. 데이터 로딩',
    body: 'Mixture-of-Thoughts (350k) + CodeForces-CoTs (100k) 데이터셋을 가중치 혼합(0.6:0.4)으로 로드합니다.',
  },
  {
    label: '2. 토크나이저 설정',
    body: 'ChatML 형식으로 채팅 템플릿을 적용합니다. Qwen 모델은 <|im_end|>를 EOS 토큰으로 설정합니다.',
  },
  {
    label: '3. 대화 형식 변환',
    body: '각 예시를 {role: "user", content: prompt} + {role: "assistant", content: <think>...</think><answer>...</answer>} 형태로 변환합니다.',
  },
  {
    label: '4. SFT 학습 실행',
    body: 'DeepSpeed ZeRO-3 + BF16 혼합 정밀도로 8xH100에서 학습. Liger Kernel로 메모리 20-30% 절약합니다.',
  },
  {
    label: '5. 체크포인트 저장',
    body: '500 스텝마다 자동 저장 (최대 3개). W&B로 Loss, LR, GPU Memory, Throughput을 추적합니다.',
  },
];

export const sftHyperparams = [
  { param: 'learning_rate', value: '4.0e-5', desc: '학습률' },
  { param: 'num_train_epochs', value: '5', desc: '훈련 에포크 수' },
  { param: 'max_seq_length', value: '32768', desc: '최대 시퀀스 길이' },
  { param: 'batch_size', value: '2', desc: '디바이스당 배치 크기' },
  { param: 'bf16', value: 'True', desc: 'BFloat16 혼합 정밀도' },
  { param: 'use_liger_kernel', value: 'True', desc: '메모리 효율 커널' },
];

export const chatTemplate = `<|im_start|>user
문제를 해결해주세요.<|im_end|>
<|im_start|>assistant
<think>
추론 과정...
</think>
<answer>
최종 답변
</answer><|im_end|>`;

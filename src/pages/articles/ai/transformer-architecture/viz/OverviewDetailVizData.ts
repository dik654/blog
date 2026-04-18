import type { StepDef } from '@/components/ui/step-viz';

export const C = { enc: '#3b82f6', dec: '#8b5cf6', ffn: '#f59e0b', norm: '#10b981', muted: '#64748b' };

export const STEPS: StepDef[] = [
  {
    label: 'Encoder 스택: 6개 동일 레이어',
    body: '각 레이어는 두 서브블록으로 구성.\n서브블록 1: Multi-Head Self-Attention → Add & Norm.\n서브블록 2: Position-wise FFN → Add & Norm.\nResidual Connection이 매 서브블록을 감싸며,\nLayerNorm이 잔차 합산 뒤 정규화.\n6층 반복 → 점진적으로 추상화 수준 상승.\n출력은 Decoder의 Cross-Attention으로 전달.',
  },
  {
    label: 'Decoder 스택: 6개 레이어 + Mask',
    body: '서브블록 3개: Masked Self-Attn → Cross-Attn → FFN.\nMasked Self-Attn: 미래 토큰 차단 (causal mask).\nCross-Attn: Q는 디코더, K/V는 인코더 출력.\n이를 통해 소스 문장 정보를 참조하면서 타겟 생성.\nFFN + Add & Norm으로 마무리.\n총 6층 × 3 서브블록 = 18 서브블록.',
  },
  {
    label: '모델 크기: d=512, h=8, N=6',
    body: 'd_model = 512: 은닉 차원. 모든 레이어 입출력 일치.\nd_ff = 2048: FFN 내부 확장 (4배). 표현력 증대.\nh = 8: 어텐션 헤드 수. d_k = 512/8 = 64.\nN = 6: 인코더·디코더 각 6층.\n총 파라미터 약 65M (base).\n큰 모델(big): d=1024, h=16, N=6 → 약 213M.',
  },
  {
    label: 'RNN 대비 장점과 단점',
    body: '장점 1: 완전 병렬화 — 전체 시퀀스 동시 처리.\n장점 2: O(1) 경로 길이 — 임의 두 토큰 직접 연결.\n장점 3: GPU/TPU 친화적 — 대규모 행렬 연산.\n단점 1: O(n²) 메모리·시간 — 시퀀스 길이에 이차.\n단점 2: 짧은 시퀀스에서 RNN보다 파라미터 낭비.\nGPT/BERT/LLaMA 모두 이 구조의 인코더 또는 디코더 부분.',
  },
];

import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  vivit: '#8b5cf6',
  timesformer: '#3b82f6',
  videomae: '#10b981',
  token: '#f59e0b',
  spatial: '#ef4444',
  temporal: '#06b6d4',
  mask: '#94a3b8',
  flow: '#64748b',
};

export const STEPS: StepDef[] = [
  {
    label: '시공간 토큰화 — 비디오를 토큰으로',
    body: '이미지: H x W를 P x P 패치로 분할 → N = (H/P) x (W/P) 토큰.\n비디오: T x H x W를 t x P x P 튜블릿(tubelet)으로 분할.\nN = (T/t) x (H/P) x (W/P) 토큰. 위치 임베딩으로 시공간 좌표를 인코딩.',
  },
  {
    label: 'ViViT — Video Vision Transformer',
    body: 'Arnab et al. (2021). 4가지 변형 중 "Factorised Encoder"가 핵심.\n공간 인코더: 각 프레임 내 패치 간 self-attention.\n시간 인코더: 프레임 CLS 토큰 간 self-attention.\n분리 이유: 전체 시공간 attention은 O((T x N)^2)로 메모리 폭발.',
  },
  {
    label: 'TimeSformer — Divided Space-Time Attention',
    body: 'Bertasius et al. (2021). 각 블록에서 attention을 분리.\n먼저 temporal attention: 같은 공간 위치의 서로 다른 프레임 토큰 간.\n다음 spatial attention: 같은 프레임 내 서로 다른 위치 토큰 간.\n계산량: O(T x N^2 + N x T^2) — 전체 O((TN)^2) 대비 크게 절감.',
  },
  {
    label: 'VideoMAE — 비디오 마스크 오토인코더',
    body: 'Tong et al. (2022). 자기지도 사전학습.\n시공간 튜블릿의 90%를 랜덤 마스킹 → 인코더는 10%만 처리.\n디코더가 마스킹된 튜블릿을 복원하도록 학습.\n비디오의 시간 중복성이 높아 90% 마스킹에도 복원 가능 → 학습 효율 극대화.',
  },
  {
    label: '어텐션 패턴 비교',
    body: 'Joint Space-Time: 모든 토큰 간 attention. 정확하지만 O((TN)^2).\nDivided Space-Time (TimeSformer): 공간·시간 분리. 효율적.\nFactorised (ViViT): 인코더 자체를 분리. 가장 경량.\n실전: 데이터·GPU에 따라 선택. VideoMAE 사전학습 + Fine-tune이 현재 주류.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

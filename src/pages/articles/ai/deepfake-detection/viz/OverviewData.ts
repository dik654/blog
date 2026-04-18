import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'GAN vs Diffusion: 딥페이크 생성 기술의 진화',
    body: 'GAN(2014): Generator-Discriminator 대결 구조 — StyleGAN으로 사실적 얼굴 합성 가능\nDiffusion(2020~): 노이즈 제거 과정으로 이미지 생성 — 더 안정적이고 다양한 출력\n생성 품질이 높을수록 탐지 난이도도 급격히 상승한다',
  },
  {
    label: '딥페이크 3가지 유형: Face Swap / Reenactment / Synthesis',
    body: 'Face Swap: A의 얼굴을 B의 영상에 덮어씌움 (FaceSwap, DeepFaceLab)\nFace Reenactment: A의 표정으로 B의 얼굴을 조종 (First Order Motion)\nEntire Face Synthesis: 존재하지 않는 얼굴을 통째로 생성 (StyleGAN)',
  },
  {
    label: '탐지의 핵심 어려움: 아티팩트가 점점 사라진다',
    body: '초기 딥페이크 — 경계 블러, 색상 불일치, 눈 깜빡임 부자연스러움\n최신 딥페이크 — 사람이 봐도 구분 불가, 4K 해상도, 실시간 생성\n결국 모델이 사람보다 미세한 통계적 패턴을 잡아야 한다',
  },
  {
    label: '대회 특성: 학습 데이터가 주어지지 않는다',
    body: '일반 비전 대회 — train/test 세트 제공, 도메인 동일\n딥페이크 대회 — test만 제공, 조작 기법 미공개, 외부 데이터 구축 필수\n핵심 전략: 다양한 공개 데이터셋 + 자체 합성 데이터로 일반화 확보',
  },
];

export const COLORS = {
  gan: '#3b82f6',
  diffusion: '#8b5cf6',
  swap: '#ef4444',
  reenact: '#f59e0b',
  synthesis: '#10b981',
  alert: '#ef4444',
};

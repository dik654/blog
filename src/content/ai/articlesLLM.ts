import type { Article } from '../types';
import { vllmServingArticles } from './articlesVLLM';

const llmBaseArticles: Article[] = [
  // ── LLM Theory: 학습, 정렬, 해석가능성 ──
  {
    slug: 'rlhf',
    title: 'RLHF & LLM 정렬: PPO에서 DPO·KTO까지',
    subcategory: 'ai-llm-theory',
    sections: [
      { id: 'overview', title: 'LLM 정렬 문제' },
      { id: 'reward-model', title: 'Bradley-Terry 보상 모델' },
      { id: 'ppo', title: 'PPO 최적화' },
      { id: 'dpo', title: 'DPO: Direct Preference Optimization' },
      { id: 'constitutional-ai', title: 'Constitutional AI & RLAIF' },
      { id: 'orpo', title: 'ORPO: Odds Ratio Preference' },
      { id: 'kto', title: 'KTO: Kahneman-Tversky Optimization' },
    ],
    component: () => import('@/pages/articles/ai/rlhf'),
  },
  {
    slug: 'sparse-autoencoder',
    title: '희소 오토인코더: LLM 내부를 들여다보는 망원경',
    subcategory: 'ai-llm-theory',
    sections: [
      { id: 'overview', title: '왜 LLM 내부를 봐야 하는가' },
      { id: 'residual-stream', title: '잔차 흐름: 토큰이 레이어를 통과하는 과정' },
      { id: 'polysemanticity', title: '다의성과 중첩 가설' },
      { id: 'sae-architecture', title: 'SAE 구조: 희소 인코딩과 복원' },
      { id: 'feature-steering', title: '특징 조작: 모델 행동 제어' },
      { id: 'limitations', title: '한계와 전망' },
    ],
    component: () => import('@/pages/articles/ai/sparse-autoencoder'),
  },

  // ── LLM Applied: 추론 모델 학습 ──
  {
    slug: 'open-r1',
    title: 'Open-R1: 오픈소스 추론 모델 학습',
    subcategory: 'ai-llm-applied',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'sft-process', title: 'SFT 프로세스' },
      { id: 'grpo-process', title: 'GRPO 프로세스' },
      { id: 'reward-system', title: '보상 함수 시스템' },
      { id: 'data-pipeline', title: '데이터 생성 파이프라인' },
      { id: 'evaluation', title: '평가 벤치마킹' },
      { id: 'deployment', title: '배포 & 서빙' },
    ],
    component: () => import('@/pages/articles/ai/open-r1'),
  },

  // ── LLM Serving: 추론 최적화, 서빙 인프라 ──
  {
    slug: 'llm-serving-ops',
    title: 'LLM 서빙 인프라: K8s Fleet · LiteLLM · AIOps',
    subcategory: 'ai-llm-serving',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'litellm-gateway', title: 'LiteLLM 게이트웨이' },
      { id: 'k8s-gpu-fleet', title: 'Kubernetes GPU Fleet 관리' },
      { id: 'serving-deployment', title: '서빙 배포 패턴' },
      { id: 'observability-aiops', title: '관측성 & AIOps' },
    ],
    component: () => import('@/pages/articles/ai/llm-serving-ops'),
  },
];

export const llmArticles: Article[] = [
  ...llmBaseArticles,
  ...vllmServingArticles,
];

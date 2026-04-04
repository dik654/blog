import type { Category } from '../types';
import { aiArticles } from './articles';

const ai: Category = {
  slug: 'ai',
  name: 'AI',
  description: '인공지능, LLM, 생성 모델, 시계열 분석 학습 노트',
  subcategories: [
    { slug: 'ai-foundations', name: 'Foundations', description: '신경망 기초, 역전파, 임베딩 등 핵심 이론', icon: '🧠' },
    { slug: 'ai-nlp', name: 'NLP & Attention', description: 'Transformer, 어텐션 메커니즘, 토큰화', icon: '💬' },
    { slug: 'ai-vision', name: 'Computer Vision', description: 'CNN, 객체 탐지, 이미지 분류 모델', icon: '👁️' },
    { slug: 'ai-timeseries', name: 'Time Series', description: '시계열 예측, 이상 탐지, 패턴 분석', icon: '📈' },
    { slug: 'ai-generative', name: 'Generative Models', description: 'GAN, Diffusion, VAE 등 생성 모델', icon: '🎨' },
    {
      slug: 'ai-llm', name: 'LLM', description: 'LLM 이론, 서빙, 활용', icon: '🚀',
      children: [
        { slug: 'ai-llm-theory', name: '이론 & 정렬', description: 'RLHF, 해석가능성 등 LLM 핵심 이론' },
        { slug: 'ai-llm-serving', name: '서빙 & 인프라', description: '추론 최적화, 서빙 아키텍처' },
        { slug: 'ai-llm-applied', name: '활용', description: '추론 모델 학습, 배포 파이프라인' },
      ],
    },
    { slug: 'ai-agents', name: 'Agents & Tools', description: 'AI 에이전트, 도구 호출, 워크플로 자동화', icon: '🤖' },
    { slug: 'ai-from-scratch', name: 'DL 구현 (Rust)', description: 'dezero_rs — 딥러닝 프레임워크를 Rust로 직접 구현', icon: '🦀' },
  ],
  articles: aiArticles,
};

export default ai;

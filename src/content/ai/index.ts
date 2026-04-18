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
    { slug: 'ai-agents', name: 'Agents & Tools', description: '프롬프트·컨텍스트·MCP·하네스·에이전트 패턴 등 공통 이론', icon: '🤖' },
    { slug: 'ai-agents-ops', name: 'Agent Dev Ops', description: '개인 에이전트 개발 운영 — devlog·ADR·lessons·changelog 패턴', icon: '📓' },
    {
      slug: 'ai-agents-claw', name: 'Claw Code', description: 'Claude Code 하네스의 클린룸 재구현 (Rust)', icon: '🦀',
      children: [
        { slug: 'ai-agents-claw-core', name: '코어', description: '하네스 전체 구조, 도구 시스템, 세션, 컨텍스트 압축' },
        { slug: 'ai-agents-claw-security', name: '보안 & 검증', description: '권한 모델, Bash 검증, 파일 연산 경계' },
        { slug: 'ai-agents-claw-lifecycle', name: '라이프사이클', description: '워커 부트, 훅 시스템, 플러그인' },
        { slug: 'ai-agents-claw-infra', name: '인프라 & 통합', description: 'MCP, API 클라이언트, 설정, CLI' },
        { slug: 'ai-agents-claw-ops', name: '오케스트레이션', description: '정책 엔진, 복구, 태스크, 텔레메트리' },
      ],
    },
    { slug: 'ai-from-scratch', name: 'DL 구현 (Rust)', description: 'dezero_rs — 딥러닝 프레임워크를 Rust로 직접 구현', icon: '🦀' },
    {
      slug: 'ai-practical', name: '실전 ML', description: '대회·실무에서 바로 쓰는 파이프라인, 모델링, 전략', icon: '🏆',
      children: [
        { slug: 'ai-practical-data', name: '데이터 & 피처', description: 'EDA, 피처 엔지니어링, 증강, 불균형 처리' },
        { slug: 'ai-practical-tabular', name: '테이블형 모델링', description: 'GBM, TabNet, 시계열 피처, 시퀀스 모델링' },
        { slug: 'ai-practical-pipeline', name: '학습 파이프라인', description: 'PyTorch 실전, Transfer Learning, LR 스케줄링, 정규화' },
        { slug: 'ai-practical-cv', name: '실전 CV', description: '이미지 분류, ViT, 멀티뷰, 딥페이크, 비디오' },
        { slug: 'ai-practical-embedding', name: '도메인 임베딩', description: 'Contrastive Learning, 도메인 Fine-tuning, 문장 임베딩' },
        { slug: 'ai-practical-compression', name: '모델 경량화', description: '양자화, 프루닝, 지식 증류, 경량화 파이프라인' },
        { slug: 'ai-practical-llm', name: 'LLM 응용', description: 'RAG, LoRA/QLoRA, 멀티 에이전트 구현' },
        { slug: 'ai-practical-strategy', name: '대회 전략', description: '교차 검증, 튜닝, 앙상블, 평가 지표, 실험 관리' },
      ],
    },
  ],
  articles: aiArticles,
};

export default ai;

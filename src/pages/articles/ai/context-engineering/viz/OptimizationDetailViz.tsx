import SimpleStepViz from '@/components/viz/SimpleStepViz';
import { BUDGET_STEPS, CACHE_STEPS } from './OptimizationDetailVizData';

const budgetVisuals = [
  { title: 'Token Budget 분배', color: '#6366f1', rows: [
    { label: 'System Prompt', value: '5K (고정)' },
    { label: 'RAG Results', value: '30K (동적)' },
    { label: 'History', value: '10K (동적)' },
    { label: 'Tools+Scratch', value: '8K (동적)' },
    { label: 'Output+Safety', value: '9K (예약)' },
    { label: '총', value: '63K 사용, 65K 여유 (128K 기준)' },
  ]},
  { title: '초과 대응 + Compression', color: '#10b981', rows: [
    { label: '1. Truncate', value: 'oldest history 제거' },
    { label: '2. Summarize', value: 'LLM 요약: 10K → 1K' },
    { label: '3. Extractive', value: '핵심 문장만 선택' },
    { label: '4. LLMLingua', value: '토큰 수준 3-4x 압축 (논문)' },
  ]},
  { title: 'Lost in the Middle 완화', color: '#ef4444', rows: [
    { label: '현상', value: '중간부 정보를 LLM이 잘 참조 못함' },
    { label: '완화 1', value: '중요 정보는 start/end 배치 (U자)' },
    { label: '완화 2', value: 'Key facts 반복 — 앞뒤 중복' },
    { label: '완화 3', value: 'Attention sink tokens 활용' },
  ]},
];

const cacheVisuals = [
  { title: 'Prompt Caching 원리', color: '#f59e0b', rows: [
    { label: '아이디어', value: '공통 prefix 캐싱 → 재사용' },
    { label: 'Cache write', value: '1.25x base cost (첫 호출)' },
    { label: 'Cache read', value: '0.1x base cost (90% 할인!)' },
    { label: 'TTL', value: '5분, 최소 1024 tokens' },
  ]},
  { title: '비용 절감 시뮬레이션', color: '#ef4444', rows: [
    { label: 'Without', value: '25K × $3/M = $0.075/req' },
    { label: 'With (hit)', value: '25K × $0.30/M = $0.008/req' },
    { label: '100 queries', value: '$7.50 → $0.88' },
    { label: '절감율', value: '88% 비용 절감!' },
  ]},
  { title: '활용 조건 + KV Cache', color: '#6366f1', rows: [
    { label: '효과적', value: '같은 system prompt, 고정 RAG/예시' },
    { label: 'OpenAI', value: '1024+ prefix 자동, 50% 할인, 1h TTL' },
    { label: 'KV Cache', value: 'Transformer K,V 저장 → prefix 재사용' },
    { label: '실무', value: '정적 앞쪽, 동적 뒤쪽 배치' },
  ]},
];

export function BudgetViz() {
  return <SimpleStepViz steps={BUDGET_STEPS} visuals={budgetVisuals} />;
}

export function CacheViz() {
  return <SimpleStepViz steps={CACHE_STEPS} visuals={cacheVisuals} />;
}

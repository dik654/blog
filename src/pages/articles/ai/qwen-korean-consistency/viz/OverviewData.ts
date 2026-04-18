import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '1. Qwen vocab — 한국어와 한자가 같은 토큰 풀에 공존',
    body: 'Qwen 토크나이저(BBPE 기반)는 약 152K 토큰 vocab을 가진다.\n그 중 CJK 한자 영역(U+4E00~9FFF)이 수만 개 토큰을 차지한다.\n한글 음절(U+AC00~D7A3)도 같은 vocab에 들어 있지만, 학습 데이터에서 중국어 비중이 훨씬 크기 때문에 한자 토큰의 사전확률이 구조적으로 높다.',
  },
  {
    label: '2. 사전학습 분포 — 중국어가 한국어의 수십 배',
    body: 'Qwen2.5 / Qwen3는 중국어와 영어 중심 코퍼스에 한국어가 소량 섞여 학습된다.\n한국어 데이터 비중은 1~3% 수준으로 추정되는 반면, 중국어는 30%+ 차지한다.\n결과: 모델 내부 표상에서 "한국어 reasoning 경로"는 "중국어 reasoning 경로"의 부분집합처럼 형성된다.',
  },
  {
    label: '3. lm_head softmax — 한국어 컨텍스트에서도 한자 토큰 logit이 살아 있다',
    body: '디코딩 마지막 단계: hidden state h를 lm_head 행렬 W에 곱해 logit z = W·h를 만들고 softmax로 토큰 분포를 얻는다.\n한국어 문맥이라도 W의 한자 토큰 row가 학습 시 강하게 정렬돼 있어 z[한자]가 z[한글] 못지않게 높게 나오는 경우가 많다.\n특히 reasoning(<think>) 단계에서 모델이 "더 정밀한" 토큰을 찾을수록 한자 후보가 우위를 점한다.',
  },
  {
    label: '4. 출력 — 한국어 문장 사이에 한자가 끼어든다',
    body: '관찰되는 실제 패턴:\n• 어휘 치환: "분석한다" → "分析한다"\n• 단어 통째 한자: "問題를 解決" \n• Reasoning에서만 누출: 최종 답은 한국어인데 <think> 안이 중국어\n• 코드/수식 주변에서 폭증: 영어→한자→한국어 코드스위칭\n원인은 "한자 토큰의 logit이 한국어 토큰을 이긴다"는 단 하나의 기계적 사실이다.',
  },
  {
    label: '5. 그래서 해법은 어디로 가야 하는가',
    body: '문제가 lm_head 차원에서 발생하므로, 해법도 그 차원에 가까울수록 강력하다.\n• 프롬프트 — 입력단 가드레일, 가장 약함\n• 런타임 judge + retry — 출력단 사후 검증, 중간\n• Smoothie-Qwen — lm_head weight 직접 조정, 강함\n• RL fine-tune — 모델 전체 reward 재정렬, 가장 강함 (비용 최대)\n이 글은 이 4가지를 차례로 깊게 본다.',
  },
];

export const VOCAB_SLICES = [
  { label: '한글', range: 'U+AC00~D7A3', share: 8, color: '#3b82f6' },
  { label: 'CJK 한자', range: 'U+4E00~9FFF', share: 38, color: '#ef4444' },
  { label: 'Latin', range: 'ASCII+', share: 30, color: '#10b981' },
  { label: '기타', range: '...', share: 24, color: '#a3a3a3' },
];

export const LOGIT_SAMPLE = [
  { tok: '분석', kind: 'kr', logit: 7.2 },
  { tok: '分析', kind: 'cn', logit: 7.6 },
  { tok: '해석', kind: 'kr', logit: 6.4 },
  { tok: '解釋', kind: 'cn', logit: 6.9 },
  { tok: '풀이', kind: 'kr', logit: 5.1 },
];

export const SOLUTIONS = [
  { label: '프롬프트', strength: 1, cost: 1, color: '#a3a3a3' },
  { label: '런타임 judge', strength: 2, cost: 2, color: '#10b981' },
  { label: 'Smoothie-Qwen', strength: 3, cost: 1, color: '#3b82f6' },
  { label: 'RL fine-tune', strength: 4, cost: 4, color: '#ef4444' },
];

import type { CodeRef } from '@/components/code/types';

import sftPy from './codebase/open-r1/src/open_r1/sft.py?raw';
import grpoPy from './codebase/open-r1/src/open_r1/grpo.py?raw';
import rewardsPy from './codebase/open-r1/src/open_r1/rewards.py?raw';
import generatePy from './codebase/open-r1/src/open_r1/generate.py?raw';

export const codeRefs: Record<string, CodeRef> = {
  'r1-sft-main': {
    path: 'open-r1/src/open_r1/sft.py',
    code: sftPy,
    lang: 'python',
    highlight: [31, 48],
    desc: 'SFT 학습 메인 함수 — SFTConfig 설정 → 모델/토크나이저 로드 → 데이터셋 전처리 → SFTTrainer 학습',
    annotations: [
      { lines: [31, 43], color: 'sky', note: 'SFTConfig — 하이퍼파라미터 통합 관리' },
      { lines: [46, 52], color: 'emerald', note: '모델 로드 + ChatML 형식 자동 설정' },
      { lines: [55, 65], color: 'amber', note: '350K 추론 트레이스 데이터셋 로드 & 포맷팅' },
      { lines: [68, 78], color: 'violet', note: 'SFTTrainer 학습 + 체크포인트 저장' },
    ],
  },

  'r1-grpo-main': {
    path: 'open-r1/src/open_r1/grpo.py',
    code: grpoPy,
    lang: 'python',
    highlight: [44, 72],
    desc: 'GRPO 학습 메인 — 보상 함수 목록 정의 → GRPOTrainer가 N개 응답 생성 → 그룹 정규화 Advantage → 정책 업데이트',
    annotations: [
      { lines: [44, 60], color: 'sky', note: 'GRPOConfig — num_generations=14, beta=0.001 (KL 페널티)' },
      { lines: [63, 70], color: 'emerald', note: '보상 함수 목록 — accuracy(0.7) + format(0.2) + tag_count(0.1)' },
      { lines: [82, 91], color: 'amber', note: 'GRPOTrainer 내부 동작 — (a)N개 생성 (b)보상 (c)정규화 (d)업데이트' },
    ],
  },

  'r1-rewards-accuracy': {
    path: 'open-r1/src/open_r1/rewards.py',
    code: rewardsPy,
    lang: 'python',
    highlight: [20, 68],
    desc: '정확도 보상 함수 — math_verify로 LaTeX 파싱 → \\boxed{} 추출 → 수학적 동치 판정',
    annotations: [
      { lines: [20, 33], color: 'sky', note: 'accuracy_reward 파이프라인: 파싱 → 추출 → 검증' },
      { lines: [44, 55], color: 'emerald', note: '정답 LaTeX 파싱 + \\boxed{} 패턴 우선 추출' },
      { lines: [60, 63], color: 'amber', note: 'math_verify.verify() — 수학적 동치 판정' },
    ],
  },

  'r1-rewards-format': {
    path: 'open-r1/src/open_r1/rewards.py',
    code: rewardsPy,
    lang: 'python',
    highlight: [71, 102],
    desc: '형식 + 태그 카운트 보상 — <think>/<answer> 구조 강제로 지름길 학습 방지',
    annotations: [
      { lines: [71, 88], color: 'sky', note: 'format_reward — 정규식으로 <think>...<answer> 패턴 매칭' },
      { lines: [91, 102], color: 'emerald', note: 'tag_count_reward — 4개 태그 각 0.25점 (총 1.0)' },
    ],
  },

  'r1-generate-pipeline': {
    path: 'open-r1/src/open_r1/generate.py',
    code: generatePy,
    lang: 'python',
    highlight: [36, 62],
    desc: 'Distilabel 파이프라인 — Ray 분산 + vLLM 백엔드 + TextGeneration 배치 처리',
    annotations: [
      { lines: [36, 39], color: 'sky', note: 'Pipeline().ray() — Ray 분산 처리 활성화' },
      { lines: [41, 50], color: 'emerald', note: 'OpenAILLM — vLLM 서버에 OpenAI-compatible API 호출' },
      { lines: [51, 55], color: 'amber', note: 'group_generations=True — GRPO 그룹 학습용 데이터 구조화' },
    ],
  },
};

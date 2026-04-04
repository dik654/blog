import type { CodeRef } from '@/components/code/types';
import precompSrc from './codebase/reth/precompiles.rs?raw';
import bn128Src from './codebase/reth/bn128.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'precompile-enum': {
    path: 'revm/precompile/src/lib.rs', lang: 'rust', highlight: [6, 13],
    desc: 'Precompile enum — Standard(순수 함수)과 Env(환경 참조) 두 가지 변형',
    annotations: [
      { lines: [3, 5], color: 'sky', note: '함수 시그니처 — input + gas_limit → Result' },
      { lines: [8, 11], color: 'emerald', note: 'Standard: 순수 함수 / Env: 블록 환경 필요' },
    ],
    code: precompSrc,
  },
  'cancun-registry': {
    path: 'revm/precompile/src/lib.rs', lang: 'rust', highlight: [18, 31],
    desc: 'Cancun 프리컴파일 레지스트리 — Shanghai 기반 + KZG Point Evaluation 추가',
    annotations: [
      { lines: [19, 20], color: 'amber', note: 'OnceLock — 한 번만 초기화, 이후 &static 참조' },
      { lines: [22, 28], color: 'violet', note: 'EIP-4844 KZG Point Eval (0x0a) 추가' },
    ],
    code: precompSrc,
  },
  'precompile-dispatch': {
    path: 'revm/precompile/src/lib.rs', lang: 'rust', highlight: [34, 39],
    desc: '주소별 디스패치 — HashMap 조회 후 enum match로 실행',
    annotations: [
      { lines: [36, 39], color: 'rose', note: 'Standard vs Env 분기 — pattern matching' },
    ],
    code: precompSrc,
  },
  'bn128-add': {
    path: 'revm/precompile/src/bn128.rs', lang: 'rust', highlight: [3, 14],
    desc: 'bn128_add (0x06) — 타원곡선 덧셈, 가스 150',
    annotations: [
      { lines: [4, 7], color: 'sky', note: '가스 체크 → 입력 파싱' },
      { lines: [8, 11], color: 'emerald', note: '포인트 읽기 → 덧셈 → 결과 직렬화' },
    ],
    code: bn128Src,
  },
  'bn128-pairing': {
    path: 'revm/precompile/src/bn128.rs', lang: 'rust', highlight: [27, 36],
    desc: 'bn128_pairing (0x08) — zkSNARK 검증 핵심. 입력 쌍 수에 비례하는 가스',
    annotations: [
      { lines: [28, 29], color: 'amber', note: '가스 = 34,000 * k + 45,000 (k = 쌍 수)' },
      { lines: [34, 35], color: 'violet', note: '페어링 결과가 1이면 true (검증 성공)' },
    ],
    code: bn128Src,
  },
};

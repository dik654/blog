import type { CodeRef } from '@/components/code/types';
import f3Go from './codebase/go-f3/f3.go?raw';
import gpbftGo from './codebase/go-f3/gpbft.go?raw';

export const codeRefs: Record<string, CodeRef> = {
  'f3-run': {
    path: 'go-f3/f3.go', code: f3Go, lang: 'go', highlight: [14, 40],
    desc: 'F3.Run() — EC 체인 감시 + GossiPBFT 확정 메인 루프',
    annotations: [
      { lines: [14, 19], color: 'sky', note: 'F3 구조체 — manifest, host, certStore, gpbft' },
      { lines: [23, 30], color: 'emerald', note: 'EC에서 새 tipset 도착 → gpbft.Begin() 호출' },
      { lines: [32, 38], color: 'amber', note: 'RunToCompletion → 인증서 저장 → 확정 완료' },
    ],
  },
  'gpbft-run': {
    path: 'go-f3/gpbft.go', code: gpbftGo, lang: 'go', highlight: [11, 40],
    desc: 'GossiPBFT 5단계: QUALITY→CONVERGE→PREPARE→COMMIT→DECIDE',
    annotations: [
      { lines: [11, 17], color: 'sky', note: '5단계 Phase 상수 정의' },
      { lines: [19, 24], color: 'emerald', note: 'Runner 구조체 — phase, participants, powerTable' },
      { lines: [28, 39], color: 'amber', note: 'RunToCompletion — 매 단계 2/3+ 파워 쿼럼 확인' },
    ],
  },
};

import type { CodeRef } from '@/components/code/types';
import beaconStateRaw from './codebase/prysm/beacon-chain/state/state-native/beacon_state.go?raw';

export const beaconStateCodeRefs: Record<string, CodeRef> = {
  'beacon-state-struct': {
    path: 'beacon-chain/state/state-native/beacon_state.go — BeaconState',
    lang: 'go',
    code: beaconStateRaw,
    highlight: [5, 30],
    desc: 'BeaconState — 비콘 체인 전체 상태를 보유하는 핵심 구조체',
    annotations: [
      { lines: [7, 8], color: 'sky', note: '제네시스 정보: 시작 시간 + 검증자 루트' },
      { lines: [10, 11], color: 'emerald', note: '슬롯 & 포크 버전 추적' },
      { lines: [17, 18], color: 'amber', note: '검증자 목록 + 잔액 배열' },
      { lines: [24, 26], color: 'violet', note: 'FieldTrie 해시 캐싱 (dirty 추적)' },
      { lines: [29, 29], color: 'rose', note: 'Copy-on-Write 공유 참조 카운트' },
    ],
  },
  'state-copy': {
    path: 'beacon-chain/state/state-native/beacon_state.go — NewBeaconState()',
    lang: 'go',
    code: beaconStateRaw,
    highlight: [33, 45],
    desc: 'NewBeaconState — Genesis 또는 상태 복원 시 새 상태 생성',
    annotations: [
      { lines: [35, 38], color: 'sky', note: '빈 맵 초기화: dirty, rebuild, leaves' },
      { lines: [40, 42], color: 'emerald', note: 'Option 패턴으로 필드 주입' },
      { lines: [44, 44], color: 'amber', note: '모든 필드의 초기 트라이 구성' },
    ],
  },
};

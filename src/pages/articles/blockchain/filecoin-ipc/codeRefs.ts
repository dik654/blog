import type { CodeRef } from '@/components/code/types';
import subnetGo from './codebase/ipc/subnet.go?raw';

export const codeRefs: Record<string, CodeRef> = {
  'ipc-subnet': {
    path: 'gateway/subnet.go',
    code: subnetGo, lang: 'go', highlight: [5, 54],
    desc: 'subnet.go — IPC 서브넷 생성, 검증자 참여, 체크포인팅 + 크로스 메시지',
    annotations: [
      { lines: [5, 11], color: 'sky',
        note: 'SubnetConfig — 부모ID, 최소 스테이크, 합의 타입, 체크포인트 주기' },
      { lines: [15, 24], color: 'emerald',
        note: 'CreateSubnet — FIL 스테이크 후 서브넷 Actor를 FVM에 배포' },
      { lines: [29, 38], color: 'amber',
        note: 'JoinSubnet — 검증자 스테이크 예치 + 검증자 세트 등록' },
      { lines: [43, 54], color: 'violet',
        note: 'SubmitCheckpoint — 2/3+ 서명 검증 → 크로스 메시지 실행' },
    ],
  },
};

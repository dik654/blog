import type { CodeRef } from '@/components/code/types';
import validatorRaw from './codebase/prysm/validator/client/validator.go?raw';
import runnerRaw from './codebase/prysm/validator/client/runner.go?raw';

export const validatorCodeRefs: Record<string, CodeRef> = {
  'validator-loop': {
    path: 'validator/client/validator.go — Run()',
    lang: 'go',
    code: validatorRaw,
    highlight: [3, 38],
    desc: 'Run — 슬롯 틱마다 의무를 조회하고 역할별로 고루틴을 실행하는 메인 루프',
    annotations: [
      { lines: [10, 11], color: 'violet', note: 'NextSlot 채널에서 슬롯 틱 수신' },
      { lines: [14, 18], color: 'emerald', note: 'RolesAt: 비콘 노드에 의무 조회' },
      { lines: [24, 31], color: 'sky', note: '역할별 분기: Proposer, Attester, SyncCommittee, Aggregator' },
    ],
  },
  'roles-at': {
    path: 'validator/client/validator.go — RolesAt()',
    lang: 'go',
    code: validatorRaw,
    highlight: [41, 60],
    desc: 'RolesAt — 특정 슬롯에서 각 공개키의 의무(Proposer/Attester/SyncCommittee)를 조회',
    annotations: [
      { lines: [47, 49], color: 'violet', note: '비콘 노드에 gRPC 호출로 duty 목록 수신' },
      { lines: [51, 57], color: 'emerald', note: 'duty.IsProposer / IsAttester → 역할 리스트 구성' },
    ],
  },
  'run-client': {
    path: 'validator/client/runner.go — RunClient()',
    lang: 'go',
    code: runnerRaw,
    highlight: [3, 31],
    desc: 'RunClient — gRPC 연결 → 키 로드 → 활성화 대기 → 메인 루프 진입',
    annotations: [
      { lines: [9, 12], color: 'violet', note: 'gRPC로 비콘 노드에 연결' },
      { lines: [16, 19], color: 'emerald', note: '키매니저 초기화 (로컬 키 or 원격 서명자)' },
      { lines: [22, 24], color: 'sky', note: '검증자 활성화 대기 (32 ETH 입금 확인)' },
      { lines: [30, 30], color: 'amber', note: 'v.Run(ctx) — 메인 슬롯 루프 시작' },
    ],
  },
};

import type { CodeRef } from '@/components/code/types';
import serviceRaw from './codebase/prysm/beacon-chain/rpc/service.go?raw';

export const rpcCodeRefs: Record<string, CodeRef> = {
  'rpc-start': {
    path: 'beacon-chain/rpc/service.go — Start()',
    lang: 'go',
    code: serviceRaw,
    highlight: [3, 30],
    desc: 'Start — gRPC 서버 초기화 + REST gateway 시작',
    annotations: [
      { lines: [11, 15], color: 'sky', note: 'gRPC 옵션: 인터셉터, 메시지 크기 제한' },
      { lines: [18, 18], color: 'emerald', note: '도메인별 서비스 등록' },
      { lines: [20, 22], color: 'amber', note: 'HTTP API 활성화 시 gRPC-gateway 시작' },
    ],
  },
  'register-services': {
    path: 'beacon-chain/rpc/service.go — registerServices()',
    lang: 'go',
    code: serviceRaw,
    highlight: [33, 41],
    desc: 'registerServices — BeaconChain, Validator, Node, Debug 서비스 등록',
    annotations: [
      { lines: [35, 35], color: 'sky', note: 'BeaconChainServer: 블록·상태·검증자 조회' },
      { lines: [37, 37], color: 'emerald', note: 'ValidatorServer: 의무 할당·블록 제안' },
      { lines: [40, 40], color: 'amber', note: '헬스체크 서비스 등록' },
    ],
  },
};

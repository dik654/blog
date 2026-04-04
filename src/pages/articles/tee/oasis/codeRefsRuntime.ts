import type { CodeRef } from '@/components/code/types';
import dispatcherRs from './codebase/oasis-core/runtime/src/dispatcher.rs?raw';
import workerGo from './codebase/oasis-core/go/worker/compute/executor/worker.go?raw';
import secretsGo from './codebase/oasis-core/go/keymanager/secrets/api.go?raw';

export const runtimeCodeRefs: Record<string, CodeRef> = {
  'dispatcher': {
    path: 'oasis-core/runtime/src/dispatcher.rs',
    code: dispatcherRs,
    lang: 'rust',
    highlight: [64, 160],
    annotations: [
      { lines: [64, 77], color: 'sky', note: 'Initializer 트레이트 — 런타임 디스패처 초기화 인터페이스' },
      { lines: [112, 143], color: 'emerald', note: 'TxDispatchState / State — 합의 블록, 에포크, 실행 모드 등 런타임 상태' },
      { lines: [150, 160], color: 'amber', note: 'Dispatcher 구조체 — mpsc 큐, Identity, Tokio 런타임 핸들' },
    ],
    desc: 'Rust 런타임 콜 디스패처입니다. SGX 엔클레이브 또는 네이티브 프로세스에서 실행되며, EnclaveRPC 세션 관리와 트랜잭션 배치 처리를 담당합니다.',
  },

  'executor-worker': {
    path: 'oasis-core/go/worker/compute/executor/worker.go',
    code: workerGo,
    lang: 'go',
    highlight: [17, 80],
    annotations: [
      { lines: [17, 32], color: 'sky', note: 'Worker 구조체 — 다중 런타임을 관리하는 executor 워커' },
      { lines: [40, 58], color: 'emerald', note: 'Start() — 런타임 종료 대기 고루틴 + 초기화 대기 고루틴' },
      { lines: [72, 80], color: 'amber', note: '각 런타임 서비스 시작 루프' },
    ],
    desc: 'Executor 워커는 여러 런타임(ParaTime)을 호스팅합니다. 각 런타임의 committee.Node를 시작하고, 모든 런타임이 초기화될 때까지 대기합니다.',
  },

  'km-secrets-api': {
    path: 'oasis-core/go/keymanager/secrets/api.go',
    code: secretsGo,
    lang: 'go',
    highlight: [20, 97],
    annotations: [
      { lines: [20, 29], color: 'sky', note: '상수 — ChecksumSize, KeyPairIDSize (각 32바이트)' },
      { lines: [46, 60], color: 'emerald', note: 'RPC 메서드명 — Init, GetOrCreateKeys, PublishMasterSecret 등' },
      { lines: [62, 97], color: 'amber', note: 'RPC 메서드 — Replicate, Generate, Load (마스터/임시 비밀 관리)' },
    ],
    desc: '키 매니저 API 정의입니다. SGX 엔클레이브 내에서 마스터 시크릿을 생성/복제하고, 인증된 런타임에게 키 쌍을 발급하는 RPC 인터페이스를 정의합니다.',
  },

  'km-status': {
    path: 'oasis-core/go/keymanager/secrets/api.go',
    code: secretsGo,
    lang: 'go',
    highlight: [123, 188],
    annotations: [
      { lines: [123, 154], color: 'sky', note: 'Status 구조체 — ID, IsSecure, Generation, Nodes, Policy' },
      { lines: [164, 188], color: 'emerald', note: 'VerifyRotationEpoch — 마스터 시크릿 회전 주기 검증' },
    ],
    desc: '키 매니저 상태 관리입니다. Generation은 마스터 시크릿의 세대 번호이며, Policy에 정의된 RotationInterval마다 시크릿을 갱신합니다.',
  },
};

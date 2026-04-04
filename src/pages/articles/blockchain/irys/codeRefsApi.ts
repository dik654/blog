import type { CodeRef } from '@/components/code/types';

import apiLibRs from './codebase/irys/crates/api-server/src/lib.rs?raw';

export const apiRefs: Record<string, CodeRef> = {
  'irys-api-state': {
    path: 'crates/api-server/src/lib.rs',
    code: apiLibRs,
    lang: 'rust',
    highlight: [44, 64],
    desc: 'ApiState는 REST API 서버의 공유 상태입니다. mempool, chunk_provider, block_tree, reth_provider 등을 보유합니다.',
    annotations: [
      { lines: [46, 48], color: 'sky', note: 'mempool + chunk_ingress 채널' },
      { lines: [49, 53], color: 'emerald', note: 'chunk_provider + peer_list + DB' },
      { lines: [56, 63], color: 'amber', note: 'block_tree, sync_state, mining_address' },
    ],
  },
  'irys-api-routes': {
    path: 'crates/api-server/src/lib.rs',
    code: apiLibRs,
    lang: 'rust',
    highlight: [72, 100],
    desc: 'routes()는 /v1 스코프 하위 REST 엔드포인트를 정의합니다. 블록, 청크, 트랜잭션, 가격, 원장, 마이닝 등 전체 API를 등록합니다.',
    annotations: [
      { lines: [73, 79], color: 'sky', note: '/v1 스코프 — info, ready, block 엔드포인트' },
      { lines: [96, 100], color: 'emerald', note: 'chunk CRUD 엔드포인트' },
      { lines: [127, 131], color: 'amber', note: 'price, tx POST 엔드포인트' },
    ],
  },
  'irys-api-server': {
    path: 'crates/api-server/src/lib.rs',
    code: apiLibRs,
    lang: 'rust',
    highlight: [183, 227],
    desc: 'run_server는 Actix-web HTTP 서버를 설정하고 시작합니다. CORS, JSON 1MB 제한, TracingLogger, 요청 메트릭 미들웨어를 적용합니다.',
    annotations: [
      { lines: [193, 200], color: 'sky', note: 'HttpServer + App 초기화' },
      { lines: [201, 213], color: 'emerald', note: 'JsonConfig 1MB 제한 + 에러 핸들러' },
      { lines: [216, 221], color: 'amber', note: 'CORS + Tracing + Metrics 미들웨어' },
    ],
  },
};

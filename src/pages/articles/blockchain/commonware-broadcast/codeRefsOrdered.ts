import type { CodeRef } from '@/components/code/types';
import typesRs from './codebase/commonware/ordered_broadcast.rs?raw';
import engineRs from './codebase/commonware/ordered_engine.rs?raw';
import ackRs from './codebase/commonware/ordered_ack_mgr.rs?raw';

export const codeRefsOrdered: Record<string, CodeRef> = {
  'ordered-types': {
    path: 'consensus/src/ordered_broadcast/types.rs', code: typesRs, lang: 'rust',
    highlight: [4, 26],
    desc: 'Chunk + Parent + Node — 인증서 체인의 핵심 타입 3종.\nNode = Chunk(데이터) + signature(서명) + Parent(이전 인증서 링크).',
    annotations: [
      { lines: [4, 9], color: 'sky', note: 'Chunk — sequencer + height + payload. 시퀀서별 독립 체인 형성' },
      { lines: [12, 17], color: 'emerald', note: 'Parent — 이전 청크의 digest + epoch + certificate. 체인 링크' },
      { lines: [21, 26], color: 'amber', note: 'Node — 시퀀서가 브로드캐스트하는 메시지. chunk + signature + parent' },
    ],
  },
  'ordered-engine': {
    path: 'consensus/src/ordered_broadcast/engine.rs', code: engineRs, lang: 'rust',
    highlight: [1, 15],
    desc: 'ordered_broadcast Engine — select_loop!으로 구동.\n시퀀서면 propose, 검증자면 ack, 모두 node 수신 처리.',
    annotations: [
      { lines: [1, 15], color: 'sky', note: 'Engine 필드: tip_manager(최신 청크) + ack_manager(서명 수집) + epoch(현재 에포크)' },
      { lines: [19, 41], color: 'emerald', note: 'run() — propose → node 수신 → validate → handle_certificate → handle_node → ack 수신' },
    ],
  },
  'ordered-ack-mgr': {
    path: 'consensus/src/ordered_broadcast/ack_manager.rs', code: ackRs, lang: 'rust',
    highlight: [10, 14],
    desc: 'AckManager — 부분 서명 수집 → 쿼럼 도달 시 인증서 생성.\n3중 BTreeMap 구조: Sequencer → Height → Epoch → Evidence.',
    annotations: [
      { lines: [2, 6], color: 'sky', note: 'Evidence — Partials(부분 서명 집합) 또는 Certificate(완성된 인증서)' },
      { lines: [10, 14], color: 'emerald', note: 'AckManager — 3중 Map: Sequencer → Height → Epoch → Evidence' },
      { lines: [17, 37], color: 'amber', note: 'add_ack — 부분 서명 추가 → 쿼럼(2f+1) 달성 시 certificate 반환' },
    ],
  },
};

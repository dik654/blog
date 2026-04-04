import type { CodeRef } from '@/components/code/types';

import peerProtocolLib from './codebase/rqbit/crates/peer_binary_protocol/src/lib.rs?raw';
import peerConnectionRs from './codebase/rqbit/crates/librqbit/src/peer_connection.rs?raw';
import peerMod from './codebase/rqbit/crates/librqbit/src/torrent_state/live/peer/mod.rs?raw';

export const peerRefs: Record<string, CodeRef> = {
  'message-enum': {
    path: 'peer_binary_protocol/src/lib.rs',
    code: peerProtocolLib,
    lang: 'rust',
    highlight: [219, 232],
    desc: 'Message 열거형은 BitTorrent 피어 프로토콜의 모든 메시지를 표현합니다.',
    annotations: [
      { lines: [221, 222], color: 'sky', note: 'Request / Cancel — 피스 청크 요청 및 취소' },
      { lines: [223, 223], color: 'emerald', note: 'Bitfield — 보유 피스를 비트맵으로 교환' },
      { lines: [226, 228], color: 'amber', note: 'Choke / Unchoke / Interested — 흐름 제어' },
      { lines: [230, 231], color: 'violet', note: 'Piece / Extended — 데이터 전송 + 확장 메시지' },
    ],
  },

  'handshake': {
    path: 'peer_binary_protocol/src/lib.rs',
    code: peerProtocolLib,
    lang: 'rust',
    highlight: [467, 523],
    desc: 'Handshake는 피어 연결의 첫 메시지입니다. 68바이트 고정 크기.',
    annotations: [
      { lines: [469, 472], color: 'sky', note: 'reserved — 8바이트 플래그 (비트 20: 확장 메시지 지원)' },
      { lines: [475, 487], color: 'emerald', note: 'new — reserved에 확장 메시지 플래그 설정' },
      { lines: [489, 506], color: 'amber', note: 'deserialize — 68바이트 파싱, pstr 검증' },
      { lines: [514, 522], color: 'violet', note: 'serialize — 버퍼에 직접 기록 (할당 없음)' },
    ],
  },

  'peer-connection': {
    path: 'librqbit/src/peer_connection.rs',
    code: peerConnectionRs,
    lang: 'rust',
    highlight: [36, 55],
    desc: 'PeerConnectionHandler 트레이트는 피어 상호작용 콜백을 정의합니다.',
    annotations: [
      { lines: [38, 39], color: 'sky', note: 'should_send_bitfield — 보유 피스 비트필드 전송 여부' },
      { lines: [40, 40], color: 'emerald', note: 'on_handshake — 핸드셰이크 수신 시 검증' },
      { lines: [45, 45], color: 'amber', note: 'on_received_message — Piece/Have 등 메시지 처리' },
      { lines: [48, 48], color: 'violet', note: 'read_chunk — 업로드 시 디스크에서 청크 읽기' },
    ],
  },

  'manage-peer': {
    path: 'librqbit/src/peer_connection.rs',
    code: peerConnectionRs,
    lang: 'rust',
    highlight: [272, 511],
    desc: 'manage_peer는 reader/writer 루프입니다. tokio::select!로 동시 실행합니다.',
    annotations: [
      { lines: [312, 312], color: 'sky', note: 'writer — 큐에서 메시지를 꺼내 직렬화 후 전송' },
      { lines: [468, 468], color: 'emerald', note: 'reader — 메시지 수신 → on_received_message 콜백' },
      { lines: [493, 510], color: 'amber', note: 'select! — 하나라도 끝나면 피어 연결 종료' },
    ],
  },

  'peer-state': {
    path: 'librqbit/src/torrent_state/live/peer/mod.rs',
    code: peerMod,
    lang: 'rust',
    highlight: [86, 99],
    desc: 'PeerState는 피어 생명주기입니다. Queued → Connecting → Live → Dead/NotNeeded.',
    annotations: [
      { lines: [90, 90], color: 'sky', note: 'Queued — 연결 대기 중' },
      { lines: [91, 91], color: 'emerald', note: 'Connecting — TCP/uTP 연결 시도 중' },
      { lines: [92, 92], color: 'amber', note: 'Live — 핸드셰이크 완료, 데이터 교환 가능' },
      { lines: [94, 98], color: 'violet', note: 'Dead / NotNeeded — 에러 후 백오프 / 불필요' },
    ],
  },
};

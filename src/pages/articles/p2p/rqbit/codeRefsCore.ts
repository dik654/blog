import type { CodeRef } from '@/components/code/types';

import sessionRs from './codebase/rqbit/crates/librqbit/src/session.rs?raw';
import torrentStateMod from './codebase/rqbit/crates/librqbit/src/torrent_state/mod.rs?raw';

export const coreRefs: Record<string, CodeRef> = {
  'session': {
    path: 'librqbit/src/session.rs',
    code: sessionRs,
    lang: 'rust',
    highlight: [107, 153],
    desc: 'Session은 rqbit의 최상위 관리자입니다. 모든 토렌트, DHT, 트래커, 네트워크 연결을 총괄합니다.',
    annotations: [
      { lines: [109, 111], color: 'sky', note: 'db — 토렌트 목록을 담는 HashMap (TorrentId → ManagedTorrentHandle)' },
      { lines: [115, 121], color: 'emerald', note: '네트워크 — peer_id, DHT, StreamConnector, UDP 트래커 클라이언트' },
      { lines: [125, 126], color: 'amber', note: 'CancellationToken — 세션 종료 시 모든 태스크에 전파' },
      { lines: [138, 139], color: 'violet', note: 'concurrent_initialize_semaphore — 동시 초기화 수 제한' },
    ],
  },

  'session-db': {
    path: 'librqbit/src/session.rs',
    code: sessionRs,
    lang: 'rust',
    highlight: [96, 105],
    desc: 'SessionDatabase는 토렌트를 HashMap으로 관리합니다. TorrentId(usize)로 빠르게 조회합니다.',
    annotations: [
      { lines: [97, 99], color: 'sky', note: 'SessionDatabase — HashMap<TorrentId, ManagedTorrentHandle>' },
      { lines: [101, 105], color: 'emerald', note: 'add_torrent — 새 토렌트를 DB에 등록' },
    ],
  },

  'managed-torrent-state': {
    path: 'librqbit/src/torrent_state/mod.rs',
    code: torrentStateMod,
    lang: 'rust',
    highlight: [67, 98],
    desc: 'ManagedTorrentState는 토렌트의 상태 머신입니다. Initializing → Paused → Live 순서로 전이합니다.',
    annotations: [
      { lines: [68, 68], color: 'sky', note: 'Initializing — 파일 무결성 체크 중' },
      { lines: [69, 69], color: 'emerald', note: 'Paused — 체크 완료, 아직 피어 연결 안 함' },
      { lines: [70, 70], color: 'amber', note: 'Live — 피어 연결 중, 다운로드/업로드 활성' },
      { lines: [71, 71], color: 'violet', note: 'Error — 복구 불가능한 오류 발생' },
    ],
  },

  'managed-torrent': {
    path: 'librqbit/src/torrent_state/mod.rs',
    code: torrentStateMod,
    lang: 'rust',
    highlight: [197, 264],
    desc: 'ManagedTorrent은 하나의 토렌트를 나타냅니다. shared(불변)와 locked(가변)로 분리해 Arc 순환 방지.',
    annotations: [
      { lines: [199, 199], color: 'sky', note: 'shared — info_hash, peer_id, 트래커 목록 등 불변 데이터' },
      { lines: [201, 201], color: 'emerald', note: 'metadata — 토렌트 파일 정보 (매그넷 해석 전에는 None)' },
      { lines: [202, 203], color: 'amber', note: 'state_change_notify + locked — 상태 전이 알림 + RwLock 보호 상태' },
    ],
  },

  'managed-torrent-shared': {
    path: 'librqbit/src/torrent_state/mod.rs',
    code: torrentStateMod,
    lang: 'rust',
    highlight: [181, 195],
    desc: 'ManagedTorrentShared는 불변 설정입니다. session은 Weak 참조로 Arc 순환을 끊습니다.',
    annotations: [
      { lines: [183, 183], color: 'sky', note: 'info_hash — 토렌트 식별 해시 (SHA-1, 20바이트)' },
      { lines: [185, 185], color: 'emerald', note: 'trackers — 피어를 찾을 트래커 URL 집합' },
      { lines: [191, 191], color: 'amber', note: 'session: Weak<Session> — 순환 참조 방지를 위한 약한 참조' },
    ],
  },
};

import type { CodeRef } from './codeRefsTypes';
import p2pRs from './codebase/commonware/p2p_network.rs?raw';
import handshakeRs from './codebase/commonware/handshake.rs?raw';

export const p2pCodeRefs: Record<string, CodeRef> = {
  'p2p-sender': {
    path: 'p2p/src/lib.rs — Sender trait 계층',
    lang: 'rust',
    code: p2pRs,
    highlight: [18, 48],
    desc: 'Sender trait 계층.\nUnlimited → Limited → Checked → Sender (blanket impl).\n프로토콜별 적절한 전송 제어 수준 선택.',
    annotations: [
      { lines: [19, 24], color: 'sky', note: 'UnlimitedSender — 제한 없음 (내부 시스템 메시지)' },
      { lines: [27, 31], color: 'emerald', note: 'LimitedSender — check() → 레이트 리밋 적용' },
      { lines: [34, 45], color: 'amber', note: 'Sender — check → send 기본 구현. blanket impl' },
      { lines: [47, 47], color: 'violet', note: 'blanket impl — 모든 LimitedSender가 Sender' },
    ],
  },
  'p2p-blocker': {
    path: 'p2p/src/lib.rs — Blocker + block! macro',
    lang: 'rust',
    code: p2pRs,
    highlight: [50, 62],
    desc: 'Blocker trait + block! 매크로.\nwarn 로깅 후 즉시 차단 — 재연결도 거부.\n프로토콜 수준에서 악성 피어 격리.',
    annotations: [
      { lines: [51, 54], color: 'sky', note: 'Blocker — block(peer) → 연결 종료 + 거부목록' },
      { lines: [57, 61], color: 'emerald', note: 'block! 매크로 — tracing::warn + block 원자적 실행' },
    ],
  },
  'p2p-recipients': {
    path: 'p2p/src/lib.rs — Recipients enum',
    lang: 'rust',
    code: p2pRs,
    highlight: [1, 16],
    desc: 'P2P 프리미티브.\nMessage<P> = (PublicKey, IoBuf) — 발신자 인증 내장.\nRecipients: All/Some/One으로 수신 범위 지정.',
    annotations: [
      { lines: [3, 4], color: 'sky', note: 'Message<P> — 발신자 공개키 + 페이로드 튜플' },
      { lines: [7, 7], color: 'emerald', note: 'Channel = u64 — 단일 TCP 위에 다중 프로토콜' },
      { lines: [10, 15], color: 'amber', note: 'Recipients — All/Some/One 세 가지 수신 범위' },
    ],
  },
  'handshake-exchange': {
    path: 'cryptography/src/handshake/key_exchange.rs',
    lang: 'rust',
    code: handshakeRs,
    highlight: [1, 44],
    desc: 'X25519 ECDH 키 교환.\n임시 키 생성 → 공개키 교환 → 공유 비밀 도출.\nnon-contributory 검사로 약한 키 거부.',
    annotations: [
      { lines: [15, 17], color: 'sky', note: 'SecretKey — 임시 비밀키. 교환 후 소멸' },
      { lines: [20, 24], color: 'emerald', note: 'new() — CryptoRng에서 임시 비밀키 생성' },
      { lines: [33, 39], color: 'amber', note: 'exchange — DH 계산 + non-contributory 검사' },
    ],
  },
};

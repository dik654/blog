/** Encoding Viz — 색상 + 스텝 정의 */

export const C = {
  ssz: '#6366f1',      // 보라 — SSZ 인코딩
  chunk: '#0ea5e9',    // 하늘 — 32B 청크
  merkle: '#f59e0b',   // 앰버 — hash_tree_root
  fork: '#10b981',     // 녹색 — Fork 버전
  domain: '#8b5cf6',   // 바이올렛 — Domain
  muted: '#94a3b8',    // 회색 — 비활성
};

export const STEPS = [
  {
    label: 'SSZ 인코딩 — 5필드를 32B 청크로 분해 → hash_tree_root',
    body: 'slot(8B)·proposer_index(8B)는 32B로 패딩.\nparent_root·state_root·body_root는 그대로 32B 청크.\n4개 청크를 바이너리 Merkle 트리로 해싱한다.',
  },
  {
    label: 'Fork 버전 타임라인 — Bellatrix → Capella → Deneb',
    body: 'fork_version: 4바이트로 하드포크를 식별한다.\n같은 메시지도 포크가 다르면 다른 서명이 된다 → 리플레이 방지.',
  },
  {
    label: 'Domain 합성 — 서명 도메인 분리',
    body: 'domain_type(4B) + fork_data_root 앞 28B = Domain(32B).\nSYNC_COMMITTEE(0x07), BEACON_PROPOSER(0x00) 등 용도별 분리.\ncompute_signing_root(msg, domain) → BLS 서명의 메시지.',
  },
];

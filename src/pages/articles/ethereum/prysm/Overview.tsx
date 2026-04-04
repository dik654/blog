import PrysmArchViz from './viz/PrysmArchViz';

const ARTICLES = [
  /* 기초: 직렬화 & 암호 */
  { href: '/blockchain/prysm-ssz', title: 'SSZ 직렬화 & Merkleization', desc: '인코딩 · HashTreeRoot · Multiproof' },
  { href: '/blockchain/prysm-bls', title: 'BLS 서명 (BLST 바인딩)', desc: 'BLS12-381 · CGo 바인딩 · 배치 검증' },
  /* 상태 */
  { href: '/blockchain/prysm-beacon-state', title: 'BeaconState 구조', desc: 'Copy-on-Write · FieldTrie 해시 캐싱' },
  { href: '/blockchain/prysm-slot-processing', title: '슬롯 처리 & 상태 루트', desc: 'ProcessSlots 루프 · 에폭 경계 감지' },
  { href: '/blockchain/prysm-epoch-processing', title: '에폭 처리', desc: 'Justification · 보상/패널티 · 슬래싱' },
  /* 합의 */
  { href: '/blockchain/prysm-block-processing', title: '블록 처리 & 상태 전환', desc: 'RANDAO · operations · execution payload' },
  { href: '/blockchain/prysm-block-proposal', title: '블록 제안 & 조립', desc: 'ProposerIndex · attestation 수집 · BLS 서명' },
  { href: '/blockchain/prysm-forkchoice', title: 'Fork Choice (LMD-GHOST)', desc: 'doubly-linked-tree · GetHead' },
  { href: '/blockchain/prysm-finality', title: 'Casper FFG & Finality', desc: '체크포인트 · Finalization · Weak Subjectivity' },
  /* 검증자 */
  { href: '/blockchain/prysm-validator-client', title: '검증자 클라이언트', desc: '의무 할당 · Keymanager · 슬래싱 방지' },
  { href: '/blockchain/prysm-attestation', title: '어테스테이션', desc: '생성 · 집계 · 서브넷 · 블록 포함' },
  { href: '/blockchain/prysm-sync-committee', title: '싱크 위원회', desc: '위원회 참여 · 기여 집계' },
  /* 네트워크 */
  { href: '/blockchain/prysm-p2p-libp2p', title: 'libp2p 네트워킹', desc: 'Discv5 · 피어 스코어링 · 연결 게이팅' },
  { href: '/blockchain/prysm-gossipsub', title: 'Gossipsub', desc: '토픽 · 포크 다이제스트 · SSZ-Snappy' },
  { href: '/blockchain/prysm-sync', title: '동기화 전략', desc: 'Initial · Checkpoint · Regular Sync' },
  /* 저장 */
  { href: '/blockchain/prysm-beacon-db', title: 'BeaconDB', desc: 'BoltDB 버킷 · 블록/상태 CRUD · 프루닝' },
  { href: '/blockchain/prysm-state-cache', title: '상태 캐시', desc: 'Hot/Cold · State Summary · 재생' },
  /* API */
  { href: '/blockchain/prysm-beacon-api', title: 'Beacon API', desc: 'gRPC + REST Gateway · Validator API' },
  { href: '/blockchain/prysm-engine-api', title: 'Engine API (CL → EL)', desc: 'NewPayload · ForkchoiceUpdated · GetPayload' },
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Prysm 내부 아키텍처 개요</h2>
      <div className="not-prose mb-8"><PrysmArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Prysm</strong> — Go로 구현된 이더리움 CL(합의 계층) 클라이언트<br />
          비콘 체인 상태 관리, 포크 선택, 검증자 의무 수행, P2P 네트워킹 담당<br />
          Engine API로 EL(Reth 등)에 실행 페이로드 검증을 위임
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">심층 분석 아티클</h3>
        <p>기초(SSZ/BLS) → 상태 → 합의 → 검증자 → 네트워크 → 저장 → API 순서로 읽으면 이해가 쉬움</p>
      </div>
      <div className="not-prose grid gap-3 mt-4">
        {ARTICLES.map((a) => (
          <a key={a.href} href={a.href}
            className="block rounded-lg border border-border/60 p-4 hover:bg-accent transition-colors">
            <p className="font-semibold text-foreground">{a.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{a.desc}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

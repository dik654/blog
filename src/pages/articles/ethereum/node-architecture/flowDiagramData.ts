export interface FlowNode {
  id: string;
  fn: string;
  desc: string;
  color: 'sky' | 'emerald' | 'amber' | 'violet' | 'rose' | 'slate';
  detail?: string;
  codeRefKey?: string;
  children?: FlowNode[];
}

export const FLOW_COLORS = {
  sky:     { border: '#0ea5e9', bg: 'rgba(14,165,233,0.07)',  text: '#0369a1' },
  emerald: { border: '#10b981', bg: 'rgba(16,185,129,0.07)',  text: '#065f46' },
  amber:   { border: '#f59e0b', bg: 'rgba(245,158,11,0.07)',  text: '#92400e' },
  violet:  { border: '#8b5cf6', bg: 'rgba(139,92,246,0.07)',  text: '#4c1d95' },
  rose:    { border: '#f43f5e', bg: 'rgba(244,63,94,0.07)',   text: '#881337' },
  slate:   { border: '#64748b', bg: 'rgba(100,116,139,0.07)', text: '#334155' },
};

export const GLOSSARY: { term: string; def: string }[] = [
  { term: 'MDBX',            def: 'Memory-Mapped B-Tree Database. 파일을 메모리에 직접 매핑(mmap)해 시스템 콜 없이 디스크 I/O를 수행하는 고성능 키-값 DB.' },
  { term: 'LRU',             def: 'Least Recently Used. 가장 오래 사용하지 않은 항목부터 제거하는 캐시 교체 정책.' },
  { term: 'BLS / BLS12-381', def: 'Boneh-Lynn-Shacham 서명. 여러 서명을 하나로 집계(aggregate)할 수 있어 비콘 체인이 수천 개의 어테스테이션을 효율적으로 처리.' },
  { term: 'gossipsub',       def: 'libp2p의 토픽 기반 pub/sub 프로토콜. 각 노드가 관심 토픽만 구독하고 수신 메시지를 일부 피어에게만 재전파해 O(n²) 브로드캐스트를 피함.' },
  { term: 'fork digest',     def: 'SHA256(genesis_validators_root, fork_version)의 앞 4바이트. 포크마다 달라 다른 포크 노드의 메시지가 섞이지 않도록 토픽 이름에 포함됨.' },
  { term: 'EVM',             def: 'Ethereum Virtual Machine. 이더리움 스마트 컨트랙트를 실행하는 스택 기반 가상 머신. Reth는 revm 크레이트를 사용.' },
  { term: 'JWT',             def: 'JSON Web Token. CL과 EL이 32바이트 공유 비밀키로 HS256 서명한 토큰을 매 요청마다 교환해 인증. ±60초 이내 토큰만 유효.' },
  { term: 'DevP2P',          def: '이더리움 EL의 P2P 프로토콜. TCP 위에서 RLP 인코딩 메시지 교환. EthWire 핸드셰이크 → 블록·트랜잭션 동기화.' },
  { term: 'ecrecover',       def: 'ECDSA 서명(v,r,s)에서 secp256k1 공개키를 역산해 이더리움 주소를 복구하는 연산. eth_sendRawTransaction 발신자 인증에 사용.' },
  { term: 'RANDAO',          def: '검증자들이 BLS 서명으로 랜덤 값을 제출하고 XOR로 혼합해 블록 제안자·어테스테이션 위원회를 무작위 선정하는 메커니즘.' },
  { term: 'epoch / finalized', def: 'epoch = 32 슬롯(약 6.4분). finalized = 2/3 이상 검증자가 어테스테이션한 체크포인트로 영구 확정된 상태.' },
  { term: 'SparseStateTrie', def: '변경된 계정·스토리지 노드만 선택적으로 해싱해 stateRoot를 구하는 방식. 전체 트리 재해싱 없이 훨씬 빠름.' },
  { term: 'PersistenceService', def: 'MDBX 디스크 저장을 비동기 태스크로 분리한 서비스. EL은 인메모리 트리에 블록을 보관하고 즉시 VALID를 반환한 뒤 백그라운드에서 저장.' },
  { term: 'SSZ / RLP',       def: 'SSZ(SimpleSerialize) = CL 직렬화 포맷. RLP(Recursive Length Prefix) = EL 직렬화 포맷.' },
];
